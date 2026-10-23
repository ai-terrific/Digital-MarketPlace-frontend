import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { SideBar } from "./sidebar";
import { Header } from "./header";
import { Footer } from "./footer";
import { useDeviceType } from "@/hooks";

const Layout: React.FC = () => {
  const { isMobile } = useDeviceType();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const onToggle = () => {
    setSidebarOpen((e) => !e);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <SideBar open={sidebarOpen} onToggle={onToggle} />

      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        <Header onToggle={onToggle} />
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1440,
            width: "100%",
            mx: "auto",
            paddingLeft: isMobile ? `32px !important` : `312px !important`,
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
