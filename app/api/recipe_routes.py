from flask import Blueprint, request #importing request
from flask_login import current_user, login_required
# import correct forms here
from app.models import Recipe, db, Food, Recipe_Food
from app.forms import RecipeForm

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
    # went ahead and did similar based off auth_routes.py

    # food_item = RecipeFood()

    # def food_item_iterable():
    #   process food item
    #   add to session db.session.add(item)
    # food_item_iterable for ... SEE BELOW
    recipe_form = RecipeForm() #Instantiate the form
    recipe_form['csrf_token'].data = request.cookies['csrf_token'] #add csrf token to form
    #if statement to validate form
    if recipe_form.validate_on_submit(): #if form is valid extract data
        name = recipe_form.data['name']
        directions = recipe_form.data['directions']
        image_url = recipe_form.data['image_url']
        recipe_foods = recipe_form.data['recipe_foods']

        recipe = Recipe(
            name=name,
            directions=directions,
            image_url=image_url,
            user_id=current_user.id
        )
        db.session.add(recipe)
        db.session.commit()

        def process_food_item(food_item):
            food_id = food_item['food_id'] #uh double check if food_item is correct
            amount = food_item['amount']
            new_recipe_food = Recipe_Food( #relationship between recipe and food
                recipe_id=recipe.id,
                food_id=food_id,
                amount=amount
            )
            db.session.add(new_recipe_food) #add to session

        for food_item in recipe_foods: #loop through recipe_foods
            process_food_item(food_item) #call/process each food item

        db.session.commit() #commit all changes to db
        return recipe.to_dict() #return the recipe as a dictionaryå
    return recipe_form.errors, 400 #return errors if form is invalid a 400 error

# PUT update recipe
@recipe_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_recipe(id):
    """
    Updates an existing recipe
    """
    recipe = Recipe.query.get(id)
    if recipe.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403

    data = request.get_json()
    recipe.name = data['name']
    recipe.directions = data['directions']
    recipe.image_url = data['image_url']
    db.session.commit()
    return recipe.to_dict()

# DELETE recipe
@recipe_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_recipe(id):
    """
    Deletes an existing recipe
    """
    recipe = Recipe.query.get(id)
    if recipe.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403

    db.session.delete(recipe)
    db.session.commit()
    return {'message': 'Recipe deleted'}