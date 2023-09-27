import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui/FullScreenLoading';
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';

export default function MenPage() {
  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title={'Next shop - men'} pageDescription={'Men products'}>
      <Typography variant='h1' component='h1'>
        Men
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        All products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
