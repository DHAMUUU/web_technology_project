import { Link } from 'react-router-dom';
import { Bookmark, CalendarClock, Check, Pin } from 'lucide-react';

export function PriorityBadge({ priority }) {
  const key = (priority || 'Normal').toLowerCase();
  return <span className={`priority-pill priority-${key}`}><i/>{priority || 'Normal'}</span>;
}

export function NoticeCard({ notice, onBookmark, onMarkRead, view = 'grid' }) {
  return <article className={`notice-card ${view === 'list' ? 'notice-card-list' : ''} ${notice.priority === 'High' ? 'notice-card-urgent' : ''}`}>
    <div className="notice-card-top"><span className={`category-chip category-${notice.category?.toLowerCase()}`}>{notice.category || 'General'}</span><div className="notice-card-actions">{!notice.isRead && onMarkRead && <span className="unread-tag">Unread</span>}{notice.isPinned && <span className="pin-tag"><Pin size={13}/>Pinned</span>}{onMarkRead && !notice.isRead && <button className="bookmark-button mark-read-button" aria-label="Mark notice as read" title="Mark as read" onClick={() => onMarkRead(notice)}><Check size={16}/></button>}{onBookmark && <button className={`bookmark-button ${notice.isBookmarked ? 'is-bookmarked' : ''}`} aria-label={notice.isBookmarked ? 'Remove bookmark' : 'Bookmark notice'} aria-pressed={Boolean(notice.isBookmarked)} onClick={() => onBookmark(notice)}><Bookmark size={17} fill={notice.isBookmarked ? 'currentColor' : 'none'}/></button>}</div></div>
    <Link className="notice-card-main" to={`/notices/${notice._id}`}><h3>{notice.title}</h3><p>{notice.description}</p></Link>
    <div className="notice-card-bottom"><div className="notice-card-byline"><span className="mini-avatar">{notice.postedBy?.name?.[0]?.toUpperCase() || 'C'}</span><span>{notice.postedBy?.name || 'Campus administration'}</span></div><span className="notice-date">{notice.expiryDate ? <><CalendarClock size={13}/>{new Date(notice.expiryDate).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</> : new Date(notice.createdAt).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span><PriorityBadge priority={notice.priority}/></div>
  </article>;
}
