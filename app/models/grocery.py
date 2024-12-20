# TODO: setup grogery table and grocery relation to food
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Grocery(db.Model):
    __tablename__ = 'grocery_lists'

    if environment == "production":
        __grocery_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    name = db.Column(db.String(20), nullable=False)
    completed = db.Column(db.Boolean, nullable=False)