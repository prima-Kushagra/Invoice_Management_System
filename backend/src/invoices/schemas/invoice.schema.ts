import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Invoice extends Document {

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  status: string; // paid | pending

  @Prop()
  pdfUrl: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);