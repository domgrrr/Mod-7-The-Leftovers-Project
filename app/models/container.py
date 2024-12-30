from .db import db, environment, SCHEMA, add_prefix_for_prod

class Container(db.Model):
    __tablename__ = 'containers'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    storage_type = db.Column(db.String(12), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'storage_type': self.storage_type
        }

class Container_Food(db.Model):
    __tablename__ = 'container_foods'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    container_id = db.Column(db.Integer, db.ForeignKey('containers.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('foods.id'), nullable=False)
    amount = db.Column(db.String)
    expiration = db.Column(db.Date)

    def to_dict(self):
        return {
            "food_id": self.food_id
        }
