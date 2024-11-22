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
    async chart(time: string): Promise<any[]> {
        let groupByClause: string;

        switch (time) {
            case 'day':
                groupByClause = "TO_CHAR(pm.created_at, 'YYYY-MM-DD')";
                break;
            case 'week':
                groupByClause = "TO_CHAR(pm.created_at, 'IYYY-IW')";
                break;
            case 'month':
                groupByClause = "TO_CHAR(pm.created_at, 'YYYY-MM')";
                break;
            default:
                groupByClause = "TO_CHAR(pm.created_at, 'YYYY-MM-DD')";
                break;
        }

        const query = `
            SELECT
            ${groupByClause} as date,
            COUNT(pm.id) as count
            FROM perencanaan_manual pm
            GROUP BY ${groupByClause}
            ORDER BY ${groupByClause} ASC;
        `;
        const result: any = await this.prisma.$queryRawUnsafe(query);
        return result;
    }
}