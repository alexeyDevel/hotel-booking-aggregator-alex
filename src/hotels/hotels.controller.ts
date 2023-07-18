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
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Hotel, HotelRoom } from './schemas/hotel.schema';
import { HotelRoomService } from './hotelRoom.service';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard, Roles } from '../auth/guards/role.guards';
import { RoleEnum } from '../users/enums/role.enum';
import { SearchHotelDto } from "./dto/serch.dto";

@Controller('admin/hotels')
export class HotelsController {
  constructor(private hotelService: HotelsService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.admin)
  async createHotel(@Body() data: CreateHotelDto): Promise<Hotel> {
    return this.hotelService.create(data);
  }
  @Get(':id')
  async getHotelById(@Param('id') id: string): Promise<Hotel> {
    return this.hotelService.findById(id);
  }
  @Get()
  async searchHotels(@Query() params: SearchHotelDto): Promise<Hotel[]> {
    return this.hotelService.search(params);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.admin)
  async updateHotel(
    @Param('id') id: string,
    @Body() data: UpdateHotelDto,
  ): Promise<Hotel> {
    return this.hotelService.update(id, data);
  }
}
