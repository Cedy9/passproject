import { bookingState } from './state.js';

export function updateTimeSlots(newSlots) {
    bookingState.timeSlots = newSlots;
}

// Ajoute ici d'autres fonctions pour gérer les créneaux, le calendrier, etc.
