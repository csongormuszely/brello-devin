from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from app.database import Base

board_user_association = Table(
    'board_user_association',
    Base.metadata,
    Column('board_id', Integer, ForeignKey('boards.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    background_color = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="boards")
    lists = relationship("List", back_populates="board", cascade="all, delete-orphan")
    shared_users = relationship("User", secondary=board_user_association, back_populates="shared_boards")
