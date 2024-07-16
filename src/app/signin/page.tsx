"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useSnackBar } from "../components/snackbar-provider";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { showSnackBar } = useSnackBar();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!formData.username || !formData.password) {
      showSnackBar("Please fill in all fields.", "error");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/signin`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.ok) {
        const json = await res.json();

        const expirationTime = new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
        );

        Cookies.set("accessToken", json.token, {
          expires: expirationTime,
          path: "/",
        });

        Cookies.set("username", formData.username, {
          expires: expirationTime,
          path: "/",
        });

        showSnackBar("You have successfully signed in.", "success");
        router.push("/home");
      } else {
        showSnackBar(
          "Invalid username or password. Please try again.",
          "error",
        );
      }
    } catch (error) {
      showSnackBar("An error occurred. Please try again.", "error");
    }
  }, [formData, router, showSnackBar]);

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Sign in</Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
