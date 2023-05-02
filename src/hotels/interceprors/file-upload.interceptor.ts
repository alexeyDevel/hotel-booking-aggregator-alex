import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HotelRoomInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Получить объект запроса (Request) из контекста
        const request = context.switchToHttp().getRequest();

        // Теперь вы можете получить данные из объекта запроса, например:
        const body = request.body;
        console.log('request');
        console.log(request);
        // Здесь вы можете добавить логику перед выполнением запроса

        // Важно вызывать next.handle() для продолжения обработки запроса
        const result = next.handle();

        // Здесь вы можете добавить логику после выполнения запроса, но перед отправкой ответа

        return result;
    }
}
