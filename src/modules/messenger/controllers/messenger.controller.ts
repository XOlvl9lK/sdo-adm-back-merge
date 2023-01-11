import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateMessageService } from '@modules/messenger/application/create-message.service';
import { DeleteMessageService } from '@modules/messenger/application/delete-message.service';
import { FindMessageService } from '@modules/messenger/application/find-message.service';
import { UpdateMessageService } from '@modules/messenger/application/update-message.service';
import { CreateMessageRequestDto } from '@modules/messenger/controllers/dtos/create-message.request-dto';
import { MoveToBasketRequestDto } from '@modules/messenger/controllers/dtos/move-to-basket.request-dto';
import { Page } from '@core/libs/page.decorator';
import { UserId } from '@core/libs/user-id.decorator';
import { RequestQuery } from '@core/libs/types';
import { PermissionEnum } from '@modules/user/domain/permission.entity';
import { UpdateDraftMessageDto } from '@modules/messenger/controllers/dtos/update-draft-message.dto';
import { UseAuthPermissions } from '@core/libs/use-auth-permissions.decorator';

@Controller('messenger')
export class MessengerController {
  constructor(
    private createMessageService: CreateMessageService,
    private deleteMessageService: DeleteMessageService,
    private findMessageService: FindMessageService,
    private updateMessageService: UpdateMessageService,
  ) {}

  @Page('Сообщения')
  @UseAuthPermissions(PermissionEnum.MESSAGE)
  @Get('count')
  async countByUser(@UserId() userId: string) {
    return await this.findMessageService.countAllMessagesByUser(userId);
  }

  @Page('Сообщения')
  @UseAuthPermissions(PermissionEnum.MESSAGE)
  @Get('incoming')
  async getIncomingByUser(@Query() requestQuery: RequestQuery, @UserId() userId: string) {
    const [data, total] = await this.findMessageService.findIncomingByUser(requestQuery, userId);
    return { data, total };
  }

  @Page('Сообщения')
  @UseAuthPermissions(PermissionEnum.MESSAGE)
  @Get('outgoing')
  async getOutgoingByUser(@Query() requestQuery: RequestQuery, @UserId() userId: string) {
    const [data, total] = await this.findMessageService.findOutgoingByUser(requestQuery, userId);
    return { data, total };
  }

  @Page('Сообщения')
  @UseAuthPermissions(PermissionEnum.MESSAGE)
  @Get('draft')
  async getDraftByUser(@Query() requestQuery: RequestQuery, @UserId() userId: string) {
    const [data, total] = await this.findMessageService.findDraftByUser(requestQuery, userId);
    return { data, total };
  }

  @Page('Сообщения')
  @UseAuthPermissions(PermissionEnum.MESSAGE)
  @Get('basket')
  async getBasketByUser(@Query() requestQuery: RequestQuery, @UserId() userId: string) {
    const [data, total] = await this.findMessageService.findBasketByUser(requestQuery, userId);
    return { data, total };
  }

  @Page('Сообщения')
  @UseAuthPermissions(PermissionEnum.MESSAGE)
  @Get('new')
  async getNewMessage(@UserId() userId: string) {
    return this.findMessageService.findNewMessage(userId);
  }

  @Page('Сообщения')
  @UseAuthPermissions(PermissionEnum.MESSAGE)
  @Get(':id')
  async getById(@Param('id') id: string, @UserId() userId: string) {
    return await this.findMessageService.findById(id, userId);
  }

  @UseAuthPermissions(PermissionEnum.MESSAGE_CREATE)
  @Post('send')
  async sendMessage(@Body() messageDto: CreateMessageRequestDto) {
    return this.createMessageService.sendMessage(messageDto);
  }

  @UseAuthPermissions(PermissionEnum.MESSAGE_CREATE)
  @Post('draft')
  async createDraftMessage(@Body() messageDto: CreateMessageRequestDto) {
    return this.createMessageService.createDraftMessage(messageDto);
  }

  @UseAuthPermissions(PermissionEnum.MESSAGE_CREATE)
  @Put('move-to-basket')
  async moveToBasket(@Body() messagesDto: MoveToBasketRequestDto) {
    return this.updateMessageService.moveToBasket(messagesDto);
  }

  @UseAuthPermissions(PermissionEnum.MESSAGE_CREATE)
  @Put('draft')
  async updateDraftMessage(@Body() messageDto: UpdateDraftMessageDto) {
    return this.updateMessageService.updateDraftMessage(messageDto);
  }

  @UseAuthPermissions(PermissionEnum.MESSAGE_CREATE)
  @Delete()
  async delete(@Body() messagesDto: string[]) {
    return this.deleteMessageService.delete(messagesDto);
  }
}
