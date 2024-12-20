from app.models import db, Food, environment, SCHEMA
from sqlalchemy.sql import text

def seed_foods():
    # for i in food_array:
        # food_item = Food(
            # dependent on food array
        # )
        # db.session.add(food_item)
    apple = Food (
        name='apple', type='fruit', image_url='https://i.ibb.co/ZMwV2mV/apple-1834639-1280.jpg', alias_boolean=False, alias_id=None
    )
    db.session.add(apple)
    db.session.commit()

def undo_foods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.foods RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM containers"))
        
    db.session.commit()