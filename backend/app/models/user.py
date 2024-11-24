from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_confirmed = Column(Boolean, default=False)
    confirmation_token = Column(String, unique=True, nullable=True)

    boards = relationship("Board", back_populates="owner")
