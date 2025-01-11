from app.models import db, Recipe_Food, environment, SCHEMA
from sqlalchemy.sql import text

def seed_recipe_foods():
    foods = [
        Recipe_Food( recipe_id=1, food_id=22, amount='1 can' ),
        Recipe_Food( recipe_id=1, food_id=21, amount='2' ),
        Recipe_Food( recipe_id=1, food_id=24, amount='2 cups' ),
        Recipe_Food( recipe_id=2, food_id=156, amount='3 cups' ),
        Recipe_Food( recipe_id=2, food_id=153, amount='1.5 cups' ),
        Recipe_Food( recipe_id=2, food_id=153, amount='1 cup' ),
        Recipe_Food( recipe_id=2, food_id=24, amount='1/2 cup' ),
        Recipe_Food( recipe_id=3, food_id=35, amount='2' ),
        Recipe_Food( recipe_id=3, food_id=78, amount='2' )
    ]
    db.session.add_all(foods)
    db.session.commit()

def undo_recipe_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipe_foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM recipe_foods"))
        
    db.session.commit()