import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  DriveFileRenameOutline,
  SaveOutlined,
  UploadOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { AdminLayout } from '@/components/layouts';
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';
import { Controller, useForm } from 'react-hook-form';
import { shopApi } from '@/api';
import { Product } from '@/models';
import { useRouter } from 'next/router';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender = ['men', 'women', 'kid', 'unisex'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTagValue, setNewTagValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product,
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'title') {
        const newSlug =
          value.title
            ?.trim()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .toLowerCase() || '';

        setValue('slug', newSlug);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setValue]);

  const onChageSize = (size: string) => {
    const currentSizes = getValues('sizes');
    if (currentSizes.includes(size)) {
      return setValue(
        'sizes',
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    }

    setValue('sizes', [...currentSizes, size], { shouldValidate: true });
  };

  const onNewTag = () => {
    const newTag = newTagValue.trim().toLocaleLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');

    if (newTag.length === 0) return;

    if (currentTags.includes(newTag)) {
      return;
    }

    currentTags.push(newTag);
  };

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter((t) => t !== tag);
    setValue('tags', updatedTags, { shouldValidate: true });
  };

  const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    try {
      for (const file of target.files) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await shopApi.post<{ message: string }>(
          '/admin/upload',
          formData
        );
        setValue('images', [...getValues('images'), data.message], {
          shouldValidate: true,
        });
      }
    } catch (error) {}
  };

  const onDeleteImage = (image: string) => {
    setValue(
      'images',
      getValues('images').filter((img) => img !== image),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (form: FormData) => {
    if (form.images.length < 2) return;

    setIsSaving(true);

    try {
      const resp = await shopApi({
        url: '/admin/products',
        method: form._id ? 'PUT' : 'POST',
        data: form,
      });
      if (!form._id) {
        router.replace(`/admin/products/${form.slug}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title={'Product'}
      subTitle={`On Edit: ${product.title}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button
            color='secondary'
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type='submit'
            disabled={isSaving}
          >
            Save
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Title'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 2, message: '2 characters at least' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <Controller
              name='description'
              rules={{
                required: 'This field is required',
                minLength: {
                  value: 8,
                  message: 'You must type at least 8 characters!',
                },
              }}
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Description'
                  variant='filled'
                  fullWidth
                  multiline
                  rows={5}
                  sx={{ mb: 1 }}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <TextField
              label='Inventory'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Inventory is required',
                min: { value: 0, message: 'Min value 0' },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label='Price'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Min value 0' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Type</FormLabel>
              <RadioGroup
                row
                value={getValues('type')}
                onChange={(e) =>
                  setValue('type', e.target.value, { shouldValidate: true })
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                // {...register('gender')}
                value={getValues('gender')}
                onChange={(e) =>
                  setValue('gender', e.target.value, { shouldValidate: true })
                }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Sizes</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox checked={getValues('sizes').includes(size)} />
                  }
                  label={size}
                  onChange={() => onChageSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Slug - URL'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Field is required',
                validate: (val) =>
                  val.trim().includes(' ') ? 'No blank spaces' : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label='Labels'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              helperText='Press [spacebar] to add'
              onKeyUp={({ code }) =>
                code === 'Space' ? onNewTag() : undefined
              }
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component='ul'
            >
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color='primary'
                    size='small'
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection='column'>
              <FormLabel sx={{ mb: 1 }}>Images</FormLabel>
              <Button
                color='secondary'
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Load Image
              </Button>

              <input
                type='file'
                multiple
                accept='image/png, image/gif, image/jpeg'
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={onFileSelected}
              />

              <Chip
                label='2 images at least'
                color='error'
                variant='outlined'
                sx={{
                  display: getValues('images').length < 2 ? 'flex' : 'none',
                }}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component='img'
                        className='fadeIn'
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          onClick={() => onDeleteImage(img)}
                          fullWidth
                          color='error'
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  let product: IProduct | null;

  if (slug === 'new') {
    const tempProduct = JSON.parse(JSON.stringify(new Product()));
    delete tempProduct._id;
    tempProduct.images = ['sample1.jpg', 'sample2.jpg'];
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
