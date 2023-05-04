import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MongoServerError } from 'mongodb';

@Injectable()
export class MongoExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);
        if (error instanceof MongoServerError && error.code === 11000) {
          const field = Object.keys(error.keyValue)[0];
          const message = `Дублирование поля ${field}`;
          throw new HttpException(message, HttpStatus.CONFLICT);
        } else {
          return throwError(() => error);
        }
      }),
    );
  }
}
