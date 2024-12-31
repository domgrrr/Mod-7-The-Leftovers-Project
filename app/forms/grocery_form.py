from flask_wtf import FlaskForm
from wtforms import StringField, DateField, FieldList, FormField, BooleanField, IntegerField
from wtforms.validators import DataRequired, ValidationError, Optional
from your_app.models import FoodItem, Recipe  # Assuming you have FoodItem and Recipe models

# Sub-form for individual grocery list items
class GroceryItemForm(FlaskForm):
    food_id = IntegerField("Food ID", validators=[DataRequired()])
    quantity = StringField("Quantity", validators=[DataRequired(message="Quantity is required.")])
    purchased = BooleanField("Purchased", default=False)

    # Validation to ensure food_id exists in the FoodItem table
    def validate_food_id(self, field):
        food_item = FoodItem.query.get(field.data)
        if not food_item:
            raise ValidationError(f"Food ID {field.data} does not exist in the database.")

# Main form for creating a grocery list
class GroceryForm(FlaskForm):
    name = StringField("List Name", validators=[DataRequired(message="List name is required.")])
    date = DateField("Date", validators=[Optional()])  # Date of the grocery list
    completed = BooleanField("Completed", default=False)  # If the grocery list is completed
    items = FieldList(FormField(GroceryItemForm), min_entries=1)  # List of grocery items

    # Field to add items to the grocery list from a recipe
    recipe_id = IntegerField("Recipe ID", validators=[Optional()])

    # Validation to ensure recipe_id exists if provided
    def validate_recipe_id(self, field):
        if field.data:  # Only validate if a recipe_id is provided
            recipe = Recipe.query.get(field.data)
            if not recipe:
                raise ValidationError(f"Recipe ID {field.data} does not exist in the database.")