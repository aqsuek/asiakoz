from pathlib import Path
root = Path(__file__).resolve().parent.parent
page = root / "glaznaya-klinika-almaty/index.html"
text = page.read_text()
section = """<section id="rekvizity" class="section">
<h2>Лицензия и реквизиты</h2>
<p>ТОО «ASIA KOZ», БИН 231040028960. Государственная лицензия на медицинскую деятельность 23027526 от 20.12.2023.</p>
<p>Выдана РГУ «Департамент Комитета медицинского и фармацевтического контроля Министерства здравоохранения Республики Казахстан по городу Алматы».</p>
<p>Приложение 002 от 12.01.2024: офтальмология. Адрес медицинской деятельности: Алматы, проспект Райымбека, 176А.</p>
<p><a class="link" href="https://elicense.kz/Licenses/Details/adf856f6-be1e-4104-9c7b-034e22179528" target="_blank" rel="noopener noreferrer">Проверить лицензию в eLicense</a></p>
</section>
"""
if 'id="rekvizity"' not in text:
    assert "<footer" in text
    page.write_text(text.replace("<footer", section + "<footer", 1))
