// Create web server 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Data structure
const posts = {};

// Event handlers
const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
}

// Routes
app.get('/posts', (req, res) => {
    res.send(posts);
});

// Listen for events
app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send({});
});

// Start server
app.listen(4002, async () => {
    console.log('Listening on 4002');

    // Get all events
    const res = await axios.get('http://localhost:4005/events');

    // Loop through events and send to event handler
    for (let event of res.data) {
        console.log('Processing event:', event.type);
        handleEvent(event.type, event.data);
    }
});