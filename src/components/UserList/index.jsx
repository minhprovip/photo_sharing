import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Divider, List, ListItemText, ListItemButton } from "@mui/material";
import "./styles.css";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const navigate = useNavigate();
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/user/list",
          {
            credentials: "include",
          },
        );
        if (response.status === 401) {
          navigate("/login"); // Redirect to login page
        } else {
          const result = await response.json();

          setUsers(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate]);
  return (
    <List component="nav">
      {Array.isArray(users) &&
        users.map((item, index) => (
          <>
            <ListItemButton
              key={item._id}
              component={Link}
              to={`/users/${item._id}`}
              selected={selectedIndex === item._id}
              onClick={(event) => handleListItemClick(event, item._id)}
            >
              <ListItemText primary={item.first_name} />
            </ListItemButton>

            {index !== users.length - 1 && <Divider component="li" />}
          </>
        ))}
    </List>
  );
}

export default UserList;
