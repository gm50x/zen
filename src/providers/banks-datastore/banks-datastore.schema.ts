import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'banks', timestamps: true, id: true })
export class Bank {
  @Prop()
  name: string;

  @Prop()
  fullName: string;

  @Prop({ index: true })
  compe: string;

  @Prop({ index: true })
  ispb: string;
}

export type BankDocument = HydratedDocument<Bank>;

export const BankSchema = SchemaFactory.createForClass(Bank);
