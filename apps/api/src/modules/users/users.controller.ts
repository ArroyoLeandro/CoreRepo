import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserBody,
  UpdateUserBody,
  User,
  UsersList,
} from '@repo/validators';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { CsrfGuard } from '../auth/csrf.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async list(): Promise<UsersList> {
    return this.usersService.list();
  }

  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.getById(id);
  }

  @Post()
  @UseGuards(CsrfGuard)
  async create(
    @Body(new ZodValidationPipe(CreateUserBody)) body: CreateUserBody,
  ): Promise<User> {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @UseGuards(CsrfGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateUserBody)) body: UpdateUserBody,
  ): Promise<User> {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(CsrfGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ ok: true }> {
    return this.usersService.softDelete(id);
  }
}
