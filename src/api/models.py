from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class Users(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    surname: Mapped[str] = mapped_column(String(40))
    telephone: Mapped[str] = mapped_column(String(15), unique=True, nullable=False)
    NID: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    creation_date: Mapped[date] = mapped_column(Date(10), unique=True, nullable=False)
    avatar_url: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)



    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }