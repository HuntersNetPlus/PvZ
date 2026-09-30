// api/webhook.js — Telegram Bot webhook handler
// Vercel Serverless Function

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL; // https://your-project.vercel.app/order.html

async function sendMessage(chatId, text, extra = {}) {
    const body = { chat_id: chatId, text, parse_mode: 'HTML', ...extra };
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

async function sendOrderButton(chatId) {
    const body = {
        chat_id: chatId,
        text: '📦 <b>Создать заказ</b>\n\nНажми кнопку ниже чтобы открыть форму заказа:',
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🛒 Открыть форму заказа',
                    web_app: { url: WEBAPP_URL }
                }
            ]]
        }
    };
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

module.exports = async function handler(req, res) {
    // Только POST запросы от Telegram
    if (req.method !== 'POST') {
        return res.status(200).json({ ok: true, info: 'Bot is running' });
    }

    try {
        const update = req.body;

        // Обработка обычных сообщений
        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id;
            const text = msg.text || '';

            if (text === '/start') {
                await sendMessage(chatId,
                    '👋 Привет! Я бот PvZ Shop.\n\n' +
                    '📦 <b>/order</b> — создать заказ\n'
                );
            } else if (text === '/order') {
                await sendOrderButton(chatId);
            } else {
                // Любое другое сообщение — подсказка
                await sendMessage(chatId, 'Используй /order чтобы создать заказ.');
            }
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Webhook error:', err);
        return res.status(200).json({ ok: false, error: err.message });
    }
}
