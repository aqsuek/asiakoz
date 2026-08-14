import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { useLang } from "../i18n/LanguageContext";
import { formatPostDate, getPostBySlug, pickPostText, youtubeEmbedUrl } from "../lib/posts";
import { newsUrl } from "../lib/routes";

function Body({ text }) {
  if (!text) return null;
  return (
    <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-muted">
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>{para.trim()}</p>
      ))}
    </div>
  );
}

export default function NewsArticlePage({ slug }) {
  const { lang, t } = useLang();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getPostBySlug(slug).then((item) => {
      setPost(item);
      setLoading(false);
    });
  }, [slug]);

  const text = post ? pickPostText(post, lang) : null;
  const embed = post?.videoUrl ? youtubeEmbedUrl(post.videoUrl) : null;

  useEffect(() => {
    if (!text?.title) return undefined;
    const prev = document.title;
    document.title = `${text.title} — AsiaKoz`;
    return () => {
      document.title = prev;
    };
  }, [text?.title]);

  if (loading) {
    return (
      <section className="section-container py-20">
        <p className="text-ink-muted">{t.news.loading}</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="section-container py-20 text-center">
        <h1 className="section-title">{t.news.notFound}</h1>
        <a href={newsUrl()} className="btn-primary mt-6 inline-flex">
          {t.news.backList}
        </a>
      </section>
    );
  }

  return (
    <section className="pb-16 pt-6 sm:pb-20 sm:pt-8">
      <div className="section-container">
        <a href={newsUrl()} className="btn-ghost !px-0">
          <Icon name="chevronLeft" className="h-4 w-4" />
          {t.news.backList}
        </a>

        <article className="mx-auto mt-5 max-w-3xl overflow-hidden rounded-[1.75rem] border border-ink/[0.06] bg-white shadow-card">
          {post.cover ? (
            <div className="aspect-[16/9] overflow-hidden bg-surface-muted">
              <img src={post.cover} alt={text.title} className="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-deep">
                {post.type === "vlog" ? t.news.vlog : t.news.news}
              </span>
              {post.publishedAt ? (
                <span className="text-sm text-ink-muted">{formatPostDate(post.publishedAt, lang)}</span>
              ) : null}
            </div>

            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{text.title}</h1>
            {text.excerpt ? <p className="mt-3 text-base leading-relaxed text-ink-muted">{text.excerpt}</p> : null}

            {embed ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-ink/[0.06] bg-black aspect-video">
                <iframe
                  title={text.title}
                  src={embed}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}

            <Body text={text.body} />
          </div>
        </article>
      </div>
    </section>
  );
}
