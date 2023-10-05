import { GetServerSideProps } from 'next';
import { AuthLayout } from '@/components/layouts';
import { AuthContext } from '@/context';
import { validations } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  name: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [erroMessage, setErroMessage] = useState('');

  const onRegisterForm = async ({ email, password, name }: FormData) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErroMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);

    await signIn('credentials', { email, password });
  };

  return (
    <AuthLayout title='Register'>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Create account
              </Typography>
              <Chip
                label='Check your data'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Full name'
                variant='filled'
                fullWidth
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'At least 2 characters long',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='email'
                label='Email'
                variant='filled'
                fullWidth
                {...register('email', {
                  required: 'Email is required',
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Password'
                type='password'
                variant='filled'
                fullWidth
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: '6 characters length' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                color='secondary'
                className='circular-btn'
                size='large'
                fullWidth
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p}`
                    : '/auth/login'
                }
                passHref
                legacyBehavior
              >
                <Link>Already have an account?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = '/' } = query;
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
