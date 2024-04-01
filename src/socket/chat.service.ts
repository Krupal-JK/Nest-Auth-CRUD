import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async saveMessage(sender: string, receiver: string, content: string): Promise<Message> {
    const message = this.messageRepository.create({ sender, receiver, content });
    return await this.messageRepository.save(message);
  }

  async getMessages(sender: string, receiver: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [{ sender, receiver }, { sender: receiver, receiver: sender }],
      order: { timestamp: 'ASC' },
    });
  }
}
