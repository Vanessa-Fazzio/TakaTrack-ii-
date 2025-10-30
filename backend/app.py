from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
from models import db, User, WasteBin, Collection, RecyclingRecord

app = Flask(__name__)
app.config['SECRET_KEY'] = 'takatrack-secret-key'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///takatrack.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt = JWTManager(app)
CORS(app)

from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.waste import waste_bp
from routes.recycling import recycling_bp
from routes.notifications import notifications_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(waste_bp, url_prefix='/api/waste')
app.register_blueprint(recycling_bp, url_prefix='/api/recycling')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')

def init_db():
    with app.app_context():
        db.create_all()
        if User.query.count() == 0:
            users = [
                User(email='demo@takatrack.com', name='Demo User', phone='1234567890', role='driver', password_hash=generate_password_hash('demo123')),
                User(email='admin@takatrack.com', name='Admin', phone='+254756789012', role='admin', password_hash=generate_password_hash('admin123'))
            ]
            for user in users: db.session.add(user)
            
            bins = [
                WasteBin(latitude=-1.2921, longitude=36.8219, status='full', type='general'),
                WasteBin(latitude=-1.2865, longitude=36.8235, status='empty', type='recycling'),
                WasteBin(latitude=-1.2955, longitude=36.8195, status='half', type='organic')
            ]
            for bin_obj in bins: db.session.add(bin_obj)
            
            db.session.commit()
            
            collections = [
                Collection(user_id=1, bin_id=1, status='completed', weight=15.5, waste_type='general', location='Westlands', priority='high'),
                Collection(user_id=1, bin_id=2, status='pending', weight=0, waste_type='recycling', location='Sarit Centre', priority='medium')
            ]
            for col in collections: db.session.add(col)
            
            record = RecyclingRecord(user_id=1, material_type='plastic', weight=5.2, environmental_impact=10.4)
            db.session.add(record)
            db.session.commit()

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/api/drivers')
def get_drivers():
    drivers = User.query.filter_by(role='driver').all()
    return jsonify([{**user.to_dict(), 'activeCollections': 0, 'totalCollected': 0, 'status': 'available'} for user in drivers])

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)