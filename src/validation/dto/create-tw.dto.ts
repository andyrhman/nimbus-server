import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTempatWisataDTO {
    @IsString({ message: 'Nama must be a string' })
    @IsNotEmpty()
    nama: string;

    @IsString({ message: 'Deskripsi must be a string' })
    @IsNotEmpty()
    deskripsi: string;

    @IsOptional()
    @IsString({ message: 'Thumbnail must be a string URL if provided' })
    thumbnail?: string;

    @IsNotEmpty()
    alamat: string;

    @IsNotEmpty()
    website: string;

    @IsNotEmpty()
    google_link: string;

    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    review_total: string;

    @IsNotEmpty()
    average_rating: string;

    @IsNotEmpty()
    provinsi_id: number;

    @IsNotEmpty()
    categoryWisata_id: number;
}