# 💰 Family Budget Project

Full-stack приложение для управления семейным бюджетом с разделением по доходам и расходам, JWT-аутентификацией и PostgreSQL базой данных.

---

## 📦 Технологии

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Token)
- bcrypt
- dotenv

**Frontend:**
- React
- React Router
- Fetch API

**Dev Tools:**
- Documate (документация)
- ESLint
- Git + GitHub

---

## 🗂️ Структура проекта

```bash
family_budget_project/
├── backend/
│   ├── routes/             # API роуты (auth, incomes, expenses)
│   ├── controllers/        # Логика контроллеров
│   ├── middleware/         # Проверка токена, ошибки и т.д.
│   ├── db.js               # Настройка подключения к PostgreSQL
│   ├── index.js            # Точка входа для Express-сервера
│   ├── .env                # Конфиденциальные переменные
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # Страницы: Login, Dashboard и т.д.
│   │   ├── App.jsx         # Основной компонент с Router
│   │   └── main.jsx        # Точка входа React-приложения
│   └── package.json
└── README.md               # Этот файл
🚀 Установка и запуск:
1. Клонируй репозиторий
git-bash clone https://github.com/Emil4ik400/family_budget_project.git
cd family_budget_project

🧪 API Эндпоинты (Express)
Метод	Путь	Описание
POST	/login	Авторизация, получение JWT
POST	/register	Регистрация пользователя
GET	/api/expenses	Получение всех расходов
POST	/api/expenses	Добавить расход
GET	/api/incomes	Получение всех доходов
POST	/api/incomes	Добавить доход

⚠️ Некоторые эндпоинты защищены middleware с JWT проверкой

🧠 Документация
Документация проекта генерируется с помощью  Docuwriter и сохраняется в виде .md файлов в проекте. В будущем планируется интеграция Swagger или альтернатив.

⚙️ CI/CD (будет позже)
GitHub Actions: автоматизация тестов и деплой

Docker контейнеризация (в планах)

Хостинг: Heroku / Vercel / EC2 + RDS

📌 Автор
👨‍💻 Emil Mehraliyev

Стек: Node.js + React + PostgreSQL + AWS

📃 Лицензия
Этот проект предназначен для личного и учебного использования.