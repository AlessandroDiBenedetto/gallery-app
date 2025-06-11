# 📷 Gallery App - Backend

Un'applicazione backend per la gestione di utenti e immagini, con funzionalità di autenticazione, autorizzazione e upload protetto. Sviluppata in Node.js.

## 🚀 Funzionalità

- 🔐 Registrazione e login degli utenti con hashing sicuro delle password
- 🪪 Autenticazione tramite JWT
- 📥 Upload immagini con limiti diversi per utenti `standard` e `premium`
- 🗑 Eliminazione immagini protetta da controllo di proprietà
- 🧾 Logout sicuro con blacklist dei token JWT
- 🔐 Middleware per protezione delle route

## 📂 Struttura del progetto

```
backend/
├── controllers/
│   ├── authController.js      # Gestione login e registrazione
│   └── imageController.js     # Gestione upload, recupero e cancellazione immagini
├── middleware/
│   └── authMiddleware.js      # Verifica token e logout con blacklist
├── models/
│   ├── user.js                # Funzioni per gestione utenti
│   └── image.js               # Funzioni per gestione immagini
├── db.js                      # Connessione al database
└── server.js                  # Entry point dell'app
frontend/
├── js/
|  ├── app.js                  # manipolazione DOM
├── index.html
├── style.css
```

## 🧪 API principali

### 🔸 Registrazione

```http
POST /api/register
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

### 🔸 Login

```http
POST /api/login
{
  "username": "alice",
  "password": "password123"
}
```

> ✅ Restituisce un JWT da usare come `Authorization: Bearer <token>`

---

### 🔸 Upload immagine

```http
POST /api/images
Headers: Authorization: Bearer <token>
Body:
{
  "title": "Sunset",
  "url": "https://example.com/image.jpg"
}
```

> ⚠️ Limite immagini: 3 per utenti standard, 10 per premium.

---

### 🔸 Ottenere immagini utente

```http
GET /api/images
Headers: Authorization: Bearer <token>
```

---

### 🔸 Cancellare un'immagine

```http
DELETE /api/images/:id
Headers: Authorization: Bearer <token>
```

---

### 🔸 Logout

```http
POST /api/logout
Headers: Authorization: Bearer <token>
```

> 🚫 Il token viene invalidato tramite inserimento in blacklist.

---

## 🔐 Sicurezza

- Password criptate con `bcrypt`
- Token JWT firmati e scadono dopo 1 ora
- Verifica `jti` nel database per impedire riutilizzo del token dopo logout

---

## ⚙️ Requisiti

- Node.js
- MySQL (o un altro database compatibile)
- `.env` file con:

```
JWT_SECRET_KEY=your_jwt_secret
```

## 🗄 Setup database

Assicurati di aver creato un database MySQL vuoto (es. `gallery_app`), poi esegui il file SQL:

```bash
mysql -u your_user -p your_database_name < schema.sql

-- schema.sql

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('standard', 'premium') DEFAULT 'standard'
);

CREATE TABLE IF NOT EXISTS image (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS token_blacklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token_id VARCHAR(255) NOT NULL,
  blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


---

## 📌 Note finali

Questo backend può essere integrato con un frontend React, Vue o mobile app per realizzare un'app di gestione immagini sicura e scalabile.

---

## 🧑‍💻 Autore

Alessandro Di Benedetto
