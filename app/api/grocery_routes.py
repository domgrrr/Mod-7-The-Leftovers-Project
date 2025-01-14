from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Grocery, Grocery_Food, Food, db
from app.forms import GroceryForm, GroceryItemForm

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

        print("!!! items", grocery_items)

        # Prepare the item data to return
        items = [{
            "food_id": grocery_item.food_id,
            "name": item.name,
            "amount": grocery_item.amount,
            "purchased": grocery_item.purchased
        } for grocery_item, item in grocery_items]

        return jsonify({id: items}), 200
    except:
        return jsonify({'error': 'Error fetching grocery list.'}), 500

@grocery_routes.route('/', methods=['POST'])
@login_required
def create_grocery_list():
    """Create a new grocery list with items."""
    form = GroceryForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        try:
            # Create the grocery list
            grocery_list = Grocery(
                name=form.name.data,
                date=form.date.data,
                completed=form.completed.data,
                user_id=current_user.id,
            )
            db.session.add(grocery_list)
            db.session.commit()

            # Add the items to the list
            for item_data in form.items.data:
                if 'food_id' in item_data and 'quantity' in item_data and 'purchased' in item_data:
                    grocery_item = Grocery_Food(
                        grocery_id=grocery_list.id,
                        food_id=item_data['food_id'],
                        amount=item_data['quantity'],
                        purchased=item_data['purchased'],
                    )
                    db.session.add(grocery_item)

            db.session.commit()
            return jsonify(grocery_list.to_dict()), 201
        except:
            return jsonify({'error': 'Error creating grocery list.'}), 500

    return jsonify({"errors": form.errors}), 400

@grocery_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_grocery_list(id):
    """Update the grocery list name."""
    try:
        # Find the grocery list
        grocery = Grocery.query.filter(Grocery.id == id, Grocery.user_id == current_user.id).first()

        if not grocery:
            return jsonify({'error': 'Not found or unauthorized'}), 404

        # Get the new name
        data = request.get_json()
        new_name = data.get("name", "").strip()

        if not new_name:
            return jsonify({'error': 'Valid name required'}), 400

        grocery.name = new_name
        db.session.commit()
        return jsonify(grocery.to_dict()), 200
    except:
        return jsonify({'error': 'Error updating grocery list.'}), 500

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
