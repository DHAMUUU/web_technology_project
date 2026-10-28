import { Link } from 'react-router-dom';
import { Bookmark, CalendarClock, Check, Pin } from 'lucide-react';
import NoticeImage from './NoticeImage';

export function PriorityBadge({ priority }) {
  const key = (priority || 'Normal').toLowerCase();
  return <span className={`priority-pill priority-${key}`}><i/>{priority || 'Normal'}</span>;
}

const categoryToken = category => (category || 'General').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function NoticeCard({ notice, onBookmark, onMarkRead, view = 'grid', bookmarkActionLabel, openLabel = 'View notice' }) {
  const publishedDate = notice.createdAt ? new Date(notice.createdAt) : null;
  const expiryDate = notice.expiryDate ? new Date(notice.expiryDate) : null;
  return <article className={`notice-card ${view === 'list' ? 'notice-card-list' : ''} ${notice.priority === 'High' ? 'notice-card-urgent' : ''}`}>
    <NoticeImage notice={notice} className="notice-card-image"/>
    <div className="notice-card-content">
      <div className="notice-card-top"><div className="notice-card-labels"><span className={`category-chip category-${categoryToken(notice.category)}`}>{notice.category || 'General'}</span>{notice.isDemo && <span className="demo-tag">Demo sample</span>}</div><div className="notice-card-actions">{!notice.isRead && onMarkRead && <span className="unread-tag">Unread</span>}{notice.isPinned && <span className="pin-tag"><Pin size={13}/>Pinned</span>}{onMarkRead && !notice.isRead && <button className="bookmark-button mark-read-button" aria-label="Mark notice as read" title="Mark as read" onClick={() => onMarkRead(notice)}><Check size={16}/></button>}{onBookmark && (bookmarkActionLabel ? <button className="bookmark-action-text" aria-label={bookmarkActionLabel} title={bookmarkActionLabel} onClick={() => onBookmark(notice)}><Bookmark size={13} fill="currentColor"/>{bookmarkActionLabel}</button> : <button className={`bookmark-button ${notice.isBookmarked ? 'is-bookmarked' : ''}`} aria-label={notice.isBookmarked ? 'Remove bookmark' : 'Bookmark notice'} title={notice.isBookmarked ? 'Remove bookmark' : 'Save for later'} aria-pressed={Boolean(notice.isBookmarked)} onClick={() => onBookmark(notice)}><Bookmark size={17} fill={notice.isBookmarked ? 'currentColor' : 'none'}/></button>)}</div></div>
      <Link className="notice-card-main" to={`/notices/${notice._id}`}><h3>{notice.title}</h3><p>{notice.summary || notice.description}</p><span className="notice-open-link">{openLabel}</span></Link>
      <div className="notice-card-bottom"><div className="notice-card-byline"><span className="mini-avatar">{(notice.issuingDepartment || notice.postedBy?.name || 'C')[0]?.toUpperCase()}</span><span>{notice.issuingDepartment || notice.postedBy?.name || 'Campus administration'}</span></div>{publishedDate && <span className="notice-date">Posted {publishedDate.toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span>}{expiryDate && <span className="notice-deadline"><CalendarClock size={12}/>Due {expiryDate.toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span>}<PriorityBadge priority={notice.priority}/></div>
    </div>
  </article>;
}
