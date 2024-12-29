from app.models import db, Food, environment, SCHEMA
from sqlalchemy.sql import text
import csv

def seed_foods():
    with open(r"app/seeds/seeder_info/foods.csv", 'r') as file:
        reader = csv.reader(file)
        data = list(reader)
    for item in data:
        if item[3] == "True":
            al_bool = True
        else:
            al_bool = False
        food_item = Food(
            name=item[0],
            type=item[1],
            image_url=item[2],
            alias_bool=al_bool,
            alias_id=item[4]
        )
        db.session.add(food_item)
    db.session.commit()

def undo_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM foods"))
        
    db.session.commit()