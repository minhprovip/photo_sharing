import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import config from "../../config";

function LoginRegister({ onLogin }) {
  const [creds, setCreds] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/admin/session`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.status === 401) {
          throw new Error("Not authenticated");
        }

        const data = await response.json();
        onLogin(data.user);
        navigate(`/users/${data.user._id}`);
      } catch (error) {
        onLogin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, onLogin]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    // Destructure credentials
    const { username, password } = creds;

    // Check if either username or password is empty
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/admin/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login_name: username, password: password }),
        },
      );

      // Check if response status is not OK
      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }

      const data = await response.json();
      onLogin(data.user);
      navigate(`/users/${data.user._id}`);
    } catch (error) {
      // Handle specific error scenarios
      if (error instanceof TypeError) {
        setError("Network error occurred. Please try again.");
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
    }
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    setError(null);

    const { username, password, confirmPassword, firstName, lastName } = creds;

    if (!username || !password || !confirmPassword || !firstName || !lastName) {
      setError("All required fields must be provided.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/admin/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login_name: username,
            password,
            first_name: firstName,
            last_name: lastName,
            location: creds.location,
            description: creds.description,
            occupation: creds.occupation,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed.");
      }
      const data = await response.json();

      alert("Registration successful!");
      setState(true);
      setCreds({ ...creds, username: data.user.login_name });
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {state ? (
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="login_name"
              label="Login Name"
              name="login_name"
              autoComplete="login_name"
              autoFocus
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  onClick={() => {
                    setState(false);
                    setError(null);
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleRegistration}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="login_name"
                  label="Login Name"
                  name="login_name"
                  autoComplete="login_name"
                  onChange={(e) =>
                    setCreds({ ...creds, username: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) =>
                    setCreds({ ...creds, password: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  id="confirm_password"
                  autoComplete="confirm-new-password"
                  onChange={(e) =>
                    setCreds({ ...creds, confirmPassword: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) =>
                    setCreds({ ...creds, firstName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) =>
                    setCreds({ ...creds, lastName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="location"
                  label="Location"
                  name="location"
                  autoComplete="location"
                  onChange={(e) =>
                    setCreds({ ...creds, location: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                  onChange={(e) =>
                    setCreds({ ...creds, description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="occupation"
                  label="Occupation"
                  name="occupation"
                  autoComplete="occupation"
                  onChange={(e) =>
                    setCreds({ ...creds, occupation: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register Me!
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  onClick={() => {
                    setState(true);
                    setError(null);
                  }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Container>
  );
}
export default LoginRegister;
