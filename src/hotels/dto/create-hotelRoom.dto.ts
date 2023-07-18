import { IsBoolean, IsString, IsOptional } from 'class-validator';
import mongoose from "mongoose";

export class CreateHotelRoomDto {
    @IsString()
    hotel: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;
}