const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs');

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

router.get('/home', (req, res, next) => {
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
                            res.render('author-page', { author_name, author_subTitle, author_desc, publishedPost });
                        })
                        .catch(err => {
                            console.error('Error fetching comment counts:', err);
                            res.render('author-page', { author_name, author_subTitle, author_desc, publishedPost });
                        });
                }
            });
        }
    });
});

router.get('/edit', (req, res, next) => {
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
                            res.render('author-edit', { author_name, author_subTitle, author_desc, publishedPost });
                        })
                        .catch(err => {
                            console.error('Error fetching comment counts:', err);
                            res.render('author-edit', { author_name, author_subTitle, author_desc, publishedPost });
                        });
                }
            });
        }
    });
});

router.get('/draft', (req, res, next) => {
    global.db.all("SELECT author_name, author_subTitle, author_desc FROM Author", function (err, rows) {
        if (err) {
            return next(err);
        } else {
            const author_name = rows[0].author_name;
            const author_subTitle = rows[0].author_subTitle;
            const author_desc = rows[0].author_desc;

            global.db.all("SELECT * FROM Posts WHERE is_draft = 1 ORDER BY post_date DESC", function (err, publishedPost) {
                if (err) {
                    return next(err);
                } else {
                    res.render('author-draft', { author_name, author_subTitle, author_desc, publishedPost });
                }
            });
        }
    });
});

router.get('/profile', (req, res, next) => {
    global.db.all("SELECT author_name, author_subTitle, author_desc FROM Author", function (err, rows) {
        if (err) {
            return next(err);
        } else {
            const author_name = rows[0].author_name;
            const author_subTitle = rows[0].author_subTitle;
            const author_desc = rows[0].author_desc;

            res.render('profile-edit', { author_name, author_subTitle, author_desc });
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
                    res.render('author-post-details', { post, comments });
                }
            });
        }
    });
});

router.post('/update-profile', (req, res) => {
    const { name, subTitle, desc } = req.body;

    global.db.run(
        "UPDATE Author SET author_name = ?, author_subTitle = ?, author_desc = ?",
        [name, subTitle, desc],
        function (err) {
            if (err) {
                console.error('Error updating profile:', err);
                return res.status(500).json({ error: 'Error updating profile' });
            }
            res.status(200).json({ message: 'Profile updated successfully' });
        }
    );
});

router.post('/newPost', (req, res) => {
    const { post_title, post_sub_title, post_desc } = req.body;

    if (!post_title || !post_sub_title) {
        return res.status(400).json({ error: 'Missing required fields' });
    } else {
        const post_last_modified = formatDate(new Date().toISOString());

        const query = 'INSERT INTO Posts (post_title, post_sub_title, post_desc, post_last_modified) VALUES (?,?,?,?)';
        const queryParams = [post_title, post_sub_title, post_desc, post_last_modified];

        global.db.run(
            query,
            queryParams,
            function (err) {
                if (err) {
                    console.error('Error inserting post:', err);
                    return res.status(500).json({ error: 'Error inserting post' });
                }

                res.status(200).json({ message: 'Post created successfully' });
            }
        );

    }
});

router.post('/update-post', (req, res) => {
    const { post_id, post_title, post_sub_title, post_desc } = req.body;

    if (!post_id || !post_title || !post_sub_title) {
        return res.status(400).json({ error: 'Missing required fields' });
    } else {
        const post_last_modified = formatDate(new Date().toISOString());

        const query = 'UPDATE Posts SET post_title = ?, post_sub_title = ?, post_desc = ?, post_last_modified = ? WHERE post_id = ?';
        const queryParams = [post_title, post_sub_title, post_desc, post_last_modified, post_id];

        global.db.run(
            query,
            queryParams,
            function (err) {
                if (err) {
                    console.error('Error updating post:', err);
                    return res.status(500).json({ error: 'Error updating post' });
                }

                res.status(200).json({ message: 'Post updated successfully' });
            }
        );

    }
});

router.post('/toPublish', (req, res) => {
    const { post_id, post_title, post_sub_title, post_desc } = req.body;

    if (!post_id || !post_title || !post_sub_title) {
        return res.status(400).json({ error: 'Missing required fields' });
    } else {
        const post_last_modified = formatDate(new Date().toISOString());
        const post_date = formatDate(new Date().toISOString());

        const query = 'UPDATE Posts SET post_title = ?, post_sub_title = ?, post_desc = ?, post_date = ?, post_last_modified = ?, is_draft = ? WHERE post_id = ?';
        const queryParams = [post_title, post_sub_title, post_desc, post_date, post_last_modified, 0, post_id];

        global.db.run(
            query,
            queryParams,
            function (err) {
                if (err) {
                    console.error('Error updating post:', err);
                    return res.status(500).json({ error: 'Error updating post' });
                }

                res.status(200).json({ message: 'Post updated successfully' });
            }
        );

    }
});

router.delete('/delete-post/:id', (req, res) => {
    const postId = req.params.id;

    global.db.run("DELETE FROM Comments WHERE post_id = ?", postId, function (err) {
        if (err) {
            console.error('Error deleting post:', err);
            return res.status(500).json({ error: 'Error deleting post' });
        } else {
            global.db.run("DELETE FROM Posts WHERE post_id = ?", postId, function (err) {
                if (err) {
                    console.error('Error deleting post:', err);
                    return res.status(500).json({ error: 'Error deleting post' });
                }
            });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    });
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

module.exports = router;
