import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CommunicationsService } from '../services/communications.service';
import { CreateNewContactDto } from '../dto/create.contacts.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/contact')
export class CommunicationsController {
  constructor(private readonly contactsService: CommunicationsService) {}

  @Post('post/contact')
  postContact(@Req() req: Request, @Body() body: CreateNewContactDto) {
    return this.contactsService.postContact(body, req.user.userId);
  }
}
