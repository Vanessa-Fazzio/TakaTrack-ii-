from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), default='resident')
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {'id': self.id, 'email': self.email, 'name': self.name, 'phone': self.phone, 'role': self.role}

class WasteBin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='empty')
    type = db.Column(db.String(20), default='general')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {'id': self.id, 'latitude': self.latitude, 'longitude': self.longitude, 'status': self.status, 'type': self.type, 'lastUpdated': self.created_at.isoformat()}

class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bin_id = db.Column(db.Integer, db.ForeignKey('waste_bin.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    weight = db.Column(db.Float, default=0)
    waste_type = db.Column(db.String(20), default='general')
    location = db.Column(db.String(200))
    priority = db.Column(db.String(20), default='medium')
    scheduled_date = db.Column(db.DateTime)
    completed_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    bin = db.relationship('WasteBin', backref='collections')
    
    def to_dict(self):
        return {'id': self.id, 'user_id': self.user_id, 'bin_id': self.bin_id, 'status': self.status, 'weight': self.weight, 'waste_type': self.waste_type, 'location': self.location, 'priority': self.priority, 'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None, 'completed_date': self.completed_date.isoformat() if self.completed_date else None, 'created_at': self.created_at.isoformat(), 'bin': self.bin.to_dict() if self.bin else None}

class RecyclingRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    material_type = db.Column(db.String(50), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(200), default='Recycling Center')
    environmental_impact = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {'id': self.id, 'material': self.material_type, 'weight': self.weight, 'location': self.location, 'environmental_impact': self.environmental_impact, 'createdAt': self.created_at.isoformat()}