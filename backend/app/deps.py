from datetime import datetime

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Session as DBSession
from app.models import User


def get_current_user(
    session: str | None = Cookie(default=None, alias=settings.cookie_name),
    db: Session = Depends(get_db),
) -> User:
    if not session:
        raise HTTPException(status_code=401, detail="未登录")

    db_session = db.query(DBSession).filter(DBSession.id == session).first()
    if db_session is None or db_session.expires_at < datetime.now():
        raise HTTPException(status_code=401, detail="会话已过期，请重新登录")

    user = db_session.user
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="用户不可用")

    return user
