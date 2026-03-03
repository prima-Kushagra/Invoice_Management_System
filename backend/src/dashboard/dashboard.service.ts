import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getStats(userId: string) {
    return {
      totalRevenue: 12450,
      pendingInvoices: 18,
      customers: 42,
    };
  }
}