import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceStatusEnum } from 'src/modules/performance/domain/performance.entity';
import { PerformanceRepository } from 'src/modules/performance/infrastructure/database/performance.repository';
import { PerformanceException } from 'src/modules/performance/infrastructure/exceptions/performance.exception';
import { PdfHelper } from '@modules/control/infrastructure/pdf.helper';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';

@Injectable()
export class GeneratePerformanceCertificateService {
  constructor(
    @InjectRepository(PerformanceRepository)
    private performanceRepository: PerformanceRepository,
  ) {}

  async handle(id: string, response: Response, domain: string) {
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent('Сертификат.pdf')}`);

    const performance = await this.performanceRepository.findById(id);
    if (!performance) PerformanceException.NotFound();
    if (!performance.assignment.certificateIssuance)
      PerformanceException.NotAllowedToIssuanceCertificate(
        'Успеваемость',
        `Пользователь id=${performance.user.id}. Попытка получения сертификата при отключенной настройке`,
      );
    if (![PerformanceStatusEnum.COMPLETED, PerformanceStatusEnum.PASSED].includes(performance.status))
      PerformanceException.CompleteBeforeIssuanceCertificate(
        'Успеваемость',
        `Пользователь id=${performance.user.id}. Попытка получения сертификата до завершения обучения элемента id=${performance.educationElementId}`,
      );
    const educationElementTitle = performance.educationElement.title;
    const educationElementType =
      performance.elementType === EducationElementTypeEnum.COURSE
        ? 'курсу'
        : performance.elementType === EducationElementTypeEnum.TEST
        ? 'тесту'
        : 'программе';
    const userName = performance.user.fullName || performance.user.login;
    const data = {
      educationElementTitle,
      userName,
      educationElementType,
      domain,
    };

    let html = readFileSync(join(process.cwd(), 'pdf-templates', 'cert.html'), 'utf8');

    Object.entries(data).forEach(([key, value]) => {
      html = html.replaceAll(`{{ ${key} }}`, value);
    });

    await new PdfHelper({
      landscape: true,
    }).writeRawString(html, response);
  }
}
