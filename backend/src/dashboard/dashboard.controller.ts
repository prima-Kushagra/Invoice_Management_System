import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';


@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Request() req) {
    return this.dashboardService.getStats(req.user.userId);
  }
}