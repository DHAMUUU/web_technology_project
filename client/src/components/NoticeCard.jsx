import { Link } from 'react-router-dom';
export function PriorityBadge({ priority }) { return <span className={`badge priority-${priority?.toLowerCase()}`}>{priority}</span>; }
export function NoticeCard({ notice }) { return <Link className="notice-card" to={`/notices/${notice._id}`}>
  <div className="d-flex justify-content-between align-items-center mb-3"><span className="category-label">{notice.category}</span><PriorityBadge priority={notice.priority}/></div>
  <h3>{notice.isPinned && <span className="pin">◆ </span>}{notice.title}</h3><p>{notice.description}</p>
  <div className="notice-meta"><span>{notice.postedBy?.name || 'Campus administration'}</span><span>{new Date(notice.createdAt).toLocaleDateString()}</span></div>
</Link>; }
