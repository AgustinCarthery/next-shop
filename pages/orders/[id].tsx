import { CardList, OrderSummary } from '@/components/cart';
import { GetServerSideProps, NextPage } from 'next';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { ShopLayout } from '@/components/layouts';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { dbOrders } from '@/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { IOrder } from '@/interfaces';
import { shopApi } from '@/api';
import { useRouter } from 'next/router';

export type OrderResponseBody = {
  id: string;
  status:
    | 'CREATED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'COMPLETED'
    | 'PAYER_ACTION_REQUIRED';
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const {
    shippingAddress: {
      firstName,
      lastName,
      adddres,
      adddres2,
      city,
      country,
      phone,
      zip,
    },
  } = order;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No Paypal payment ');
    }

    setIsPaying(true);
    try {
      const { data } = await shopApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
    }
  };

  return (
    <ShopLayout title='Order Summary 123123' pageDescription={'Order Summary'}>
      <Typography variant='h1' component='h1'>
        Order: {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label='Paid'
          variant='outlined'
          color='success'
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label='Pending payment'
          variant='outlined'
          color='error'
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CardList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Summary ({order.numberOfItems}{' '}
                {order.numberOfItems > 1 ? 'Products' : 'Product'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Shipping Address</Typography>
              </Box>
              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {adddres} {adddres2 ? `, ${adddres2}` : ''}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  tax: order.tax,
                  subTotal: order.subTotal,
                  total: order.total,
                }}
              />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  justifyContent='center'
                  className='fadeIn'
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                  flexDirection='column'
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label='Paid'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
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
