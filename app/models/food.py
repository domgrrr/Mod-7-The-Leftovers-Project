from .db import db, environment, SCHEMA, add_prefix_for_prod

class Food(db.Model):
    __tablename__ = 'foods'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    type = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    alias_bool = db.Column(db.Boolean, nullable=False)
    alias_id = db.Column(db.Integer)
