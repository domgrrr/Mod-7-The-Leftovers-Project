from app.models import db, environment, SCHEMA, Recipe

def seed_recipes():
    demo_recipes = [
        #just some example recipes that will be given to the user once logged in / signed up
        #setting the user id to 0 means that it is a default recipe that all users will have access to, so nothing specific to user
        Recipe(user_id=1, name='Demo Recipe 1', directions='Mix ingredients...', image_url='https://www.allrecipes.com/thmb/GHJl1NqVoa7UhT7RCVwCEPMnc94=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-15857-Easy-Pineapple-Cake-DDMFS-4x3-6127575ad6c941a28038561637003450.jpg', ),
        Recipe(user_id=2, name='Demo Recipe 2', directions='Bake at 350 degrees...', image_url='https://joyfoodsunshine.com/wp-content/uploads/2019/08/best-apple-pie-recipe-from-scratch-8.jpg', ),
        Recipe(user_id=1, name='Demo Recipe 3', directions='Boil water...', image_url='https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505', ),
        # Add recipes before completing the seed
    ]

    db.session.add_all(demo_recipes)

    db.session.commit()

def undo_recipes():
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;')
    else:
        db.session.execute('DELETE FROM recipes')
    db.session.commit()