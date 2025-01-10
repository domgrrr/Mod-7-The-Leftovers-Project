from .db import db, environment, SCHEMA, add_prefix_for_prod

class Container_Food(db.Model):
    __tablename__ = 'container_foods'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    container_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('containers.id')), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    amount = db.Column(db.String)
    expiration = db.Column(db.Date)

    def to_dict(self):
        return {
            "food_id": self.food_id
        }
