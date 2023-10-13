/* eslint-disable import/no-unresolved */
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GOOGLE_API_SCOPES } from './constants';
import creds from './red-cable-391719-5f59af674a1b.json';

// Initialize Google Auth
const serviceAccountAuth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: GOOGLE_API_SCOPES,
});

let docRef: any = null;

export default async function connectSheet() {
  try {
    if (docRef === null || !docRef) {
      const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID as string, serviceAccountAuth);
      await doc.loadInfo(); // loads document properties and worksheets
      docRef = doc;
      console.log('initilize instance');
    }

    return docRef;
  } catch (error) {
    return error;
  }
}
