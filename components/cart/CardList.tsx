import {
  Grid,
  Link,
  Typography,
  CardActionArea,
  CardMedia,
  Box,
  Button,
} from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '@/context';
import { ICartProduct } from '@/interfaces/cart';
import { IOrderItem } from '@/interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CardList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } =
    useContext(CartContext);

  const onNewCartQuantityValue = (
    product: ICartProduct,
    newQuantityValue: number
  ) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  const onRemoveCartItem = (product: ICartProduct) => {
    removeCartProduct(product);
  };

  const productsToShow = products ? products : cart;
  return (
    <>
      {productsToShow.map((product) => (
        <Grid
          spacing={2}
          key={product.slug + product.size}
          container
          sx={{ mb: 1 }}
        >
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component='img'
                    sx={{ borderRadius: '5px' }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='body1'>{product.title}</Typography>
              <Typography variant='body1'>
                Size: <strong>{product.size}</strong>
              </Typography>

              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={10}
                  updatedQuantity={(value) => {
                    onNewCartQuantityValue(product as ICartProduct, value);
                  }}
                />
              ) : (
                <Typography variant='h5'>{`${product.quantity} ${
                  product.quantity > 1 ? 'Products' : 'Product'
                }`}</Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display='flex'
            alignItems='center'
            flexDirection='column'
          >
            <Typography variant='subtitle1'>{`$${product.price}`}</Typography>

            {editable && (
              <Button
                variant='text'
                color='secondary'
                onClick={() => onRemoveCartItem(product as ICartProduct)}
              >
                Remove
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
