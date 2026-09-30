// api/webhook.js — Telegram Bot webhook handler

const BOT_TOKEN = process.env.BOT_TOKEN;

// URL витрины (мини-апп)
const SHOP_URL = process.env.WEBAPP_URL || 'https://pvz-pink.vercel.app/index%20(50).html';
// URL формы заказа
const ORDER_URL = process.env.WEBAPP_URL
    ? process.env.WEBAPP_URL.replace('index%20(50).html', 'order.html').replace('index (50).html', 'order.html')
    : 'https://pvz-pink.vercel.app/order.html';

async function sendMessage(chatId, text, extra = {}) {
    const body = { chat_id: chatId, text, parse_mode: 'HTML', ...extra };
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).json({ ok: true, info: 'Bot is running' });
    }

    try {
        const update = req.body;

        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id;
            const text = msg.text || '';

            if (text === '/start') {
                await sendMessage(chatId,
                    'Добро пожаловать в PvZ Shop.\n\nБыстро, анонимно и круглосуточно.\nНажми кнопку ниже чтобы открыть витрину.',
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                {
                                    text: 'Открыть витрину',
                                    web_app: { url: 'https://huntersnetplus.github.io/PvZ/' }
                                }
                            ]]
                        }
                    }
                );
            } else if (text === '/order') {
                await sendMessage(chatId,
                    'Форма создания заказа.\n\nЗаполни все поля и нажми "Сформировать заказ".',
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                {
                                    text: 'Создать заказ',
                                    web_app: { url: 'https://pvz-pink.vercel.app/order.html' }
                                }
                            ]]
                        }
                    }
                );
            } else {
                await sendMessage(chatId, 'Используй /start чтобы открыть витрину.');
            }
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Webhook error:', err);
        return res.status(200).json({ ok: false, error: err.message });
    }
}
