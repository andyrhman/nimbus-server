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
    async chart(): Promise<any[]> {
        const result: any = await this.prisma.$queryRaw`
            SELECT
            TO_CHAR(u.created_at, 'YYYY-MM-DD') as date,
            COUNT(u.id) as count
            FROM users u
            GROUP BY TO_CHAR(u.created_at, 'YYYY-MM-DD')
            ORDER BY TO_CHAR(u.created_at, 'YYYY-MM-DD') ASC;
        `;
        return result;
    }
}