import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { initialData } from '@/database/products';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <ShopLayout
      title={'Next shop - home'}
      pageDescription={'find products here'}
    >
      <Typography variant="h1" component="h1">
        Shop
      </Typography>
      <Typography variant="h2" sx={{ marginBottom: 1 }}>
        All Products
      </Typography>

      <ProductList products={initialData.products as any} />
    </ShopLayout>
  );
}
