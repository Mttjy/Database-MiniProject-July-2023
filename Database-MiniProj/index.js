const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON");
  }
});

// Import the routers from ./routes
const authorRouter = require('./routes/author');
const readerRouter = require('./routes/reader');

app.set('view engine', 'ejs');

// Serve static files from the folders
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.set('views', __dirname + '/views');

// Mount the author router on the path /author & /reader
app.use('/author', authorRouter);
app.use('/reader', readerRouter);

app.delete('/delete-post/:id', (req, res) => {
  const postId = req.params.id;
  deletePost(postId, (err) => {
    if (err) {
      console.error('Error deleting post:', err);
      return res.status(500).json({ error: 'Error deleting post' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  });
});

app.post('/post/:id/like', (req, res, next) => {
  const postId = req.params.id;
  const likeCount = parseInt(req.body.likeCount);

  global.db.run("UPDATE Posts SET likes = ? WHERE post_id = ?", [likeCount, postId], function (err) {
    if (err) {
      return next(err);
    } else {
      global.db.get("SELECT likes FROM Posts WHERE post_id = ?", [postId], function (err, row) {
        console.log(likeCount)
        if (err) {
          return next(err);
        } else {
          const likes = row.likes;
          res.json({ likes: likes });
        }
      });
    }
  });
});

app.get('/', (req, res) => {
  res.redirect('/reader/blog');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
