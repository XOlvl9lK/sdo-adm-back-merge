import {
  educationElementRepositoryMockProvider,
  groupRepositoryMockProvider,
  TestHelper,
} from '@core/test/test.helper';
import { CreateMessageService } from '@modules/messenger/application/create-message.service';
import {
  getContentTemplate,
  MailDeliveryEventHandler,
} from '@modules/messenger/application/mail-delivery.event-handler';
import { Random } from '@core/test/random';
import { sdoId } from '@modules/user/infrastructure/database/user.repository';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelper(educationElementRepositoryMockProvider, groupRepositoryMockProvider, {
  type: 'createService',
  provide: CreateMessageService,
  extend: [{ method: 'sendMessage', mockImplementation: jest.fn() }],
});

describe('MailDeliveryEventHandler', () => {
  let mailDeliveryEventHandler: MailDeliveryEventHandler;

  beforeAll(async () => {
    [mailDeliveryEventHandler] = await helpers.beforeAll([MailDeliveryEventHandler]);
  });

  test('Should return correct content template', () => {
    const result = getContentTemplate('Тест', 'Тестовый тест');

    expect(result).toBe(`
  <p>Добрый день.</p>
  <br />
  <p>Вы зачислены на изучение следующих элементов обучения</p>
  <br />
  <ul>
    <li>Тест "Тестовый тест"</li>
  </ul>
  <p>Успешного обучения!</p>
`);
  });

  test('Should call sendMessage', async () => {
    await mailDeliveryEventHandler['sendMessage']({
      educationElementId: Random.id,
      userId: Random.id,
    });

    const mockCreateMessageService = helpers.getProviderValueByToken('CreateMessageService');

    expect(mockCreateMessageService.sendMessage).toHaveBeenCalledTimes(1);
    expect(mockCreateMessageService.sendMessage).toHaveBeenCalledWith({
      theme: 'Вы зачислены на обучение',
      content: getContentTemplate('Тест', Random.lorem),
      receiverId: Random.id,
      senderId: sdoId,
    });
  });

  test('Should call sendMessage', async () => {
    // const sendMessageSpy = jest.spyOn(mailDeliveryEventHandler, 'sendMessage')
    // await mailDeliveryEventHandler.handleEnrolled({
    //   userId: Random.id,
    //   educationElementId: Random.id,
    //   assignmentId: Random.id,
    //   educationElementType: EducationElementTypeEnum.TEST,
    //   educationRequestId: Random.id
    // })
    //
    // expect(sendMessageSpy).toHaveBeenCalledTimes(1)
    // expect(sendMessageSpy).toHaveBeenCalledWith({
    //   userId: Random.id,
    //   educationElementId: Random.id,
    //   assignmentId: Random.id,
    //   educationElementType: EducationElementTypeEnum.TEST,
    //   educationRequestId: Random.id
    // })
  });

  test('Should call sendMessage', async () => {
    // const sendMessageSpy = jest.spyOn(mailDeliveryEventHandler, 'sendMessage')
    // await mailDeliveryEventHandler.handleEducationRequestAccept({
    //   userId: Random.id,
    //   educationElementId: Random.id,
    //   assignmentId: Random.id,
    //   educationElementType: EducationElementTypeEnum.TEST,
    //   educationRequestId: Random.id
    // })
    //
    // expect(sendMessageSpy).toHaveBeenCalledTimes(1)
    // expect(sendMessageSpy).toHaveBeenCalledWith({
    //   userId: Random.id,
    //   educationElementId: Random.id,
    //   assignmentId: Random.id,
    //   educationElementType: EducationElementTypeEnum.TEST,
    //   educationRequestId: Random.id
    // })
  });

  test('Should call sendMessage', async () => {
    // const sendMessageSpy = jest.spyOn(mailDeliveryEventHandler, 'sendMessage')
    // await mailDeliveryEventHandler.handleCreatePerformanceOnObligatoryUpdated({
    //   userId: Random.id,
    //   educationElementId: Random.id,
    //   assignmentId: Random.id,
    //   educationElementType: EducationElementTypeEnum.TEST,
    // })
    //
    // expect(sendMessageSpy).toHaveBeenCalledTimes(1)
    // expect(sendMessageSpy).toHaveBeenCalledWith({
    //   userId: Random.id,
    //   educationElementId: Random.id,
    // })
  });

  test('Shoudl call sendMessage', async () => {
    // const sendMessageSpy = jest.spyOn(mailDeliveryEventHandler, 'sendMessage')
    // await mailDeliveryEventHandler.handleGroupEnrolled({
    //   groupId: Random.id,
    //   educationElementId: Random.id,
    //   assignmentId: Random.id,
    //   educationElementType: EducationElementTypeEnum.TEST,
    // })
    //
    // expect(sendMessageSpy).toHaveBeenCalled()
  });

  afterEach(() => {
    clearAllMocks();
  });
});
