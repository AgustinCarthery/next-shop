import { AdminLayout } from '@/components/layouts';
import { PeopleOutline } from '@mui/icons-material';
import { Typography } from '@mui/material';
import React from 'react';

const UsersPage = () => {
  return (
    <AdminLayout
      title='Users'
      subTitle='Users maintenance'
      icon={<PeopleOutline />}
    ></AdminLayout>
  );
};

export default UsersPage;
