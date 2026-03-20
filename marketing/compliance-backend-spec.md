# Backend Integration Spec (Compliance)

## 1) Блокировка отправки без согласия
- Фронт отправляет событие только при `consent=true`.
- Бэкенд валидирует поле `consent` повторно; при `false` возвращает `400`.

## 2) Логирование цифровых следов
Реализовать endpoint:
- `POST /api/consent-log`

Тело:
```json
{
  "event": "form_submit|whatsapp_click",
  "ts": "2026-03-12T12:00:00.000Z",
  "page": "/katarakta-almaty/",
  "referrer": "https://google.com/...",
  "target": "https://wa.me/77008880180"
}
```

Сервер сохраняет:
- `ip_address` (из request)
- `user_agent`
- `event_type`
- `event_time_utc`
- `source_page`
- `referrer`
- `target`
- `consent_version`

## 3) Разделение WhatsApp и меддокументов
- WhatsApp используется только для записи и организационных вопросов.
- Для меддокументов/жалоб интегрировать сертифицированную МИС (авторизация + аудит).
- Минимум: отдельная кнопка/маршрут `Передать медицинские документы` → МИС.

## 4) HTTPS
- На уровне reverse proxy включить redirect `http -> https` (301).
- Включить HSTS: `Strict-Transport-Security`.
- Убедиться, что все внутренние ссылки и canonical — `https`.

