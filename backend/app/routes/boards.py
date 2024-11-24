from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.board import Board
from app.models.user import User
from app.auth.jwt import verify_token

router = APIRouter()

@router.post("/")
def create_board(title: str, background_color: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    new_board = Board(title=title, background_color=background_color, owner_id=current_user.id)
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.get("/")
def get_boards(current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    boards = db.query(Board).filter(
        or_(
            Board.owner_id == current_user.id,
            Board.shared_users.any(id=current_user.id)
        )
    ).all()
    return boards

@router.get("/{board_id}")
def get_board(board_id: int, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    board = db.query(Board).filter(
        Board.id == board_id,
        or_(
            Board.owner_id == current_user.id,
            Board.shared_users.any(id=current_user.id)
        )
    ).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board

@router.put("/{board_id}")
def update_board(board_id: int, title: str, background_color: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    board.title = title
    board.background_color = background_color
    db.commit()
    db.refresh(board)
    return board

@router.delete("/{board_id}")
def delete_board(board_id: int, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(board)
    db.commit()
    return {"message": "Board deleted successfully"}

@router.post("/{board_id}/share")
def share_board(board_id: int, email: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    user_to_share = db.query(User).filter(User.email == email).first()
    if not user_to_share:
        raise HTTPException(status_code=404, detail="User not found")

    if user_to_share.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot share board with yourself")

    if user_to_share in board.shared_users:
        raise HTTPException(status_code=400, detail="Board already shared with this user")

    board.shared_users.append(user_to_share)
    db.commit()
    return {"message": "Board shared successfully"}
