import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SupportRequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                const formattedData = [{
                    id: data._id,
                    createdAt: data.createdAt,
                    isActive: data.isActive,
                    hasNewMessages: true,
                }];
                return formattedData;
            }),
        );
    }
}
