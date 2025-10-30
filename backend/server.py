from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import sqlite3
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'takatrack-secret-key'
CORS(app)

def db_exec(q, p=None, f=None):
    c = sqlite3.connect('takatrack.db')
    r = c.execute(q, p or [])
    result = r.fetchone() if f == 1 else r.fetchall() if f == 2 else None
    c.commit(); c.close()
    return result

def init_db():
    tables = [
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, phone TEXT, role TEXT DEFAULT "resident", password_hash TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
        'CREATE TABLE IF NOT EXISTS waste_bins (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL NOT NULL, longitude REAL NOT NULL, status TEXT DEFAULT "empty", type TEXT DEFAULT "general", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
        'CREATE TABLE IF NOT EXISTS collections (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, bin_id INTEGER, status TEXT DEFAULT "pending", weight REAL DEFAULT 0, waste_type TEXT DEFAULT "general", location TEXT, scheduled_date TIMESTAMP, priority TEXT DEFAULT "medium", completed_date TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
        'CREATE TABLE IF NOT EXISTS recycling_records (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, material_type TEXT NOT NULL, weight REAL NOT NULL, location TEXT, environmental_impact REAL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
    ]
    
    for t in tables: db_exec(t)
    
    if not db_exec('SELECT COUNT(*) FROM users', f=1)[0]:
        users = [('demo@takatrack.com', 'Demo User', '1234567890', 'driver', generate_password_hash('demo123')), ('admin@takatrack.com', 'Admin', '+254756789012', 'admin', generate_password_hash('admin123'))]
        for u in users: db_exec('INSERT INTO users (email, name, phone, role, password_hash) VALUES (?, ?, ?, ?, ?)', u)
        
        bins = [(-1.2921, 36.8219, 'full', 'general'), (-1.2865, 36.8235, 'empty', 'recycling'), (-1.2955, 36.8195, 'half', 'organic')]
        for b in bins: db_exec('INSERT INTO waste_bins (latitude, longitude, status, type) VALUES (?, ?, ?, ?)', b)
        
        cols = [(1, 1, 'completed', 15.5, 'general', 'Westlands', '2024-01-15 09:00:00', 'high'), (1, 2, 'pending', 0, 'recycling', 'Sarit Centre', '2024-01-15 15:30:00', 'medium')]
        for c in cols: db_exec('INSERT INTO collections (user_id, bin_id, status, weight, waste_type, location, scheduled_date, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', c)
        
        db_exec('INSERT INTO recycling_records (user_id, material_type, weight, location, environmental_impact) VALUES (?, ?, ?, ?, ?)', (1, 'plastic', 5.2, 'Recycling Center', 10.4))

@app.route('/api/health')
def health(): return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/api/auth/register', methods=['POST'])
def register():
    d = request.get_json()
    if not d or not all(k in d for k in ['email', 'password', 'name']): return jsonify({'message': 'Email, password, and name are required'}), 400
    if db_exec('SELECT id FROM users WHERE email = ?', [d['email']], 1): return jsonify({'message': 'Email already registered'}), 400
    db_exec('INSERT INTO users (email, name, phone, role, password_hash) VALUES (?, ?, ?, ?, ?)', [d['email'], d['name'], d.get('phone', ''), d.get('role', 'resident'), generate_password_hash(d['password'])])
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    d = request.get_json()
    if not d or not all(k in d for k in ['email', 'password']): return jsonify({'message': 'Email and password are required'}), 400
    u = db_exec('SELECT id, name, role, password_hash FROM users WHERE email = ?', [d['email']], 1)
    if not u or not check_password_hash(u[3], d['password']): return jsonify({'message': 'Invalid email or password'}), 401
    return jsonify({'token': f"token_{u[0]}_{int(datetime.utcnow().timestamp())}", 'user': {'id': u[0], 'email': d['email'], 'name': u[1], 'role': u[2]}})

@app.route('/api/dashboard/stats')
def dashboard_stats():
    s = {'totalBins': db_exec('SELECT COUNT(*) FROM waste_bins', f=1)[0], 'completed': db_exec('SELECT COUNT(*) FROM collections WHERE status = "completed"', f=1)[0], 'pending': db_exec('SELECT COUNT(*) FROM collections WHERE status = "pending"', f=1)[0], 'inProgress': db_exec('SELECT COUNT(*) FROM collections WHERE status = "in_progress"', f=1)[0], 'recycledWeight': round(db_exec('SELECT COALESCE(SUM(weight), 0) FROM recycling_records', f=1)[0], 1)}
    return jsonify({**s, 'collectedToday': s['completed'], 'pendingCollections': s['pending'], 'activeDrivers': 3})

@app.route('/api/notifications')
def notifications(): return jsonify([{'id': 1, 'title': 'Collection Completed', 'message': 'Your waste collection completed.', 'type': 'success', 'time': '10:30'}, {'id': 2, 'title': 'Bin Full Alert', 'message': 'Bin #123 is full.', 'type': 'warning', 'time': '09:15'}])

@app.route('/api/waste/bins')
def waste_bins():
    bins = db_exec('SELECT id, latitude, longitude, status, type FROM waste_bins', f=2)
    return jsonify([{'id': b[0], 'latitude': b[1], 'longitude': b[2], 'status': random.choice(['empty', 'half', 'full']) if random.random() < 0.1 else b[3], 'type': b[4], 'lastUpdated': datetime.utcnow().isoformat()} for b in bins])

@app.route('/api/waste/collections', methods=['GET', 'POST'])
def collections():
    if request.method == 'GET':
        cols = db_exec('SELECT c.id, c.user_id, c.bin_id, c.status, c.weight, c.waste_type, c.location, c.scheduled_date, c.priority, c.completed_date, c.created_at, b.latitude, b.longitude, b.type FROM collections c LEFT JOIN waste_bins b ON c.bin_id = b.id ORDER BY c.created_at DESC', f=2)
        return jsonify([{'id': c[0], 'user_id': c[1], 'bin_id': c[2], 'status': c[3], 'weight': c[4], 'waste_type': c[5] or 'general', 'location': c[6] or 'Unknown', 'scheduled_date': c[7], 'priority': c[8] or 'medium', 'completed_date': c[9], 'created_at': c[10], 'bin': {'id': c[2], 'latitude': c[11] or -1.2921, 'longitude': c[12] or 36.8219, 'type': c[13] or c[5] or 'general'} if c[11] else None} for c in cols])
    else:
        d = request.get_json()
        if not d or not d.get('location'): return jsonify({'message': 'Location is required'}), 400
        wt = d.get('wasteType', 'general')
        br = db_exec('SELECT id FROM waste_bins WHERE type = ? LIMIT 1', [wt], 1)
        if not br: db_exec('INSERT INTO waste_bins (latitude, longitude, status, type) VALUES (?, ?, ?, ?)', (-1.2921, 36.8219, 'pending', wt)); bid = db_exec('SELECT last_insert_rowid()', f=1)[0]
        else: bid = br[0]
        db_exec('INSERT INTO collections (user_id, bin_id, status, weight, waste_type, location, scheduled_date, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', (1, bid, 'pending', 0, wt, d.get('location'), d.get('scheduledDate'), d.get('priority', 'medium')))
        cid = db_exec('SELECT last_insert_rowid()', f=1)[0]
        return jsonify({'message': 'Collection scheduled successfully', 'collection': {'id': cid, 'user_id': 1, 'bin_id': bid, 'status': 'pending', 'weight': 0, 'waste_type': wt, 'location': d.get('location'), 'scheduled_date': d.get('scheduledDate'), 'priority': d.get('priority', 'medium'), 'created_at': datetime.utcnow().isoformat()}}), 201

@app.route('/api/waste/collections/<int:cid>', methods=['PUT'])
def update_collection(cid):
    d = request.get_json()
    if not d or 'status' not in d: return jsonify({'message': 'Status is required'}), 400
    if not db_exec('UPDATE collections SET status = ? WHERE id = ?', [d['status'], cid]): return jsonify({'message': 'Collection not found'}), 404
    return jsonify({'message': 'Collection updated successfully'})

@app.route('/api/recycling/records', methods=['GET', 'POST'])
def recycling_records():
    if request.method == 'GET':
        recs = db_exec('SELECT id, material_type, weight, location, environmental_impact, created_at FROM recycling_records ORDER BY created_at DESC', f=2)
        return jsonify([{'id': r[0], 'material': r[1], 'weight': r[2], 'location': r[3] or 'Recycling Center', 'environmental_impact': r[4], 'createdAt': r[5]} for r in recs])
    else:
        d = request.get_json()
        if not d or not d.get('material') or not d.get('weight'): return jsonify({'message': 'Material and weight are required'}), 400
        m, w = d['material'].lower(), float(d['weight'])
        ei = w * {'plastic': 2.0, 'paper': 1.5, 'glass': 0.5, 'metal': 3.0, 'electronic': 4.0}.get(m, 1.0)
        loc = d.get('location', 'Recycling Center')
        db_exec('INSERT INTO recycling_records (user_id, material_type, weight, location, environmental_impact) VALUES (?, ?, ?, ?, ?)', (1, m, w, loc, ei))
        rid = db_exec('SELECT last_insert_rowid()', f=1)[0]
        return jsonify({'message': 'Recycling record added successfully', 'record': {'id': rid, 'material': m, 'weight': w, 'location': loc, 'environmental_impact': ei, 'createdAt': datetime.utcnow().isoformat()}}), 201

@app.route('/api/recycling/stats')
def recycling_stats():
    r = db_exec('SELECT SUM(weight), SUM(environmental_impact) FROM recycling_records', f=1)
    tw, cs = r[0] or 0, r[1] or 0
    return jsonify({'totalWeight': round(tw, 2), 'carbonSaved': round(cs, 2), 'treesEquivalent': int(cs * 0.02)})

@app.route('/api/drivers')
def get_drivers():
    drivers = db_exec('SELECT u.id, u.name, u.phone, u.email, COUNT(c.id), COALESCE(SUM(CASE WHEN c.status="completed" THEN c.weight ELSE 0 END), 0) FROM users u LEFT JOIN collections c ON u.id = c.user_id WHERE u.role="driver" GROUP BY u.id ORDER BY u.name', f=2)
    return jsonify([{'id': d[0], 'name': d[1], 'phone': d[2], 'email': d[3], 'activeCollections': d[4], 'totalCollected': round(d[5], 2), 'status': 'active' if d[4] > 0 else 'available'} for d in drivers])

if __name__ == '__main__': init_db(); app.run(debug=True, host='0.0.0.0', port=5003)