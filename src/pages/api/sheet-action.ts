import type { NextApiRequest, NextApiResponse } from 'next';
import connectSheet from '../../../utils/connectSheet';
import { getSheetInstance, getSheetStaticData } from '../../../utils/sheet-helpers';

export default async function sheetAction(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const doc = await connectSheet();
  const sheet = getSheetInstance({ doc, method: 'sheetsByTitle', key: 'chat' });

  console.log(req.method);
  if (req.method === 'GET') {
    const { offset, limit } = req.query;
    const data = await getSheetStaticData(sheet, Number(offset), Number(limit));

    res.status(200).json(data);
    res.end();
    return;
  }

  // const rows = await sheet.getRows();
  // // Return as static object values
  // const a = rows.map((row, index) => ({
  //   data: {
  //     ...row.toObject(),
  //   },
  //   index,
  //   rowNumber: row.rowNumber,
  // }));
  // sheet.delete()

  // const data = await getSheetStaticData(sheet);
  // headers: JSON.stringify(sheet.headerValues),
  // console.log(a);
  // const b = rows[0].delete();
  // console.log(b);

  res.status(200).json({ name: 'John Doe' });
}
