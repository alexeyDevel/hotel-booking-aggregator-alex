import {Injectable, NotFoundException} from '@nestjs/common';
import mongoose from 'mongoose';
import {
  GetChatListParams,
  ISupportRequestEmployeeService,
  ISupportRequestService, MarkMessagesAsReadDto,
  SendMessageDto
} from "./interfaces/interfaces";
import {ID} from "../app/types/types";
import {Message} from "./schemas/message.schema";
import {SupportRequest, SupportRequestDocument} from "./schemas/supportRequest.schema";
import {FilterQuery, Model, UpdateQuery} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  constructor(
      @InjectModel(SupportRequest.name)
      private readonly supportRequestModel: Model<SupportRequestDocument>,
  ) {}

  async markMessagesAsRead(
      params: MarkMessagesAsReadDto,
  ): Promise<void> {
    const { supportRequest, user, createdBefore } = params;
    await this.supportRequestModel.findOneAndUpdate(
        {
          _id: supportRequest,
          user,
          'messages.sentAt': { $lt: createdBefore },
          'messages.readAt': { $exists: false },
        },
        { $set: { 'messages.$[message].readAt': new Date() } },
        {
          arrayFilters: [{ 'message.author': { $ne: user } }],
          new: true,
          runValidators: true,
        },
    );
  }
  async getUnreadCount(supportRequestId: ID): Promise<Message[]> {
    const supportRequest = await this.supportRequestModel
        .findById(supportRequestId)
        .exec();
    if (!supportRequest) {
      throw new NotFoundException('Support request not found');
    }
    const messages = supportRequest.get('messages') as Message[];
    const unreadMessages = messages.filter(
        (msg) => !msg.readAt //&& `${msg.author}` !==  `${supportRequest.author}`,
    );
    return unreadMessages;
  }

  async closeRequest(supportRequest: ID): Promise<void> {
    await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
      isActive: false,
    });
  }

}
