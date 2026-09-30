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
