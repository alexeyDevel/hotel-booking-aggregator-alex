import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformDateInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { dateStart, dateEnd } = request.body;
        request.body.dateStart = new Date(dateStart);
        request.body.dateEnd = new Date(dateEnd);
        return next.handle().pipe(
            map((data) => {
                return data;
            }),
        );
    }
}
