const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require("path");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function getCommentCount(postId, callback) {
    global.db.get("SELECT COUNT(*) as comment_count FROM Comments WHERE post_id = ?", [postId], function (err, row) {
        if (err) {
            return callback(err);
        } else {
            callback(null, row.comment_count);
        }
    });
}

router.get('/blog', (req, res, next) => {
    global.db.all("SELECT author_name, author_subTitle, author_desc FROM Author", function (err, rows) {
        if (err) {
            return next(err);
        } else {
            const author_name = rows[0].author_name;
            const author_subTitle = rows[0].author_subTitle;
            const author_desc = rows[0].author_desc;

            global.db.all("SELECT * FROM Posts WHERE is_draft = 0 ORDER BY post_date DESC", function (err, publishedPost) {
                if (err) {
                    return next(err);
                } else {
                    const getCommentCountsPromises = publishedPost.map(post => {
                        return new Promise((resolve, reject) => {
                            getCommentCount(post.post_id, (err, count) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    post.comments = count;
                                    resolve();
                                }
                            });
                        });
                    });

                    Promise.all(getCommentCountsPromises)
                        .then(() => {
                            res.render('reader-home', { author_name, author_subTitle, author_desc, publishedPost });
                        })
                        .catch(err => {
                            console.error('Error fetching comment counts:', err);
                            res.render('reader-home', { author_name, author_subTitle, author_desc, publishedPost });
                        });
                }
            });
        }
    });
});

router.get('/post/:id', (req, res, next) => {
    const postId = req.params.id;

    global.db.get("SELECT * FROM Posts WHERE post_id = ?", [postId], function (err, post) {
        if (err) {
            return next(err);
        } else {
            global.db.all("SELECT * FROM Comments WHERE post_id = ? ORDER BY comment_date DESC", [postId], function (err, comments) {
                if (err) {
                    return next(err);
                } else {
                    res.render('post-details', { post, comments });
                }
            });
        }
    });
});

router.post('/post/:id/comment', (req, res, next) => {
    const postId = req.params.id;
    const commentText = req.body.comment;

    const commentDate = new Date().toISOString();
    const newComment = {
        comment_text: commentText,
        comment_date: commentDate,
    };

    global.db.run("INSERT INTO Comments (post_id, comment_text, comment_date) VALUES (?, ?, ?)",
        [postId, newComment.comment_text, newComment.comment_date], function (err) {
            if (err) {
                console.error('Error saving comment:', err);
                return res.status(500).json({ error: 'Error saving comment' });
            }
            res.status(201).json(newComment);
        });
});

module.exports = router;