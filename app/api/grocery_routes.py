from flask import Blueprint
from flask_login import current_user, login_required
from app.models import Grocery, Grocery_Food, Food, db

grocery_routes = Blueprint('grocery_lists', __name__)

@grocery_routes.route('/')
@login_required
def grocery_lists():
    """
    Returns all the users grocery_lists
    """
    all_grocery_lists = Grocery.query.filter(Grocery.user_id == current_user.id)
    return {'grocery_lists': [grocery.to_dict() for grocery in all_grocery_lists]}

@grocery_routes.route('/<int:id>')
@login_required
def grocery(id):
    """
    Returns foods in a grocery list
    """
    grocery_info = db.session.query(
        Grocery,
        Grocery_Food,
        Food
    ).join(Grocery_Food, Grocery_Food.grocery_id == Grocery.id).join(
        Food, Food.id == Grocery_Food.food_id
    ).filter(Grocery.id == id).all()
    print("OBJECT HERE:", grocery_info)
    food_arr = [
        {
            "food_id": food_relation.food_id,
            "name": food_obj.name,
            "type": food_obj.type,
            "image_url": food_obj.image_url,
            "amount": food_relation.amount,
            "purchased": food_relation.purchased,
            "alias_bool": food_obj.alias_bool,
            "alias_id": food_obj.alias_id
        } for (_, food_relation, food_obj) in grocery_info
    ]
    return {grocery_info[0][0].id: food_arr} if len(grocery_info) > 0 else {"message": "Empty"}