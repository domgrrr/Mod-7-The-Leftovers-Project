from app.models import db, Grocery, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_grocery_lists():
    #seeder for the grocery_lists table
    grocery_lists = [
        Grocery(
            user_id=1,
            name="Pantry",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=1,
            name="Freezer",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=1,
            name="Fridge",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=1,
            name="Holiday",
            date=datetime.strptime("2024-12-23", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=2,
            name="Pantry",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=2,
            name="Freezer",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=2,
            name="Fridge",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=2,
            name="Holiday",
            date=datetime.strptime("2024-12-23", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=3,
            name="Pantry",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=3,
            name="Freezer",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=3,
            name="Fridge",
            date=datetime.strptime("2024-12-01", "%Y-%m-%d").date(),
            completed=False
        ),
        Grocery(
            user_id=3,
            name="Holiday",
            date=datetime.strptime("2024-12-23", "%Y-%m-%d").date(),
            completed=False
        )
    ]
    db.session.add_all(grocery_lists)
    
    db.session.commit()

def undo_grocery_lists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.grocery_lists RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM grocery_lists"))
        
    db.session.commit()