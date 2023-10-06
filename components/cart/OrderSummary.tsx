import { CartContext } from '@/context';
import { IOrder } from '@/interfaces';
import { currency } from '@/utils';
import { Grid, Typography } from '@mui/material';
import React, { FC, useContext } from 'react';

interface Props {
  orderValues?: {
    numberOfItems: number;
    tax: number;
    subTotal: number;
    total: number;
  };
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
  const { numberOfItems, tax, subTotal, total } = useContext(CartContext);

  const summaryValues = orderValues
    ? orderValues
    : { numberOfItems, tax, subTotal, total };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Products</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>
          {summaryValues.numberOfItems}{' '}
          {summaryValues.numberOfItems > 1 ? 'Products' : 'Product'}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>
          {currency.format(summaryValues.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
