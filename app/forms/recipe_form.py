from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField # or DynamicSelectField
from wtforms.validators import DataRequired, ValidationError
from app.models import Recipe, Recipe_Food

class RecipeForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    directions = TextAreaField('directions', validators=[DataRequired()])
    image_url = StringField('image_url')

class RecipeFood(FlaskForm):
    name = SelectField('name') #need to validate this? Dynamic?
    amount = StringField('amount') #data normalization?
    