# 🎧 DRIP BEATZ — Kit complet

```
drip-beatz/
├── backend/    → Flask (PythonAnywhere)
└── frontend/   → Next.js (Vercel)
```

---

## 1. BACKEND — PythonAnywhere

### Upload
1. Va sur **pythonanywhere.com** → Files
2. Upload le dossier `backend/` → renomme-le en `drip-beatz-backend`

### Installer les dépendances
Dans la console Bash PythonAnywhere :
```bash
cd ~/drip-beatz-backend
pip install -r requirements.txt --user
```

### Créer la Web App
1. **Web** → *Add a new web app* → Manual configuration → Python 3.11
2. **WSGI file** → remplace tout le contenu par celui de `wsgi.py`
3. Change dans `wsgi.py` :
   - `toncompte` → ton username PythonAnywhere
   - `SECRET_KEY` → une clé aléatoire longue
   - `ADMIN_PASSWORD` → ton mot de passe choisi

### Dossier static
Dans la section **Static files** de ta Web App :
```
URL:  /static/
Path: /home/toncompte/drip-beatz-backend/static
```

4. **Reload** → ton dashboard est en ligne sur `https://toncompte.pythonanywhere.com`

---

## 2. FRONTEND — Vercel

### Configuration
Dans `frontend/lib/beats-data.js`, mets à jour :
```js
export const BEATMAKER = {
  name:      'TON NOM DE BEATMAKER',
  tagline:   'Trap · Afro · Drill',
  bio:       'Beatmaker basé à Abidjan 🇨🇮',
  whatsapp:  '225XXXXXXXXX',   // ton numéro sans +
  instagram: 'https://instagram.com/toncompte',
  tiktok:    'https://tiktok.com/@toncompte',
  youtube:   'https://youtube.com/@toncompte',
}
```

### Déployer sur Vercel
1. Push le dossier `frontend/` sur GitHub
2. Va sur **vercel.com** → *New Project* → importe ton repo
3. **Root Directory** → `frontend`
4. **Environment Variables** → ajoute :
   ```
   NEXT_PUBLIC_API_URL = https://toncompte.pythonanywhere.com
   ```
5. Deploy → ton site est live !

---

## 3. Workflow beatmaker

### Ajouter un beat depuis le dashboard Flask :
1. Ouvre Google Drive → upload ton fichier MP3/WAV
2. Clic droit → *Partager* → **Toute personne avec le lien peut voir**
3. Copie le lien
4. Dashboard → **Ajouter un beat** → colle le lien (l'ID est extrait automatiquement)
5. Remplis titre, genre, BPM, prix, mood emoji → Enregistrer
6. Le beat apparaît instantanément sur le site Vercel

### Acheter (côté client) :
Visiteur écoute 30s → clique "Acheter" → WhatsApp s'ouvre avec le nom du beat → il paie Wave/MoMo → tu envoies le fichier complet

---

## Mot de passe dashboard

Défini dans `wsgi.py` → variable `ADMIN_PASSWORD`.  
Change-le AVANT de mettre en ligne.
