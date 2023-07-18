import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHotelDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description?: string;
}
