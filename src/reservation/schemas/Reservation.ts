import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {ID} from "../../app/types/types";

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    userId: ID;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Hotel' })
    hotelId: ID;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'HotelRoom' })
    roomId: ID;

    @Prop({ required: true })
    dateStart: Date;

    @Prop({ required: true })
    dateEnd: Date;
}
const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index(
    { roomId: 1, dateStart: 1, dateEnd: 1 },
    { unique: true },
);

export default ReservationSchema;


