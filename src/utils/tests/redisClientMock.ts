import Redis from "ioredis-mock";
let mockClient = new Redis();
jest.mock("../redisClient", () => mockClient);
