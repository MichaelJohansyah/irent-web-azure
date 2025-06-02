# WAJIB BACA KALAU MAU RUN PROJECT

This project is a starter kit using **Laravel** (backend) and **React** (frontend) with **Inertia.js** and **Vite**.  
It supports authentication, MySQL database, and is ready for local development on Windows (with or without Laragon).

---

## Requirements

- [PHP 8.2+](https://www.php.net/downloads.php)
- [Composer](https://getcomposer.org/)
- [Node.js & npm](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) (easiest with [Laragon](https://laragon.org/) or [XAMPP](https://www.apachefriends.org/))
- (Optional) [Git](https://git-scm.com/)

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

## 2. Install Dependencies

**Backend (Laravel):**
```bash
composer install
```

**Frontend (React/Vite):**
```bash
npm install
```

---

## 3. Environment Setup

- Copy `.env.example` to `.env` if `.env` does not exist:
  ```bash
  cp .env.example .env
  ```
  On Windows, use:
  ```powershell
  copy .env.example .env
  ```

- Generate Laravel app key:
  ```bash
  php artisan key:generate
  ```

---

## 4. Database Setup

- Make sure MySQL is running (start Laragon/XAMPP if using).
- Create a database (e.g., `my_database`) using phpMyAdmin or MySQL CLI.
- Edit `.env` and set:
  ```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=my_database
  DB_USERNAME=root
  DB_PASSWORD=
  ```
  *(Adjust `DB_USERNAME` and `DB_PASSWORD` if needed.)*

- Run migrations to create tables:
  ```bash
  php artisan migrate
  ```

---

## 5. Running the Project

**Start Laravel backend:**
```bash
php artisan serve
```
- The backend will be available at [http://localhost:8000](http://localhost:8000).

**Start React frontend (Vite):**
```bash
npm run dev
```
- The frontend will be available at the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

- Jangan lupa dua command ini harus dijalankan sama-sama di terminal yang berbeda ya.
---

## 6. Authentication

- Visit `/register` to create a new account.
- Visit `/login` to log in.
- Email verification and password reset are supported.

---

## 7. Useful Commands

- **Run tests:**  
  ```bash
  php artisan test
  ```
- **Format code:**  
  ```bash
  npm run format
  ```
- **Lint frontend:**  
  ```bash
  npm run lint
  ```

---

## 8. Troubleshooting

- **Database errors?**  
  Make sure MySQL is running and `.env` settings are correct.
- **Port conflicts?**  
  Change the port in `.env` or use `php artisan serve --port=8080`.
- **Node/npm errors?**  
  Make sure you have Node.js 18+ and run `npm install` again.

---

## 9. Contributing

- Fork the repo, create a new branch, and submit a pull request.
- Please run tests and lint before submitting.

---

## 10. Additional Notes

- You do **not** need to move the project to Laragon’s `www` folder.  
  Just make sure MySQL is running.
- If you want to use Laragon’s pretty URLs, you can move the project to `C:\laragon\www\your-repo-name`.

---

## 11. Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Laragon Documentation](https://laragon.org/docs.html)

---

Happy coding!