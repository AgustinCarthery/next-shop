import { db } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
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
    case 'POST': {
      return loginUser(req, res);
    }

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '' } = req.body;

  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if (!user) {
    return res
      .status(400)
      .json({ message: 'Email or password invalid - EMAIL' });
  }

  if (!bcrypt.compare(password, user.password!)) {
    return res
      .status(400)
      .json({ message: 'Email or password invalid - PASSWORD' });
  }

  const { role, name, _id } = user;
  const token = jwt.signToken(_id, name);

  return res.status(200).json({
    token,
    user: { email, role, name },
  });
};
