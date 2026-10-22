import type { ProductStatus } from "@/types";
import { Chip } from "@mui/material";
import React from "react";

interface StatusChipProps {
  status: ProductStatus;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        bgcolor:
          status === "Active"
            ? "rgba(16, 185, 129, 0.9)"
            : "rgba(245, 158, 11, 0.9)",
        color: "#fff",
        fontSize: "0.65rem",
        backdropFilter: "blur(4px)",
      }}
    />
  );
};

export default StatusChip;
