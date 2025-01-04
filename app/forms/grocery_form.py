from flask_wtf import FlaskForm  # Importing FlaskForm for creating WTForms.
from wtforms import (
    StringField,
    DateField,
    FieldList,
    FormField,
    BooleanField,
    IntegerField,
)  # Importing various field types.
from wtforms.validators import DataRequired, ValidationError, Optional, NumberRange  # Importing validators.
from app.models import Food, Recipe  # Assuming Food and Recipe models exist in your app.

# Sub-form for individual grocery list items.
class GroceryItemForm(FlaskForm):
    food_id = IntegerField(
        "Food ID",
        validators=[
            DataRequired(message="Food ID is required."),
            NumberRange(min=1, message="Food ID must be a positive integer."),
        ],
    )
    quantity = StringField(
        "Quantity", 
        validators=[DataRequired(message="Quantity is required.")],
    )
    purchased = BooleanField("Purchased", default=False)

    # Custom validator to ensure the provided food_id exists in the Food table.
    def validate_food_id(self, field):
        print(f"Validating food_id: {field.data}")  # Log the food_id being validated.
        food_item = Food.query.get(field.data)
        if not food_item:
            error_message = f"Food ID {field.data} does not exist in the database."
            print(f"ValidationError: {error_message}")  # Log the validation error.
            raise ValidationError(error_message)

# Main form for creating a grocery list.
class GroceryForm(FlaskForm):
    name = StringField(
        "List Name",
        validators=[DataRequired(message="List name is required.")],
    )
    date = DateField(
        "Date", 
        validators=[Optional()],  # This field is optional.
    )
    completed = BooleanField("Completed", default=False)  # Tracks if the list is completed.
    items = FieldList(
        FormField(GroceryItemForm), 
        min_entries=1,  # Requires at least one item in the grocery list.
    )

    recipe_id = IntegerField(
        "Recipe ID",
        validators=[
            Optional(),  # This field is optional.
            NumberRange(min=1, message="Recipe ID must be a positive integer."),
        ],
    )

    # Custom validator to ensure the provided recipe_id exists in the Recipe table.
    def validate_recipe_id(self, field):
        if field.data:  # Only validate if a recipe_id is provided.
            print(f"Validating recipe_id: {field.data}")  # Log the recipe_id being validated.
            recipe = Recipe.query.get(field.data)
            if not recipe:
                error_message = f"Recipe ID {field.data} does not exist in the database."
                print(f"ValidationError: {error_message}")  # Log the validation error.
                raise ValidationError(error_message)

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
