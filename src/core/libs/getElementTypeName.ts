import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';

export const getElementTypeName = (elementType: EducationElementTypeEnum, plural?: boolean) => {
  switch (elementType) {
    case EducationElementTypeEnum.TEST:
      return plural ? 'Тесты' : 'Тест';
    case EducationElementTypeEnum.COURSE:
      return plural ? 'Курсы дистанционного обучения' : 'Курс дистанционного обучения';
    case EducationElementTypeEnum.PROGRAM:
      return plural ? 'Программы обучения' : 'Программа обучения';
  }
};
