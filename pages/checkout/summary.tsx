import { CardList, OrderSummary } from '@/components/cart';
import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import { CartContext } from '@/context';
import { countries } from '@/utils';

const SummaryPage = () => {
  const { shippingAddress, numberOfItems } = useContext(CartContext);

  if (!shippingAddress) return <></>;

  const { firstName, lastName, adddres, adddres2, city, country, phone, zip } =
    shippingAddress;

  return (
    <ShopLayout title='Order Summary' pageDescription={'Order Summary'}>
      <Typography variant='h1' component='h1'>
        Order Summary
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CardList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Summary ({numberOfItems}{' '}
                {numberOfItems === 1 ? 'producto' : 'productos'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Shipping Address</Typography>

                <NextLink href='/checkout/address' passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>
              <Typography>{`${firstName} ${lastName}`}</Typography>
              <Typography>
                {adddres}
                {adddres2 ? `, ${adddres2}` : ''}
              </Typography>
              <Typography>
                {city}, {zip}{' '}
              </Typography>
              <Typography>
                {countries.find((c) => c.code === country)?.name}
              </Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirm Order
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
