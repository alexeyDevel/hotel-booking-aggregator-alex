import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        const hasRole = () => user.roles.some(role => roles.includes(role));
        if (user && user.roles && hasRole()) {
            return true;
        }
        throw new ForbiddenException('You do not have sufficient permissions');
    }
}

import { SetMetadata } from '@nestjs/common';
import {RoleEnum} from "../../users/enums/role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
export const AllowAnonymous = () => SetMetadata('allow-anonymous', true);