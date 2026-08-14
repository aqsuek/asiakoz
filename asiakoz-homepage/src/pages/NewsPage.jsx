import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { useLang } from "../i18n/LanguageContext";
import { formatPostDate, loadPosts, pickPostText } from "../lib/posts";
import { homeUrl, newsArticleUrl, newsUrl } from "../lib/routes";

function PostCard({ post, lang, t }) {
  const text = pickPostText(post, lang);
  const date = formatPostDate(post.publishedAt, lang);

  return (
    <a
      href={newsArticleUrl(post.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-ink/[0.06] bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        {post.cover ? (
          <img src={post.cover} alt={text.title} className="h-full w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-soft to-white text-brand">
            <Icon name={post.type === "vlog" ? "sparkles" : "globe"} className="h-10 w-10 opacity-70" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-deep">
          {post.type === "vlog" ? t.news.vlog : t.news.news}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {date ? <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{date}</p> : null}
        <h2 className="mt-2 font-display text-lg font-extrabold leading-snug text-ink">{text.title}</h2>
        {text.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{text.excerpt}</p> : null}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand">
          {t.news.readMore}
          <Icon name="chevronRight" className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const { lang, t } = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPosts(true).then((items) => {
      setPosts(items);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    document.title = t.news.seoTitle;
  }, [t.news.seoTitle]);

  return (
    <section className="pb-16 pt-6 sm:pb-20 sm:pt-8">
      <div className="section-container">
        <a href={homeUrl()} className="btn-ghost !px-0">
          <Icon name="chevronLeft" className="h-4 w-4" />
          {t.news.backHome}
        </a>

        <div className="mt-5 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">{t.news.eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.news.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{t.news.subtitle}</p>
        </div>

        {loading ? (
          <p className="mt-10 text-ink-muted">{t.news.loading}</p>
        ) : posts.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} lang={lang} t={t} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.25rem] border border-dashed border-ink/[0.12] bg-white p-10 text-center">
            <p className="text-ink-muted">{t.news.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
