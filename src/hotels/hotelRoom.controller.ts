import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Put,
    UseInterceptors,
    ParseFilePipe, UploadedFiles, UsePipes, UploadedFile, MaxFileSizeValidator, FileTypeValidator, UseGuards
} from '@nestjs/common';
import {Hotel, HotelRoom} from "./schemas/hotel.schema";
import {HotelRoomService} from "./hotelRoom.service";
import {ISearchRoomsParams} from "./interfaces/ISearchRoomsParams";
import {CreateHotelRoomDto} from "./dto/create-hotelRoom.dto";
import {FormDataRequest} from "nestjs-form-data";
import {FilesInterceptor} from "@nestjs/platform-express";
import {multerOptions} from "../app/configs/multer.configuration";
import {UpdateHotelRoomDto} from "./dto/update-hotelRoom.dto";
import {RoleGuard, Roles} from "../auth/guards/role.guards";
import {RoleEnum} from "../users/enums/role.enum";
import {HotelRoomInterceptor} from "./interceprors/hotelRoom.interceptor";

@Controller('api/common/hotel-rooms')
export class HotelRoomsController {
    constructor(private hotelRoomService: HotelRoomService) {}

    @Post()
    @UseGuards(RoleGuard)
    @Roles(RoleEnum.admin)
    @UseInterceptors(
        FilesInterceptor('images', 10, multerOptions),
        HotelRoomInterceptor
    )
    async createHotelRoom(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() data: CreateHotelRoomDto,
        ): Promise<HotelRoom> {
        const paths = images.map(file => file.filename);
        return this.hotelRoomService.create({...data, images: [...paths]});
    }

    @Get(':id')
    async getHotelRoomById(@Param('id') id: string): Promise<HotelRoom> {
        return this.hotelRoomService.findById(id);
    }

    @Get()
    async searchHotelRooms(@Query() params: ISearchRoomsParams): Promise<HotelRoom[]> {
        return this.hotelRoomService.search(params);
    }

    @Put(':id')
    @UseGuards(RoleGuard)
    @Roles(RoleEnum.admin)
    @UseInterceptors(HotelRoomInterceptor)
    async updateHotelRoom(
            @Param('id') id: string,
            @UploadedFiles() images: Array<Express.Multer.File> | string[],
            @Body() data: UpdateHotelRoomDto,
        ): Promise<HotelRoom> {
        let paths= [];
        if(images.length > 0){
            paths = images.map(file => file.filename);
        }

        return this.hotelRoomService.update(id, {...data, images: [...paths]});
    }
}
