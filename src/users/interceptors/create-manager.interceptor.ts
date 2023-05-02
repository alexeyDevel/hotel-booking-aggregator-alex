import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {RoleEnum} from "../enums/role.enum";
import * as bcrypt from 'bcryptjs';
import {hashPassword} from "../../auth/utils/auth.util";


@Injectable()
export class CreateManagerInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { email, password, name, contactPhone } = request.body;
        const passwordHash = hashPassword(password);
        request.body.passwordHash = passwordHash;
        request.body.role = RoleEnum.manager;
        return next.handle().pipe(
            map((data) => {
                return data;
            }),
        );
    }
}
