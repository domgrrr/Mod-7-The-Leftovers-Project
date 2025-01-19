from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Grocery, Grocery_Food, Food, db
from app.forms import GroceryForm, GroceryItemForm
from datetime import datetime

grocery_routes = Blueprint('grocery_lists', __name__)

@grocery_routes.route('/')
@login_required
def grocery_lists():
    """Return the user's grocery lists."""
    try:
        # Get all grocery lists for the current user
        grocery_lists = Grocery.query.filter(Grocery.user_id == current_user.id).all()

        # If no lists, return empty
        if not grocery_lists:
            return jsonify({'grocery_lists': []}), 204

        # Otherwise, return the lists
        # print("!!!", jsonify({'grocery_lists': [grocery.to_dict() for grocery in grocery_lists]}).data)
        return jsonify({'grocery_lists': [grocery.to_dict() for grocery in grocery_lists]}), 200
    except:
        return jsonify({'error': 'Error fetching grocery lists.'}), 500

@grocery_routes.route('/<int:id>')
@login_required
def grocery(id):
    """Return details of a specific grocery list."""
    try:
        # Get the specific grocery list
        grocery_list = Grocery.query.filter_by(id=id, user_id=current_user.id).first()

        if not grocery_list:
            return jsonify({'error': 'Not found or unauthorized'}), 404

        # Get the items in the grocery list
        grocery_items = db.session.query(Grocery_Food, Food).join(Grocery_Food, Grocery_Food.food_id == Food.id).filter(Grocery_Food.grocery_id == id).all()

        # print("!!! items", grocery_items)

        # Prepare the item data to return
        items = [{
            "food_id": grocery_item.food_id,
            "name": item.name,
            "amount": grocery_item.amount,
            "purchased": grocery_item.purchased
        } for grocery_item, item in grocery_items]

        return jsonify({'foods': items}), 200
    except:
        return jsonify({'error': 'Error fetching grocery list.'}), 500

@grocery_routes.route('/', methods=['POST'])
@login_required
def create_grocery_list():
    """Create a new grocery list with items."""
    
    def process_form(food, gId):
        form = GroceryItemForm(data=food)
        form['csrf_token'].data = request.cookies['csrf_token']
        form['grocery_id'].data = gId
        # print("!!!", food, "!!!", gId)
        if form.validate_on_submit():
            food_item = Grocery_Food( 
                food_id=form.data['food_id'], 
                grocery_id=form.data['grocery_id'],
                amount=form.data['amount'], 
                purchased=False
            )
            db.session.add(food_item)
            return (food_item, True)
        return (form.errors, False)
    
    with db.session.no_autoflush:
        form = GroceryForm()
        form['csrf_token'].data = request.cookies.get('csrf_token')

        print("!!! form", form.data)
        print("!!! form", request.data)
        if form.validate_on_submit():
            
            # Create the grocery list
            grocery_list = Grocery(
                name=form.data['name'],
                date=form.data['date'],
                completed=False,
                user_id=current_user.id,
            )
            db.session.add(grocery_list)
            db.session.commit()
        else:
            return form.errors, 400

        data = request.get_json()
        newGroceryObj = db.session.query(Grocery).order_by(Grocery.id.desc()).first()
            
        for food_item in data['grocery_foods']:
            (returnValue, valid) = process_form(food_item, newGroceryObj.id)
            if not valid:
                return returnValue
        
        db.session.commit()
        return jsonify(grocery_list.to_dict()), 201

@grocery_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_grocery_list(id):
    """Update the grocery list name."""
    with db.session.no_autoflush:
        try:
            # Find the grocery list
            grocery = Grocery.query.get(id)
            if grocery.user_id != current_user.id:
                return {'error': 'Unauthorized'}, 403

            if not grocery:
                return jsonify({'error': 'Not found or unauthorized'}), 404
            
            data = request.get_json()
            # print('!!!', data)
            grocery.name = data['name']
            grocery.date = datetime.strptime(data['date'], "%Y-%m-%d").date()
            # print("!!!!", grocery.date)

            Grocery_Food.query.filter_by(grocery_id=id).delete() #cleared existing ingredients to add updated ones everytime we edit/update

            # Add updated ingredients
            for food_item in data['grocery_foods']:
                new_food = Grocery_Food(
                    food_id=food_item['food_id'],
                    grocery_id=id,
                    amount=food_item['amount'],
                    purchased=False
                )
                db.session.add(new_food) #loop through recipe_foods and add them to db

            db.session.commit() #commit changes
            return grocery.to_dict()
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@grocery_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_grocery_list(id):
    """Delete a grocery list."""
    try:
        # Find the grocery list
        grocery = Grocery.query.filter(Grocery.id == id, Grocery.user_id == current_user.id).first()

        if not grocery:
            return jsonify({'error': 'Not found or unauthorized'}), 404

        # Delete the list
        db.session.delete(grocery)
        db.session.commit()
        return jsonify({'message': 'Grocery list deleted.'}), 200
    except:
        return jsonify({'error': 'Error deleting grocery list.'}), 500
