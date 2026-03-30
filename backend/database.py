from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Beat(db.Model):
    __tablename__ = 'beats'
    id         = db.Column(db.Integer, primary_key=True)
    title      = db.Column(db.String(120), nullable=False)
    genre      = db.Column(db.String(80),  default='')
    bpm        = db.Column(db.String(10),  default='')
    key        = db.Column(db.String(10),  default='')
    price      = db.Column(db.String(40),  default='')
    mood       = db.Column(db.String(8),   default='🎵')
    drive_id   = db.Column(db.String(200), nullable=False)
    cover      = db.Column(db.String(200), nullable=True)
    tags       = db.Column(db.String(200), default='')
    featured   = db.Column(db.Boolean,     default=False)
    created_at = db.Column(db.DateTime,    default=datetime.utcnow)

def init_db():
    """Crée les tables si elles n'existent pas. Aucune donnée de démo."""
    db.create_all()
