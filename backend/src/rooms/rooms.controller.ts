import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, JoinRoomDto } from './rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @Post('join')
  join(@Body() dto: JoinRoomDto) {
    return this.roomsService.joinRoom(dto);
  }

  @Get(':key')
  getRoom(@Param('key') key: string) {
    return this.roomsService.getRoomByKey(key);
  }

  @Get(':key/members')
  getMembers(@Param('key') key: string) {
    return this.roomsService.getMembers(key);
  }
}
