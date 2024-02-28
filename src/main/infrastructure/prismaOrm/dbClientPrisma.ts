import { PrismaClient } from '@prisma/client';
import { IDbClient } from '../adapters/dbServer';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

export class DbClientPrisma implements IDbClient {
  private static prismaInstance: null | PrismaClient = null;

  private prismaClientSingleton(): PrismaClient {
    DbClientPrisma.prismaInstance = new PrismaClient();
    return DbClientPrisma.prismaInstance;
  }

  public getInstance(): PrismaClient {
    return DbClientPrisma.prismaInstance ? DbClientPrisma.prismaInstance : this.prismaClientSingleton();
  }

  public async connect(): Promise<void> {
    try {
      await this.getInstance().$connect();
    } catch (error: unknown) {
      if (error instanceof PrismaClientInitializationError) {
        if (error.errorCode === 'P1012') {
          throw new Error(`Error initializing database: Environment variable not found: DATABASE_URL.
                    \n Please add the DATABASE_URL variable to your .env file.
                    `);
        }
        throw new Error(`${error.message}`);
      }
      throw new Error('Unexpected error during connect database server');
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.getInstance().$disconnect();
    } catch (error) {
      throw new Error('Unexpected error during close connection database server');
    }
  }
}
