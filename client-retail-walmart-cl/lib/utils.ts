// Genera un session ID único para el usuario
export function getSessionId(): string {

  if (typeof window === 'undefined') {

    return `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  let sessionId = localStorage.getItem('delivery_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('delivery_session_id', sessionId);
  }
  
  return sessionId;
}

// Formatea fecha para el formato esperado por el backend (YYYY-MM-DD)
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Obtiene la fecha mínima (hoy)
export function getMinDate(): string {
  return formatDateForAPI(new Date());
}

// Obtiene la fecha máxima (30 días desde hoy)
export function getMaxDate(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  return formatDateForAPI(maxDate);
}
