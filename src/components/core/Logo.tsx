import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        component="img"
        src="/logo.png"
      />
    </Link>
  );
};

export default Logo;
