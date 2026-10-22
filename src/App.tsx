import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { DialogProvider } from "./context/DialogContext";
import { WalletProvider } from "./context/WalletContext";
import routes from "./routes";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <DialogProvider>
          <RouterProvider router={routes} />
        </DialogProvider>
      </WalletProvider>
    </ThemeProvider>
  );
};

export default App;
