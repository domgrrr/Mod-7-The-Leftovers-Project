from app.models import db, environment, SCHEMA, Recipe

def seed_recipes():
    demo_recipes = [
        #just some example recipes that will be given to the user once loggied in / signed up
        #setting the user id to 0 means that it is a default recipe that all users will have access to, so nothing specific to user
        Recipe(user_id=1, name='Demo Recipe 1', directions='Mix ingredients...', image_url='http://example.com/image1.jpg', ),
        Recipe(user_id=1, name='Demo Recipe 2', directions='Bake at 350 degrees...', image_url='http://example.com/image2.jpg', ),
        Recipe(user_id=1, name='Demo Recipe 3', directions='Boil water...', image_url='http://example.com/image3.jpg', ),
        # Add recipes before completing the seed
    ]

    for recipe in demo_recipes:
        db.session.add(recipe)

    db.session.commit()

def undo_recipes():
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM recipes')
    db.session.commit()