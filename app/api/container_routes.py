from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import Container, Container_Food, Food, db
from app.forms import FoodItemForm
from datetime import datetime

container_routes = Blueprint('containers', __name__)

@container_routes.route('/')
@login_required
def containers():
    """
    Returns all the users containers
    """
    all_containers = Container.query.filter(Container.user_id == current_user.id)
    return {'containers': [container.to_dict() for container in all_containers]}

@container_routes.route('/<int:id>')
@login_required #this route returns all the foods in a SPECIFIC container by container ID
def container(id):
    """
    Returns foods in container
    """
    container_info = db.session.query(
        Container,
        Container_Food,
        Food
    ).join(Container_Food, Container_Food.container_id == Container.id).join(
        Food, Food.id == Container_Food.food_id
    ).filter(Container.id == id).all()
    # To see this in the console: print("OBJECT HERE:", container_info)
    food_arr = [
        {
            "relation_id": food_relation.id,
            "food_id": food_relation.food_id,
            "name": food_obj.name,
            "type": food_obj.type,
            "image_url": food_obj.image_url,
            "amount": food_relation.amount,
            "expiration": food_relation.expiration,
            "alias_bool": food_obj.alias_bool,
            "alias_id": food_obj.alias_id
        } for (_, food_relation, food_obj) in container_info
    ]
    # food_objs_starting_with_c = [
    #     food_obj
    #     for (food, food_obj) in food_objects
    #     if food_obj.name[0] = 'c'
    # ]
    return {"storage_type": container_info[0][0].storage_type, "food_items": food_arr} if len(container_info) > 0 else {"Empty"}
    # return {'foods': [food.to_dict() for food in container_foods]}

@container_routes.route('/<int:id>/new', methods=['POST'])
@login_required
def new_food(id):
    """
    Adds food to a container
    """
    
    # helper function to process each each individual form
    def process_form(food):
        form = FoodItemForm(data=food)
        form['csrf_token'].data = request.cookies['csrf_token']
        form['container_id'].data = id
        if form.validate_on_submit():
            food_item = Container_Food( 
                food_id=form.data['food_id'], 
                container_id=form.data['container_id'],
                amount=form.data['amount'], 
                expiration=datetime.strptime(form.data["expiration"], "%Y-%m-%d").date() if form.data['expiration'] != "" else None
            )
            db.session.add(food_item)
        return {'message': 'doing something'}
    
    with db.session.no_autoflush:
        data = request.get_json()['food']
        for food in data:
            process_form(food)
            print('FOOD_DATA', food)
        db.session.commit()
        return {'message': 'doing something'}

@container_routes.route('/<int:id>/edit', methods=['PUT'])
@login_required
def edit_food():
    """
    Edit food amount and/or expiration
    """ 


@container_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_food(id):
    """
    Deletes food item from container
    """
    food_relation = Container_Food.query.get(id)
    db.session.delete(food_relation)
    db.session.commit()
    return {'message': 'Food deleted'}
    
#master list of all foods in ALL containers
@container_routes.route('/masterlist') #we can change this to /all or /list-all whichever preferred
@login_required
def master_list(): #we can change def name based off of preference
    """
    Returns a master list of ALL foods in all containers for the current user
    """
    master_list_info = db.session.query(
        Container_Food,
        Food
    ).join(
        Food, Food.id == Container_Food.food_id #get food details for each food item in a container
    ).join(
        Container, Container.id == Container_Food.container_id #get container details for each food item in a container
    ).filter(Container.user_id == current_user.id).all() #filteres results to only show the current user's containers
    #returning the master list of all foods in all containers
    #by joining the Container_Food, Food, and Container tables, we can get all the details of each food item in a container
    #gathers all food items in all containers for the current user returning a MASTER LIST (needs to be checked if works)
    food_arr = [ 
        { #for each food item in a container, return the following details in a dictionary
            "container_id": food_relation.container_id,
            "food_id": food_relation.food_id,
            "name": food_obj.name,
            "type": food_obj.type,
            "image_url": food_obj.image_url,
            "amount": food_relation.amount,
            "expiration": food_relation.expiration,
            "alias_bool": food_obj.alias_bool,
            "alias_id": food_obj.alias_id
        } for (food_relation, food_obj) in master_list_info
    ]

    return {'foods': food_arr} #returns the master list of all foods in all containers for the current user with a key of "foods"