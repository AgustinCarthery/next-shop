import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui/FullScreenLoading';
import { useProducts } from '@/hooks';
import { Typography } from '@mui/material';

export default function Home() {
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout
      title={'Next shop - home'}
      pageDescription={'find products here'}
    >
      <Typography variant='h1' component='h1'>
        Shop
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        All Products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
