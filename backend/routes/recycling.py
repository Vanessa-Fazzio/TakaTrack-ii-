from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import RecyclingRecord, db
from sqlalchemy import func

recycling_bp = Blueprint('recycling', __name__)

@recycling_bp.route('/records', methods=['GET', 'POST'])
@jwt_required()
def recycling_records():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        records = RecyclingRecord.query.order_by(RecyclingRecord.created_at.desc()).all()
        return jsonify([record.to_dict() for record in records])
    
    data = request.get_json()
    if not data or not data.get('material') or not data.get('weight'):
        return jsonify({'message': 'Material and weight are required'}), 400
    
    material = data['material'].lower()
    weight = float(data['weight'])
    impact_factors = {'plastic': 2.0, 'paper': 1.5, 'glass': 0.5, 'metal': 3.0, 'electronic': 4.0}
    environmental_impact = weight * impact_factors.get(material, 1.0)
    
    record = RecyclingRecord(user_id=user_id, material_type=material, weight=weight, location=data.get('location', 'Recycling Center'), environmental_impact=environmental_impact)
    db.session.add(record)
    db.session.commit()
    
    return jsonify({'message': 'Recycling record added successfully', 'record': record.to_dict()}), 201

@recycling_bp.route('/stats', methods=['GET'])
@jwt_required()
def recycling_stats():
    total_weight = db.session.query(func.sum(RecyclingRecord.weight)).scalar() or 0
    carbon_saved = db.session.query(func.sum(RecyclingRecord.environmental_impact)).scalar() or 0
    return jsonify({'totalWeight': round(total_weight, 2), 'carbonSaved': round(carbon_saved, 2), 'treesEquivalent': int(carbon_saved * 0.02)})