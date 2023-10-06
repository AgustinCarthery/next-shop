import { ShopLayout } from '@/components/layouts';
import { countries } from '@/utils';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from '@/context';

type FormData = {
  firstName: string;
  lastName: string;
  adddres: string;
  adddres2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    adddres: Cookies.get('adddres') || '',
    adddres2: Cookies.get('adddres2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { ...getAddressFromCookies() },
  });

  const onSubmitAddress = async (data: FormData) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout title={'Checkout'} pageDescription={'Confirm billing address'}>
      <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
        <Typography variant='h1' component='h1'>
          Address
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Name'
              variant='filled'
              fullWidth
              {...register('firstName', {
                required: 'First Name is required',
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Last Name'
              variant='filled'
              fullWidth
              {...register('lastName', {
                required: 'Last Name is required',
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Address line 1'
              variant='filled'
              fullWidth
              {...register('adddres', {
                required: 'Address is required',
              })}
              error={!!errors.adddres}
              helperText={errors.adddres?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Address line 2'
              variant='filled'
              fullWidth
              {...register('adddres2')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Zip Code'
              variant='filled'
              fullWidth
              {...register('zip', {
                required: 'Zip code is required',
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='City'
              variant='filled'
              fullWidth
              {...register('city', {
                required: 'City is required',
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FormControl fullWidth> */}
            <TextField
              // select
              variant='filled'
              label='País'
              fullWidth
              // defaultValue={ Cookies.get('country') || countries[0].code }
              {...register('country', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.country}
              helperText={errors.country?.message}
            />
            {/* {
                                countries.map( country => (
                                    <MenuItem 
                                        key={ country.code }
                                        value={ country.code }
                                    >{ country.name }</MenuItem>
                                ))
                            }
                        </TextField> */}
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Phone'
              variant='filled'
              fullWidth
              {...register('phone', {
                required: 'Phone is required',
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          <Button
            color='secondary'
            className='circular-btn'
            size='large'
            type='submit'
          >
            Place order
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = '' } = req.cookies;
//   let isValidToken = false;

//   try {
//     await jwt.isValidToken(token);
//     isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default AddressPage;
