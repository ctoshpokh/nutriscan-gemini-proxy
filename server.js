const express = require('express');
const cors = require('cors');
const http = require('https');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.GEMINI_API_KEY;

// Directly catch the exact path the app and curl command are sending
app.post('/v1beta/models/gemini-2.5-flash:generateContent', (req, res) => {
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.status(proxyRes.statusCode);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (e) => {
        res.status(500).json({ error: e.message });
    });

    proxyReq.write(JSON.stringify(req.body));
    proxyReq.end();
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
