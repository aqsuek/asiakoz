# Сайт AsiaKoz — с нуля (без Tilda)

Статичный сайт офтальмологического центра AsiaKoz. Только HTML и CSS, без конструкторов.

## Структура

```
asiakoz/
├── index.html        — главная страница
├── doctors.html      — страница «Наши врачи»
├── doctor-orel.html  — страница врача Орел Талип (Алматы)
├── doctor-erol.html  — страница врача Эрол Джошкун (филиал Актау)
├── uslugi.html       — услуги и операции (список с блоками «что мы делаем»)
├── images/
│   ├── logo-long.png   — длинный логотип (в шапке)
│   └── logo-square.png — квадратный логотип (фавикон)
├── css/
│   └── style.css     — общие стили
└── README.md
```

## Как открыть

1. **Локально:** открой в браузере файл `index.html` (двойной клик или «Open with»).
2. **Через сервер:** в папке `asiakoz` выполни:
   - `npx serve .` или
   - `python3 -m http.server 8000`
   затем открой в браузере `http://localhost:8000` (или указанный порт).

## Как выложить в интернет

- Залей папку `asiakoz` на любой хостинг (Netlify, GitHub Pages, Vercel Static, хостинг по FTP).
- Домен привяжи в настройках хостинга (например asiakoz.com).

### Автодеплой из GitHub (FTP)

В репозитории есть workflow **Deploy site (FTP)** (`.github/workflows/deploy.yml`): при каждом `push` в ветку `main` файлы синхронизируются на сервер по FTP.

1. На GitHub: **Settings → Secrets and variables → Actions → New repository secret** — создайте:
   - `FTP_SERVER` — адрес FTP (хост или IP)
   - `FTP_USERNAME` — логин
   - `FTP_PASSWORD` — пароль
2. Если после входа по FTP корень сайта не домашняя папка пользователя, в `deploy.yml` в параметре `server-dir` укажите путь (например `public_html/`).
3. Если хостинг требует FTPS — в том же файле поменяйте `protocol: ftp` на `ftps` (или `ftps-legacy`) и при необходимости порт.

Пока секреты не добавлены, workflow при push будет завершаться ошибкой подключения.

## Что можно править

- **Текст и контакты** — прямо в HTML-файлах.
- **Цвета и отступы** — в `css/style.css` и в `<style>` внутри страниц.
- **Фото** — замени ссылки `src` у тегов `<img>` на свои (со своего сервера или CDN).

## Ссылки

- Логотип и кнопка Instagram ведут на: https://www.instagram.com/asiakoz.clinic/
- WhatsApp: +7 707 687 01 80
- 2GIS (отзывы): https://2gis.kz/kk/almaty/firm/70000001081905733
