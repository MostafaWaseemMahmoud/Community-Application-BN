const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Middleware to enable CORS

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack to console
  res.status(500).send("Something went wrong!"); // Send generic error response
});

const users = []; // Array to store user data

const port = process.env.PORT || 8080; // Define port number for server

// Route to get all users
app.get("/Allusers", (req, res) => {
  if (users.length > 0) {
    res.status(200).send(users); // Send users data if available
  } else {
    res.status(404).send("Sorry!! But We Don't Have Any Users "); // Send error message if no users found
  }
});

// Function to check if a user already exists by email
function checkUserAlreadyExist(email) {
  return users.some((user) => user.email === email);
}

// Function to get a user by their email
function getUserByEmail(email) {
  return users.find((user) => user.email === email);
}

// Route to add a new user
app.post("/addUser", (req, res) => {
  const { name, password, email } = req.body;

  if (checkUserAlreadyExist(email)) {
    res.status(400).send("User already exists"); // Send error response if user already exists
    return;
  }

  const newUser = {
    name,
    password,
    email,
    posts: [], // Initialize posts array for the new user
  };

  users.push(newUser); // Add new user to the users array
  res.status(200).send("User added successfully"); // Send success response
});

// Route to add a new post for a user
app.post("/addPost/:email", (req, res) => {
  const { posttitle, postbody } = req.body;
  const { email } = req.params;

  const user = getUserByEmail(email);

  if (!user) {
    res.status(404).send("User not found"); // Send error response if user not found
    return;
  }

  user.posts.push({ posttitle, postbody }); // Add new post to user's posts array
  res.status(200).send(user); // Send updated user data as response
});

// Route to delete a post for a user
app.delete("/deletePost/:email/:posttitle", (req, res) => {
  const { email, posttitle } = req.params;

  const user = getUserByEmail(email);

  if (!user) {
    res.status(404).send("User not found"); // Send error response if user not found
    return;
  }

  const postIndex = user.posts.findIndex(
    (post) => post.posttitle === posttitle
  );

  if (postIndex === -1) {
    res.status(404).send("Post not found"); // Send error response if post not found
    return;
  }

  user.posts.splice(postIndex, 1); // Remove post from user's posts array
  res.status(200).send(user); // Send updated user data as response
});

// Route to delete a user by email
app.delete("/deleteUser/:email", (req, res) => {
  const { email } = req.params;

  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex === -1) {
    res.status(404).send("User not found"); // Send error response if user not found
    return;
  }

  users.splice(userIndex, 1); // Remove user from users array
  res.status(200).send("User deleted successfully"); // Send success response
});

// Route to get a user by email
app.get("/getuser/:email", (req, res) => {
  const { email } = req.params;

  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(404).send("User not found"); // Send error response if user not found
    return;
  }

  res.status(200).send(user); // Send user data as response
});

// Route to authenticate and login a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    res.status(401).send("Invalid email or password"); // Send error response if login credentials are invalid
    return;
  }

  // Here you can generate and set a session or token to maintain the user's authentication state
  // For simplicity, let's just send the user data as response for now
  res.status(200).send(user); // Send user data as response
});

// Start the server
app.listen(port, () => {
  console.log("App Start On Port: " + port); // Log server start message
});
