# Family Budget Project — CLAUDE.md

## Overview

Full-stack приложение для управления семейным бюджетом.
Пользователь регистрируется, логинится через JWT и управляет доходами/расходами.

**Стек:** Node.js · Express · PostgreSQL · React · JWT · bcrypt · LangChain (planned)
**OS:** Ubuntu (WSL2 на Windows — проект лежит в `/mnt/c/Users/mehra/family_budget_project_dev`)
**Branch:** `dev`

---

## Project Structure

### Текущая структура
```
family_budget_project/
├── backend/
│   ├── routes/         # API роуты
│   ├── controllers/    # Логика контроллеров
│   ├── middleware/     # JWT проверка, обработка ошибок
│   ├── db.js           # Подключение к PostgreSQL
│   ├── index.js        # Точка входа Express
│   └── .env
├── front-end/
│   └── web/
│       ├── src/
│       │   ├── pages/      # Login, Dashboard и др.
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── package.json
```

### Целевая структура (рефакторинг и масштабирование)
```
family_budget_project/
├── backend/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── expenses/
│   │   │   ├── expenses.routes.js
│   │   │   ├── expenses.controller.js
│   │   │   └── expenses.service.js
│   │   ├── incomes/
│   │   │   ├── incomes.routes.js
│   │   │   ├── incomes.controller.js
│   │   │   └── incomes.service.js
│   │   └── ai/
│   │       ├── agents/
│   │       │   └── budget-analyst.agent.js   # (planned)
│   │       └── chains/                        # LangChain chains (planned)
│   ├── shared/
│   │   ├── middleware/   # JWT, error handler
│   │   └── utils/
│   ├── config/
│   │   └── db.js
│   └── index.js
├── front-end/
│   └── web/
│       ├── src/
│       │   ├── modules/      # По доменам: auth, budget, ai
│       │   ├── shared/       # Общие компоненты, хуки
│       │   ├── App.jsx
│       │   └── main.jsx
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── CLAUDE.md
```

---

## Commands (Ubuntu / WSL2)

> Все команды выполняются в терминале WSL2. Проект примонтирован по пути `/mnt/c/Users/mehra/family_budget_project_dev`.

```bash
# Backend
cd backend && npm install
npm run dev          # nodemon index.js

# Frontend
cd front-end/web && npm install
npm run dev          # vite / react-scripts

# PostgreSQL (локально)
psql -U postgres -d family_budget
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /register | ❌ | Регистрация |
| POST | /login | ❌ | Авторизация, возвращает JWT |
| GET | /api/expenses | ✅ | Получить все расходы |
| POST | /api/expenses | ✅ | Добавить расход |
| GET | /api/incomes | ✅ | Получить все доходы |
| POST | /api/incomes | ✅ | Добавить доход |

Все `/api/*` роуты защищены JWT middleware.

---

## Architecture Rules

### Модульность
- Каждый домен (auth, expenses, incomes, ai) — отдельная папка со своими routes / controller / service
- **Controller** — только принимает запрос и возвращает ответ, без бизнес-логики
- **Service** — вся бизнес-логика и работа с БД
- Новая фича = новый модуль, не расширение существующего

### Код
- Чистый, читаемый код с понятными именами
- Async/await везде, никаких колбэков
- Обработка ошибок через централизованный error handler middleware
- Переменные окружения только через `config/`, никогда хардкодом

### База данных
- Не менять схему БД без явного запроса
- Новые таблицы/миграции — отдельным файлом в `db/migrations/`

### Безопасность
- Никогда не трогать `.env`
- JWT токен всегда проверяется через middleware, не в контроллере

---

## AI Module (Planned)

Планируется интеграция LangChain + OpenAI для добавления AI-агентов.

### Budget Analyst Agent (в разработке)
- Анализирует расходы и доходы пользователя
- Даёт рекомендации по бюджету
- Находится в `backend/modules/ai/agents/budget-analyst.agent.js`

### Правила для AI модуля
- AI логика полностью изолирована в `modules/ai/`
- Агенты не обращаются к БД напрямую — только через сервисы других модулей
- LangChain chains — в `modules/ai/chains/`
- Не смешивать AI код с бизнес-логикой других модулей

---

## DevOps (Planned)

### Docker
```bash
docker-compose up --build    # Поднять всё (backend + frontend + postgres)
docker-compose down          # Остановить
```

Планируется:
- `Dockerfile` для backend (Node.js)
- `Dockerfile` для frontend (Nginx + React build)
- `docker-compose.yml` с сервисами: backend, frontend, postgres

### CI/CD — GitHub Actions
Pipeline при push в `dev` и `main`:
1. **Lint** — ESLint проверка
2. **Test** — запуск тестов
3. **Build** — сборка Docker образов
4. **Deploy** — деплой на сервер (EC2 / VPS)

---

## Environment Variables

```env
# backend/.env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/family_budget
JWT_SECRET=your_secret_key
OPENAI_API_KEY=             # для AI агентов (planned)
```
