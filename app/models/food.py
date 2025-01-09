from .db import db, environment, SCHEMA, add_prefix_for_prod

class Food(db.Model):
    __tablename__ = 'foods'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    type = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)
    alias_bool = db.Column(db.Boolean, nullable=False)
    alias_id = db.Column(db.Integer, db.ForeignKey("foods.id"))

    container_food = db.relationship(
        'Container_Food', 
        back_populates='users', 
        cascade="all, delete-orphan", 
        primaryjoin="User.id == Container_Food.user_id"
    )
    grocery_food = db.relationship(
        'Grocery_Food', 
        back_populates='foods', 
        cascade="all, delete-orphan", 
        primaryjoin="Food.id == Grocery_Food.food_id"
    )
    recipe = db.relationship(
        'Recipe_Food', 
        back_populates='foods', 
        cascade="all, delete-orphan", 
        primaryjoin="Food.id == Recipe_Food.food_id"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type
        }
