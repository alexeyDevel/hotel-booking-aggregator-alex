import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';
import {IsOptional} from "class-validator";

export class UpdateHotelDto extends PartialType(CreateHotelDto) {
    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string;
}
