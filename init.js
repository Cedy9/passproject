import { bookingState } from './state.js';
import { navigateToStep, updateSummary } from './ui.js';
import { updateTimeSlots } from './slots.js';
import { fetchAvailableSlots } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    await fetchAvailableSlots();
    navigateToStep(1);
    // Ajoute ici d'autres initialisations et listeners selon ton projet
});
