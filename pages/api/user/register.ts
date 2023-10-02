import { db } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '@/utils';

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
    case 'POST':
      return registerUser(req, res);
    default:
      break;
  }

  res.status(200).json({ message: 'Example' });
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {
    email = '',
    password = '',
    name = '',
  } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must have at least 6 characters' });
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: 'Name must have more than 2 letters' });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: 'Email already in use',
    });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    name,
    password: bcrypt.hashSync(password),
    role: 'client',
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    return res.status(500).json({ message: 'Check server logs' });
  }

  const { _id, role } = newUser;

  const token = jwt.signToken(_id, name);

  return res.status(200).json({
    token,
    user: {
      name,
      role,
      email,
    },
  });
};
