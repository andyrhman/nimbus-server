import { fakerID_ID as faker } from "@faker-js/faker";
import { PrismaClient } from '@prisma/client';
import { myPrisma } from "../config/db.config";

const prisma = new PrismaClient();

async function main() {
    const usedStates = new Set<string>();

    for (let i = 0; i < 30; i++) {
        let state: string;
        do {
            state = faker.location.state();
        } while (usedStates.has(state));

        usedStates.add(state);

        await myPrisma.provinsi.create({
            data: {
                nama: state,
                thumbnail: `${faker.image.urlLoremFlickr({ category: 'city' })}?random=${Math.round(Math.random() * 1000)}`
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
