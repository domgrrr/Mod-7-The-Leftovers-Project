from .db import db, environment, SCHEMA, add_prefix_for_prod

class Grocery_Food(db.Model):
    __tablename__ = 'grocery_list_foods'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    grocery_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('grocery_lists.id')), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    amount = db.Column(db.String)
    purchased = db.Column(db.Boolean, nullable=False)