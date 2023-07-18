import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User, UserDocument} from "./schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {IUserService} from "./interfaces/IUserService";
import {ISearchUserParams} from "./interfaces/ISearchUserParams";
@Injectable()
export class UsersService implements IUserService{
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const response = createdUser.save();

    return response;
  }

  async findAll(params: ISearchUserParams): Promise<User[]> {
    const filter: any = {};
    if (params.email) filter.email = { $regex: params.email, $options: 'i' };
    if (params.name) filter.name = { $regex: params.name, $options: 'i' };
    if (params.contactPhone) filter.contactPhone = { $regex: params.contactPhone, $options: 'i' };
    return this.userModel.find(filter).exec();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }
}
