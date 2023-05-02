import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import {HotelRoomService} from "./hotelRoom.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Hotel, HotelRoom, HotelRoomSchema, HotelSchema} from "./schemas/hotel.schema";
import {HotelRoomsController} from "./hotelRoom.controller";
import {NestjsFormDataModule} from "nestjs-form-data";
import {FilesModule} from "../files/files.module";
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";



@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },

    ]),FilesModule,
  ],
  controllers: [HotelsController, HotelRoomsController],
  providers: [HotelsService, HotelRoomService]
})
export class HotelsModule {}
