import { CardList, OrderSummary } from '@/components/cart';
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { ShopLayout } from '@/components/layouts';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React from 'react';
import { CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from '@/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { IOrder } from '@/interfaces';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  return (
    <ShopLayout title='Order Summary 123123' pageDescription={'Order Summary'}>
      <Typography variant='h1' component='h1'>
        Order: 123
      </Typography>

      {/* <Chip
        sx={{ my: 2 }}
        label="Pending payment"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}
      <Chip
        sx={{ my: 2 }}
        label='Paid'
        variant='outlined'
        color='success'
        icon={<CreditScoreOutlined />}
      />
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CardList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Summary (3 products)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Shipping Address</Typography>

                <NextLink href='/checkout/address' passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>
              <Typography>Pepino test</Typography>
              <Typography>Banana 123</Typography>
              <Typography>Rosario, Santa Fe</Typography>
              <Typography>Argentina</Typography>
              <Typography>+54 9341 3145323</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <h1>Pay</h1>
                <Chip
                  sx={{ my: 2 }}
                  label='Paid'
                  variant='outlined'
                  color='success'
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const { id = '' } = query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  if (order.user !== session.user?.id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }
  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
