import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { CreateLocationDto } from './dtos/location.create.dto';
import { LocationService } from './location.service';

@Controller('plan-detail-location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.createLocation(createLocationDto);
  }

  @Get(':locationName')
  async findLocationByName(@Param('locationName') locationName: string) {
    return this.locationService.findLocationByName(locationName);
  }
}
