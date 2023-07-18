import {Injectable, NotFoundException} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {GetChatListParams, ISupportRequestService, SendMessageDto} from "./interfaces/interfaces";
import {ID} from "../app/types/types";
import {Message, MessageDocument} from "./schemas/message.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {SupportRequest} from "./schemas/supportRequest.schema";
import {concatMap, filter, from, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {WebSocketServer} from "@nestjs/websockets";
import { Server } from 'socket.io';

@Injectable()
export class SupportRequestService implements ISupportRequestService{
  constructor(
      @InjectModel(SupportRequest.name)
      private readonly supportRequestModel: Model<SupportRequest>,
      @InjectModel(Message.name)
      private readonly messageModel: Model<Message>,
      private readonly eventEmitter: EventEmitter2,

  ) {}
  subscribe(
        handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
        const event = 'newMessage';
        this.eventEmitter.on(event, handler);

        return () => this.eventEmitter.off(event, handler);
  }

  async sendMessage({author, supportRequest, text}: SendMessageDto): Promise<Message> {
    const message = new this.messageModel({
      author,
      supportRequest,
      text,
    });
    await message.save();
    const updatedSupportRequest = await this.supportRequestModel
        .findByIdAndUpdate(supportRequest, {
          $push: { messages: message },
        })
        .populate('user')
        .exec();
    this.eventEmitter.emit('newMessage', updatedSupportRequest, message);
    // this.server.emit('newMessage', message);
    return message.populate({
        path: 'author',
        model: 'User',
        select: '_id name'
    });
  }

  async getMessages(supportRequestId: ID): Promise<Message[]> {
    const supportRequest = await this.supportRequestModel
        .findById(supportRequestId)
        .populate('messages.author')
        .exec();
    if (!supportRequest) {
        throw new NotFoundException('Support request not found');
    }
    const messages = supportRequest.get('messages') as Message[];

    return messages;
  }

  async findSupportRequests(data: GetChatListParams): Promise<SupportRequest[]> {
    const query = this.supportRequestModel.find({isActive: data.isActive }).where('user', data.user);
    if (data.offset) {
        query.skip(data.offset);
    }
    if(data.limit){
        query.limit(data.limit);
    }
    return query;
        //.populate('author').exec();
  }
  async findSupportRequestsManager(data: GetChatListParams): Promise<SupportRequest[]> {
      const query = this.supportRequestModel
          .find({isActive: data.isActive })
          .where('user', data.user)
          .populate({
               path: 'messages'
          })
      if (data.offset) {
          query.skip(data.offset);
      }
      if(data.limit){
          query.limit(data.limit);
      }
      return query.populate('user').exec();
  }
  async getAllMassagesByChat(id: string, user: any){
      const chat = await this.supportRequestModel
          .findById(id)
          .populate({
              path: 'messages',
              populate: {
                  path: 'author',
                  model: 'User',
                  select: 'name'
              }
          });
      const response = chat.messages.map(message => {
          return   {
              id: message._id,
              createdAt: message.sentAt,
              text: message.text,
              readAt: message.readAt,
              author: {
                  id: message.author._id,
                  name: message.author['name']
              }
          }
      })

      if(user.roles.includes('client')  && `${chat.user._id}` ==  `${user.userId}`){
          return response;
      }
      else if (user.roles.includes('manager')){
          return response;
      }
      else
          return "Нет доступа к чату";
  }
  getMessageStreamForChat(chatId: ID): Observable<Message> {
        // Найти запись о поддержке по chatId
      return from(this.supportRequestModel.findOne({_id: chatId}).populate('messages')).pipe(
          filter((supportRequest) => !!supportRequest), // проверяем, что поддержка существует
          map((supportRequest) => supportRequest.messages), // получаем массив сообщений из записи о поддержке
          concatMap((messages) => messages), // преобразуем массив сообщений в поток сообщений
      );
  }

}
