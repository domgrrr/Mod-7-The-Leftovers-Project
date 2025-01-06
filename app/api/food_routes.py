from flask import Blueprint, request
from flask_login import login_required
from app.models import Food, db
from datetime import datetime

food_routes = Blueprint('foods', __name__)

@food_routes.route('/')
@login_required
def allFoods():
    """
    Returns all foods
    """
    all_foods = Food.query.all()
    return [food.to_dict() for food in all_foods]