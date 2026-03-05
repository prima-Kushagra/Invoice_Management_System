import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {

  constructor(private paymentService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() body) {
    return this.paymentService.createOrder(body);
  }
}