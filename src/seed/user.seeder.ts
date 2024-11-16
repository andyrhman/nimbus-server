import { fakerID_ID as faker } from "@faker-js/faker";
import { PrismaClient } from '@prisma/client';
import { myPrisma } from "../config/db.config";
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {

    const password = await argon2.hash("123123");

    for (let i = 0; i < 30; i++) {
        await myPrisma.user.create({
            data: {
                nama: faker.person.fullName(),
                username: faker.internet.username().toLowerCase(),
                email: faker.internet.email().toLowerCase(),
                profile_pic: faker.image.avatar(),
                password
            }
        });
    }

    console.info("Seeding has been completed");
}
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
