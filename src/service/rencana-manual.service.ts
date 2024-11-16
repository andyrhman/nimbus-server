import { PrismaClient, PerencanaanManual, Prisma } from '@prisma/client';
import { AbstractService } from './abstract.service';

export class PerencanaanManualService extends AbstractService<
    PerencanaanManual,
    Prisma.PerencanaanManualWhereInput,
    Prisma.PerencanaanManualCreateInput,
    Prisma.PerencanaanManualUpdateInput,
    Prisma.PerencanaanManualInclude
> {
    constructor(prisma: PrismaClient) {
        super(prisma, prisma.perencanaanManual);
    }
    async chart(): Promise<any[]> {
        const result: any = await this.prisma.$queryRaw`
            SELECT
            TO_CHAR(pm.created_at, 'YYYY-MM-DD') as date,
            COUNT(pm.id) as count
            FROM perencanaan_manual pm
            GROUP BY TO_CHAR(pm.created_at, 'YYYY-MM-DD')
            ORDER BY TO_CHAR(pm.created_at, 'YYYY-MM-DD') ASC;
        `;
        return result;
    }
}