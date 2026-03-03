import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoicesService {

  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<Invoice>,
  ) {}

  async create(userId: string, amount: number) {
    const invoice = new this.invoiceModel({
      userId,
      invoiceNumber: `INV-${Date.now()}`,
      amount,
      status: "paid",
    });

    return invoice.save();
  }

  async findByUser(userId: string) {
    return this.invoiceModel.find({ userId });
  }
}