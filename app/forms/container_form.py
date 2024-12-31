from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, DateField, FieldList, FormField
from wtforms.validators import DataRequired, ValidationError, Optional
from app.models import Food  # Assuming the Food model is in app.models

# The FoodItemForm is a nested form used to add food items to the container
class FoodItemForm(FlaskForm):
    food_id = IntegerField("Food ID", validators=[DataRequired()])
    amount = StringField("Amount", validators=[DataRequired(message="Amount is required.")])
    expiration = DateField("Expiration Date", validators=[Optional()])  # Optional for non-perishable items

    # Validate the food_id against the database
    def validate_food_id(self, field):
        food_item = Food.query.get(field.data)
        if not food_item:
            raise ValidationError(f"Food ID {field.data} does not exist in the database.")

class ContainerForm(FlaskForm):
    user_id = IntegerField("User ID", validators=[DataRequired()])
    storage_type = StringField(
        "Storage Type", 
        validators=[DataRequired(message="Storage type is required.")]
    )
    # Add a list of food items to the container
    food_items = FieldList(FormField(FoodItemForm), min_entries=1, label="Food Items")

    submit = SubmitField("Submit")

    # Validate the storage type
    def validate_storage_type(self, field):
        valid_storage_types = ["fridge", "freezer", "pantry", "shelf"]
        if field.data.lower() not in valid_storage_types:
            raise ValidationError(
                f"Invalid storage type. Must be one of: {', '.join(valid_storage_types)}."
            )
