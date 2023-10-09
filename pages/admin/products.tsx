import { AdminLayout } from '@/components/layouts';
import NextLink from 'next/link';
import { IProduct } from '@/interfaces';
import { currency } from '@/utils';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Chip, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import useSWR from 'swr';

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Photo',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia
            sx={{ p: 1 }}
            component='img'
            alt={row.title}
            className='fadeIn'
            image={`/products/${row.img}`}
          />
        </a>
      );
    },
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior>
          <Link underline='always'>{row.title}</Link>
        </NextLink>
      );
    },
  },
  { field: 'gender', headerName: 'Gender' },
  { field: 'type', headerName: 'Type' },
  { field: 'inStock', headerName: 'Invetory' },
  { field: 'price', headerName: 'Price' },
  { field: 'sizes', headerName: 'Sizes', width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) return <></>;

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: currency.format(product.price),
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }));

  return (
    <AdminLayout
      title={`Products (${data?.length})`}
      subTitle='Products maintenance'
      icon={<CategoryOutlined />}
    >
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color='secondary'
          href='/admin/products/new'
        >
          Create Product
        </Button>
      </Box>
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows!}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
