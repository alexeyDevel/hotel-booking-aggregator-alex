import {Injectable, NotFoundException} from '@nestjs/common';

import { UpdateSupportRequestDto } from './dto/update-support-request.dto';
import {
  CreateSupportRequestDto,
  GetChatListParams,
  ISupportRequestClientService,
  ISupportRequestService, MarkMessagesAsReadDto,
  SendMessageDto
} from "./interfaces/interfaces";
import {ID} from "../app/types/types";
import {Message, MessageDocument} from "./schemas/message.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {SupportRequest, SupportRequestDocument} from "./schemas/supportRequest.schema";
import {SupportRequestService} from "./support-request.service";

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService{
  constructor(
      @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
      @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
      private readonly supportRequestService: SupportRequestService

  ) {}
  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
    const supportRequest = new this.supportRequestModel({ user: data.user });
    const message = new this.messageModel({
      author: data.user,
      text: data.text,
    });

    await message.save();
    await supportRequest.messages.push(message);
    await supportRequest.save();

    return supportRequest.toObject();
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const { supportRequest, user, createdBefore } = params;
    const filter = { supportRequest, author: { $ne: user }, readAt: null, sentAt: { $lte: createdBefore } };
    const update = { $set: { readAt: new Date() }};
    const message = await this.messageModel.updateMany(filter, update);
    if (message) {
      return { success: true };
    } else {
      throw new Error('Failed to mark messages as read');
    }
  }

  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    const request = await this.supportRequestModel.findById(supportRequest);
    if (!request) {
      throw new NotFoundException(`Support request with id ${supportRequest} not found`);
    }
    const messages = request.messages.filter((message) => {
      return !message.readAt; ///`${message.author}` !== request.user;
    });
    return messages;
  }


}
