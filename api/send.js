// api/send.js — проксирует отправку заказа в Telegram
// Токен бота хранится только на сервере, в браузер не попадает

const BOT_TOKEN = process.env.BOT_TOKEN;

module.exports = async function handler(req, res) {
    // Разрешаем CORS для GitHub Pages и Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    try {
        const { chatId, orderId, location, product, price, payMethod, requisites, comment } = req.body;

        if (!chatId || !orderId) {
            return res.status(400).json({ ok: false, error: 'chatId и orderId обязательны' });
        }

        // Формируем текст сообщения
        const caption =
            `<b>НОВЫЙ ЗАКАЗ #${orderId}</b>\n` +
            `<blockquote>` +
            `📍 Локация: ${location || '—'}\n` +
            `💊 Позиция: ${product || '—'}\n` +
            `💰 Сумма: ${price || '—'}\n` +
            `💳 Оплата: ${payMethod || '—'}` +
            (comment ? `\n📝 ${comment}` : '') +
            `</blockquote>\n` +
            `Реквизиты:\n<code>${requisites || '—'}</code>`;

        // Кнопка статуса под сообщением
        const reply_markup = {
            inline_keyboard: [[
                { text: '⏳ Ожидает оплаты', callback_data: 'status_pending' }
            ]]
        };

        // Отправляем фото с подписью
        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                photo: 'https://github.com/HuntersNetPlus/PvZ/blob/main/AV_1-ezgif.com-video-to-webp-converter.webp?raw=true',
                caption,
                parse_mode: 'HTML',
                reply_markup
            })
        });

        const tgData = await tgRes.json();

        if (!tgData.ok) {
            // Если фото не загрузилось — отправляем просто текст
            const textRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: caption,
                    parse_mode: 'HTML',
                    reply_markup
                })
            });
            const textData = await textRes.json();
            return res.status(200).json(textData);
        }

        return res.status(200).json(tgData);
    } catch (err) {
        console.error('Send error:', err);
        return res.status(500).json({ ok: false, error: err.message });
    }
}
