import { createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import Marketplace from "@/pages/Marketplace";
import ProductDetails from "@/pages/ProductDetails";
import CreateProduct from "@/pages/CreateProduct";
import MyProducts from "@/pages/MyProducts";
import Admin from "@/pages/Admin";
import { routers } from "@/constants";

const routes = createBrowserRouter([
  {
    path: routers.LANDING,
    element: <Layout />,
    children: [
      {
        path: routers.LANDING,
        element: <Marketplace />,
      },
      {
        path: routers.PRODUCT,
        element: <ProductDetails />,
      },
      {
        path: routers.CREATE,
        element: <CreateProduct />,
      },
      {
        path: routers.MYPRODUCTS,
        element: <MyProducts />,
      },
      {
        path: routers.ADMIN,
        element: <Admin />,
      },
    ],
  },
]);

export default routes;
