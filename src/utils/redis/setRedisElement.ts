import redisClient from "../redisClient";

export default async function setRedisElement({
  name,
  data,
}: {
  name: string;
  data: any;
}) {
  await redisClient.set(
    name,
    JSON.stringify(data),
    "EX",
    parseInt(process.env.REDIS_EXPIRY as string) || 3600
  );
}
