from app.models import db, Container_Food, Recipe_Food, Grocery_Food, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_container_foods():
    foods = [
        Container_Food( container_id=1, food_id=55, amount='5', expiration=None ),
        Container_Food( container_id=1, food_id=63, amount='2', expiration=None ),
        Container_Food( container_id=1, food_id=153, amount='15 oz', expiration=None ),
        Container_Food( container_id=1, food_id=154, amount='10 oz', expiration=None ),
        Container_Food( container_id=1, food_id=158, amount='1.5 lbs', expiration=None ),
        Container_Food( container_id=2, food_id=151, amount='1 gallon', expiration=datetime.strptime("2025-01-12", "%Y-%m-%d").date() ),
        Container_Food( container_id=2, food_id=7, amount='1 lb', expiration=None ),
        Container_Food( container_id=2, food_id=77, amount='2', expiration=None ),
        Container_Food( container_id=3, food_id=14, amount='2', expiration=None )
    ]
    db.session.add_all(foods)
    db.session.commit()

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

def seed_grocery_foods():
    foods =[
        Grocery_Food( grocery_id=1, food_id=34, amount=None, purchased=False )
    ]
    db.session.add_all(foods)
    db.session.commit()

def undo_container_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.container_foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM container_foods"))
        
    db.session.commit()

def undo_recipe_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipe_foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM recipe_foods"))
        
    db.session.commit()

def undo_grocery_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.grocery_foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM grocery_foods"))
        
    db.session.commit()