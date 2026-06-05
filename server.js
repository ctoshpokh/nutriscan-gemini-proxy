const express = require('express');
const cors = require('cors');
const http = require('https');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.GEMINI_API_KEY;

// This wildcard catch-all handles ANY model version your phone tries to call
app.post('/v1beta/models/*', (req, res) => {
    // Extracts whatever model path your phone sent (e.g., "gemini-1.5-flash-latest:generateContent")
    const modelPath = req.params[0]; 

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${modelPath}?key=${API_KEY}`,
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
    console.log(`Universal Proxy running on port ${PORT}`);
});
