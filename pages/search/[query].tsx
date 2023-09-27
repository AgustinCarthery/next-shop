import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';
import { Box, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { FC } from 'react';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: FC<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={'Next shop - Search'}
      pageDescription={'find products here'}
    >
      <Typography variant='h1' component='h1'>
        Search products
      </Typography>

      {foundProducts ? (
        <Typography
          variant='h2'
          sx={{ marginBottom: 1 }}
          textTransform='capitalize'
        >
          {query}
        </Typography>
      ) : (
        <Box display='flex'>
          <Typography variant='h2' sx={{ mb: 1 }}>
            No products found
          </Typography>
          <Typography
            variant='h2'
            sx={{ ml: 1 }}
            color='secondary'
            textTransform='capitalize'
          >
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
