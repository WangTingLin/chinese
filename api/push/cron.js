import webpush from 'web-push';
import { Redis } from '@upstash/redis';
import { createClient } from '@sanity/client';

webpush.setVapidDetails(
  'mailto:admin@chinesestudio.tw',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const sanity = createClient({
  projectId: '6c1fauax',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

function getTaiwanDateStr(daysOffset = 0) {
  const now = new Date();
  now.setTime(now.getTime() + (8 * 60 * 60 * 1000)); // UTC+8
  now.setDate(now.getDate() + daysOffset);
  return now.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  // 允許 Vercel Cron 或手動觸發（加 secret 保護）
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    // 取得今天和未來 3 天的活動
    const today = getTaiwanDateStr(0);
    const in3days = getTaiwanDateStr(3);

    const activities = await sanity.fetch(
      `*[_type in ["activity","conference","callForPapers"] && defined(date) && date >= $today && date <= $in3days] | order(date asc) {
        _id, title, date, location, category
      }`,
      { today, in3days }
    );

    if (!activities.length) {
      return res.status(200).json({ sent: 0, message: '近期無活動' });
    }

    // 整理通知內容
    const todayStr = getTaiwanDateStr(0);
    const tomorrowStr = getTaiwanDateStr(1);

    const lines = activities.slice(0, 5).map(ev => {
      const datePart = (ev.date || '').split(' ')[0];
      let prefix = '';
      if (datePart === todayStr) prefix = '【今天】';
      else if (datePart === tomorrowStr) prefix = '【明天】';
      else prefix = `【${datePart}】`;
      return `${prefix} ${ev.title}`;
    });

    const title = `📅 近期活動提醒（共 ${activities.length} 項）`;
    const body = lines.join('\n') + (activities.length > 5 ? `\n...還有 ${activities.length - 5} 項` : '');

    // 取得所有訂閱者
    const keys = await redis.smembers('subs');
    if (!keys.length) return res.status(200).json({ sent: 0, message: '無訂閱者' });

    let sent = 0;
    let failed = 0;

    for (const key of keys) {
      const raw = await redis.get(`sub:${key}`);
      if (!raw) continue;
      const subscription = typeof raw === 'string' ? JSON.parse(raw) : raw;

      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({ title, body, url: '/' })
        );
        sent++;
      } catch (err) {
        // 410 Gone = 訂閱已失效，自動清除
        if (err.statusCode === 410 || err.statusCode === 404) {
          await redis.del(`sub:${key}`);
          await redis.srem('subs', key);
        }
        failed++;
      }
    }

    return res.status(200).json({ sent, failed, total: keys.length });
  } catch (err) {
    console.error('Cron error:', err);
    return res.status(500).json({ error: err.message });
  }
}
