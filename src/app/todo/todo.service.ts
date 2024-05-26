import { Injectable } from '@nestjs/common';
import { CreateTodoDto, updateTodoDto } from './dto/todo.dto';
import { Todo } from './schemas/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ResponseRequest from 'src/common/ResponseRequest';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async findAll(): Promise<ResponseRequest> {
    try {
      const todos = await this.todoModel.find().exec();
      return new ResponseRequest({
        status: 200,
        error: null,
        data: todos,
      });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async create(createTodoDto: CreateTodoDto): Promise<ResponseRequest> {
    const createdTodo = new this.todoModel(createTodoDto);

    try {
      const result = await createdTodo.save();
      return new ResponseRequest({ status: 200, error: null, data: result });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async findById(id: string): Promise<ResponseRequest> {
    try {
      const todo = await this.todoModel.findById(id).exec();
      return new ResponseRequest({ status: 200, error: null, data: todo });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async findByUserId(user_id: string): Promise<ResponseRequest> {
    try {
      const todos = await this.todoModel.find({ user_id }).exec();
      return new ResponseRequest({ status: 200, error: null, data: todos });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async delete(id: string): Promise<ResponseRequest> {
    try {
      const deletedTodo = await this.todoModel
        .findOneAndDelete({ _id: id })
        .exec();
      return new ResponseRequest({
        status: 200,
        error: null,
        data: deletedTodo,
      });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async update(
    id: string,
    updateTodo: updateTodoDto,
  ): Promise<ResponseRequest> {
    try {
      const updatedTodo = await this.todoModel
        .updateOne(
          { _id: id },
          {
            $set: {
              name: updateTodo.name,
              description: updateTodo.description,
            },
          },
        )
        .exec();

      return new ResponseRequest({
        status: 200,
        error: null,
        data: updatedTodo,
      });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }
}
