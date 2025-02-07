import "./App.css";

import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginRegister from "./components/LoginRegister";

const App = () => {
  const [loginUser, setLoginUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081//api/admin/session",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const data = await response.json();
        setLoginUser(data.user);
      } catch (error) {
        setLoginUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/admin/logout",
        {
          method: "POST",
          credentials: "include",
        },
      );
      setLoginUser(null);
      if (!response.ok) {
        throw new Error(`Logout request failed with status ${response.status}`);
      }

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar loginUser={loginUser} onLogout={handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {loginUser && <UserList />}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/login"
                  element={<LoginRegister onLogin={setLoginUser} />}
                />
                <Route
                  path="/users/:userId"
                  element={
                    <ProtectedRoute user={loginUser}>
                      <UserDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/photos/:userId"
                  element={
                    <ProtectedRoute user={loginUser}>
                      <UserPhotos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute user={loginUser}>
                      <UserList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute user={loginUser}>
                      <UserList />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
