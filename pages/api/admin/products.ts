import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'PUT':
      return updateProduct(req, res);
    case 'POST':
      return createProduct(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().sort({ title: 'asc' }).lean();

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

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'Invalid Id' });
  }

  if (images.length < 2) {
    return res.status(400).json({ message: '2 messages are required' });
  }
  try {
    await db.connect();
    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'Product does not exists' });
    }

    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileId, extension] = image
          .substring(image.lastIndexOf('/') + 1)
          .split('.');
      }
    });

    await product.updateOne(req.body), { new: true };

    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({ message: 'Check server logs' });
  }
};

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: '2 messages are required' });
  }
  try {
    await db.connect();

    const productInDB = await Product.findOne({ slug: req.body.slug });
    if (productInDB) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: 'Product with same slug already exists' });
    }
    const product = new Product(req.body);
    await product.save();

    await db.disconnect();

    res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: 'Check server logs' });
  }
};
