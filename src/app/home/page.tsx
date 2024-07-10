"use client";

import React from "react";
import Button from "@mui/material/Button";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Box from "@mui/material/Box";
import { Container, Stack } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { useRouter } from "next/navigation";

const UploadFileComp: React.FC = (): JSX.Element => {
  const router = useRouter();

  const handleCreateNewMapping = () => {
    router.push("/home/upload");
  };

  const handleDashboard = () => {
    router.push("/home/board");
  };

  return (
    <Container maxWidth="xl">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Stack spacing={2}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleCreateNewMapping}
          >
            Create New Mapping
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<DashboardOutlinedIcon />}
            onClick={handleDashboard}
          >
            Board
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default UploadFileComp;
