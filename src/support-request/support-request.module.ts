import { Module } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { SupportRequestController } from './support-request.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SupportRequest, SupportRequestSchema} from "./schemas/supportRequest.schema";
import {Message, MessageSchema} from "./schemas/message.schema";
import {EventEmitter2} from "@nestjs/event-emitter";
import {SupportRequestClientService} from "./support-request-client.service";
import {SupportRequestEmployeeService} from "./support-request-employee.service";
import {SupportRequestGateway} from "./support-request.geteway";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [SupportRequestController],
  providers: [SupportRequestGateway, SupportRequestService, EventEmitter2, SupportRequestClientService, SupportRequestEmployeeService]
})
export class SupportRequestModule {}
