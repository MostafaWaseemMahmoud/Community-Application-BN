const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const users = [];

const port = process.env.PORT || 8080;

app.get("/Allusers", (req, res) => {
  if (users.length > 0) {
    res.status(200).send(users);
  } else {
    res.status(404).send("Sorry!! But We Don't Have Any Users ");
  }
});

function checkUserAlreadyExist(email) {
  return users.some((user) => user.email === email);
}

function getUserByEmail(email) {
  return users.find((user) => user.email === email);
}

app.post("/addUser", (req, res) => {
  const { name, password, email } = req.body;

  if (checkUserAlreadyExist(email)) {
    res.status(400).send("User already exists");
    return;
  }

  const newUser = {
    name,
    password,
    email,
    posts: [],
  };

  users.push(newUser);
  res.status(200).send("User added successfully");
});

app.post("/addPost/:email", (req, res) => {
  const { posttitle, postbody } = req.body;
  const { email } = req.params;

  const user = getUserByEmail(email);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  user.posts.push({ posttitle, postbody });
  res.status(200).send(user);
});

app.delete("/deletePost/:email/:posttitle", (req, res) => {
  const { email, posttitle } = req.params;

  const user = getUserByEmail(email);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  const postIndex = user.posts.findIndex(
    (post) => post.posttitle === posttitle
  );

  if (postIndex === -1) {
    res.status(404).send("Post not found");
    return;
  }

  user.posts.splice(postIndex, 1);
  res.status(200).send(user);
});

app.delete("/deleteUser/:email", (req, res) => {
  const { email } = req.params;

  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex === -1) {
    res.status(404).send("User not found");
    return;
  }

  users.splice(userIndex, 1);
  res.status(200).send("User deleted successfully");
});

app.get("/getuser/:email", (req, res) => {
  const { email } = req.params;

  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.status(200).send(user);
});

app.listen(port, () => {
  console.log("App Start On Port: " + port);
});
