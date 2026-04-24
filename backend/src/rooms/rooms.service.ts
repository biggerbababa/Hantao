import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, JoinRoomDto } from './rooms.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateKey(): string {
    return nanoid(6).toUpperCase();
  }

  async createRoom(dto: CreateRoomDto) {
    const key = this.generateKey();
    const room = await this.prisma.room.create({
      data: { name: dto.name, key },
    });
    const user = await this.prisma.user.create({
      data: { nickname: dto.nickname, roomId: room.id },
    });
    return { room, user };
  }

  async joinRoom(dto: JoinRoomDto) {
    const room = await this.prisma.room.findUnique({ where: { key: dto.key } });
    if (!room) throw new NotFoundException('ไม่พบห้องนี้ กรุณาตรวจสอบรหัสห้อง');
    const existing = await this.prisma.user.findFirst({
      where: { roomId: room.id, nickname: dto.nickname },
    });
    if (existing) throw new BadRequestException('ชื่อเล่นนี้ถูกใช้ในห้องแล้ว');
    const user = await this.prisma.user.create({
      data: { nickname: dto.nickname, roomId: room.id },
    });
    return { room, user };
  }

  async getRoomByKey(key: string) {
    const room = await this.prisma.room.findUnique({
      where: { key },
      include: { users: true },
    });
    if (!room) throw new NotFoundException('ไม่พบห้องนี้');
    return room;
  }

  async getMembers(key: string) {
    const room = await this.prisma.room.findUnique({
      where: { key },
      include: { users: true },
    });
    if (!room) throw new NotFoundException('ไม่พบห้องนี้');
    return room.users;
  }
}
