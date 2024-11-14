/*
  Warnings:

  - You are about to drop the column `rating` on the `tempat_wisata` table. All the data in the column will be lost.
  - Added the required column `alamat` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `average_rating` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `google_link` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review_total` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tempat_wisata" DROP COLUMN "rating",
ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "average_rating" INTEGER NOT NULL,
ADD COLUMN     "google_link" TEXT NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ADD COLUMN     "review_total" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;
