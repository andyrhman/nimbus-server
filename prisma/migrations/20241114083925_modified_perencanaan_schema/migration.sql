/*
  Warnings:

  - You are about to drop the `TempatWisataPerencanaanManual` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TempatWisataPerencanaanManual" DROP CONSTRAINT "TempatWisataPerencanaanManual_perencanaanManual_id_fkey";

-- DropForeignKey
ALTER TABLE "TempatWisataPerencanaanManual" DROP CONSTRAINT "TempatWisataPerencanaanManual_tempatWisata_id_fkey";

-- DropTable
DROP TABLE "TempatWisataPerencanaanManual";

-- CreateTable
CREATE TABLE "tempatWisata_perencanaan_manual" (
    "id" SERIAL NOT NULL,
    "tanggal_perencanaan" TIMESTAMP(3) NOT NULL,
    "perencanaanManual_id" INTEGER NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "tempatWisata_perencanaan_manual_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" ADD CONSTRAINT "tempatWisata_perencanaan_manual_perencanaanManual_id_fkey" FOREIGN KEY ("perencanaanManual_id") REFERENCES "perencanaan_manual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" ADD CONSTRAINT "tempatWisata_perencanaan_manual_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
