import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {LocalStrategy} from "./strategys/local.strategy";
import {CookieStrategy} from "./strategys/сookie.strategy";

@Module({
  imports: [
    UsersModule,
  ],
  providers: [AuthService, CookieStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
