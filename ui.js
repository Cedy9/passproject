import { bookingState } from './state.js';

export function showNotification(message, type = 'info', duration = 3000) {
    let container = document.getElementById('lw-notifications');
    if (!container) {
        container = document.createElement('div');
        container.id = 'lw-notifications';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;width:300px;';
        document.body.appendChild(container);
    }
    const notification = document.createElement('div');
    notification.className = `lw-notification lw-notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    notification.style.cssText = `padding:12px 15px;margin-bottom:10px;border-radius:4px;background-color:${type==='success'?'#d4edda':type==='error'?'#f8d7da':'#cce5ff'};color:${type==='success'?'#155724':type==='error'?'#721c24':'#004085'};box-shadow:0 2px 5px rgba(0,0,0,0.1);transition:all 0.3s ease;opacity:0;transform:translateX(50px);`;
    notification.innerHTML = message;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    },10);
    setTimeout(()=>{
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        setTimeout(()=>notification.remove(),300);
    },duration);
}

export function navigateToStep(stepNumber) {
    // À compléter selon ta logique d'étapes, par exemple :
    // Afficher/masquer les sections, mettre à jour les indicateurs, etc.
    showNotification(`Navigation vers l'étape ${stepNumber}`);
}

export function updateSummary() {
    // À compléter : met à jour le résumé de la réservation dans le DOM
    showNotification('Résumé mis à jour', 'success');
}
