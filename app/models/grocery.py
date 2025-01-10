from .db import db, environment, SCHEMA, add_prefix_for_prod

class Grocery(db.Model):
    __tablename__ = 'grocery_lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    date = db.Column(db.Date, nullable=False)
    name = db.Column(db.String(20), nullable=False)
    completed = db.Column(db.Boolean, nullable=False)

    grocery_food = db.relationship(
        'Grocery_Food', 
        cascade="all, delete-orphan", 
        primaryjoin="Grocery.id == Grocery_Food.grocery_id"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date,
            'name': self.name,
            'completed': self.completed
        }

class Grocery_Food(db.Model):
    __tablename__ = 'grocery_list_foods'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    grocery_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('grocery_lists.id')), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    amount = db.Column(db.String)
    purchased = db.Column(db.Boolean, nullable=False)