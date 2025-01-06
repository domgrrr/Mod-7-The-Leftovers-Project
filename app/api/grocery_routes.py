from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Grocery, Grocery_Food, Food, db
from app.forms import GroceryForm, GroceryItemForm

grocery_routes = Blueprint('grocery_lists', __name__)

@grocery_routes.route('/')
@login_required
def grocery_lists():
    """
    Returns all the user's grocery lists.
    """
    try:
        all_grocery_lists = Grocery.query.filter(Grocery.user_id == current_user.id).all()
        if not all_grocery_lists:
            return jsonify({'grocery_lists': []}), 204
        return jsonify({'grocery_lists': [grocery.to_dict() for grocery in all_grocery_lists]}), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching grocery lists.'}), 500

@grocery_routes.route('/<int:id>')
@login_required
def grocery(id):
    """
    Returns foods in a grocery list.
    """
    try:
        grocery_list = Grocery.query.filter_by(id=id, user_id=current_user.id).first()
        if not grocery_list:
            return jsonify({'error': 'Grocery list not found or unauthorized'}), 404

        grocery_info = db.session.query(
            Grocery,
            Grocery_Food,
            Food
        ).join(Grocery_Food, Grocery_Food.grocery_id == Grocery.id).join(
            Food, Food.id == Grocery_Food.food_id
        ).filter(Grocery.id == id).all()

        if not grocery_info:
            return jsonify({id: []}), 200

        food_arr = [
            {
                "food_id": food_relation.food_id,
                "name": food_obj.name,
                "type": food_obj.type,
                "image_url": food_obj.image_url,
                "amount": food_relation.amount,
                "purchased": food_relation.purchased,
                "alias_bool": food_obj.alias_bool,
                "alias_id": food_obj.alias_id
            } for (_, food_relation, food_obj) in grocery_info
        ]
        return jsonify({id: food_arr}), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching grocery list details.'}), 500

@grocery_routes.route('/', methods=['POST'])
@login_required
def create_grocery_list():
    """
    Creates a new grocery list with items.
    """
    form = GroceryForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        try:
            # Create new grocery list
            grocery_list = Grocery(
                name=form.name.data,
                date=form.date.data,
                completed=form.completed.data,
                user_id=current_user.id,
            )
            db.session.add(grocery_list)
            db.session.commit()

            # Add items to the grocery list
            for item_data in form.items.data:
                if all(k in item_data for k in ('food_id', 'quantity', 'purchased')):
                    foodForm = GroceryItemForm(data=item_data)
                    foodForm['csrf_token'].data = request.cookies['csrf_token']
                    print("Form_DATA", foodForm.data)
                    grocery_item = Grocery_Food(
                        grocery_id=grocery_list.id,
                        food_id=form.data['food_id'],
                        amount=form.data['quantity'],
                        purchased=form.data['purchased'],
                    )
                    db.session.add(grocery_item)

            db.session.commit()
            return jsonify(grocery_list.to_dict()), 201
        except Exception as e:
            return jsonify({'error': 'An error occurred while creating the grocery list.'}), 500
    else:
        return jsonify({"errors": form.errors}), 400

@grocery_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_grocery_list(id):
    """
    Updates the name of a grocery list.
    """
    try:
        grocery = Grocery.query.filter(Grocery.id == id, Grocery.user_id == current_user.id).first()

        if not grocery:
            return jsonify({'error': 'Grocery list not found or unauthorized'}), 404

        data = request.get_json()
        new_name = data.get("name", "").strip()

        if not new_name:
            return jsonify({'error': 'A valid name is required'}), 400

        grocery.name = new_name
        db.session.commit()
        return jsonify(grocery.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred while updating the grocery list.'}), 500

@grocery_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_grocery_list(id):
    """
    Deletes a grocery list.
    """
    try:
        grocery = Grocery.query.filter(Grocery.id == id, Grocery.user_id == current_user.id).first()

        if not grocery:
            return jsonify({'error': 'Grocery list not found or unauthorized'}), 404

        db.session.delete(grocery)
        db.session.commit()
        return jsonify({'message': 'Grocery list deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'An error occurred while deleting the grocery list.'}), 500
