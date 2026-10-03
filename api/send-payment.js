// api/send-payment.js — отправляет ссылку на оплату B Pay в Telegram бота

const BOT_TOKEN = process.env.BOT_TOKEN;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ ok: false });

    try {
        const { chatId, orderId, productName, amountRub, paymentUrl } = req.body;

        if (!chatId || !paymentUrl) {
            return res.status(400).json({ ok: false, error: 'chatId и paymentUrl обязательны' });
        }

        const amount = Number(amountRub).toLocaleString('ru-RU');

        const text =
            `<b>Заказ #${orderId}</b>\n\n` +
            `<blockquote>` +
            `${productName || '—'}\n` +
            `Сумма: ${amount} ₽` +
            `</blockquote>\n\n` +
            `Нажми кнопку ниже чтобы оплатить через СБП.`;

        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id:    chatId,
                text,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: 'Оплатить СБП →',
                            url: paymentUrl
                        }
                    ], [
                        {
                            text: '⏳ Ожидает оплаты',
                            callback_data: 'status_pending'
                        }
                    ]]
                }
            })
        });

        const tgData = await tgRes.json();
        return res.status(200).json(tgData);

    } catch (err) {
        console.error('send-payment error:', err);
        return res.status(500).json({ ok: false, error: err.message });
    }
};
