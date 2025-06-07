// Backend pour la gestion des créneaux de réservation
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

// Middleware pour les requêtes CORS et JSON
app.use(cors());
app.use(express.json());

// Chemin vers le fichier de données
const DATA_FILE = path.join(__dirname, 'slots-data.json');

// Fonctions utilitaires pour lire/écrire les données
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        // Créer un fichier vide si n'existe pas
        fs.writeFileSync(DATA_FILE, '{}', 'utf8');
        return {};
    }
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        console.error('Erreur lors de la lecture des données:', error);
        return {};
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture des données:', error);
        return false;
    }
}

// Définition des créneaux disponibles
const DEFAULT_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
// Créneaux du samedi modifiés pour être d'une heure minimum
const SATURDAY_SLOTS = ['09:00', '10:00', '11:00', '12:00'];

// Route pour obtenir les créneaux disponibles pour une date
app.get('/slots', (req, res) => {
    const date = req.query.date;
    
    // Vérifier si la date est fournie
    if (!date) {
        return res.status(400).json({
            error: 'Date requise sous format YYYY-MM-DD'
        });
    }
    
    // Lire les données
    const data = readData();
    const bookedSlots = data[date] || [];
    
    // Déterminer si c'est un samedi (jour 6 de la semaine)
    const day = new Date(date).getDay();
    const allSlots = (day === 6) ? SATURDAY_SLOTS : DEFAULT_SLOTS;
    
    // Filtrer les créneaux disponibles
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    // Retourner la réponse
    res.json({
        date,
        available: availableSlots,
        booked: bookedSlots
    });
});

// Route pour réserver un créneau
app.post('/book', (req, res) => {
    const { date, slot, client, vehicle } = req.body;
    
    // Vérifier les données requises
    if (!date || !slot) {
        return res.status(400).json({
            success: false,
            error: 'Date et créneau obligatoires'
        });
    }
    
    // Lire les données existantes
    const data = readData();
    
    // Créer le tableau pour cette date s'il n'existe pas
    if (!data[date]) {
        data[date] = [];
    }
    
    // Vérifier si le créneau est déjà réservé
    if (data[date].includes(slot)) {
        return res.status(409).json({
            success: false,
            error: 'Ce créneau est déjà réservé'
        });
    }
    
    // Ajouter le créneau à la liste des réservés
    data[date].push(slot);
    
    // Sauvegarder dans le fichier
    if (writeData(data)) {
        console.log(`Réservation: ${date} à ${slot} par ${client?.name || 'anonyme'}`);
        res.json({
            success: true,
            date,
            slot
        });
    } else {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la sauvegarde'
        });
    }
});

// Route pour récupérer toutes les réservations
app.get('/bookings', (req, res) => {
    const data = readData();
    
    // Formater les données pour les rendre plus lisibles
    const formattedBookings = [];
    
    Object.keys(data).forEach(date => {
        data[date].forEach(slot => {
            formattedBookings.push({
                date,
                slot,
                id: `${date}-${slot.replace(':', '-')}`
            });
        });
    });
    
    res.json({
        totalBookings: formattedBookings.length,
        bookings: formattedBookings
    });
});

// Route pour supprimer une réservation
app.delete('/booking/:id', (req, res) => {
    const bookingId = req.params.id;
    const [date, time] = bookingId.split('-');
    const slot = `${time.substring(0, 2)}:${time.substring(3)}`;
    
    const data = readData();
    
    // Vérifier si la date existe
    if (!data[date] || !data[date].includes(slot)) {
        return res.status(404).json({
            success: false,
            error: 'Réservation introuvable'
        });
    }
    
    // Supprimer le créneau
    data[date] = data[date].filter(s => s !== slot);
    
    // Si plus de créneaux pour cette date, supprimer la date
    if (data[date].length === 0) {
        delete data[date];
    }
    
    // Sauvegarder les modifications
    if (writeData(data)) {
        console.log(`Réservation supprimée: ${date} à ${slot}`);
        res.json({
            success: true,
            message: 'Réservation supprimée avec succès'
        });
    } else {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression'
        });
    }
});

// Route pour la santé du serveur
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
