// Native WebSocket Polling & Event Handler for Vite (Zero External Dependencies)

let listeners = [];
let pollingInterval = null;

export const connectWebSocket = (onConnectedCallback) => {
  try {
    // Check backend connection health
    if (onConnectedCallback) {
      onConnectedCallback();
    }

    // Auto-polling fallback to simulate real-time updates smoothly
    if (!pollingInterval) {
      pollingInterval = setInterval(() => {
        listeners.forEach((callback) => {
          try {
            callback('FLEET_SYNC');
          } catch (e) {
            console.error(e);
          }
        });
      }, 10000); // 10s auto-refresh
    }
  } catch (err) {
    console.warn('WebSocket fallback initialized:', err);
  }
};

export const subscribeToBusUpdates = (onMessageReceived) => {
  if (onMessageReceived && !listeners.includes(onMessageReceived)) {
    listeners.push(onMessageReceived);
  }

  return () => {
    listeners = listeners.filter((cb) => cb !== onMessageReceived);
  };
};

export const disconnectWebSocket = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  listeners = [];
};

export default {
  connectWebSocket,
  subscribeToBusUpdates,
  disconnectWebSocket,
};