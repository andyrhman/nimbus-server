/*
  Warnings:

  - You are about to drop the column `perencanaanManual_id` on the `tempatWisata_perencanaan_manual` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" DROP CONSTRAINT "tempatWisata_perencanaan_manual_perencanaanManual_id_fkey";

-- AlterTable
ALTER TABLE "perencanaan_manual" ADD COLUMN     "tw_perencanaan_manual_id" INTEGER;

-- AlterTable
ALTER TABLE "tempatWisata_perencanaan_manual" DROP COLUMN "perencanaanManual_id";

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_tw_perencanaan_manual_id_fkey" FOREIGN KEY ("tw_perencanaan_manual_id") REFERENCES "tempatWisata_perencanaan_manual"("id") ON DELETE SET NULL ON UPDATE CASCADE;
