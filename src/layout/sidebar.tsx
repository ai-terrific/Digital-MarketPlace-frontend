import { Drawer } from "@mui/material";
import SidebarContent from "@/components/SideBar";
import { useDeviceType } from "@/hooks";

interface SideBarProps {
  open: boolean;
  onToggle: () => void;
}

export const SideBar = ({ open, onToggle }: SideBarProps) => {
  const { isMobile } = useDeviceType();

  return (
    <Drawer
      variant={isMobile ? "persistent" : "permanent"}
      anchor="left"
      open={open}
      onClose={() => onToggle()}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
        },
      }}
    >
      <SidebarContent onClose={() => onToggle()} />
    </Drawer>
  );
};
