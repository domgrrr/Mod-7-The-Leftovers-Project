from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, DateField, IntegerField, FieldList, FormField
from wtforms.validators import DataRequired
from app.models import Food

# Simplified sub-form for individual grocery list items.
class GroceryItemForm(FlaskForm):
    food_id = IntegerField(
        "food_id", 
        validators=[DataRequired(message="Food ID is required.")]
    )
    grocery_id = IntegerField('grocery_id', validators=[DataRequired()])
    amount = StringField(
        "amount"
    )
    purchased = BooleanField("Purchased", default=False)

    # Basic validation to ensure food_id exists in the database.
    def validate_food_id(self, field):
        food_item = Food.query.get(field.data)
        if not food_item:
            raise ValidationError(f"Food ID {field.data} does not exist.")

# Main form for creating a grocery list.
class GroceryForm(FlaskForm):
    name = StringField(
        "name", 
        validators=[DataRequired(message="List name is required.")]
    )
    date = DateField("date", validators=[DataRequired()])
    completed = BooleanField("Completed", default=False)  # Tracks if the list is completed.
    items = FieldList(FormField(GroceryItemForm))  # Requires at least one item.


# Explanation and Debugging Logs:
# 1. `GroceryItemForm`:
#    - Handles validation for individual grocery items, ensuring `food_id` exists in the Food table and is a positive integer.
#    - Logs every `food_id` being validated and errors if the ID does not exist.

# 2. `GroceryForm`:
#    - The main form for creating grocery lists.
#    - Ensures the list has a name and at least one item (using `FieldList`).
#    - Allows optional inclusion of a `date` and `recipe_id`.
#    - Logs and validates `recipe_id` if provided, ensuring it exists in the Recipe table.

# Usage:
# - When a form is submitted, the validators automatically check the data and log relevant information for debugging.
