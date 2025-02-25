
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger("Orders Prisma")

    async onModuleInit() {
        await this.$connect();
        this.logger.log("Orders database connected");
    }
}
