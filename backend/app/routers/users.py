from fastapi import APIRouter, Depends

from app.deps import get_current_user
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    """受保护接口示例：返回当前登录用户。"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "created_at": current_user.created_at,
    }
