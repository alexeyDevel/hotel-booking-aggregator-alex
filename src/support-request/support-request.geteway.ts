import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {SupportRequestService} from "./support-request.service";
import {Message} from "./schemas/message.schema";
import {EventEmitter2} from "@nestjs/event-emitter";


@WebSocketGateway({ cors: true })
export class SupportRequestGateway {
    constructor(
        private readonly supportRequestService: SupportRequestService,
        private eventEmitter: EventEmitter2,
    ) {}
    @WebSocketServer() server: Server;

    @SubscribeMessage('subscribeToChat')
    handleSubscribeToChat(
        @MessageBody() chatId: string,
        @ConnectedSocket() client: Socket
    ): void {
        const message$ = this.supportRequestService.getMessageStreamForChat(chatId);
        message$.subscribe((message: Message) => {
            client.emit(`chatMessage-${chatId}`, message);
        });
        // регистрируем обработчик события myEvent и отправляем данные клиенту
        this.eventEmitter.on(`newMessage-${chatId}`, (data) => {
            client.emit(`chatMessage-${chatId}`, data);
        });
    }

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() payload: string,
        @ConnectedSocket() client: Socket
    ): string {
        const сhatId= '644e3a9a647cccdfb92a051f';
        this.eventEmitter.emit('chatMessage', сhatId, {text: 'text'});
        return 'Hello world!';
    }
}