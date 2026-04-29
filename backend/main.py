from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # IMPORTANTE
from sqlalchemy.orm import Session
from typing import List
import schemas
import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
# 1. Agrega esto PRIMERO para dar permisos a tu HTML
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Permite todos los headers
)

# 2. La ruta que probaste recién
@app.get("/")
def home():
    return {"message": "API del Recetario funcionando correctamente"}

# 3. La ruta que necesita el index.html
@app.get("/recipes/")
def get_recipes(db: Session = Depends(database.get_db)):
    return db.query(models.Recipe).all()

@app.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    # FastAPI ya validó que 'recipe' traiga título e ingredientes
    new_recipe = models.Recipe(**recipe.model_dump())
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe

@app.get("/recipes/", response_model=List[schemas.Recipe])
def get_recipes(db: Session = Depends(get_db)):
    return db.query(models.Recipe).all()

@app.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(database.get_db)):
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    db.delete(db_recipe)
    db.commit()
    return {"message": "Receta eliminada"}