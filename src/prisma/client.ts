import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

class PrsiamClientSingleton {
  private static instance: PrsiamClientSingleton;
  private constructor() {}
  public static getInstance(): PrsiamClientSingleton {
    if (!PrsiamClientSingleton.instance) {
      PrsiamClientSingleton.instance = new PrsiamClientSingleton();
    }

    return PrsiamClientSingleton.instance;
  }
  public getClient(): PrismaClient {
    return prisma;
  }
}
prisma = PrsiamClientSingleton.getInstance().getClient();
export { prisma as Client };
