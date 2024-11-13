import { ArrayMinSize, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTempatWisataDTO {
    @IsString({ message: 'Nama must be a string' })
    @IsNotEmpty()
    nama: string;

    @IsString({ message: 'Deskripsi must be a string' })
    @IsNotEmpty()
    deskripsi: string;

    thumbnail: string;

    @IsNotEmpty()
    rating: number;

    @IsNotEmpty()
    provinsi_id: number;

    @IsNotEmpty()
    categoryWisata_id: number;
}