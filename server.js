const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Serve frontend
app.use(express.static('public'));

// --- CONFIG: replace with your BharatPe details ---
const BHARATPE_API_BASE = "https://api.bharatpe.example"; // placeholder
const BHARATPE_API_KEY = "YOUR_BHARATPE_API_KEY";         // placeholder
const BHARATPE_MERCHANT_ID = "YOUR_MERCHANT_ID";          // placeholder

// Helper to call BharatPe API
async function callBharatPe(path, method='POST', body={}) {
    const url = BHARATPE_API_BASE + path;
    const resp = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BHARATPE_API_KEY}`,
            'X-Merchant-Id': BHARATPE_MERCHANT_ID
        },
        body: JSON.stringify(body)
    });
    return resp.json();
}

// Create collect request
app.post('/create-collect', async (req, res) => {
    const { amount, note } = req.body;
    if(!amount) return res.status(400).json({ error: 'Amount required' });

    const payload = {
        amount,
        currency: "INR",
        merchant_order_id: "ORD" + Date.now(),
        remark: note || "Payment",
        payer_vpa: "BHARATPE.8X0A0T8C8B85333@fbpe",
        callback_url: "https://yourdomain.com/webhook"
    };

    try {
        const data = await callBharatPe('/v1/collect', 'POST', payload);
        res.json(data);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Webhook to handle payment status
app.post('/webhook', (req, res) => {
    console.log('Webhook payload:', req.body);
    res.status(200).send('ok');
});

app.listen(3000, () => console.log('Server running on port 3000'));
