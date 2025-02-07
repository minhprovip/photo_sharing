import React, { useState, useEffect } from "react";
import "./styles.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  List,
  Stack,
  TextField,
  CardMedia,
  Button,
  CardActions,
} from "@mui/material";
/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const slug = useParams();
  const navigate = useNavigate();
  const [userPhotos, setUserPhotos] = useState(null);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/photosOfUser/${slug.userId}`,
          {
            credentials: "include",
          },
        );
        if (response.status === 401) {
          navigate("/login"); // Redirect to login page
        } else {
          const result = await response.json();
          setUserPhotos(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate, slug.userId]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  const handleCommentSubmit = async (photoId) => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: newComment }),
        },
      );
      if (response.status === 401) {
        navigate("/login");
      }
      if (response.ok) {
        const data = await response.json();
        const newCommentObj = data.comment;

        setUserPhotos((prevPhotos) =>
          prevPhotos.map((photo) =>
            photo._id === photoId
              ? { ...photo, comments: [...photo.comments, newCommentObj] }
              : photo,
          ),
        );
        setNewComment("");
      } // Clear the input field
      else {
        alert("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  return (
    <Stack spacing={2}>
      {Array.isArray(userPhotos) &&
        userPhotos.map((photo) => (
          <Card className="photo-and-comments">
            <CardMedia
              component="img"
              title="Picture"
              image={`http://localhost:8081/images/${photo.file_name}`}
            />

            <CardContent>
              Posted at: {new Date(photo.date_time).toLocaleString()}
            </CardContent>
            <CardContent className="photo-comments">
              <List>
                {photo.comments &&
                  photo.comments.map((comment, index) => (
                    <>
                      <ListItem key={comment._id} className="comment">
                        <ListItemText
                          primary={comment.comment}
                          secondary={
                            <p>
                              Commented at:{" "}
                              {new Date(comment.date_time).toLocaleString()} by{" "}
                              <Link to={`/users/${comment.user_id._id}`}>
                                {comment.user_id.first_name}
                              </Link>
                            </p>
                          }
                        />
                      </ListItem>
                      {index !== photo.comments.length - 1 && (
                        <Divider component="li" />
                      )}
                    </>
                  ))}
              </List>
            </CardContent>
            <CardActions>
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={handleCommentChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCommentSubmit(photo._id)}
              >
                Submit
              </Button>
            </CardActions>
          </Card>
        ))}
    </Stack>
  );
}

export default UserPhotos;
