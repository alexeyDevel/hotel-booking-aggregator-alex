import {ID} from "../../app/types/types";

export interface IReservationDto {
    userId: ID;
    hotelId: ID;
    roomId: ID;
    dateStart: Date;
    dateEnd: Date;
}