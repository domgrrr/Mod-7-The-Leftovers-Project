from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField, FieldList, FormField # or DynamicSelectField
from wtforms.validators import DataRequired, ValidationError
from app.models import Recipe, Recipe_Food

class RecipeFood(FlaskForm):
    food_id = IntegerField('food_id', validators=[DataRequired()]) #need to validate this? Did we wanna do this dynamic?
    recipe_id = IntegerField('recipe_id', validators=[DataRequired()]) #TODO: validate in recipe
    amount = StringField('amount', validators=[DataRequired()]) #data normalization?

#switched ittt bc it wasnt importing recipefood, go ahead and take a look at these changes
class RecipeForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    directions = TextAreaField('directions', validators=[DataRequired()])
    image_url = StringField('image_url')
    recipe_foods = FieldList(FormField(RecipeFood)) # handles list of ingredients for the recipe, need to validate this?
    #this is needed to avoid 500 issue i guess^?