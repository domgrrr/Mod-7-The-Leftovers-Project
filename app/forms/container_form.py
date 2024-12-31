from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, DateField, FieldList, FormField
from wtforms.validators import DataRequired, ValidationError, Optional

# the FoodItemForm is a nested form used to add food items to the container
class FoodItemForm(FlaskForm):
    food_id = IntegerField("Food ID", validators=[DataRequired()])
    amount = StringField("Amount", validators=[DataRequired(message="Amount is required.")])
    expiration = DateField("Expiration Date", validators=[Optional()])  # Optional for non-perishable items


class ContainerForm(FlaskForm):
    user_id = IntegerField("User ID", validators=[DataRequired()])
    storage_type = StringField(
        "Storage Type", 
        validators=[
            DataRequired(message="Storage type is required.")
        ]
    )
    # Add a list of food items to the container
    # min_entries=1 means that the list must have at least one item
    # food_items field in the ContainerForm is a FieldList of FormField(FoodItemForm)allowing users to add multiple food items to a single container
    food_items = FieldList(FormField(FoodItemForm), min_entries=1, label="Food Items")

    submit = SubmitField("Submit")

# validate_storage_type function checks if the storage type entered by the user is valid
# do we need to check food_id against the database?
    def validate_storage_type(self, field):
        valid_storage_types = ["fridge", "freezer", "pantry", "shelf"]
        if field.data.lower() not in valid_storage_types:
            raise ValidationError(
                f"Invalid storage type. Must be one of: {', '.join(valid_storage_types)}."
            )
            
    # def validate_food_id(self, field):
    #     # Query the database to check if the food_id exists
    #     food_item = FoodItem.query.get(field.data)
    #     if not food_item:
    #         raise ValidationError(f"Food ID {field.data} does not exist in the database.")