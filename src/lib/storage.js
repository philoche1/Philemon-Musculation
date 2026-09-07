// Storage module that mimics the window.storage API used inside Claude
// artifacts, so the rest of the app (App.jsx) doesn't need to change.
//
// - shared = true  -> passe par la fonction serveur sécurisée /api/musculation-data
//                      (le navigateur n'a plus jamais d'accès direct à Supabase)
// - shared = false -> stored in this browser's localStorage (personal to this device)

const COACH_TOKEN_KEY = 'musculation-coach-token-v1';
const CLIENT_TOKEN_KEY = 'musculation-client-token-v1';

function localKeyName(key) {
  return `philemon-local:${key}`;
}

export function getCoachToken() {
  return window.localStorage.getItem(COACH_TOKEN_KEY);
}
export function setCoachToken(token) {
  window.localStorage.setItem(COACH_TOKEN_KEY, token);
}
export function clearCoachToken() {
  window.localStorage.removeItem(COACH_TOKEN_KEY);
}

export function getClientToken() {
  return window.localStorage.getItem(CLIENT_TOKEN_KEY);
}
export function setClientToken(token) {
  window.localStorage.setItem(CLIENT_TOKEN_KEY, token);
}
export function clearClientToken() {
  window.localStorage.removeItem(CLIENT_TOKEN_KEY);
}

// Le proxy accepte l'un ou l'autre jeton : on envoie celui qui existe
// (en pratique un seul rôle actif à la fois sur un même appareil).
function getActiveToken() {
  return getCoachToken() || getClientToken();
}

async function callProxy(body) {
  const token = getActiveToken();
  const res = await fetch('/api/musculation-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Erreur serveur (${res.status})`);
  }
  const data = await res.json();
  return data.result;
}

async function get(key, shared = false) {
  if (!shared) {
    const raw = window.localStorage.getItem(localKeyName(key));
    if (raw === null) return null;
    return { key, value: raw, shared };
  }
  return await callProxy({ action: 'get', key });
}

async function set(key, value, shared = false) {
  if (!shared) {
    window.localStorage.setItem(localKeyName(key), value);
    return { key, value, shared };
  }
  return await callProxy({ action: 'set', key, value });
}

async function del(key, shared = false) {
  if (!shared) {
    window.localStorage.removeItem(localKeyName(key));
    return { key, deleted: true, shared };
  }
  return await callProxy({ action: 'delete', key });
}

async function list(prefix = '', shared = false) {
  if (!shared) {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      const marker = 'philemon-local:';
      if (k && k.startsWith(marker + prefix)) keys.push(k.slice(marker.length));
    }
    return { keys, prefix, shared };
  }
  return await callProxy({ action: 'list', prefix });
}

export const storage = { get, set, delete: del, list };
