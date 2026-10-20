import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { WalletProvider } from "./context/WalletContext";
import routes from "./routes";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <RouterProvider router={routes} />
      </WalletProvider>
    </ThemeProvider>
  );
};

export default App;
