import { db, SHOP_CONSTANTS } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string } | IProduct[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    default:
      res.status(400).json({ message: 'Bad request' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = 'all' } = req.query;

  let condition = {};

  if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }

  await db.connect();
  const products = await Product.find(condition)
    .select('title images price slug inStock -_id')
    .lean();
  await db.disconnect();

  const updatedProducts: IProduct[] = products.map((product) => {
    product.images = product.images.map((img) => {
      return img.includes('http')
        ? img
        : `${process.env.HOST_NAME}products/${img}`;
    });
    return product;
  });

  res.status(200).json(updatedProducts);
};
