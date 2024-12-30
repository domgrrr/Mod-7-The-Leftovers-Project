from flask import Blueprint
from flask_login import current_user, login_required
from app.models import Recipe, db, Food, Recipe_Food

recipe_routes = Blueprint('recipes', __name__)
# '/' get all recipes
@recipe_routes.route('/')
def all_recipes():
    """
    Returns all the recipes
    """
    all_recipes = Recipe.query.all()
    return {'recipes': [recipe.to_dict() for recipe in all_recipes]}
# '/user' get all users recipes

@recipe_routes.route('/user')
@login_required
def user_recipes():
    """
    Returns all the users recipes
    """
    all_user_recipes = Recipe.query.filter(Recipe.user_id == current_user.id)
    return {'recipes': [recipe.to_dict() for recipe in all_user_recipes]}
# '/<int:id>' get all ingredients for specific recipe 
@recipe_routes.route('/<int:id>')
@login_required
def recipe(id):
    """
    Returns details of a specific recipe along with its ingredients
    """
    recipe_info = db.session.query(
        Recipe,
        Recipe_Food,
        Food
    ).join(Recipe_Food, Recipe_Food.recipe_id == Recipe.id).join(
        Food, Food.id == Recipe_Food.food_id
    ).filter(Recipe.id == id).all()
    
    if not recipe_info: #if theres no recipe id just return this error
        return {'error': 'Recipe not found'}, 404

    recipe_details = {  #do we need all the recipe details?
        "id": recipe_info.id,
        "name": recipe_info.name,
        "directions": recipe_info.directions,
        "image_url": recipe_info.image_url,
        "user_id": recipe_info.user_id,
        "ingredients": [
            {
                "food_id": food_relation.food_id,
                "name": food_obj.name,
                "amount": food_relation.amount #uhhhh do we need this?
            } for (_, food_relation, food_obj) in recipe_info
        ]
    }
    
    return recipe_details