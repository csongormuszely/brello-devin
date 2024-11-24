from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.models.list import List
from app.models.board import Board
from app.models.user import User
from app.auth.jwt import verify_token

router = APIRouter()

@router.post("/{list_id}")
def create_task(list_id: int, title: str, description: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    list_item = db.query(List).join(Board).filter(List.id == list_id, Board.owner_id == current_user.id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List not found")
    new_task = Task(title=title, description=description, list_id=list_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/{list_id}")
def get_tasks(list_id: int, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    list_item = db.query(List).join(Board).filter(List.id == list_id, Board.owner_id == current_user.id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List not found")
    tasks = db.query(Task).filter(Task.list_id == list_id).all()
    return tasks

@router.put("/{task_id}")
def update_task(task_id: int, title: str, description: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    task = db.query(Task).join(List, Board).filter(Task.id == task_id, Board.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.title = title
    task.description = description
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    task = db.query(Task).join(List, Board).filter(Task.id == task_id, Board.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

@router.put("/{task_id}/move")
def move_task(task_id: int, new_list_id: int, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    task = db.query(Task).join(List, Board).filter(Task.id == task_id, Board.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    new_list = db.query(List).join(Board).filter(List.id == new_list_id, Board.owner_id == current_user.id).first()
    if not new_list:
        raise HTTPException(status_code=404, detail="New list not found")
    task.list_id = new_list_id
    db.commit()
    db.refresh(task)
    return task
