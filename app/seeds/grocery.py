from app.models import db, Grocery, environment, SCHEMA
from sqlalchemy.sql import text

def seed_grocery_lists():
    #seeder for the grocery_lists table
    grocery_lists = [
        {
            "user_id": 1,
            "name": "Pantry",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 1,
            "name": "Freezer",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 1,
            "name": "Fridge",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 1,
            "name": "Holiday",
            "date": "2024-12-23",
            "completed": False
        },
        {
            "user_id": 2,
            "name": "Pantry",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 2,
            "name": "Freezer",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 2,
            "name": "Fridge",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 2,
            "name": "Holiday",
            "date": "2024-12-23",
            "completed": False
        },
        {
            "user_id": 3,
            "name": "Pantry",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 3,
            "name": "Freezer",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 3,
            "name": "Fridge",
            "date": "2024-12-01",
            "completed": False
        },
        {
            "user_id": 3,
            "name": "Holiday",
            "date": "2024-12-23",
            "completed": False
        }
    ]
    for grocery in grocery_lists:
        new_grocery = Grocery(**grocery)  # Unpack dictionary into model
        db.session.add(new_grocery)
    
    db.session.commit()

def undo_grocery_lists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groceery_lists RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM grocery_lists"))
        
    db.session.commit()