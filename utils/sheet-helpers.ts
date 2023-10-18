import type { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import {
  SheetParams,
  SheetProperties,
  SheetStaticData,
  SpreadsheetProperties,
} from './types';

export const getSpreadsheetProperties = (doc: GoogleSpreadsheet): SpreadsheetProperties => ({
  title: doc.title,
  spreadsheetId: doc.spreadsheetId,
});

export const getSheetInstance = ({
  doc,
  key = 0,
  method = 'sheetsByIndex',
}: SheetParams): GoogleSpreadsheetWorksheet => doc[method][key];

export const getSheetProperties = (sheet: GoogleSpreadsheetWorksheet): SheetProperties => ({
  sheetId: sheet.sheetId,
  title: sheet.title,
  index: sheet.index,
  sheetType: sheet.sheetType,
  hidden: sheet.hidden,
  rightToLeft: sheet.rightToLeft,
});

export const getSheetStaticData = async (
  sheet: GoogleSpreadsheetWorksheet,
  offset: number = 0,
  limit: number = 10,
): Promise<SheetStaticData[]> => {
  const data = await sheet.getRows({
    limit,
    offset,
  });

  // Return as static object values
  return data.map((row, index) => ({
    data: {
      ...row.toObject(),
    },
    index,
    rowNumber: row.rowNumber,
  }));
};

export const updateSheetRow = async (
  sheet: GoogleSpreadsheetWorksheet,
  index: number,
  data: object,
): Promise<SheetStaticData[]> => {
  const rows = await sheet.getRows();

  rows[index].assign({ ...data });
  await rows[index].save();

  return getSheetStaticData(sheet);
};
