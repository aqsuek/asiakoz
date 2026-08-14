# AsiaKoz admin

Жабық панель: кім сайтқа кірді, қай бетке өтті, WhatsApp / қоңырау батырмасын басты ма. Жаңалықтар мен vlog басқару.

GitHub Pages-та жұмыс істемейді — жеке Next.js қосымша (`localhost:3001` немесе Vercel).

## Іске қосу

```bash
cd asiakoz-admin
cp .env.example .env.local
# ADMIN_PASSWORD мен TRACK_SECRET-ті өзгертіңіз
npm install
npm run dev
```

Ашыңыз: http://localhost:3001  
Әдепкі құпиясөз: `asiakoz` (`.env.local` арқылы өзгертіңіз).

## Сайтты қосу

`asiakoz-homepage/.env.local`:

```
VITE_ANALYTICS_ENDPOINT=http://localhost:3001/api/events
VITE_ANALYTICS_SECRET=change-me-too
```

Сосын лендингті `npm run dev` немесе `deploy:*` арқылы жинаңыз. Live үшін endpoint-ті Vercel URL-ге ауыстырыңыз.

## Жаңалықтар / vlog

1. http://localhost:3001/news — жаңа жазба қосыңыз (RU/KZ мәтін, мұқаба, YouTube vlog).
2. Статусын **Жарияланған** етіңіз.
3. **Сайтқа экспорт** батырмасын басыңыз — `asiakoz-homepage/public/data/posts.json` жаңартылады.
4. Сайтты deploy етіңіз — `/news/` бетінде көрінеді.

Оқиғалар `asiakoz-admin/data/events.json` файлына жазылады (git-ке кірмейді). Жазбалар — `data/posts.json`. Vercel-де файл сақталмайды — кейін база керек.
