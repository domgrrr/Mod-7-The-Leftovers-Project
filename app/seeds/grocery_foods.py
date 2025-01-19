from app.models import db, Grocery_Food, environment, SCHEMA
from sqlalchemy.sql import text

def seed_grocery_foods():
    foods =[
        Grocery_Food( grocery_id=1, food_id=34, amount=None, purchased=False )
    ]
    db.session.add_all(foods)
    db.session.commit()


def undo_grocery_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.grocery_list_foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM grocery_list_foods"))
        
    db.session.commit()