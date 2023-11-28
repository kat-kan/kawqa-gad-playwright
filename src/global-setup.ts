import * as dotenv from 'dotenv';
import baseURL from '../playwright.config';

async function globalSetup(): Promise<void> {
  dotenv.config({ override: true });
  if (baseURL === undefined) throw new Error('⚠️  URL: is undefined');
  console.log('⚠️  URL:', process.env.BASE_URL);
}

export default globalSetup;
