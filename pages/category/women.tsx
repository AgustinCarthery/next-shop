import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui/FullScreenLoading';
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';

export default function WomenPage() {
  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={'Next shop - Women'} pageDescription={'Women products'}>
      <Typography variant='h1' component='h1'>
        Women
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        All products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
