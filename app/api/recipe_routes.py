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

    recipe_details = { 
        "id": recipe_info[0][0].id,
        "name": recipe_info[0][0].name,
        "directions": recipe_info[0][0].directions,
        "image_url": recipe_info[0][0].image_url,
        "user_id": recipe_info[0][0].user_id,
        "ingredients": [
            {
                "food_id": food_relation.food_id,
                "name": food_obj.name,
                "amount": food_relation.amount
            } for (_, food_relation, food_obj) in recipe_info
        ]
    }
    return recipe_details if len(recipe_info) > 0 else {"Empty"}

#POST RECIPEEEE
@recipe_routes.route('/new') #post new recipe
@login_required
def new_recipe():
    """
    Creates a new recipe with ingredients
    """
    data = request.get_json()
    name = data.get('name')
    directions = data.get('directions')
    image_url = data.get('image_url')
    ingredients = data.get('ingredients', [])

    recipe = Recipe(
        name=name,
        directions=directions,
        image_url=image_url,
        user_id=current_user.id
    )
    db.session.add(recipe)
    db.session.commit()

    for ingredient in ingredients:
        food_id = ingredient.get('food_id')
        amount = ingredient.get('amount')
        recipe_food = Recipe_Food(
            recipe_id=recipe.id,
            food_id=food_id,
            amount=amount
        )
        db.session.add(recipe_food)

    db.session.commit()
    return recipe.to_dict()

