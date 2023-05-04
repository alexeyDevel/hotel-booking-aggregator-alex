import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { CreateClientInterceptor } from './interceptors/create-client.interceptor';
import { RoleGuard, Roles } from '../auth/guards/role.guards';
import { RoleEnum } from './enums/role.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateManagerInterceptor } from './interceptors/create-manager.interceptor';
import { MongoExceptionInterceptor } from './interceptors/mongo-exception.interceptor';

@Controller('')
@UseInterceptors(MongoExceptionInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/users')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(RoleEnum.admin)
  @UseInterceptors(CreateClientInterceptor)
  async createForAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
  @Post('manager/users')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.manager)
  @UseInterceptors(CreateManagerInterceptor)
  async createForManager(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
  @Post('client/register')
  @UseInterceptors(CreateClientInterceptor)
  async createClient(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('admin/users')
  @Roles(RoleEnum.admin)
  async findAll(@Body() params): Promise<User[]> {
    return this.usersService.findAll(params);
  }
  @Get('manager/users')
  @Roles(RoleEnum.manager)
  async findAllManager(@Body() params): Promise<User[]> {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Get()
  findOneByEmail(@Body() email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
