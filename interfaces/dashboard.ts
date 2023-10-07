export interface DashboardSummaryResponse {
  numberOfOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
}
