import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {RoleEnum} from "../enums/role.enum";
import * as bcrypt from 'bcryptjs';
import {hashPassword} from "../../auth/utils/auth.util";


@Injectable()
export class CreateClientInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { email, password, name, contactPhone, role } = request.body;
        const passwordHash = hashPassword(password);
        request.body.passwordHash = passwordHash;
        request.body.role = role ? role : RoleEnum.client;
        return next.handle().pipe(
            map((data) => {
                return data;
            }),
        );
    }
}
