export interface SpreadsheetProperties {
  title: string;
  spreadsheetId: string;
}

export interface SheetParams {
  doc: any;
  key?: number | string;
  method?: 'sheetsByIndex' | 'sheetsById' | 'sheetsByTitle';
}

export interface SheetProperties {
  title: string;
  index: number;
  sheetId: number;
  hidden: boolean;
  rightToLeft: boolean;
  sheetType: 'GRID' | 'OBJECT' | 'DATA_SOURCE';
}

export interface SheetStaticData {
  data: any;
  index: number;
  rowNumber: number;
}
