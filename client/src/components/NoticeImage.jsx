const fallbackImage = '/images/demo-notices/notice-fallback.svg';

export default function NoticeImage({ notice, className = '', loading = 'lazy' }) {
  const source = notice?.coverImage || fallbackImage;
  return <img
    className={className}
    src={source}
    alt={notice?.imageAlt || notice?.title || 'Campus notice artwork'}
    width="1200"
    height="675"
    loading={loading}
    onError={event => {
      if (event.currentTarget.src.endsWith('/notice-fallback.svg')) return;
      event.currentTarget.onerror = null;
      event.currentTarget.src = fallbackImage;
    }}
  />;
}
