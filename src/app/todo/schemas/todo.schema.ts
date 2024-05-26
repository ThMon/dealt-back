import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  user_id: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
