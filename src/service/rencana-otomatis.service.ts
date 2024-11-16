import { PrismaClient, PerencanaanOtomatis, Prisma } from '@prisma/client';
import { AbstractService } from './abstract.service';

export class PerencanaanOtomatisService extends AbstractService<
    PerencanaanOtomatis,
    Prisma.PerencanaanOtomatisWhereInput,
    Prisma.PerencanaanOtomatisCreateInput,
    Prisma.PerencanaanOtomatisUpdateInput,
    Prisma.PerencanaanOtomatisInclude
> {
    constructor(prisma: PrismaClient) {
        super(prisma, prisma.perencanaanOtomatis);
    }
    async chart(): Promise<any[]> {
        const result: any = await this.prisma.$queryRaw`
            SELECT
            TO_CHAR(po.created_at, 'YYYY-MM-DD') as date,
            COUNT(po.id) as count
            FROM perencanaan_otomatis po
            GROUP BY TO_CHAR(po.created_at, 'YYYY-MM-DD')
            ORDER BY TO_CHAR(po.created_at, 'YYYY-MM-DD') ASC;
        `;
        return result;
    }
}