# PvZ Shop Bot — деплой на Vercel

## Структура

```
PVZ/
  api/
    webhook.js   — обработчик сообщений бота
    setup.js     — регистрация webhook (один раз)
    send.js      — отправка заказа (вызывается из order.html)
  index (50).html  — магазин
  order.html       — форма создания заказа
  vercel.json      — конфиг Vercel
```

---

## Шаг 1 — Загрузи на GitHub

1. Создай новый репозиторий на GitHub (например `pvz-bot`)
2. Загрузи все файлы из папки PVZ в корень репо

---

## Шаг 2 — Подключи к Vercel

1. Зайди на [vercel.com](https://vercel.com) → войди через GitHub
2. Нажми **Add New Project** → выбери репо `pvz-bot`
3. Настройки оставь по умолчанию → нажми **Deploy**

---

## Шаг 3 — Добавь токен бота

1. В Vercel открой проект → **Settings** → **Environment Variables**
2. Добавь переменную:
   - **Name:** `BOT_TOKEN`
   - **Value:** твой токен от @BotFather (например `7123456789:AAH...`)
3. Добавь вторую переменную:
   - **Name:** `WEBAPP_URL`
   - **Value:** `https://ИМЯ_ТВОЕГО_ПРОЕКТА.vercel.app/order.html`
4. Нажми **Save** → потом **Redeploy** (кнопка в Deployments)

---

## Шаг 4 — Зарегистрируй webhook

Открой в браузере:
```
https://ИМЯ_ТВОЕГО_ПРОЕКТА.vercel.app/api/setup
```

Увидишь зелёный статус — бот готов.

---

## Шаг 5 — Проверь

Напиши боту `/order` в Telegram — должна появиться кнопка.

---

## Если что-то не работает

- Проверь что `BOT_TOKEN` добавлен в Environment Variables и сделан Redeploy
- Зайди на `/api/setup` — там покажет ошибку если токен неверный
- Логи смотри в Vercel → проект → **Functions** → кликни на вызов

---

## B Pay — Авто-QR (СБП)

### Новые файлы

```
api/
  bpay-create.js   — создаёт платёж через B Pay API
  bpay-webhook.js  — принимает уведомления от B Pay, шлёт сообщение в Telegram
```

### Шаг 1 — Зарегистрируйся на b-pay-provider.com

1. Создай аккаунт → пройди модерацию
2. Кабинет → **Проекты** → создай проект
3. Вкладка **«API ключи»** → «Перевыпустить» → скопируй ключ (`np_secret_...`) — показывается один раз

### Шаг 2 — Настрой webhook в кабинете B Pay

1. В проекте → вкладка **«Webhooks»**
2. URL вебхука: `https://pvz-pink.vercel.app/api/bpay-webhook`
3. Сохрани → скопируй **webhook secret** (`whsec_...`) — показывается один раз
4. Вкладка **«Методы оплаты»** → включи нужные (СБП / Авто-QR)

### Шаг 3 — Добавь переменные в Vercel

Vercel → проект → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `BPAY_API_KEY` | `np_secret_...` (ключ из кабинета B Pay) |
| `BPAY_WEBHOOK_SECRET` | `whsec_...` (секрет вебхука из кабинета B Pay) |

Сохрани → **Redeploy**.

### Как это работает

1. Юзер выбирает **«Авто-QR (СБП)»** в форме заказа
2. `order.html` → `POST /api/bpay-create` → B Pay API создаёт платёж
3. Юзер перенаправляется на страницу оплаты `vitialpay.com`
4. После оплаты B Pay стучится на `POST /api/bpay-webhook`
5. Webhook проверяет подпись HMAC-SHA256 и шлёт юзеру сообщение в Telegram: «Оплата получена»

### Статусы платежей B Pay

| Статус | Значение |
|--------|----------|
| `CREATED` | Создан, ждём генерации QR |
| `PENDING` | QR показан клиенту |
| `SUCCESS` | Оплачено ✅ |
| `FAILED` | Не прошло / истёк таймер |
| `EXPIRED` | Клиент не оплатил за 25 минут |
| `CANCELED` | Отменено |
