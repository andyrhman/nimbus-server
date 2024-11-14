/*
  Warnings:

  - You are about to drop the column `tanggal_perencaan` on the `perencanaan_manual` table. All the data in the column will be lost.
  - You are about to drop the column `tempatWisata_id` on the `perencanaan_manual` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "perencanaan_manual" DROP CONSTRAINT "perencanaan_manual_tempatWisata_id_fkey";

-- AlterTable
ALTER TABLE "perencanaan_manual" DROP COLUMN "tanggal_perencaan",
DROP COLUMN "tempatWisata_id";

-- CreateTable
CREATE TABLE "TempatWisataPerencanaanManual" (
    "id" SERIAL NOT NULL,
    "tanggal_perencanaan" TIMESTAMP(3) NOT NULL,
    "perencanaanManual_id" INTEGER NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "TempatWisataPerencanaanManual_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TempatWisataPerencanaanManual" ADD CONSTRAINT "TempatWisataPerencanaanManual_perencanaanManual_id_fkey" FOREIGN KEY ("perencanaanManual_id") REFERENCES "perencanaan_manual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempatWisataPerencanaanManual" ADD CONSTRAINT "TempatWisataPerencanaanManual_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
