# 🚗 LiftWork — Plateforme intelligente de réservation automobile

LiftWork est une application web modulaire qui permet aux utilisateurs de :
- Commander une carte NFC personnalisée
- Renseigner leurs informations véhicule et contact
- Réserver un créneau selon un **mode intelligent** (Standard / Express / Turbo)
- Suivre l'historique de leurs entretiens depuis la carte

---

## 🔧 Technologies utilisées

- **HTML / CSS** : structure simple avec stylisation centralisée (`main.css`)
- **JavaScript ES Modules** : architecture modulaire (`state.js`, `ui.js`, `slots.js`, etc.)
- **JSON** : chargement dynamique des créneaux (`reservation-data.json`)
- **GitHub Pages** : hébergement statique gratuit

---

## 🗂 Structure du projet

```bash
.
├── index.html                # Page principale
├── main.css                 # Styles globaux
├── state.js                 # État global centralisé
├── ui.js                    # Logique d’interface
├── data.js                  # Chargement JSON
├── slots.js                 # Affichage et sélection des créneaux
├── init.js                  # Script principal
├── reservation-data.json    # Base des créneaux disponibles
├── reservation-logic-structure.json  # Structure étendue (future logique backend)
