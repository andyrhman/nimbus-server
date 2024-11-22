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
    async chart(time: string): Promise<any[]> {
        let groupByClause: string;

        switch (time) {
            case 'day':
                groupByClause = "TO_CHAR(po.created_at, 'YYYY-MM-DD')";
                break;
            case 'week':
                groupByClause = "TO_CHAR(po.created_at, 'IYYY-IW')";
                break;
            case 'month':
                groupByClause = "TO_CHAR(po.created_at, 'YYYY-MM')";
                break;
            default:
                groupByClause = "TO_CHAR(po.created_at, 'YYYY-MM-DD')";
                break;
        }

        const query = `
            SELECT
            ${groupByClause} as date,
            COUNT(po.id) as count
            FROM perencanaan_otomatis po
            GROUP BY ${groupByClause}
            ORDER BY ${groupByClause} ASC;
        `;
        const result: any = await this.prisma.$queryRawUnsafe(query);
        return result;
    }
}