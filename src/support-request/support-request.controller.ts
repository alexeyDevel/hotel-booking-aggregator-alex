import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SendMessageDto } from './interfaces/interfaces';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard, Roles } from '../auth/guards/role.guards';
import { RoleEnum } from '../users/enums/role.enum';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { SupportRequestInterceptor } from './interceptors/supportRequest.interceptor';
import { SupportRequestInterceptorForManager } from './interceptors/supportRequestForManager.interceptor';
import { ID } from '../app/types/types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('')
export class SupportRequestController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('client/support-requests')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client)
  async getSupportRequestsByUser(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('isActive') isActive = true,
    @Req() request: any,
  ) {
    return this.supportRequestService.findSupportRequests({
      user: request.user.userId,
      isActive,
    });
  }
  @Get('manager/support-requests')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client)
  @UseInterceptors(SupportRequestInterceptorForManager)
  async getSupportRequestsManagerByUser(
    @Query('limit') limit = 10,
    @Query('userId') userId: string,
    @Query('offset') offset = 0,
    @Query('isActive') isActive = true,
    @Req() request: any,
  ) {
    return await this.supportRequestService.findSupportRequestsManager({
      user: userId,
      isActive,
    });
  }

  @Post('client/support-requests')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client)
  @UseInterceptors(SupportRequestInterceptor)
  async createSupportRequest(
    @Body() supportRequestDto: CreateSupportRequestDto,
    @Req() request: any,
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      user: request.user.userId,
      text: supportRequestDto.text,
    });
  }

  @Delete(':id')
  async closeSupportRequest(@Param('id') id: string) {
    return this.supportRequestEmployeeService.closeRequest(id);
  }

  @Post('common/support-requests/:id/messages')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client, RoleEnum.manager)
  async sendMessage(
    @Param('id') id: string,
    @Body() bodyData: any,
    @Req() request: any,
  ) {
    const message = await this.supportRequestService.sendMessage({
      author: request.user.userId,
      supportRequest: id,
      text: bodyData.text,
    });
    if (message) {
      this.eventEmitter.emit(`newMessage-${id}`, message);
    }

    return message;
  }
  @Post('common/support-requests/:id/messages/read')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.client, RoleEnum.manager)
  async readMessages(
    @Param('id') id: string,
    @Body() bodyData: any,
    @Req() request: any,
  ) {
    const message = await this.supportRequestClientService.markMessagesAsRead({
      user: request.user.userId,
      supportRequest: id,
      createdBefore: new Date(bodyData.createdBefore),
    });

    return message;
  }

  // @Post('common/support-requests/:id/messages')
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(RoleEnum.client, RoleEnum.manager)
  // async getAllMassageByChat(@Param('id') id: string,
  //                            @Req() request: any) {
  //   return await this.supportRequestService.getAllMassagesByChat(id, request.user);
  // }
}
