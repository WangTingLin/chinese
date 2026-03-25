import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { subscription, action } = req.body || {};
  if (!subscription?.endpoint) return res.status(400).json({ error: 'missing subscription' });

  const key = Buffer.from(subscription.endpoint).toString('base64url').slice(0, 48);

  if (action === 'unsubscribe') {
    await redis.del(`sub:${key}`);
    await redis.srem('subs', key);
    return res.status(200).json({ ok: true });
  }

  // subscribe
  await redis.set(`sub:${key}`, JSON.stringify(subscription), { ex: 60 * 60 * 24 * 400 });
  await redis.sadd('subs', key);
  return res.status(200).json({ ok: true, key });
}
