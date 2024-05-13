"use client";

import React, { useEffect } from "react";
import PageAppBar from "../components/app-bar";
import Button from "@mui/material/Button";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Box from "@mui/material/Box";
import { Container, Grid, Stack } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

const UploadFileComp = () => {
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
          >
            Create New Mapping
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<DashboardOutlinedIcon />}
          >
            Dashboard
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default UploadFileComp;
