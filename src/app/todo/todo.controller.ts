import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Get } from '@nestjs/common';
import { CreateTodoDto, updateTodoDto } from './dto/todo.dto';
import ResponseRequest from 'src/common/ResponseRequest';
import { API_PREFIX_URL } from 'src/common/constant';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller({ path: `${API_PREFIX_URL}/todo` })
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('all')
  async findAll(): Promise<ResponseRequest> {
    return this.todoService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post('add')
  async create(@Body() createTodoDto: CreateTodoDto) {
    const result = await this.todoService.create(createTodoDto);
    return result;
  }

  @UseGuards(JwtGuard)
  @Get('findById/:id')
  async findById(@Param('id') id: string) {
    return this.todoService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Get('findByUserId/:user_id')
  async findByUserId(@Param('user_id') user_id: string) {
    return this.todoService.findByUserId(user_id);
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }

  @UseGuards(JwtGuard)
  @Put('update/:id')
  async update(@Body() todo: updateTodoDto, @Param('id') id: string) {
    return this.todoService.update(id, todo);
  }
}
