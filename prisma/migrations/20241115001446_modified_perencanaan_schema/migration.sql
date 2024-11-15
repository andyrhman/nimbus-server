/*
  Warnings:

  - You are about to drop the column `tw_perencanaan_manual_id` on the `perencanaan_manual` table. All the data in the column will be lost.
  - Added the required column `perencanaanManual_id` to the `tempatWisata_perencanaan_manual` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "perencanaan_manual" DROP CONSTRAINT "perencanaan_manual_tw_perencanaan_manual_id_fkey";

-- AlterTable
ALTER TABLE "perencanaan_manual" DROP COLUMN "tw_perencanaan_manual_id";

-- AlterTable
ALTER TABLE "tempatWisata_perencanaan_manual" ADD COLUMN     "perencanaanManual_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" ADD CONSTRAINT "tempatWisata_perencanaan_manual_perencanaanManual_id_fkey" FOREIGN KEY ("perencanaanManual_id") REFERENCES "perencanaan_manual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
