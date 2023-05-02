import {Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import { AuthGuard } from '@nestjs/passport';
import {SignInDto} from "../users/dto/sign-In.dto";
import {AllowAnonymous} from "./guards/role.guards";
import { Response } from 'express';
import {CookieStrategy} from "./strategys/сookie.strategy";

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @AllowAnonymous()
    @UseGuards(CookieStrategy)
    @Post('login')
    async signIn(@Body() signInDto: SignInDto, @Res() res: any) {
        const accessToken = await this.authService.validateUser(signInDto.email, signInDto.password);
        const maxAge = 3600 * 1000; // 1 hour
        res.cookie('access_token', accessToken, { httpOnly: true, maxAge });
        res.json({ access_token: accessToken });
    }

    @UseGuards(AuthGuard('cookie'))
    @Post('logout')
    async logout(@Req() req: any, @Res() res: any) {
        res.clearCookie('access_token');
        res.status(200).send();
    }
    // @UseGuards(AuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
}
