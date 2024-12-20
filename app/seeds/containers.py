from app.models import db, Container, environment, SCHEMA
from sqlalchemy.sql import text

def seed_containers():
    for i in range(1, 4):
        pantry = Container(
            user_id=i, storage_type='pantry'
        )
        fridge = Container(
            user_id=i, storage_type='fridge'
        )
        freezer = Container(
            user_id=i, storage_type='freezer'
        )
        db.session.add(pantry)
        db.session.add(fridge)
        db.session.add(freezer)
    db.session.commit()

def undo_containers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.containers RESTART IDENTITY CASCADE;")
    else: 
        db.session.execute(text("DELETE FROM containers"))
        
    db.session.commit()