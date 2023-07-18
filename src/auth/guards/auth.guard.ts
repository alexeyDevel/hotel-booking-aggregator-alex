import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies['access_token'];
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token.access_token, {
                secret: process.env.JWT_SECRET,
            });
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
            request['userId'] = payload._id;
            // if (this.role && payload.role !== this.role) {
            //     throw new HttpException('You do not have sufficient permissions', HttpStatus.FORBIDDEN);
            // }
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
}
