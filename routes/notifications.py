from flask import Blueprint, jsonify

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('', methods=['GET'])
def get_notifications():
    return jsonify([
        {'id': 1, 'title': 'Collection Completed', 'message': 'Your waste collection has been completed successfully.', 'type': 'success', 'time': '10:30'},
        {'id': 2, 'title': 'Bin Full Alert', 'message': 'Bin #123 is full and needs collection.', 'type': 'warning', 'time': '09:15'}
    ])