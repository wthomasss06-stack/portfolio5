import sys, os

# Remplace 'toncompte' par ton username PythonAnywhere
path = '/home/toncompte/drip-beatz-backend'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['SECRET_KEY']      = 'mets-une-vraie-cle-secrete-ici'
os.environ['ADMIN_PASSWORD']  = 'mets-ton-mot-de-passe-ici'

from app import app, db
with app.app_context():
    from database import init_db
    init_db()

application = app
