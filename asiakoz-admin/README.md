# AsiaKoz admin (GitHub Pages)

Жабық панель GitHub Pages-та: **https://asiakoz.com/admin/**

Статистика, жаңалықтар/vlog — барлығы GitHub repo арқылы жұмыс істейді (Vercel керек емес).

## Кіру

1. Ашыңыз: https://asiakoz.com/admin/
2. **Құпиясөз** — `.env` build уақытындағы `VITE_ADMIN_PASSWORD` (әдепкі: `asiakoz`)
3. **GitHub token** — `repo` Contents write рұқсаты бар Personal Access Token

Token тек браузер сессиясында сақталады. Жазба сақтағанда GitHub-қа commit жіберіледі.

## Жергілікті дамыту

```bash
cd asiakoz-admin
cp .env.example .env.local
npm install
npm run dev
```

Локал: http://localhost:3001/admin/

## Deploy

```bash
cd asiakoz-admin
npm run deploy
# немесе
bash scripts/deploy-to-site.sh
```

Сосын repo-ға push — GitHub Pages жаңарады.

## Жаңалықтар

- `/admin/news` — жазба қосу/өңдеу
- «Сақтау» → `data/posts-admin.json` + `data/posts.json` GitHub-қа commit
- GitHub Action автоматты `/news/` shell-дерін жаңартады

## Статистика

Сайт оқиғалары `data/events.json` файлына жазылады (GitHub Action арқылы).

Homepage build-ке қосыңыз (`asiakoz-homepage/.env.local`):

```
VITE_GITHUB_DISPATCH_TOKEN=ghp_...   # repo + actions:write
VITE_GITHUB_REPO=aqsuek/asiakoz
```

Сосын homepage-ті deploy етіңіз.

## GitHub Secrets (Actions)

Analytics workflow үшін repo-да Actions іске қосулы болуы керек. Token сайт build-інде embedded — spam risk бар, token-ді ротациялаңыз.
