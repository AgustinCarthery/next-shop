import { ShopLayout } from '@/components/layouts';
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
    </ShopLayout>
  );
}
