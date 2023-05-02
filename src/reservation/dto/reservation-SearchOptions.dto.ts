import {IReservationDto} from "../interfaces/IReservationDto";
import {ID} from "../../app/types/types";
import {IReservationSearchOptions} from "../interfaces/IReservationSearchOptions";

export class ReservationSearchOptions {
    dateEnd?: Date;
    dateStart?: Date;
    userId?: ID;

}
