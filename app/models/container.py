from .db import db, environment, SCHEMA, add_prefix_for_prod

class Container(db.Model):
    __tablename__ = 'containers'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    storage_type = db.Column(db.String(12), nullable=False)

# TODO: Container_to_Food Model After Food Model Creation

