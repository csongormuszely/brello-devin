# Main application file for the Brello backend
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import psycopg
from sqlalchemy.exc import IntegrityError
import jwt
from datetime import datetime, timedelta
from email.message import EmailMessage
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

# Email settings
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Models
# User model definition
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=False)
    boards = relationship("Board", back_populates="user")

# Board model definition
class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    background_color = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="boards")
    todo_lists = relationship("TodoList", back_populates="board", cascade="all, delete-orphan")

# TodoList model definition
class TodoList(Base):
    __tablename__ = "todo_lists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    board = relationship("Board", back_populates="todo_lists")
    tasks = relationship("Task", back_populates="todo_list", cascade="all, delete-orphan")

# Task model definition
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    todo_list_id = Column(Integer, ForeignKey("todo_lists.id"))
    todo_list = relationship("TodoList", back_populates="tasks")

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

class BoardCreate(BaseModel):
    title: str
    background_color: str

class BoardUpdate(BaseModel):
    title: str | None = None
    background_color: str | None = None

class BoardResponse(BaseModel):
    id: int
    title: str
    background_color: str
    user_id: int

class TodoListCreate(BaseModel):
    title: str

class TodoListUpdate(BaseModel):
    title: str

class TodoListResponse(BaseModel):
    id: int
    title: str
    board_id: int

class TaskCreate(BaseModel):
    title: str
    description: str | None = None

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    todo_list_id: int

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_confirmation_token(email: str):
    expiration = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(
        {"email": email, "exp": expiration},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def send_confirmation_email(email: str, token: str):
    message = EmailMessage()
    message.set_content(f"Click the link to confirm your email: http://localhost:8001/confirm/{token}")
    message["Subject"] = "Confirm your email"
    message["From"] = EMAIL_USERNAME
    message["To"] = email

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.send_message(message)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

# User creation endpoint
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password, is_active=False)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        token = generate_confirmation_token(user.email)
        background_tasks.add_task(send_confirmation_email, user.email, token)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    return db_user

# Email confirmation endpoint
@app.get("/confirm/{token}")
def confirm_email(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload["email"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Confirmation link has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=400, detail="Invalid confirmation link")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_active:
        return {"message": "Email already confirmed"}

    user.is_active = True
    db.commit()
    return {"message": "Email confirmed successfully"}

@app.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Board creation endpoint
@app.post("/boards", response_model=BoardResponse)
def create_board(board: BoardCreate, user_id: int, db: Session = Depends(get_db)):
    db_board = Board(**board.dict(), user_id=user_id)
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

@app.get("/boards/{board_id}", response_model=BoardResponse)
def read_board(board_id: int, db: Session = Depends(get_db)):
    db_board = db.query(Board).filter(Board.id == board_id).first()
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return db_board

@app.put("/boards/{board_id}", response_model=BoardResponse)
def update_board(board_id: int, board: BoardUpdate, db: Session = Depends(get_db)):
    db_board = db.query(Board).filter(Board.id == board_id).first()
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    update_data = board.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_board, key, value)
    db.commit()
    db.refresh(db_board)
    return db_board

@app.delete("/boards/{board_id}", response_model=dict)
def delete_board(board_id: int, db: Session = Depends(get_db)):
    db_board = db.query(Board).filter(Board.id == board_id).first()
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(db_board)
    db.commit()
    return {"message": "Board deleted successfully"}

# TodoList creation endpoint
@app.post("/boards/{board_id}/todo_lists", response_model=TodoListResponse)
def create_todo_list(board_id: int, todo_list: TodoListCreate, db: Session = Depends(get_db)):
    db_board = db.query(Board).filter(Board.id == board_id).first()
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    db_todo_list = TodoList(**todo_list.dict(), board_id=board_id)
    db.add(db_todo_list)
    db.commit()
    db.refresh(db_todo_list)
    return db_todo_list

@app.get("/todo_lists/{todo_list_id}", response_model=TodoListResponse)
def read_todo_list(todo_list_id: int, db: Session = Depends(get_db)):
    db_todo_list = db.query(TodoList).filter(TodoList.id == todo_list_id).first()
    if db_todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    return db_todo_list

@app.put("/todo_lists/{todo_list_id}", response_model=TodoListResponse)
def update_todo_list(todo_list_id: int, todo_list: TodoListUpdate, db: Session = Depends(get_db)):
    db_todo_list = db.query(TodoList).filter(TodoList.id == todo_list_id).first()
    if db_todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    update_data = todo_list.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_todo_list, key, value)
    db.commit()
    db.refresh(db_todo_list)
    return db_todo_list

@app.delete("/todo_lists/{todo_list_id}", response_model=dict)
def delete_todo_list(todo_list_id: int, db: Session = Depends(get_db)):
    db_todo_list = db.query(TodoList).filter(TodoList.id == todo_list_id).first()
    if db_todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    db.delete(db_todo_list)
    db.commit()
    return {"message": "Todo list deleted successfully"}

# Task creation endpoint
@app.post("/todo_lists/{todo_list_id}/tasks", response_model=TaskResponse)
def create_task(todo_list_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    db_todo_list = db.query(TodoList).filter(TodoList.id == todo_list_id).first()
    if db_todo_list is None:
        raise HTTPException(status_code=404, detail="Todo list not found")
    db_task = Task(**task.dict(), todo_list_id=todo_list_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    update_data = task.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", response_model=dict)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}
