import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SupportRequestInterceptorForManager implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                const formattedData = data.map(chat => {
                    return {
                        id: chat._id,
                        createdAt: chat.createdAt,
                        isActive: chat.isActive,
                        hasNewMessages: chat.messages.find(message => !message.readAt) ? true : false ,
                        client: {
                            id: chat.user._id,
                            name: chat.user.name,
                            email: chat.user.email,
                            contactPhone: chat.user.contactPhone ? chat.user.contactPhone : ""
                        }
                    }
                });
                return formattedData;
            }),
        );
    }
}
