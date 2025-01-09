from .db import db, environment, SCHEMA, add_prefix_for_prod

class Container(db.Model):
    __tablename__ = 'containers'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    storage_type = db.Column(db.String(12), nullable=False)

    user = db.relationship('User', back_populates='containers')
    container_foods = db.relationship(
        'Container_Food', 
        back_populates='container', 
        cascade="all, delete-orphan", 
        primaryjoin="Container.id == Container_Food.container_id"
    )

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
    container_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('containers.id')), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('foods.id')), nullable=False)
    amount = db.Column(db.String)
    expiration = db.Column(db.Date)

    container = db.relationship('Container', back_populates='container_foods')
    food = db.relationship('Food', back_populates='container_foods')

    def to_dict(self):
        return {
            "food_id": self.food_id
        }
