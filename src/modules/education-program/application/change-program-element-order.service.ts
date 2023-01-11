import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeOrderDto } from 'src/modules/education-program/controllers/dtos/change-order.dto';
import { ProgramElementRepository } from 'src/modules/education-program/infrastructure/database/program-element.repository';
import { ChangeOrderHelper } from '@core/libs/change-order.helper';

@Injectable()
export class ChangeProgramElementOrder {
  constructor(
    @InjectRepository(ProgramElementRepository)
    private programElementRepository: ProgramElementRepository,
  ) {}

  public async changeProgramElementOrder({ id, type, view }: ChangeOrderDto): Promise<{ success: boolean }> {
    const element = await this.programElementRepository.findOne({
      where: { id },
      relations: ['educationProgram', 'educationProgram.programElements'],
    });
    if (!element || !element?.educationProgram) return { success: false };
    ChangeOrderHelper.changeOrder(element.educationProgram.programElements, id, type, view);
    await this.programElementRepository.save(element.educationProgram.programElements);
    return { success: true };
  }
}
