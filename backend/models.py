from sqlalchemy import Column, Integer, String, Text
from database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    ingredientes = Column(Text)
    descripcion = Column(Text)
    tiempo_coccion = Column(Integer, nullable=True)





