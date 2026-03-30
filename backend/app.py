import os, re, uuid
from functools import wraps
from flask_cors import CORS

from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify, send_from_directory
)
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from database import db, Beat, init_db

app = Flask(__name__)
CORS(app)
app.secret_key  = os.environ.get('SECRET_KEY', 'change-me-en-prod')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///beats.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024   # 5 MB max cover

ALLOWED = {'png', 'jpg', 'jpeg', 'webp'}

db.init_app(app)

# ── helpers ──────────────────────────────────────────────────
def allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED

def extract_drive_id(raw):
    """Extrait l'ID Google Drive depuis un lien complet ou retourne tel quel."""
    m = re.search(r'/d/([a-zA-Z0-9_-]+)', raw)
    return m.group(1) if m else raw.strip()

def login_required(f):
    @wraps(f)
    def dec(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return dec

ADMIN_HASH = generate_password_hash(os.environ.get('ADMIN_PASSWORD', 'changez-moi'))

# ── auth ─────────────────────────────────────────────────────
@app.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('logged_in'):
        return redirect(url_for('dashboard'))
    error = None
    if request.method == 'POST':
        if check_password_hash(ADMIN_HASH, request.form.get('password', '')):
            session['logged_in'] = True
            return redirect(url_for('dashboard'))
        error = 'Mot de passe incorrect'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ── dashboard ─────────────────────────────────────────────────
@app.route('/')
@login_required
def dashboard():
    beats = Beat.query.order_by(Beat.created_at.desc()).all()
    total    = len(beats)
    featured = sum(1 for b in beats if b.featured)
    genres   = {}
    for b in beats:
        genres[b.genre] = genres.get(b.genre, 0) + 1 if b.genre else genres
    return render_template('dashboard.html', beats=beats,
                           total=total, featured=featured, genres=genres)

# ── add ───────────────────────────────────────────────────────
@app.route('/beats/add', methods=['GET', 'POST'])
@login_required
def add_beat():
    if request.method == 'POST':
        title    = request.form.get('title', '').strip().upper()
        genre    = request.form.get('genre', '').strip()
        bpm      = request.form.get('bpm', '').strip()
        key      = request.form.get('key', '').strip()
        price    = request.form.get('price', '').strip()
        mood     = request.form.get('mood', '🎵').strip() or '🎵'
        drive_id = extract_drive_id(request.form.get('drive_id', ''))
        tags     = request.form.get('tags', '').strip()
        featured = 'featured' in request.form

        if not title or not drive_id:
            flash('Titre et lien Google Drive obligatoires.', 'error')
            return redirect(url_for('add_beat'))

        cover = None
        f = request.files.get('cover')
        if f and f.filename and allowed(f.filename):
            ext   = f.filename.rsplit('.', 1)[1].lower()
            fname = f'{uuid.uuid4().hex}.{ext}'
            f.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
            cover = fname

        db.session.add(Beat(title=title, genre=genre, bpm=bpm, key=key,
                            price=price, mood=mood, drive_id=drive_id,
                            tags=tags, featured=featured, cover=cover))
        db.session.commit()
        flash(f'Beat "{title}" ajouté !', 'success')
        return redirect(url_for('dashboard'))

    return render_template('add_beat.html')

# ── edit ──────────────────────────────────────────────────────
@app.route('/beats/<int:bid>/edit', methods=['GET', 'POST'])
@login_required
def edit_beat(bid):
    beat = Beat.query.get_or_404(bid)
    if request.method == 'POST':
        beat.title    = request.form.get('title', '').strip().upper()
        beat.genre    = request.form.get('genre', '').strip()
        beat.bpm      = request.form.get('bpm', '').strip()
        beat.key      = request.form.get('key', '').strip()
        beat.price    = request.form.get('price', '').strip()
        beat.mood     = request.form.get('mood', '🎵').strip() or '🎵'
        beat.drive_id = extract_drive_id(request.form.get('drive_id', ''))
        beat.tags     = request.form.get('tags', '').strip()
        beat.featured = 'featured' in request.form

        f = request.files.get('cover')
        if f and f.filename and allowed(f.filename):
            if beat.cover:
                old = os.path.join(app.config['UPLOAD_FOLDER'], beat.cover)
                if os.path.exists(old): os.remove(old)
            ext   = f.filename.rsplit('.', 1)[1].lower()
            fname = f'{uuid.uuid4().hex}.{ext}'
            f.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
            beat.cover = fname

        db.session.commit()
        flash(f'Beat "{beat.title}" mis à jour.', 'success')
        return redirect(url_for('dashboard'))

    return render_template('edit_beat.html', beat=beat)

# ── toggle featured (Flask dashboard + API admin) ──────────────
@app.route('/beats/<int:bid>/toggle-featured', methods=['POST'])
@login_required
def toggle_featured(bid):
    beat = Beat.query.get_or_404(bid)
    beat.featured = not beat.featured
    db.session.commit()
    return jsonify({'featured': beat.featured})

@app.route('/api/beats/<int:bid>/toggle-featured', methods=['POST'])
def api_toggle_featured(bid):
    if not check_admin_key():
        return cors(jsonify({'error': 'Non autorisé'})), 401
    beat = Beat.query.get_or_404(bid)
    beat.featured = not beat.featured
    db.session.commit()
    return cors(jsonify({'featured': beat.featured}))

# ── delete ────────────────────────────────────────────────────
@app.route('/beats/<int:bid>/delete', methods=['POST'])
@login_required
def delete_beat(bid):
    beat = Beat.query.get_or_404(bid)
    if beat.cover:
        path = os.path.join(app.config['UPLOAD_FOLDER'], beat.cover)
        if os.path.exists(path): os.remove(path)
    title = beat.title
    db.session.delete(beat)
    db.session.commit()
    flash(f'Beat "{title}" supprimé.', 'info')
    return redirect(url_for('dashboard'))

# ── helper CORS ───────────────────────────────────────────────
def cors(resp):
    resp.headers['Access-Control-Allow-Origin']  = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,X-Admin-Key'
    return resp

def check_admin_key():
    """Vérifie la clé admin envoyée par le front Next.js."""
    key = request.headers.get('X-Admin-Key', '') or request.form.get('admin_key', '')
    return check_password_hash(ADMIN_HASH, key)

# ── Preflight OPTIONS (CORS) ──────────────────────────────────
@app.route('/api/<path:p>', methods=['OPTIONS'])
def options_handler(p):
    return cors(jsonify({}))

# ── API publique (Next.js) ────────────────────────────────────
@app.route('/api/beats')
def api_beats():
    beats = Beat.query.order_by(Beat.featured.desc(), Beat.created_at.desc()).all()
    result = []
    for b in beats:
        cover_url = None
        if b.cover:
            cover_url = url_for('static', filename=f'uploads/{b.cover}', _external=True)
        result.append({
            'id':       b.id,
            'title':    b.title,
            'genre':    b.genre,
            'bpm':      b.bpm,
            'key':      b.key,
            'price':    b.price,
            'mood':     b.mood,
            'driveId':  b.drive_id,
            'cover':    cover_url,
            'tags':     [t.strip() for t in b.tags.split(',') if t.strip()] if b.tags else [],
            'featured': b.featured,
        })
    return cors(jsonify(result))

# ── API admin — ajouter un beat ───────────────────────────────
@app.route('/api/beats/add', methods=['POST'])
def api_add_beat():
    if not check_admin_key():
        return cors(jsonify({'error': 'Non autorisé'})), 401

    title    = request.form.get('title', '').strip().upper()
    genre    = request.form.get('genre', '').strip()
    bpm      = request.form.get('bpm', '').strip()
    key      = request.form.get('key', '').strip()
    price    = request.form.get('price', '').strip()
    mood     = request.form.get('mood', '🎵').strip() or '🎵'
    drive_id = extract_drive_id(request.form.get('drive_id', ''))
    tags     = request.form.get('tags', '').strip()
    featured = request.form.get('featured', '') in ('true', '1', 'on', 'True')

    if not title or not drive_id:
        return cors(jsonify({'error': 'Titre et lien Drive obligatoires'})), 400

    cover = None
    f = request.files.get('cover')
    if f and f.filename and allowed(f.filename):
        ext   = f.filename.rsplit('.', 1)[1].lower()
        fname = f'{uuid.uuid4().hex}.{ext}'
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
        cover = fname

    beat = Beat(title=title, genre=genre, bpm=bpm, key=key,
                price=price, mood=mood, drive_id=drive_id,
                tags=tags, featured=featured, cover=cover)
    db.session.add(beat)
    db.session.commit()
    return cors(jsonify({'ok': True, 'id': beat.id})), 201

# ── API admin — modifier un beat ─────────────────────────────
@app.route('/api/beats/<int:bid>/edit', methods=['POST'])
def api_edit_beat(bid):
    if not check_admin_key():
        return cors(jsonify({'error': 'Non autorisé'})), 401

    beat = Beat.query.get_or_404(bid)
    beat.title    = request.form.get('title', '').strip().upper()
    beat.genre    = request.form.get('genre', '').strip()
    beat.bpm      = request.form.get('bpm', '').strip()
    beat.key      = request.form.get('key', '').strip()
    beat.price    = request.form.get('price', '').strip()
    beat.mood     = request.form.get('mood', '🎵').strip() or '🎵'
    beat.drive_id = extract_drive_id(request.form.get('drive_id', ''))
    beat.tags     = request.form.get('tags', '').strip()
    beat.featured = request.form.get('featured', '') in ('true', '1', 'on', 'True')

    f = request.files.get('cover')
    if f and f.filename and allowed(f.filename):
        if beat.cover:
            old = os.path.join(app.config['UPLOAD_FOLDER'], beat.cover)
            if os.path.exists(old): os.remove(old)
        ext   = f.filename.rsplit('.', 1)[1].lower()
        fname = f'{uuid.uuid4().hex}.{ext}'
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], fname))
        beat.cover = fname

    db.session.commit()
    return cors(jsonify({'ok': True}))

# ── API admin — supprimer un beat ────────────────────────────
@app.route('/api/beats/<int:bid>/delete', methods=['POST'])
def api_delete_beat(bid):
    if not check_admin_key():
        return cors(jsonify({'error': 'Non autorisé'})), 401

    beat = Beat.query.get_or_404(bid)
    if beat.cover:
        path = os.path.join(app.config['UPLOAD_FOLDER'], beat.cover)
        if os.path.exists(path): os.remove(path)
    db.session.delete(beat)
    db.session.commit()
    return cors(jsonify({'ok': True}))

# ── serve uploads ─────────────────────────────────────────────
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ── boot ──────────────────────────────────────────────────────
if __name__ == '__main__':
    with app.app_context():
        init_db()
    app.run(debug=True, port=5050)
