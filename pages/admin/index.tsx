import { SummaryTile } from '@/components/admin';
import { AdminLayout } from '@/components/layouts';
import { DashboardSummaryResponse } from '@/interfaces';
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const DashboardPage = () => {
  const [requestTimeRemaining, setRequestTimeRemaining] = useState(30);

  const { data, error } = useSWR<DashboardSummaryResponse>(
    '/api/admin/dashboard',
    {
      refreshInterval: 30 * 1000,
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRequestTimeRemaining((requestTimeRemaining) =>
        requestTimeRemaining > 0 ? requestTimeRemaining - 1 : 30
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) return <></>;

  if (error) {
    console.log(error);
    return <Typography>Error when loading data</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    unpaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
      title={'Dasboard'}
      subTitle={'General stats'}
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle='Total Orders'
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={paidOrders}
          subTitle='Paid Orders'
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={unpaidOrders}
          subTitle='Pending Orders'
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfClients}
          subTitle='Clients'
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfProducts}
          subTitle='Products'
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={productsWithNoInventory}
          subTitle='Out of stock Products'
          icon={
            <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTile
          title={lowInventory}
          subTitle='Shortage Products'
          icon={
            <ProductionQuantityLimitsOutlined
              color='warning'
              sx={{ fontSize: 40 }}
            />
          }
        />
        <SummaryTile
          title={requestTimeRemaining}
          subTitle='Refresh in:'
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
