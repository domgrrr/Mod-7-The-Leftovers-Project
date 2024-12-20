# TODO: setup recipe table and recipe relation to food

from sqlalchemy.dialects.postgresql import JSON #using this to print out ingredients as an array
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Recipe(db.Model):
    __tablename__ = 'recipes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) 
    directions = db.Column(db.Text, nullable=False)  
    image_url = db.Column(db.String, nullable=True)  
    ingredients = db.Column(JSON, nullable=False)  

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'directions': self.directions,
            'image_url': self.image_url,
            'ingredients': self.ingredients  
        }
