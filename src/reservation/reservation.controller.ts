import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {IReservationDto} from "./interfaces/IReservationDto";
import {Reservation} from "./schemas/Reservation";
import {RoleGuard, Roles} from "../auth/guards/role.guards";
import {RoleEnum} from "../users/enums/role.enum";
import {ReservationSearchOptions} from "./dto/reservation-SearchOptions.dto";
import {AuthGuard} from "../auth/guards/auth.guard";

@Controller('api/client/reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client)
  async addReservation(@Body() data: IReservationDto): Promise<Reservation> {
    return this.reservationService.addReservation(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client)
  async removeReservation(@Param('id') id: string): Promise<void> {
    await this.reservationService.removeReservation(id);
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client)
  async getReservations(@Query() query: ReservationSearchOptions): Promise<Reservation[]> {
    return this.reservationService.getReservations(query);
  }

  @Get('/:userId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.manager)
  async getReservationsByUserId(@Param('userId') userId: string): Promise<Reservation[]> {
    return this.reservationService.getReservations({userId: userId});
  }

}
