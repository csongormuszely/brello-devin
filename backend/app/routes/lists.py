from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.list import List
from app.models.board import Board
from app.models.user import User
from app.auth.jwt import verify_token

router = APIRouter()

@router.post("/{board_id}")
def create_list(board_id: int, title: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    new_list = List(title=title, board_id=board_id)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list

@router.get("/{board_id}")
def get_lists(board_id: int, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    lists = db.query(List).filter(List.board_id == board_id).all()
    return lists

@router.put("/{list_id}")
def update_list(list_id: int, title: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    list_item = db.query(List).join(Board).filter(List.id == list_id, Board.owner_id == current_user.id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List not found")
    list_item.title = title
    db.commit()
    db.refresh(list_item)
    return list_item

@router.delete("/{list_id}")
def delete_list(list_id: int, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    list_item = db.query(List).join(Board).filter(List.id == list_id, Board.owner_id == current_user.id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List not found")
    db.delete(list_item)
    db.commit()
    return {"message": "List deleted successfully"}
