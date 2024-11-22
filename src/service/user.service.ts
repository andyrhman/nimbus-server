import { PrismaClient, User, Prisma } from '@prisma/client';
import { AbstractService } from './abstract.service';

export class UserService extends AbstractService<
    User,
    Prisma.UserWhereInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserInclude
> {
    constructor(prisma: PrismaClient) {
        super(prisma, prisma.user);
    }

    async chart(time: string): Promise<any[]> {
        let groupByClause: string;

        switch (time) {
            case 'day':
                groupByClause = "TO_CHAR(u.created_at, 'YYYY-MM-DD')";
                break;
            case 'week':
                groupByClause = "TO_CHAR(u.created_at, 'IYYY-IW')";
                break;
            case 'month':
                groupByClause = "TO_CHAR(u.created_at, 'YYYY-MM')";
                break;
            default:
                groupByClause = "TO_CHAR(u.created_at, 'YYYY-MM-DD')";
                break;
        }

        const query = `
        SELECT
        ${groupByClause} as date,
        COUNT(u.id) as count
        FROM users u
        GROUP BY ${groupByClause}
        ORDER BY ${groupByClause} ASC;
        `;

        const result: any = await this.prisma.$queryRawUnsafe(query);
        return result;
    }
}
