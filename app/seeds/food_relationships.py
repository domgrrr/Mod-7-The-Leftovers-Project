from app.models import db, Container_Food, environment, SCHEMA
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

# def seed_recipe_foods():

def undo_container_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.container_foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM container_foods"))
        
    db.session.commit()