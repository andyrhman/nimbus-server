-- DropForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" DROP CONSTRAINT "tempatWisata_perencanaan_manual_perencanaanManual_id_fkey";

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" ADD CONSTRAINT "tempatWisata_perencanaan_manual_perencanaanManual_id_fkey" FOREIGN KEY ("perencanaanManual_id") REFERENCES "perencanaan_manual"("id") ON DELETE CASCADE ON UPDATE CASCADE;
