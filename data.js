export let reservationData = null;

export async function fetchAvailableSlots() {
    if (!reservationData) {
        const response = await fetch('reservation-data.json');
        reservationData = await response.json();
    }
    return reservationData.availableSlots || {};
}
