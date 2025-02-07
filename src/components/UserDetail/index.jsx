import React from "react";
import "./styles.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
} from "@mui/material";
/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const slug = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/user/${slug.userId}`,
          {
            credentials: "include",
          },
        );
        if (response.status === 401) {
          navigate("/login"); // Redirect to login page
        } else {
          const result = await response.json();
          setUser(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate, slug.userId]);

  if (!user) {
    return null; // or return some placeholder content
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h3">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="subtitle1">Location: {user.location}</Typography>
        <Typography variant="subtitle1">
          Occupation: {user.occupation}
        </Typography>
        <Typography variant="subtitle1">
          Description: {user.description}
        </Typography>
        {/* <Link to={`/photos/${user._id}`} key={user._id}>
              View Photos
            </Link> */}
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/photos/${user._id}`} size="small">
          View Photos
        </Button>
      </CardActions>
    </Card>
  );
}

export default UserDetail;
