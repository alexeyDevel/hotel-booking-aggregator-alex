import {ConflictException, Injectable} from '@nestjs/common';
import {IReservation} from "./interfaces/IReservation";
import {IReservationDto} from "./interfaces/IReservationDto";
import {IReservationSearchOptions} from "./interfaces/IReservationSearchOptions";
import {ID} from "../app/types/types";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Reservation, ReservationDocument} from "./schemas/Reservation";
import {ReservationSearchOptions} from "./dto/reservation-SearchOptions.dto";

@Injectable()
export class ReservationService implements  IReservation {
  constructor(
      @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(data: IReservationDto): Promise<Reservation> {
    const existingReservation = await this.reservationModel.findOne({
      roomId: data.roomId,
      dateStart: {$lt: data.dateEnd},
      dateEnd: {$gt: data.dateStart},
    });
    if (existingReservation) {
      throw new ConflictException(`Room ${data.roomId} is not available on the selected dates`);
    }
    const reservation = new this.reservationModel(data);
    return reservation.save();
  }

  getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>> {
    const query = this.reservationModel.find();
    if (filter.userId) {
      query.where({ userId: filter.userId });
    }
    if (filter.dateStart) {
      query.where({ dateStart: { $gte: filter.dateStart } });
    }
    if (filter.dateEnd) {
      query.where({ dateEnd: { $lte: filter.dateEnd } });
    }
    return query.exec();
  }

  async removeReservation(id: ID): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id).exec();
  }
}
