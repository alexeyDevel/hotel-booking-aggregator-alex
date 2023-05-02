import {IReservationDto} from "../interfaces/IReservationDto";
import {ID} from "../../app/types/types";

export class CreateReservationDto implements IReservationDto {
    dateEnd: Date;
    dateStart: Date;
    hotelId: ID;
    roomId: ID;
    userId: ID;

}
