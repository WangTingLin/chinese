import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "6c1fauax",   // 你的 Sanity projectId
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true
});