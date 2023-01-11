import { faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt';

export class Random {
  static datePast = faker.date.past();
  static dateFuture = faker.date.future();
  static id = faker.datatype.uuid();
  static ids = Array.from({ length: 5 }).map(() => faker.datatype.uuid());
  static boolean = faker.datatype.boolean();
  static string = faker.datatype.string();
  static firstName = faker.name.firstName();
  static lastName = faker.name.lastName();
  static middleName = faker.name.middleName();
  static password = hashSync(faker.internet.password(), 5);
  static email = faker.internet.email();
  static ip = faker.internet.ipv4();
  static lorem = faker.lorem.word();
  static number = faker.datatype.number();
  static fileName = faker.system.commonFileName('');
  static extension = faker.system.fileExt();
  static mimetype = faker.system.mimeType();
  static hash = hashSync(faker.lorem.word(), 5);
}
