-- CreateTable
CREATE TABLE "tempat_wisata" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "provinsi_id" INTEGER NOT NULL,
    "categoryWisata_id" INTEGER NOT NULL,

    CONSTRAINT "tempat_wisata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tempat_wisata_gambar" (
    "id" SERIAL NOT NULL,
    "picture" TEXT NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "tempat_wisata_gambar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinsi" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,

    CONSTRAINT "provinsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_wisata" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,

    CONSTRAINT "category_wisata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tempat_wisata" ADD CONSTRAINT "tempat_wisata_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tempat_wisata" ADD CONSTRAINT "tempat_wisata_categoryWisata_id_fkey" FOREIGN KEY ("categoryWisata_id") REFERENCES "category_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tempat_wisata_gambar" ADD CONSTRAINT "tempat_wisata_gambar_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
