import { fakerID_ID as faker } from "@faker-js/faker";
import { PrismaClient } from '@prisma/client';
import { myPrisma } from "../config/db.config";

const prisma = new PrismaClient();

async function main() {
    const travelWords = ["Gunung", "Pantai", "Hutan", "Gurun", "Pulau", "Air Terjun", "Lembah", "Ngarai", "Danau", "Tebing", "Desa", "Taman Nasional", "Pemandian Air Panas", "Museum"];

    for (let i = 0; i < 14; i++) {
        await myPrisma.categoryWisata.create({
            data: {
                nama: faker.helpers.arrayElement(travelWords),
                thumbnail: `${faker.image.urlLoremFlickr({ category: 'landscape' })}?random=${Math.round(Math.random() * 1000)}`
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
