import { Controller, Post, Get, UseGuards, Request, Body } from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('invoices')
export class InvoicesController {

  constructor(private invoicesService: InvoicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createInvoice(@Request() req, @Body() body) {
    return this.invoicesService.create(req.user.userId, body.amount);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyInvoices(@Request() req) {
    return this.invoicesService.findByUser(req.user.userId);
  }
}