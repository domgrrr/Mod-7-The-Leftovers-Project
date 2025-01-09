from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    # nickname = db.Column(db.String)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    container = db.relationship(
        'Container', 
        back_populates='users', 
        cascade="all, delete-orphan", 
        primaryjoin="User.id == Container.user_id"
    )
    grocery = db.relationship(
        'Grocery', 
        back_populates='users', 
        cascade="all, delete-orphan", 
        primaryjoin="User.id == Grocery.user_id"
    )
    recipe = db.relationship(
        'Recipe', 
        back_populates='users', 
        cascade="all, delete-orphan", 
        primaryjoin="User.id == Recipe.user_id"
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
