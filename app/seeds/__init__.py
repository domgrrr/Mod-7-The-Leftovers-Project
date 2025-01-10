from flask.cli import AppGroup
from .users import seed_users, undo_users
from .containers import seed_containers, undo_containers
from .foods import seed_foods, undo_foods
from .grocery import seed_grocery_lists, undo_grocery_lists
from .recipes import seed_recipes, undo_recipes
from .container_foods import seed_container_foods, undo_container_foods 
from .grocery_foods import seed_grocery_foods, undo_grocery_foods
from .recipe_foods import seed_recipe_foods, undo_recipe_foods


from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type flask seed --help
seed_commands = AppGroup('seed')


# Creates the flask seed all command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_grocery_foods()
        undo_recipe_foods()
        undo_container_foods()
        undo_recipes()
        undo_grocery_lists()
        undo_foods()
        undo_containers()
        undo_users()
    seed_users()
    seed_containers()
    seed_foods()
    seed_grocery_lists()
    seed_recipes()
    seed_container_foods()
    seed_recipe_foods()
    seed_grocery_foods()
    # Add other seed functions here


# Creates the flask seed undo command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_containers()
    undo_foods()
    undo_grocery_lists()
    undo_recipes()
    undo_container_foods()
    undo_recipe_foods()
    undo_grocery_foods()
    # Add other undo functions here

