from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import WasteBin, Collection, db
from datetime import datetime
import random

waste_bp = Blueprint('waste', __name__)

@waste_bp.route('/bins', methods=['GET'])
@jwt_required()
def get_bins():
    bins = WasteBin.query.all()
    return jsonify([{**bin.to_dict(), 'status': random.choice(['empty', 'half', 'full']) if random.random() < 0.1 else bin.status} for bin in bins])

@waste_bp.route('/collections', methods=['GET', 'POST'])
@jwt_required()
def collections():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        collections = Collection.query.order_by(Collection.created_at.desc()).all()
        return jsonify([col.to_dict() for col in collections])
    
    data = request.get_json()
    if not data or not data.get('location'):
        return jsonify({'message': 'Location is required'}), 400
    
    waste_type = data.get('wasteType', 'general')
    bin_obj = WasteBin.query.filter_by(type=waste_type).first()
    if not bin_obj:
        bin_obj = WasteBin(latitude=-1.2921, longitude=36.8219, status='pending', type=waste_type)
        db.session.add(bin_obj)
        db.session.flush()
    
    collection = Collection(user_id=user_id, bin_id=bin_obj.id, waste_type=waste_type, location=data.get('location'), priority=data.get('priority', 'medium'))
    db.session.add(collection)
    db.session.commit()
    
    return jsonify({'message': 'Collection scheduled successfully', 'collection': collection.to_dict()}), 201

@waste_bp.route('/collections/<int:collection_id>', methods=['PUT'])
@jwt_required()
def update_collection(collection_id):
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    collection = Collection.query.get(collection_id)
    if not collection:
        return jsonify({'message': 'Collection not found'}), 404
    
    collection.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Collection updated successfully'})