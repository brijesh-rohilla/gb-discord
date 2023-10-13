// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: 'John Doe' });
}

// export async function getServerSideProps() {
//   try {
//     const doc = await connectSheet();

//     const sheet = getSheetInstance({ doc });
//     const data = await getSheetStaticData(sheet);

//     return {
//       props: {
//         headers: JSON.stringify(sheet.headerValues),
//         rows: JSON.stringify(data, (_, k) => (k === undefined ? '' : k)),
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     // Return if server error
//     return { notFound: true };
//   }
// }
