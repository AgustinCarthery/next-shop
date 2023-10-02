import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { jwt } from '@/utils';

type Data =
  | { message: string }
  | {
      user: {
        email: string;
        name: string;
        role: string;
      };
      token: string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET': {
      return checkJWT(req, res);
    }

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;

  let userId = '';

  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid auth token' });
  }

  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();

  if (!user) {
    return res.status(400).json({ message: 'User does not exists' });
  }

  const { _id, email, role, name } = user;

  return res.status(200).json({
    token: jwt.signToken(_id, email),
    user: { email, role, name },
  });
};
