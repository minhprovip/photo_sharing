import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import "./styles.css";

import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar({ loginUser, onLogout }) {
  const NAME = "HA QUANG MINH";
  const navigate = useNavigate();
  const location = useLocation();
  let context = "";
  const userId = location.pathname.split("/")[2];
  const [userName, setUserName] = useState(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(
        `http://localhost:8081/api/photosOfUser/new`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      if (response.status === 401) {
        navigate("/login"); // Redirect to login page
      } else if (response.ok) {
        const newPhotoData = await response.json();
        console.log(newPhotoData);
        console.log("Photo uploaded successfully");
        alert("Photo uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
    handleClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/user/${userId}`,
          { credentials: "include" },
        );

        const result = await response.json();
        if (response.status === 401) {
          navigate("/login"); // Redirect to login page
        }
        setUserName(result.first_name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate, userId]);
  if (userName) {
    context = userName;
  }
  if (location.pathname.includes("photos")) {
    context = "Photos of " + context;
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link style={{ textDecoration: "none" }} to={"/users"}>
            {NAME}{" "}
          </Link>
        </Typography>

        {userName && (
          <Typography textAlign="center" variant="h6">
            {context}
          </Typography>
        )}

        {loginUser && (
          <>
            <Button color="inherit" onClick={handleClickOpen}>
              Upload Photo
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Upload Photo</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To upload a photo, please choose a file.
                </DialogContentText>
                <input type="file" onChange={handleFileChange} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {loginUser && (
          <>
            <Typography variant="h6">Hi {loginUser.first_name}</Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        )}
        {!loginUser && <Typography variant="h6">Please Login</Typography>}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
