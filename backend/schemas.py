from pydantic import BaseModel
from typing import Optional

# 1. Definición base: lo que siempre tiene una receta
class RecipeBase(BaseModel):
    titulo: str
    ingredientes: str
    descripcion: Optional[str] = None
    tiempo_coccion: Optional[int] = None  # En minutos

# 2. Esquema para CREAR: Es igual al base
class RecipeCreate(RecipeBase):
    pass

# 3. Esquema para RESPONDER: Lo que el Frontend va a recibir
class Recipe(RecipeBase):
    id: int

    class Config:
        # Esto permite que Pydantic lea modelos de SQLAlchemy
        # (objetos) como si fueran diccionarios.
        from_attributes = True