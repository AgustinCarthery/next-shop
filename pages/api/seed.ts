import { db, seedDatabase } from '@/database';
import { Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({
      message: 'Seed will not run in production mode',
    });
  }

  await db.connect();
  await User.deleteMany();
  await User.insertMany(seedDatabase.initialData.users);

  await Product.deleteMany();
  await Product.insertMany(seedDatabase.initialData.products);

  await db.disconnect();
  res.status(200).json({ message: 'Seed  successfully executed' });
}
