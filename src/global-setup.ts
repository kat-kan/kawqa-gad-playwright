import baseURL, { STORAGE_STATE } from '../playwright.config';
import { logConsole } from '@_src_api/utils/log-levels';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
  dotenv.config({ override: true });
  if (baseURL === undefined) throw new Error('⚠️  URL: is undefined');
  logConsole('⚠️  URL:', process.env.BASE_URL);
  process.env.SHARED_DATE = new Date().toISOString(); //one date to rule them all
}

export default globalSetup;
