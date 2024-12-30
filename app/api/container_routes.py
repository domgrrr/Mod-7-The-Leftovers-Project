from flask import Blueprint
from flask_login import current_user, login_required
from app.models import Container, Container_Food, Food

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
@login_required
def container(id):
    """
    Returns foods in container
    """
    curr_container = Container.query.get(id)
    container_foods = Container_Food.query.filter(Container_Food.container_id == curr_container.id)
    food_objects = [
        (food, Food.query.get(food.food_id))
        for food in container_foods
    ]
    food_arr = [
        {
            "food_id": food.food_id,
            "name": food_obj.name,
            "type": food_obj.type,
            "image_url": food_obj.image_url,
            "amount": food.amount,
            "expiration": food.expiration,
            "alias_bool": food_obj.alias_bool,
            "alias_id": food_obj.alias_id
        } for (food, food_obj) in food_objects
    ]
    # food_objs_starting_with_c = [
    #     food_obj
    #     for (food, food_obj) in food_objects
    #     if food_obj.name[0] = 'c'
    # ]
    return {curr_container.storage_type: food_arr}
    # return {'foods': [food.to_dict() for food in container_foods]}
    