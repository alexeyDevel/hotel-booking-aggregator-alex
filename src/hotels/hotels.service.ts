import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument, HotelRoom, HotelRoomDocument } from './schemas/hotel.schema';
import {UpdateHotelDto} from "./dto/update-hotel.dto";

@Injectable()
export class HotelsService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>) {}

  async create(data: any): Promise<Hotel> {
    const hotel = new this.hotelModel(data);
    return hotel.save();
  }

  async findById(id: string): Promise<Hotel> {
    return this.hotelModel.findById(id).exec();
  }

  async search(params: ISearchHotelParams): Promise<Hotel[]> {
    const { limit, offset, title } = params;
    const query = title ? { title: new RegExp(title, 'i') } : {};
    return this.hotelModel.find(query).skip(offset).limit(limit).exec();
  }

  async update(id: string, data: UpdateHotelDto): Promise<Hotel> {
    const hotel = await this.hotelModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }
    return hotel;
  }
}