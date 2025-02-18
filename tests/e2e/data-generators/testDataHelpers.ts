import { faker } from '@faker-js/faker';

export function generateRandomValidUser() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}
