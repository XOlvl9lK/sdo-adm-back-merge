import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestSettingsRepository } from '@modules/education-program/infrastructure/database/test-settings.repository';
import { CreateTestSettingsDto } from '@modules/education-program/controllers/dtos/create-test-settings.dto';
import { TestSettingsEntity } from '@modules/education-program/domain/test-settings.entity';

@Injectable()
export class CreateTestSettingsService {
  constructor(
    @InjectRepository(TestSettingsRepository)
    private testSettingRepository: TestSettingsRepository,
  ) {}

  async create({
    timeLimit,
    numberOfAttempts,
    answerMixingType,
    isCorrectAnswersAvailable,
    passingScore,
    questionDeliveryFormat,
    questionMixingType,
    questionSelectionType,
    maxScore,
    correctAnswersAvailableDate,
    startDate,
    endDate,
    isObligatory
  }: CreateTestSettingsDto) {
    const testSettings = new TestSettingsEntity(
      timeLimit,
      numberOfAttempts,
      questionDeliveryFormat,
      questionSelectionType,
      questionMixingType,
      answerMixingType,
      isCorrectAnswersAvailable,
      maxScore,
      passingScore,
      isObligatory,
      correctAnswersAvailableDate ? new Date(correctAnswersAvailableDate) : undefined,
      startDate,
      endDate,
    );
    return await this.testSettingRepository.save(testSettings);
  }
}
