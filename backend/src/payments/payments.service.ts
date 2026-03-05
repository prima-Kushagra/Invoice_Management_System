import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {

  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  async createOrder(data: any) {

    console.log("createOrder payload:", data);
    if (data.total === undefined || data.total === null) {
      throw new Error("Invoice total missing");
    }
    if (data.total <= 0) {
      throw new Error("Invoice total must be greater than 0 to create a payment order");
    }

    const options = {
      amount: data.total * 100,
      currency: "INR",
      receipt: `invoice_${data.invoiceId}`,
    };

    const order = await this.razorpay.orders.create(options);

    return order;
  }
}