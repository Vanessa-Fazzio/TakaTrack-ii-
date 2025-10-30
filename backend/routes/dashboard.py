from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import WasteBin, Collection, RecyclingRecord, db
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    stats = {
        'totalBins': WasteBin.query.count(),
        'completed': Collection.query.filter_by(status='completed').count(),
        'pending': Collection.query.filter_by(status='pending').count(),
        'inProgress': Collection.query.filter_by(status='in_progress').count(),
        'recycledWeight': round(db.session.query(func.sum(RecyclingRecord.weight)).scalar() or 0, 1)
    }
    return jsonify({**stats, 'collectedToday': stats['completed'], 'pendingCollections': stats['pending'], 'activeDrivers': 3})