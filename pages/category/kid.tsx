import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui/FullScreenLoading';
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';

export default function KidPage() {
  const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout title={'Next shop - Kids'} pageDescription={'Kids products'}>
      <Typography variant='h1' component='h1'>
        Kids
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        All products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
