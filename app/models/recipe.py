# TODO: setup recipe table and recipe relation to food

from sqlalchemy.dialects.postgresql import JSON #using this to print out ingredients as an array
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Recipe(db.Model):
    __tablename__ = 'recipes' #dont forget to actually put tablename instead of table

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) #added
    name = db.Column(db.String(100), nullable=False) #added (name of recipe)
    directions = db.Column(db.Text, nullable=False)  
    image_url = db.Column(db.String, nullable=True)
    # private = db.Column(db.Boolean, nullable=False)  
    # ingredients = db.Column(JSON, nullable=False)  

    # def to_dict(self): #is this needed? 
    #     return {
    #         'id': self.id,
    #         'name': self.name,
    #         'directions': self.directions,
    #         'image_url': self.image_url,
    #         'ingredients': self.ingredients  
    #     }

class Recipe_Food(db.Model):
    __tablename__ = 'recipe_foods'

    if environment == "production":
        __container_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('foods.id'), nullable=False)
    amount = db.Column(db.String)
