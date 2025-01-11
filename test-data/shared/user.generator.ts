import { faker } from '@faker-js/faker/locale/en';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserData } from 'test-data/models/user.model';

export async function generateFakeUserData(
  request: APIRequestContext,
): Promise<UserData> {
  const userFirstName = faker.person.firstName().replace(/[^A-Za-z]/g, '');
  let userLastName = faker.person.lastName().replace(/[^A-Za-z]/g, '');
  // randomly generate names with a hyphen
  if (Math.random() < 0.5) {
    userLastName += '-' + faker.person.lastName().replace(/[^A-Za-z]/g, '');
  }
  const userEmail = faker.internet.email({
    firstName: userFirstName,
    lastName: userLastName,
  });
  const userPassword = faker.internet.password();
  const avatarImage = await getRandomAvatarImage(request);
  const userAvatar = `.\\data\\users\\${avatarImage}`;

  const userData: UserData = {
    email: userEmail,
    firstname: userFirstName,
    lastname: userLastName,
    password: userPassword,
    avatar: userAvatar,
  };

  return userData;
}

async function getRandomAvatarImage(
  request: APIRequestContext,
): Promise<string> {
  const getAllAvatars: APIResponse = await request.get(`/api/images/user`);
  const allAvatars = await getAllAvatars.json();
  const randomAvatar =
    allAvatars[Math.floor(Math.random() * allAvatars.length)];
  return randomAvatar;
}
