import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { TestAttemptRepository } from '@modules/performance/infrastructure/database/attempt.repository';

@Injectable()
export class TestAttemptSessionService {
  constructor(
    @InjectRepository(TestAttemptRepository)
    private testAttemptRepository: TestAttemptRepository,
  ) {}

  async establishSession(attemptId: string, response: Response) {
    response.writeHead(200, {
      Connection: 'keep-alive',
      'Content-type': 'text/event-stream',
      'Cache-control': 'no-cache',
    });
    const attempt = await this.testAttemptRepository.findById(attemptId);
    const testSettings = attempt.performance.testSettings;
    let timeLeft: null | number = null;
    if (testSettings.timeLimit > 0) {
      const interval = setInterval(() => {
        const timeSpent = new Date().getTime() - new Date(attempt.createdAt).getTime();
        timeLeft = testSettings.timeLimit * 60 * 1000 - timeSpent;
        if (timeLeft > 0) {
          response.write(`data: ${timeLeft} \n\n`);
        } else {
          clearInterval(interval);
          response.write(`data: ${0} \n\n`);
        }
      }, 1000);
    } else {
      response.write(`data: null \n\n`);
    }
  }
}
