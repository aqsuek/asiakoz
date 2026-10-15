import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import photos from '../data/almatyPhotos.json';

export default function AlmatyPhotoGallery() {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const kk = lang !== 'ru';
  return <section id="clinic-photos" style={{padding:'64px 20px',background:'#f2f8f8'}}>
    <div style={{maxWidth:1200,margin:'0 auto'}}>
      <h2 style={{fontSize:'clamp(26px,4vw,38px)',marginBottom:12}}>{kk ? 'AsiaKoz Алматы фотогалереясы' : 'Фотогалерея AsiaKoz Алматы'}</h2>
      <p style={{marginBottom:28,color:'#466'}}>{kk ? 'Клиника қонақтары бөліскен фотолар.' : 'Фотографии, которыми поделились посетители клиники.'}</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14}}>
        {(expanded ? photos : photos.slice(0,8)).map((photo,i) => <a key={photo.src} href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`${kk ? 'Фотоны ашу' : 'Открыть фото'} ${i+1}`}>
          <img src={photo.src} alt={kk ? 'AsiaKoz Алматы клиникасының қонақтары' : 'Посетители клиники AsiaKoz в Алматы'} loading="lazy" decoding="async" width="240" height="310" style={{width:'100%',height:'auto',aspectRatio:'240/310',objectFit:'cover',borderRadius:16}} />
        </a>)}
      </div>
      <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} style={{display:'block',margin:'28px auto 0',padding:'14px 24px',borderRadius:12,border:'1px solid #008b91',background:'white',color:'#00676c',cursor:'pointer'}}>{expanded ? (kk ? 'Жинау' : 'Свернуть') : (kk ? `Барлық ${photos.length} фотоны көру` : `Показать все ${photos.length} фото`)}</button>
    </div>
  </section>;
}
