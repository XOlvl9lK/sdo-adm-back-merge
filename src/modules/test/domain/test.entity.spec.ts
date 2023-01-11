import { mockEducationElement } from '@modules/education-program/domain/education-element.entity.spec';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { TestEntity, ThemeInTestEntity } from '@modules/test/domain/test.entity';
import { mockChapterInstance } from '@modules/chapter/domain/chapter.entity.spec';
import { mockTestThemeInstance } from '@modules/test/domain/test-theme.entity.spec';

const mockThemeInTest = {
  order: 1,
  test: plainToInstance(TestEntity, {
    ...mockEducationElement,
    elementType: EducationElementTypeEnum.TEST,
    threshold: Random.number,
    totalThemes: Random.number,
  }),
  theme: mockTestThemeInstance,
};

export const mockThemeInTestInstance = plainToInstance(ThemeInTestEntity, mockThemeInTest, {
  enableCircularCheck: true,
});

const mockTest = {
  ...mockEducationElement,
  elementType: EducationElementTypeEnum.TEST,
  threshold: Random.number,
  totalThemes: Random.number,
  themes: [mockThemeInTestInstance, mockThemeInTestInstance],
};

export const mockTestInstance = plainToInstance(TestEntity, mockTest, {
  enableCircularCheck: true,
});

describe('TestEntity', () => {
  test('Should update test', () => {
    mockTestInstance.update('Title', 15, false, false, mockChapterInstance, 'Description');

    expect(mockTestInstance.title).toBe('Title');
    expect(mockTestInstance.duration).toBe(15);
    expect(mockTestInstance.isSelfAssignmentAvailable).toBe(false);
    expect(mockTestInstance.available).toBe(false);
    expect(mockTestInstance.description).toBe('Description');

    mockTestInstance.title = Random.lorem;
    mockTestInstance.duration = Random.number;
    mockTestInstance.isSelfAssignmentAvailable = true;
    mockTestInstance.available = true;
    mockTestInstance.description = Random.lorem;
  });
});
