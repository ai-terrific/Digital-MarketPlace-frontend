import { createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import CreateProductPage from "@/pages/CreateProductPage";
import AccountPage from "@/pages/AccountPage";
import MyProductsPage from "@/pages/MyProductsPage";
import AdminPage from "@/pages/AdminPage";
import { routers } from "@/constants";

const routes = createBrowserRouter([
  {
    path: routers.LANDING,
    element: <Layout />,
    children: [
      {
        path: routers.LANDING,
        element: <MarketplacePage />,
      },
      {
        path: routers.PRODUCT,
        element: <ProductDetailsPage />,
      },
      {
        path: routers.CREATE,
        element: <CreateProductPage />,
      },
      {
        path: routers.ACCOUNT,
        element: <AccountPage />,
      },
      {
        path: routers.MYPRODUCTS,
        element: <MyProductsPage />,
      },
      {
        path: routers.ADMIN,
        element: <AdminPage />,
      },
    ],
  },
]);

export default routes;
