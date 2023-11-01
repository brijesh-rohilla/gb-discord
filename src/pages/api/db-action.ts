import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../utils/connectDB';

export default async function sheetAction(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const db = await connectDB();

  console.log(req.method);
  if (req.method === 'GET') {
    const { offset, limit } = req.query;

    db.find({}).sort({ createdAt: -1 }).skip(Number(offset)).limit(Number(limit))
      .exec((error: any, data: any) => {
        console.log(data);
        if (error) {
          res.status(500).json({ error });
        } else {
          res.status(200).json(data);
        }

        res.end();
        return null;
      });
  }
}
