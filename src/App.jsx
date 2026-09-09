import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { setCoachToken, getCoachToken, clearCoachToken, setClientToken, getClientToken, clearClientToken } from "./lib/storage.js";

const DEFAULT_DATA = {"exercises": [{"id": "ex1", "zone": "WARM UP", "groupe": "Quadriceps", "nom": "Fente TRX"}, {"id": "ex2", "zone": "WARM UP", "groupe": "Quadriceps", "nom": "Squat"}, {"id": "ex3", "zone": "WARM UP", "groupe": "Ischios", "nom": "RDL"}, {"id": "ex4", "zone": "WARM UP", "groupe": "Dos", "nom": "Trx tirage"}, {"id": "ex5", "zone": "WARM UP", "groupe": "Épaules", "nom": "Rota/lat/fly"}, {"id": "ex6", "zone": "WARM UP", "groupe": "Obliques", "nom": "Bucheron"}, {"id": "ex7", "zone": "WARM UP", "groupe": "Gainage", "nom": "g 3 trx+G"}, {"id": "ex8", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Press fente"}, {"id": "ex9", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Press squat"}, {"id": "ex10", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Hack squat"}, {"id": "ex11", "zone": "BAS DU CORPS", "groupe": "Fessiers\nQuadriceps", "nom": "Power runner"}, {"id": "ex12", "zone": "BAS DU CORPS", "groupe": "Fessiers\nIshios", "nom": "Hip thrust"}, {"id": "ex13", "zone": "BAS DU CORPS", "groupe": "Fessiers\nIshios", "nom": "Smith lift"}, {"id": "ex14", "zone": "BAS DU CORPS", "groupe": "Abducteurs", "nom": "Abduction"}, {"id": "ex15", "zone": "BAS DU CORPS", "groupe": "Abducteurs", "nom": "Abduction\nunilatérale"}, {"id": "ex16", "zone": "BAS DU CORPS", "groupe": "Adducteurs", "nom": "Adduction"}, {"id": "ex17", "zone": "BAS DU CORPS", "groupe": "Adducteurs", "nom": "Adduction unilatérale"}, {"id": "ex18", "zone": "BAS DU CORPS", "groupe": "Ischios", "nom": "Leg curl"}, {"id": "ex19", "zone": "BAS DU CORPS", "groupe": "Ischios", "nom": "Leg curl\nunilatéral"}, {"id": "ex20", "zone": "BAS DU CORPS", "groupe": "Ischios", "nom": "Box leg curl"}, {"id": "ex21", "zone": "BAS DU CORPS", "groupe": "Quadriceps", "nom": "Leg extension"}, {"id": "ex22", "zone": "BAS DU CORPS", "groupe": "Quadriceps", "nom": "Leg extension unilatéral"}, {"id": "ex23", "zone": "BAS DU CORPS", "groupe": "Mollets", "nom": "Calf Press"}, {"id": "ex24", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage vertical"}, {"id": "ex25", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage horizontal"}, {"id": "ex26", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage horizontal unilatéral"}, {"id": "ex27", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Tirage diagonale"}, {"id": "ex28", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Traction délestée"}, {"id": "ex29", "zone": "HAUT DU CORPS", "groupe": "Dos", "nom": "Reverse fly"}, {"id": "ex30", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Dips délestée"}, {"id": "ex31", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Chest press"}, {"id": "ex32", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Chest press incliné"}, {"id": "ex33", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Fly"}, {"id": "ex34", "zone": "HAUT DU CORPS", "groupe": "Pectoraux", "nom": "Butterfly"}, {"id": "ex35", "zone": "HAUT DU CORPS", "groupe": "Épaules", "nom": "Shoulder press"}, {"id": "ex36", "zone": "HAUT DU CORPS", "groupe": "Épaules", "nom": "Elévation latérale"}, {"id": "ex37", "zone": "HAUT DU CORPS", "groupe": "Épaules", "nom": "Elévation postérieure"}, {"id": "ex38", "zone": "HAUT DU CORPS", "groupe": "Biceps", "nom": "Biceps curl droit\nsuppination\nneutre\npronation"}, {"id": "ex39", "zone": "HAUT DU CORPS", "groupe": "Biceps", "nom": "Biceps curl incliné\nsuppination\nneutre\npronation"}, {"id": "ex40", "zone": "HAUT DU CORPS", "groupe": "Triceps", "nom": "Extension triceps coude haut\nsuppination\nneutre\npronation"}, {"id": "ex41", "zone": "HAUT DU CORPS", "groupe": "Triceps", "nom": "Extension triceps coude milieu\nsuppination\nneutre\npronation"}, {"id": "ex42", "zone": "CENTRE DU CORPS", "groupe": "Grand dorit iso", "nom": "Gainage frontal"}, {"id": "ex43", "zone": "CENTRE DU CORPS", "groupe": "Obliques iso", "nom": "Gainage latéral"}, {"id": "ex44", "zone": "CENTRE DU CORPS", "groupe": "Erecteur iso", "nom": "Gainage dorsal"}, {"id": "ex45", "zone": "CENTRE DU CORPS", "groupe": "Obliques\ndynamique", "nom": "Oblique debout"}, {"id": "ex46", "zone": "CENTRE DU CORPS", "groupe": "Obliques\nanti inclinaison", "nom": "Farmer walk"}, {"id": "ex47", "zone": "CENTRE DU CORPS", "groupe": "Transverse", "nom": "Hypopression"}, {"id": "ex48", "zone": "CENTRE DU CORPS", "groupe": "Erecteurs\nanti rotation", "nom": "Bird dog"}], "seanceTypes": [{"id": "st1", "nom": "Full body B", "exerciceIds": ["ex1", "ex4", "ex7", "ex12", "ex14", "ex16", "ex31", "ex42", "ex43"]}, {"id": "st2", "nom": "Full body D", "exerciceIds": ["ex1", "ex12", "ex16", "ex18", "ex31", "ex44", "ex45"]}, {"id": "st3", "nom": "Full body A", "exerciceIds": ["ex2", "ex3", "ex5", "ex9", "ex18", "ex21", "ex23", "ex27", "ex42", "ex44"]}, {"id": "st4", "nom": "Full body C", "exerciceIds": ["ex2", "ex8", "ex14", "ex21", "ex23", "ex25", "ex46", "ex48"]}, {"id": "st5", "nom": "Lower quad/abd/calf", "exerciceIds": ["ex8", "ex14", "ex21", "ex23"]}, {"id": "st6", "nom": "Lower full", "exerciceIds": ["ex8", "ex12", "ex14", "ex17"]}, {"id": "st7", "nom": "Lower quad", "exerciceIds": ["ex9", "ex12", "ex21", "ex23", "ex24", "ex42", "ex46"]}, {"id": "st8", "nom": "Lower quad/ham/calf", "exerciceIds": ["ex9", "ex18", "ex21", "ex23"]}, {"id": "st9", "nom": "Lower quad/calf/glute", "exerciceIds": ["ex9", "ex12", "ex21", "ex23"]}, {"id": "st10", "nom": "Lower glut/add/abd", "exerciceIds": ["ex12", "ex14", "ex16"]}, {"id": "st11", "nom": "Lower Ham/add/glute", "exerciceIds": ["ex12", "ex16", "ex18"]}, {"id": "st12", "nom": "Lower ham", "exerciceIds": ["ex14", "ex16", "ex18", "ex34"]}, {"id": "st13", "nom": "Lower ham/Add/Abd", "exerciceIds": ["ex14", "ex16", "ex18"]}, {"id": "st14", "nom": "Upper pull", "exerciceIds": ["ex25", "ex27", "ex29", "ex36"]}, {"id": "st15", "nom": "Upper push/pull", "exerciceIds": ["ex26", "ex27", "ex31", "ex36"]}, {"id": "st16", "nom": "Upper push", "exerciceIds": ["ex31", "ex32", "ex33", "ex36"]}], "programs": [{"id": "pr1", "nom": "Programme lower A", "seanceTypeIds": ["st8", "st10"]}, {"id": "pr2", "nom": "Programme lower B", "seanceTypeIds": ["st5", "st11"]}, {"id": "pr3", "nom": "Programme lower C", "seanceTypeIds": ["st9", "st13"]}, {"id": "pr4", "nom": "Programme full body 1", "seanceTypeIds": ["st3", "st1"]}, {"id": "pr5", "nom": "Programme full body 2", "seanceTypeIds": ["st4", "st2"]}, {"id": "pr6", "nom": "Programme upper", "seanceTypeIds": ["st14", "st16"]}, {"id": "pr7", "nom": "Programme upper/lower", "seanceTypeIds": ["st6", "st15"]}, {"id": "pr8", "nom": "Programme push/pull/leg", "seanceTypeIds": ["st6", "st14", "st16"]}, {"id": "pr9", "nom": "Programme 2 lower/1 upper", "seanceTypeIds": ["st8", "st10", "st15"]}], "sessions": [{"id": "se1", "date": "2026-07-20", "entries": [{"exerciceId": "ex1", "serie": 1, "reps": 12, "charge": 8}, {"exerciceId": "ex2", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex3", "serie": 1, "reps": 12, "charge": 20}, {"exerciceId": "ex4", "serie": 1, "reps": 12, "charge": 10}, {"exerciceId": "ex5", "serie": 1, "reps": 15, "charge": 5}, {"exerciceId": "ex6", "serie": 1, "reps": 15, "charge": 8}, {"exerciceId": "ex7", "serie": 1, "reps": 12, "charge": 5}, {"exerciceId": "ex8", "serie": 1, "reps": 15, "charge": 40}, {"exerciceId": "ex8", "serie": 2, "reps": 15, "charge": 40}, {"exerciceId": "ex8", "serie": 3, "reps": 12, "charge": 42}, {"exerciceId": "ex8", "serie": 4, "reps": 12, "charge": 42}, {"exerciceId": "ex9", "serie": 1, "reps": 15, "charge": 60}, {"exerciceId": "ex9", "serie": 2, "reps": 15, "charge": 60}, {"exerciceId": "ex9", "serie": 3, "reps": 12, "charge": 62}, {"exerciceId": "ex9", "serie": 4, "reps": 12, "charge": 62}]}], "closing": true}
;

// (données de démo tronquées pour l'aperçu — le fichier complet reste sur GitHub)

const LIBRARY_KEY = "library-v1";
const CLIENTS_KEY = "clients-v1";
const ROLE_KEY = "role-choice-v1";
const CLIENT_CHOICE_KEY = "client-choice-v1";
const COACH_ACCOUNT_KEY = "coach-account-v1";
const COACH_AUTH_KEY = "coach-authed-v1";
const sessionsKey = (clientId) => `sessions-v1-${clientId}`;
const profileKey = (clientId) => `profile-v1-${clientId}`;
const bookingsKey = (clientId) => `calendly-bookings-v1-${clientId}`;

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}
const LIENS_CALENDLY = {
  "30min": "https://calendly.com/philemon-stordeur/philemon-musculation-30min",
  "1h": "https://calendly.com/philemon-stordeur/philemon-musculation-1h",
  "1h30": "https://calendly.com/philemon-stordeur/philemon-musculation-1h30",
};
const PALIERS_ACCOMPAGNEMENT = [
  { id: "fer", nom: "Fer", presentiel: 5, distanciel: 0 },
  { id: "bronze", nom: "Bronze", presentiel: 23, distanciel: 10 },
  { id: "argent", nom: "Argent", presentiel: 44, distanciel: 23 },
  { id: "or", nom: "Or", presentiel: 60, distanciel: 40 },
  { id: "diamant", nom: "Diamant", presentiel: 60, distanciel: 40 },
];
const PROFILE_FIELDS = [
  { key: "passeSportif", label: "Passé sportif, activité" },
  { key: "presentSportif", label: "Présent sportif, activité" },
  { key: "objectifs", label: "Objectifs court, moyen, long terme" },
  { key: "sante", label: "Santé" },
  { key: "exercicesAEviter", label: "Exercices à éviter" },
  { key: "alimentation", label: "Alimentation" },
  { key: "boisson", label: "Boisson" },
  { key: "fume", label: "Fume" },
  { key: "tempsEcran", label: "Temps d'écran" },
  { key: "sommeil", label: "Sommeil" },
  { key: "stress", label: "Stress sur une échelle de 1 à 10" },
  { key: "frequenceEntrainement", label: "Fréquence d'entraînement par semaine" },
  { key: "brasFaible", label: "Bras faible" },
  { key: "jambeFaible", label: "Jambe faible" },
];

const DEFAULT_SERIES_COUNT = 4;
const WARMUP_SERIES_COUNT = 3;
const GAINAGE_SERIES_COUNT = 3;
const ENDSESSION_SERIES_COUNT = 3;

const DEFAULT_REPS = 12;
const DEFAULT_CHARGE = 10;
const WARMUP_DEFAULT_SECONDS = 50;
const ENDSESSION_DEFAULT_RESPIRATION = 4;
const GAINAGE_DEFAULT_SECONDS = 60;

function isWarmupExercise(ex) {
  return !!ex && getExerciseZones(ex).some((z) => zoneLabel(z) === "Échauffement");
}

function isEndSessionExercise(ex) {
  return !!ex && getExerciseZones(ex).some((z) => zoneLabel(z) === "Étirements");
}

function isMobilityExercise(ex) {
  return !!ex && getExerciseZones(ex).some((z) => zoneLabel(z) === "Mobilité");
}

function isCardioExercise(ex) {
  return !!ex && getExerciseZones(ex).some((z) => zoneLabel(z) === "Cardio");
}

function isGainageExercise(ex) {
  return !!ex && !!ex.nom && ex.nom.toLowerCase().includes("gainage");
}

function makeEntries(exerciceIds, exercisesMap) {
  const entries = [];
  exerciceIds.forEach((exId) => {
    const ex = exercisesMap ? exercisesMap[exId] : null;
    const warmup = isWarmupExercise(ex);
    const endSession = isEndSessionExercise(ex);
    const mobility = isMobilityExercise(ex);
    const cardio = isCardioExercise(ex);
    const gainage = isGainageExercise(ex);
    if (mobility || endSession || cardio) {
      entries.push({ exerciceId: exId, serie: 1, reps: null, charge: null });
      return;
    }
    let count = DEFAULT_SERIES_COUNT;
    let repsDefault = DEFAULT_REPS;
    let chargeDefault = DEFAULT_CHARGE;
    if (warmup) {
      count = WARMUP_SERIES_COUNT;
      repsDefault = WARMUP_DEFAULT_SECONDS;
    } else if (gainage) {
      count = GAINAGE_SERIES_COUNT;
      repsDefault = GAINAGE_DEFAULT_SECONDS;
      chargeDefault = null;
    }
    for (let s = 1; s <= count; s++) {
      entries.push({ exerciceId: exId, serie: s, reps: repsDefault, charge: chargeDefault });
    }
  });
  return entries;
}

// Retrouve les valeurs (reps/charge) de la dernière séance du MÊME type
// (même nom) faite par ce client, pour pré-remplir la nouvelle séance au
// lieu de valeurs par défaut arbitraires.
function getPreviousEntriesSameSeance(allSessions, seanceNom, excludeSessionId) {
  if (!seanceNom) return null;
  const candidats = (allSessions || [])
    .map((s, idx) => ({ s, idx }))
    .filter(({ s }) => s.id !== excludeSessionId && s.seanceNom === seanceNom)
    .sort((a, b) => {
      if (a.s.date !== b.s.date) return a.s.date < b.s.date ? 1 : -1;
      return b.idx - a.idx;
    });
  if (candidats.length === 0) return null;
  const map = {};
  candidats[0].s.entries.forEach((e) => {
    map[e.exerciceId + "_" + e.serie] = { reps: e.reps, charge: e.charge };
  });
  return map;
}

// Applique les valeurs de la dernière séance identique (si elle existe) sur
// un tableau d'entries fraîchement généré par makeEntries, et initialise le
// statut "validée" de chaque série à false.
function applyPreviousEntries(entries, previousMap) {
  return entries.map((e) => {
    const prev = previousMap ? previousMap[e.exerciceId + "_" + e.serie] : null;
    return {
      ...e,
      reps: prev && prev.reps != null ? prev.reps : e.reps,
      charge: prev && prev.charge != null ? prev.charge : e.charge,
      validee: false,
    };
  });
}

function formatDateFR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [role, setRole] = useState(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  const [clients, setClients] = useState(null);
  const [clientsLoaded, setClientsLoaded] = useState(false);
   const [clientId, setClientId] = useState(null);
  const [clientChoiceLoaded, setClientChoiceLoaded] = useState(false);
  const [clientRecord, setClientRecord] = useState(null); // données du client connecté (rôle client uniquement)

  const [coachAccount, setCoachAccount] = useState(null);
  const [coachAccountLoaded, setCoachAccountLoaded] = useState(false);
  const [coachAuthed, setCoachAuthed] = useState(false);
  const [coachAuthLoaded, setCoachAuthLoaded] = useState(false);
  const [apercuClient, setApercuClient] = useState(false); // le coach voit l'interface comme un client, sans les contrôles d'édition

  const [library, setLibrary] = useState(null);
  const [libraryLoaded, setLibraryLoaded] = useState(false);

  const [sessions, setSessions] = useState(null);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [bookings, setBookings] = useState(null);
  const [bookingsLoaded, setBookingsLoaded] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [view, setView] = useState("profil");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

   useEffect(() => {
    const estSousDomaineAdmin = window.location.hostname.startsWith("admin.");
    setRole(estSousDomaineAdmin ? "coach" : "client");
    setRoleLoaded(true);
  }, []);
  // Restaure la session client mémorisée sur cet appareil (sans jamais redemander le PIN)
  useEffect(() => {
    if (getClientToken()) {
      try {
        const raw = window.localStorage.getItem("musculation-client-record-v1");
        if (raw) setClientRecord(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);
    // La liste complète des clients (avec leurs PIN) n'est chargée que pour un coach authentifié
  useEffect(() => {
    if (!(role === "coach" && coachAuthed)) return;
    (async () => {
      let cl = null;
      try {
        const r = await window.storage.get(CLIENTS_KEY, true);
        if (r && r.value) cl = JSON.parse(r.value);
      } catch (e) {}
      setClients(cl || []);
      setClientsLoaded(true);
    })();
  }, [role, coachAuthed]);

  // Le catalogue (library) est lisible par un coach authentifié ou un client authentifié
  useEffect(() => {
    const canLoad = (role === "coach" && coachAuthed) || (role === "client" && !!clientId);
    if (!canLoad) return;
    (async () => {
      let lib = null;
      try {
        const r = await window.storage.get(LIBRARY_KEY, true);
        if (r && r.value) lib = JSON.parse(r.value);
      } catch (e) {}
      if (!lib) {
        lib = {
          exercises: DEFAULT_DATA.exercises,
          seanceTypes: DEFAULT_DATA.seanceTypes,
          programs: DEFAULT_DATA.programs,
          ctTypes: [],
          ctPrograms: [],
          alimentationVideos: { matin: "", midi: "", gouter: "", soir: "" },
          ctLevelNames: ["Bilatéral", "Unilatéral"],
        };
      } else {
        if (!lib.ctTypes) lib.ctTypes = [];
        if (!lib.ctPrograms) lib.ctPrograms = [];
        if (!lib.alimentationVideos) lib.alimentationVideos = { matin: "", midi: "", gouter: "", soir: "" };
        if (!lib.ctLevelNames) lib.ctLevelNames = ["Bilatéral", "Unilatéral"];
      }
      setLibrary(lib);
      setLibraryLoaded(true);
    })();
  }, [role, coachAuthed, clientId]);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(CLIENT_CHOICE_KEY, false);
        if (r && r.value) setClientId(r.value);
      } catch (e) {}
      setClientChoiceLoaded(true);
    })();
  }, []);

   // Vérifie seulement si un compte coach existe déjà, sans jamais exposer le mot de passe
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/musculation-coach-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check" }),
        });
        const data = await res.json().catch(() => ({}));
        setCoachAccount(data.hasAccount ? { email: null } : null);
      } catch (e) {
        setCoachAccount(null);
      }
      setCoachAccountLoaded(true);
    })();
  }, []);

   // Load coach auth status for this device — vérifié auprès du serveur, pas juste sa présence locale
  useEffect(() => {
    (async () => {
      const token = getCoachToken();
      if (token) {
        try {
          const res = await fetch("/api/musculation-coach-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "verify", token }),
          });
          if (res.ok) {
            setCoachAuthed(true);
          } else {
            clearCoachToken();
          }
        } catch (e) {
          clearCoachToken();
        }
      }
      setCoachAuthLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!clientId) return;
    setSessionsLoaded(false);
    (async () => {
      let s = null;
      try {
        const r = await window.storage.get(sessionsKey(clientId), true);
        if (r && r.value) s = JSON.parse(r.value);
      } catch (e) {}
      if (!s) s = [];
      setSessions(s);
      setSessionsLoaded(true);
    })();
  }, [clientId]);
useEffect(() => {
  if (!clientId) return;
  setBookingsLoaded(false);
  (async () => {
    let b = null;
    try {
      const r = await window.storage.get(bookingsKey(clientId), true);
      if (r && r.value) b = JSON.parse(r.value);
    } catch (e) {}
    if (!b) b = [];
    setBookings(b);
    setBookingsLoaded(true);
  })();
}, [clientId]);
  useEffect(() => {
    if (!clientId) return;
    setProfileLoaded(false);
    (async () => {
      let p = null;
      try {
        const r = await window.storage.get(profileKey(clientId), true);
        if (r && r.value) p = JSON.parse(r.value);
      } catch (e) {}
      if (!p) p = {};
      setProfile(p);
      setProfileLoaded(true);
    })();
  }, [clientId]);

  const chooseRole = async (r) => {
    setRole(r);
    try { await window.storage.set(ROLE_KEY, r, false); } catch (e) {}
  };
  const changeRole = () => setRole(null);

    const createCoachAccount = async (email, password) => {
    const res = await fetch("/api/musculation-coach-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { status: "error", error: data.error };
    setCoachToken(data.token);
    setCoachAccount({ email: email.trim().toLowerCase() });
    setCoachAuthed(true);
    return { status: "ok" };
  };

   const loginCoach = async (email, password) => {
    const res = await fetch("/api/musculation-coach-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { status: data.status || "error" };
    setCoachToken(data.token);
    setCoachAuthed(true);
    return { status: "ok" };
  };

    const logoutCoach = async () => {
    setCoachAuthed(false);
    clearCoachToken();
  };

  const chooseClient = async (id) => {
    setClientId(id);
    try { await window.storage.set(CLIENT_CHOICE_KEY, id, false); } catch (e) {}
  };
   const changeClient = () => {
    setClientId(null);
    setClientRecord(null);
    clearClientToken();
    setApercuClient(false);
    try { window.localStorage.removeItem("musculation-client-record-v1"); } catch (e) {}
  };

   const addClient = async (name, email, pin, typeSeance) => {
    const newClient = { id: uid("client"), name, email, pin, typeSeance: typeSeance || "1h" };
    const newClients = [...(clients || []), newClient];
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
    try { await window.storage.set(sessionsKey(newClient.id), JSON.stringify([]), true); } catch (e) {}
    try {
      await fetch("/api/welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getCoachToken()}` },
        body: JSON.stringify({ name, email, pin }),
      });
    } catch (e) {}
    await chooseClient(newClient.id);
    return newClient;
  };

  const renvoyerEmailBienvenue = async (client) => {
    try {
      await fetch("/api/welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getCoachToken()}` },
        body: JSON.stringify({ name: client.name, email: client.email, pin: client.pin }),
      });
      setToast("Email envoyé");
    } catch (e) {
      setToast("Erreur d'envoi, réessaie");
    }
    setTimeout(() => setToast(null), 1800);
  };

  const deleteClient = async (id) => {
  const newClients = (clients || []).filter((c) => c.id !== id);
  setClients(newClients);
  try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  try { await window.storage.delete(sessionsKey(id), true); } catch (e) {}
  try { await window.storage.delete(profileKey(id), true); } catch (e) {}
  try { await window.storage.delete(bookingsKey(id), true); } catch (e) {}
  if (clientId === id) setClientId(null);
};

   const loginClient = async (email, pin) => {
    const res = await fetch("/api/musculation-client-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { status: data.status || "error" };
    setClientToken(data.token);
    setClientRecord(data.client);
    try { window.localStorage.setItem("musculation-client-record-v1", JSON.stringify(data.client)); } catch (e) {}
    return { status: "ok", id: data.client.id };
  };

  const forgotPin = async (email) => {
    try {
      const res = await fetch("/api/musculation-client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot_pin", email }),
      });
      return res.ok ? { status: "ok" } : { status: "error" };
    } catch (e) {
      return { status: "error" };
    }
  };

  const changePin = async (oldPin, newPin) => {
    try {
      const res = await fetch("/api/musculation-client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getClientToken()}` },
        body: JSON.stringify({ action: "change_pin", oldPin, newPin }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { status: data.status || "error" };
      // Met à jour la copie locale du client (utilisée pour l'affichage) avec le nouveau code
      setClientRecord((prev) => {
        const updated = prev ? { ...prev, pin: newPin } : prev;
        try { window.localStorage.setItem("musculation-client-record-v1", JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
      return { status: "ok" };
    } catch (e) {
      return { status: "error" };
    }
  };

  const assignProgram = useCallback(async (programId) => {
    if (!clientId) return;
    const now = new Date().toISOString();
    const newClients = clients.map((c) => {
      if (c.id !== clientId) return c;
      if ((programId || null) === (c.programId || null)) return c; // pas de changement réel
      const historique = c.programmeHistorique || [];
      // clôture l'entrée en cours si elle existe encore
      const historiqueMisAJour = historique.map((h, i) =>
        i === historique.length - 1 && !h.dateFin ? { ...h, dateFin: now } : h
      );
      const nouvelleEntree = programId ? [{ programId, dateDebut: now, dateFin: null }] : [];
      return {
        ...c,
        programId: programId || null,
        programmeHistorique: [...historiqueMisAJour, ...nouvelleEntree],
      };
    });
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  // Permet au coach de retirer une entrée de l'historique des programmes suivis
  const deleteProgrammeHistorique = useCallback(async (index) => {
    if (!clientId) return;
    const newClients = clients.map((c) => {
      if (c.id !== clientId) return c;
      const historique = (c.programmeHistorique || []).filter((_, i) => i !== index);
      return { ...c, programmeHistorique: historique };
    });
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const assignProgramDistanciel = useCallback(async (programId) => {
    if (!clientId) return;
    const now = new Date().toISOString();
    const newClients = clients.map((c) => {
      if (c.id !== clientId) return c;
      if ((programId || null) === (c.programDistancielId || null)) return c;
      const historique = c.programmeDistancielHistorique || [];
      const historiqueMisAJour = historique.map((h, i) =>
        i === historique.length - 1 && !h.dateFin ? { ...h, dateFin: now } : h
      );
      const nouvelleEntree = programId ? [{ programId, dateDebut: now, dateFin: null }] : [];
      return {
        ...c,
        programDistancielId: programId || null,
        programmeDistancielHistorique: [...historiqueMisAJour, ...nouvelleEntree],
      };
    });
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const deleteProgrammeDistancielHistorique = useCallback(async (index) => {
    if (!clientId) return;
    const newClients = clients.map((c) => {
      if (c.id !== clientId) return c;
      const historique = (c.programmeDistancielHistorique || []).filter((_, i) => i !== index);
      return { ...c, programmeDistancielHistorique: historique };
    });
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const assignCtProgram = useCallback(async (ctProgramId) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, ctProgramId: ctProgramId || null } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const assignMealPlan = useCallback(async (mealPlanId) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, mealPlanId: mealPlanId || null } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const assignAccompagnementPresentiel = useCallback(async (total) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, accompagnementPresentielTotal: total || null } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const setAccompagnementOffsetPresentiel = useCallback(async (offset) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, accompagnementPresentielOffset: Math.max(0, offset) } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const assignAccompagnementDistanciel = useCallback(async (total) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, accompagnementDistancielTotal: total || null } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const setAccompagnementOffsetDistanciel = useCallback(async (offset) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, accompagnementDistancielOffset: Math.max(0, offset) } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  // Assigne un palier (Fer/Bronze/Argent/Or/Diamant) : fixe automatiquement
  // les totaux présentiel + distanciel correspondants, et mémorise le palier
  // en cours pour l'affichage de la frise de progression.
  const assignPalier = useCallback(async (palierId) => {
    if (!clientId) return;
    const palier = PALIERS_ACCOMPAGNEMENT.find((p) => p.id === palierId);
    const newClients = clients.map((c) => {
      if (c.id !== clientId) return c;
      if (!palier) return { ...c, palierActuel: null };
      return {
        ...c,
        palierActuel: palierId,
        accompagnementPresentielTotal: palier.presentiel,
        accompagnementDistancielTotal: palier.distanciel,
      };
    });
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);

  const assignTypeSeance = useCallback(async (typeSeance) => {
    if (!clientId) return;
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, typeSeance: typeSeance || null } : c
    );
    setClients(newClients);
    try { await window.storage.set(CLIENTS_KEY, JSON.stringify(newClients), true); } catch (e) {}
  }, [clientId, clients]);
  const persistLibrary = useCallback(async (newLib) => {
    setSaving(true);
    setLibrary(newLib);
    try {
      await window.storage.set(LIBRARY_KEY, JSON.stringify(newLib), true);
      setToast("Enregistré");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const persistSessions = useCallback(async (newSessions) => {
    if (!clientId) return;
    setSaving(true);
    setSessions(newSessions);
    try {
      await window.storage.set(sessionsKey(clientId), JSON.stringify(newSessions), true);
      setToast("Enregistré");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, [clientId]);

  const persistProfile = useCallback(async (newProfile) => {
    if (!clientId) return;
    setSaving(true);
    setProfile(newProfile);
    try {
      await window.storage.set(profileKey(clientId), JSON.stringify(newProfile), true);
      setToast("Enregistré");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, [clientId]);

  // Permet au coach d'ajouter manuellement une séance faite hors Calendly
  // (ex: séance découverte réglée en direct, ou séance distancielle), pour qu'elle compte dans le pack.
  const addManualBooking = useCallback(async (dateTimeISO, status, type) => {
    if (!clientId) return;
    setSaving(true);
    const newBooking = {
      uri: uid("manual"),
      start_time: dateTimeISO,
      status: status || "effectuee",
      type: type || "presentiel",
      manual: true,
    };
    const newBookings = [...(bookings || []), newBooking];
    setBookings(newBookings);
    try {
      await window.storage.set(bookingsKey(clientId), JSON.stringify(newBookings), true);
      setToast("Séance ajoutée");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, [clientId, bookings]);

  // Auto-validation d'une séance distancielle par le client lui-même (un clic, date du jour)
  const validateDistancielSession = useCallback(async (uri) => {
    if (!clientId) return null;
    setSaving(true);
    const bookingUri = uri || uid("distanciel");
    const newBooking = {
      uri: bookingUri,
      start_time: new Date().toISOString(),
      status: "effectuee",
      type: "distanciel",
      manual: true,
    };
    const newBookings = [...(bookings || []), newBooking];
    setBookings(newBookings);
    try {
      await window.storage.set(bookingsKey(clientId), JSON.stringify(newBookings), true);
      setToast("Séance distancielle validée");
    } catch (e) {
      setToast("Erreur d'enregistrement, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
    return bookingUri;
  }, [clientId, bookings]);

  // Supprime une séance ajoutée manuellement (les réservations Calendly ne
  // peuvent pas être supprimées ici, seulement annulées depuis Calendly)
  const deleteManualBooking = useCallback(async (uri) => {
    if (!clientId) return;
    setSaving(true);
    const newBookings = (bookings || []).filter((b) => b.uri !== uri);
    setBookings(newBookings);
    try {
      await window.storage.set(bookingsKey(clientId), JSON.stringify(newBookings), true);
      setToast("Séance supprimée");
    } catch (e) {
      setToast("Erreur de suppression, réessaie");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 1800);
  }, [clientId, bookings]);

  const notReady =
    !roleLoaded || !clientChoiceLoaded || !coachAccountLoaded || !coachAuthLoaded ||
    (role === "coach" && coachAuthed && !clientsLoaded);

  if (notReady) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
        <div style={{ marginTop: 16, color: "#9CA3AF", fontFamily: FONT_BODY }}>Chargement du suivi…</div>
      </div>
    );
  }



  if (role === "coach" && !coachAuthed) {
    return (
        <CoachAuth
        hasAccount={!!coachAccount}
        onCreate={createCoachAccount}
        onLogin={loginCoach}
      />
    );
  }

  const needsClientSelection =
    role === "client" ? !clientRecord : !clientId || !clients.find((c) => c.id === clientId);

  if (needsClientSelection) {
    return (
        <ClientSelect
        clients={clients}
                    role={role}
        onChoose={chooseClient}
        onAdd={addClient}
        onDelete={deleteClient}
        onLogin={loginClient}
        onResendWelcome={renvoyerEmailBienvenue}
        onForgotPin={forgotPin}
      />
    );
  }

  const activeClient = role === "client" ? clientRecord : clients.find((c) => c.id === clientId);
  const roleEffectif = role === "coach" && apercuClient ? "client" : role;
  const data = library && sessions !== null ? { ...library, sessions } : null;

  return (
    <div style={styles.app}>
         <Header
        role={role}
        view={view}
        setView={setView}
        apercuClient={apercuClient}
        onToggleApercuClient={() => setApercuClient((v) => !v)}
        clientName={activeClient ? activeClient.name : ""}
        onChangeClient={changeClient}
        saving={saving}
        onLogoutCoach={logoutCoach}
      />
      <div style={styles.body}>
       {!data || !sessionsLoaded || !bookingsLoaded ? (
          <div style={{ ...styles.emptyState, padding: "60px 0" }}>Chargement des données du client…</div>
        ) : (
          <>
                      {view === "profil" && (
              <ProfileView
                profile={profile}
                profileLoaded={profileLoaded}
                persistProfile={persistProfile}
                activeClient={activeClient}
                role={roleEffectif}
                assignTypeSeance={assignTypeSeance}
                presentielCount={
  (bookings || []).filter(
    (b) => b.status !== "annulee" && (b.type || "presentiel") === "presentiel" && new Date(b.start_time) <= new Date()
  ).length
}
                distancielCount={
  (bookings || []).filter(
    (b) => b.status !== "annulee" && b.type === "distanciel" && new Date(b.start_time) <= new Date()
  ).length
}
bookings={bookings} 
                assignAccompagnementPresentiel={assignAccompagnementPresentiel}
                setAccompagnementOffsetPresentiel={setAccompagnementOffsetPresentiel}
                assignAccompagnementDistanciel={assignAccompagnementDistanciel}
                setAccompagnementOffsetDistanciel={setAccompagnementOffsetDistanciel}
                addManualBooking={addManualBooking}
                deleteManualBooking={deleteManualBooking}
                validateDistancielSession={validateDistancielSession}
                onChangePin={changePin}
                assignPalier={assignPalier}
                onGoToSuivi={() => setView("suivi")}
              />
            )}
            {view === "suivi" && (
              <SuiviView
                data={data}
                persistSessions={persistSessions}
                role={roleEffectif}
                activeClient={activeClient}
                deleteProgrammeHistorique={deleteProgrammeHistorique}
                deleteProgrammeDistancielHistorique={deleteProgrammeDistancielHistorique}
                validateDistancielSession={validateDistancielSession}
                deleteManualBooking={deleteManualBooking}
              />
            )}
            {view === "progression" && <ProgressionView data={data} />}
            {view === "ct" && <CTView data={data} activeClient={activeClient} clientId={clientId} role={roleEffectif} persistLibrary={persistLibrary} />}
            {view === "alimentation" && <AlimentationView clientId={clientId} role={roleEffectif} data={data} persistLibrary={persistLibrary} activeClient={activeClient} assignMealPlan={assignMealPlan} />}
            {view === "programmes" && (
              <ProgrammesView
                data={data}
                persistLibrary={persistLibrary}
                role={roleEffectif}
                activeClient={activeClient}
                assignProgram={assignProgram}
                assignProgramDistanciel={assignProgramDistanciel}
                assignCtProgram={assignCtProgram}
              />
            )}
            {view === "seances" && (
              <SeanceTypesView data={data} persistLibrary={persistLibrary} role={roleEffectif} activeClient={activeClient} />
            )}
            {view === "exercices" && (
              <ExercisesView data={data} persistLibrary={persistLibrary} role={roleEffectif} />
            )}
          </>
        )}
      </div>
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

const FONT_DISPLAY = "'Space Grotesk', 'Arial Black', sans-serif";
const FONT_BODY = "'Inter', -apple-system, sans-serif";

const COLORS = {
  bg: "#0F0D0B",
  bg2: "#1A1613",
  card: "#211C18",
  cardBorder: "#3A2F26",
  accent: "#FF7A1A",
  accent2: "#FFB066",
  text: "#FAF8F5",
  textDim: "#C9BFB4",
  textFaint: "#8A7C6E",
  danger: "#FF6B6B",
};

function RoleSelect({ onChoose }) {
  return (
    <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
      <div style={{ maxWidth: 420, width: "100%", padding: 24, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase" }}>
          Philémon Musculation
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: COLORS.text, margin: "0 0 8px 0", lineHeight: 1.15 }}>
          Qui consulte ce suivi ?
        </h1>
        <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 14, marginBottom: 32 }}>
          Ce choix reste mémorisé sur cet appareil.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button style={styles.roleBtn} onClick={() => onChoose("coach")}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: COLORS.bg }}>Je suis le coach</div>
              <div style={{ fontSize: 12, color: "#3D2410" }}>Remplir et gérer les programmes</div>
            </div>
          </button>
          <button style={{ ...styles.roleBtn, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}` }} onClick={() => onChoose("client")}>
            <span style={{ fontSize: 20 }}>💪</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: COLORS.text }}>Je suis le client</div>
              <div style={{ fontSize: 12, color: COLORS.textDim }}>Suivre ma progression</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function CoachAuth({ hasAccount, onCreate, onLogin, onChangeRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submitCreate = async () => {
    setError("");
    if (!emailValid) {
      setError("Adresse mail invalide.");
      return;
    }
    if (password.length < 4) {
      setError("Le mot de passe doit faire au moins 4 caractères.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    const result = await onCreate(email, password);
    if (result && result.status === "error") setError(result.error || "Erreur lors de la création.");
  };

  const submitLogin = async () => {
    setError("");
    if (!emailValid || !password) {
      setError("Renseigne ton adresse mail et ton mot de passe.");
      return;
    }
    const result = await onLogin(email, password);
    if (result.status === "wrong_email") setError("Adresse mail inconnue.");
    else if (result.status === "wrong_password") setError("Mot de passe incorrect.");
  };

  return (
    <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
      <div style={{ maxWidth: 380, width: "100%", padding: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
          Philémon Musculation
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: COLORS.text, margin: "0 0 8px 0", textAlign: "center" }}>
          {hasAccount ? "Espace coach" : "Crée ton espace coach"}
        </h1>
        <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 13, marginBottom: 8, textAlign: "center" }}>
          {hasAccount
            ? "Identifie-toi pour accéder à tes clients."
            : "Choisis une adresse mail et un mot de passe pour protéger l'accès coach."}
        </p>
       
        <div style={styles.card}>
          <label style={styles.fieldLabel}>Adresse mail</label>
          <input
            style={styles.textInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            autoFocus
          />
          <label style={styles.fieldLabel}>Mot de passe</label>
          <input
            style={styles.textInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && hasAccount && submitLogin()}
          />
          {!hasAccount && (
            <>
              <label style={styles.fieldLabel}>Confirme le mot de passe</label>
              <input
                style={styles.textInput}
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </>
          )}
          {error && <div style={{ color: COLORS.danger, fontSize: 12, marginBottom: 10 }}>{error}</div>}
          <button
            style={{ ...styles.primaryBtn, width: "100%" }}
            onClick={hasAccount ? submitLogin : submitCreate}
          >
            {hasAccount ? "Accéder à mon espace coach" : "Créer mon espace coach"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientSelect({ clients, role, onChoose, onAdd, onDelete, onLogin, onChangeRole, onResendWelcome, onForgotPin }) {
  if (role === "coach") {
    return <CoachClientPicker clients={clients} onChoose={onChoose} onAdd={onAdd} onDelete={onDelete} onChangeRole={onChangeRole} onResendWelcome={onResendWelcome} />;
  }
  return <ClientLogin onLogin={onLogin} onChoose={onChoose} onChangeRole={onChangeRole} onForgotPin={onForgotPin} />;
}

function CoachClientPicker({ clients, onChoose, onAdd, onDelete, onChangeRole, onResendWelcome }) {
  const [showAdd, setShowAdd] = useState(clients.length === 0);
   const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [typeSeance, setTypeSeance] = useState("1h");
  const [showDashboard, setShowDashboard] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const create = () => {
    if (!name.trim() || !emailValid || pin.length !== 4) return;
    onAdd(name.trim(), email.trim().toLowerCase(), pin, typeSeance);
  };

  if (showDashboard) {
    return <CoachDashboard clients={clients} onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
      <div style={{ maxWidth: 420, width: "100%", padding: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
          Philémon Musculation
        </div>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <button style={styles.linkBtn} onClick={() => setShowDashboard(true)}>📊 Tableau de bord</button>
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: COLORS.text, margin: "0 0 8px 0", textAlign: "center" }}>
          Quel client veux-tu suivre ?
        </h1>
        <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 13, marginBottom: 8, textAlign: "center" }}>
          Mémorisé sur cet appareil, modifiable à tout moment.
        </p>
    
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {clients.map((c) => (
  <div key={c.id} style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
    <button style={{ ...styles.clientBtn, flex: 1 }} onClick={() => onChoose(c.id)}>
      <span style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accent, color: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontSize: 14, flexShrink: 0 }}>
        {c.name.slice(0, 1).toUpperCase()}
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 14, color: COLORS.text, fontWeight: 600 }}>{c.name}</span>
        <span style={{ display: "block", fontSize: 11, color: COLORS.textDim }}>{c.email}</span>
        <span style={{ display: "block", fontSize: 11, color: COLORS.textFaint }}>Code d'accès client : {c.pin}</span>
      </span>
    </button>
    <button
      style={{ ...styles.secondaryBtn, padding: "0 14px" }}
      onClick={(e) => {
        e.stopPropagation();
        onResendWelcome(c);
      }}
      title="Renvoyer l'email de bienvenue"
    >
      📧
    </button>
    <button
      style={{ ...styles.secondaryBtn, color: "#ff6b6b", borderColor: "#ff6b6b", padding: "0 14px" }}
      onClick={() => {
        if (window.confirm(`Supprimer définitivement ${c.name} et toutes ses données ?`)) {
          onDelete(c.id);
        }
      }}
    >
      Suppr.
    </button>
  </div>
))}
        </div>

        {!showAdd ? (
          <button style={styles.secondaryBtn} onClick={() => setShowAdd(true)}>+ Nouveau client</button>
        ) : (
          <div style={styles.card}>
            <label style={styles.fieldLabel}>Nom du client</label>
            <input
              style={styles.textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marie"
              autoFocus
            />
            <label style={styles.fieldLabel}>Adresse mail du client (identifiant de connexion)</label>
            <input
              style={styles.textInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marie@exemple.com"
            />
                        <label style={styles.fieldLabel}>Code d'accès à 4 chiffres (à communiquer au client)</label>
            <input
              style={styles.textInput}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
            />
            <label style={styles.fieldLabel}>Format des séances</label>
            <select value={typeSeance} onChange={(e) => setTypeSeance(e.target.value)} style={styles.textInput}>
              <option value="30min">30 minutes</option>
              <option value="1h">1 heure</option>
              <option value="1h30">1 heure 30</option>
            </select>
        
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {clients.length > 0 && (
                <button style={styles.secondaryBtn} onClick={() => setShowAdd(false)}>Annuler</button>
              )}
              <button style={styles.primaryBtn} disabled={!name.trim() || !emailValid || pin.length !== 4} onClick={create}>
                Créer et sélectionner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CoachDashboard({ clients, onBack }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const now = new Date();
      const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);

      const bookingsParClient = await Promise.all(
        clients.map(async (c) => {
          try {
            const r = await window.storage.get(bookingsKey(c.id), true);
            return r && r.value ? JSON.parse(r.value) : [];
          } catch (e) {
            return [];
          }
        })
      );

      let seancesCeMoisCi = 0;
      const packsBientotEpuises = [];
      let clientsActifs = 0;

      clients.forEach((c, i) => {
        const bookings = bookingsParClient[i] || [];
        const effectuees = bookings.filter((b) => b.status !== "annulee" && new Date(b.start_time) <= now);
        const effectueesPresentiel = effectuees.filter((b) => (b.type || "presentiel") === "presentiel");
        const effectueesDistanciel = effectuees.filter((b) => b.type === "distanciel");

        seancesCeMoisCi += effectuees.filter((b) => new Date(b.start_time) >= debutMois).length;

        const totalPresentiel = c.accompagnementPresentielTotal != null ? c.accompagnementPresentielTotal : c.accompagnementTotal;
        const totalDistanciel = c.accompagnementDistancielTotal;
        const estActif = totalPresentiel != null || totalDistanciel != null;
        if (estActif) clientsActifs += 1;

        if (totalPresentiel != null) {
          const offset = c.accompagnementPresentielOffset != null ? c.accompagnementPresentielOffset : (c.accompagnementOffset || 0);
          const restant = totalPresentiel - (offset + effectueesPresentiel.length);
          if (restant <= 3) packsBientotEpuises.push({ name: c.name, type: "Présentiel", restant });
        }
        if (totalDistanciel != null) {
          const offset = c.accompagnementDistancielOffset || 0;
          const restant = totalDistanciel - (offset + effectueesDistanciel.length);
          if (restant <= 3) packsBientotEpuises.push({ name: c.name, type: "Distanciel", restant });
        }
      });

      packsBientotEpuises.sort((a, b) => a.restant - b.restant);

      setStats({ clientsActifs, seancesCeMoisCi, packsBientotEpuises });
      setLoading(false);
    })();
  }, [clients]);

  return (
    <div style={{ ...styles.app, minHeight: "100%" }}>
      <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", padding: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
          Philémon Musculation
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: COLORS.text, margin: "0 0 20px 0", textAlign: "center" }}>
          Tableau de bord
        </h1>

        {loading ? (
          <div style={styles.emptyState}>Chargement des statistiques…</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <div style={{ ...styles.card, flex: "1 1 140px", textAlign: "center" }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: COLORS.accent }}>{stats.clientsActifs}</div>
                <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>Clients actifs</div>
              </div>
              <div style={{ ...styles.card, flex: "1 1 140px", textAlign: "center" }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: COLORS.accent }}>{stats.seancesCeMoisCi}</div>
                <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>Séances ce mois-ci</div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                Packs bientôt épuisés (≤ 3 séances restantes)
              </div>
              {stats.packsBientotEpuises.length === 0 ? (
                <div style={{ fontSize: 13, color: COLORS.textFaint }}>Aucun pack proche de la fin pour l'instant.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {stats.packsBientotEpuises.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: COLORS.bg2, borderRadius: 8 }}>
                      <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{p.name} <span style={{ fontSize: 11, color: COLORS.textFaint, fontWeight: 400 }}>({p.type})</span></span>
                      <span style={{ fontSize: 12, color: p.restant <= 0 ? COLORS.danger : COLORS.accent2, fontWeight: 700 }}>
                        {p.restant <= 0 ? "Dépassé" : `${p.restant} restante${p.restant > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button style={styles.secondaryBtn} onClick={onBack}>← Retour à la liste des clients</button>
        </div>
      </div>
    </div>
  );
}

function ClientLogin({ onLogin, onChoose, onChangeRole, onForgotPin }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const forgotEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim());

   const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (!emailValid || pin.length !== 4) {
      setError("Renseigne ton adresse mail et ton code à 4 chiffres.");
      return;
    }
    setLoading(true);
    const result = await onLogin(email.trim(), pin);
    setLoading(false);
    if (result.status === "ok") {
      onChoose(result.id);
    } else if (result.status === "wrong_pin") {
      setError("Code incorrect.");
    } else {
      setError("Aucun profil trouvé pour cette adresse mail. Vérifie l'orthographe ou contacte ton coach.");
    }
  };

  const submitForgot = async () => {
    if (!forgotEmailValid) return;
    setForgotLoading(true);
    await onForgotPin(forgotEmail.trim());
    setForgotLoading(false);
    setForgotSent(true);
  };

  if (showForgot) {
    return (
      <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
        <div style={{ maxWidth: 380, width: "100%", padding: 24 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
            Philémon Musculation
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: COLORS.text, margin: "0 0 8px 0", textAlign: "center" }}>
            Code oublié ?
          </h1>
          <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 13, marginBottom: 8, textAlign: "center" }}>
            {forgotSent
              ? "Si un compte existe avec cette adresse, un nouveau code vient d'être envoyé par email."
              : "Indique ton adresse mail, on t'envoie un nouveau code."}
          </p>
          <div style={styles.card}>
            {!forgotSent ? (
              <>
                <label style={styles.fieldLabel}>Adresse mail</label>
                <input
                  style={styles.textInput}
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="marie@exemple.com"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && submitForgot()}
                />
                <button
                  style={{ ...styles.primaryBtn, width: "100%" }}
                  disabled={!forgotEmailValid || forgotLoading}
                  onClick={submitForgot}
                >
                  {forgotLoading ? "Envoi..." : "Recevoir un nouveau code"}
                </button>
              </>
            ) : (
              <button style={{ ...styles.secondaryBtn, width: "100%" }} onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}>
                Retour à la connexion
              </button>
            )}
            {!forgotSent && (
              <button style={{ ...styles.linkBtn, marginTop: 12 }} onClick={() => setShowForgot(false)}>
                ← Retour à la connexion
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.app, alignItems: "center", justifyContent: "center", display: "flex", minHeight: "100%" }}>
      <div style={{ maxWidth: 380, width: "100%", padding: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, letterSpacing: 3, color: COLORS.accent, marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>
          Philémon Musculation
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: COLORS.text, margin: "0 0 8px 0", textAlign: "center" }}>
          Identifie-toi
        </h1>
        <p style={{ color: COLORS.textDim, fontFamily: FONT_BODY, fontSize: 13, marginBottom: 8, textAlign: "center" }}>
          Ton adresse mail et le code fournis par ton coach.
        </p>
     
        <div style={styles.card}>
          <label style={styles.fieldLabel}>Adresse mail</label>
          <input style={styles.textInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marie@exemple.com" autoFocus />
          <label style={styles.fieldLabel}>Code à 4 chiffres</label>
          <input
            style={styles.textInput}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {error && <div style={{ color: COLORS.danger, fontSize: 12, marginBottom: 10 }}>{error}</div>}
                  <button style={{ ...styles.primaryBtn, width: "100%" }} onClick={submit} disabled={loading}>
            {loading ? "Connexion..." : "Accéder à mon suivi"}
          </button>
          <button style={{ ...styles.linkBtn, marginTop: 12, display: "block", textAlign: "center", width: "100%" }} onClick={() => setShowForgot(true)}>
            Code oublié ?
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({ role, view, setView, clientName, onChangeClient, saving, onLogoutCoach, apercuClient, onToggleApercuClient }) {
  const tabs = [
    { id: "profil", label: "Profil" },
    { id: "suivi", label: "Suivi" },
    { id: "progression", label: "Progression" },
    { id: "programmes", label: "Programmes" },
    { id: "seances", label: "Séances" },
    { id: "exercices", label: "Exercices" },
    { id: "ct", label: "CT" },
    { id: "alimentation", label: "Alimentation" },
  ];
  return (
    <div style={styles.header}>
      <div style={styles.headerTop}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: 2, color: COLORS.accent, textTransform: "uppercase" }}>
          Philémon Musculation
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {saving && <span style={{ fontSize: 11, color: COLORS.textFaint }}>Enregistrement…</span>}
                                         <span style={styles.roleBadge}>{role === "coach" ? "Coach" : "Client"}</span>
          {role === "coach" && (
            <button style={styles.linkBtn} onClick={onToggleApercuClient}>
              {apercuClient ? "← Revenir en mode coach" : "👁️ Aperçu client"}
            </button>
          )}
          {role === "coach" && (
            <button style={styles.linkBtn} onClick={onLogoutCoach}>déconnexion</button>
          )}
          <span style={{ ...styles.roleBadge, background: "rgba(255,176,102,0.15)", color: COLORS.accent2 }}>{clientName}</span>
          <button style={styles.linkBtn} onClick={onChangeClient}>client</button>
        </div>
      </div>
      <div style={styles.tabRow}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              ...styles.tabBtn,
              color: view === t.id ? COLORS.bg : COLORS.textDim,
              background: view === t.id ? COLORS.accent : "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function exMap(data) {
  const m = {};
  data.exercises.forEach((e) => (m[e.id] = e));
  return m;
}

const STANDARD_ZONES = ["MOBILITE", "WARM UP", "CARDIO", "BAS DU CORPS", "HAUT DU CORPS", "CENTRE DU CORPS", "ETIREMENTS"];

function zoneLabel(zone) {
  if (!zone) return "Autre";
  const z = zone.trim().toUpperCase();
  if (z === "MOBILITE" || z === "MOBILITÉ") return "Mobilité";
  if (z === "WARM UP") return "Échauffement";
  if (z === "CARDIO") return "Cardio";
  if (z === "ETIREMENTS" || z === "ÉTIREMENTS" || z === "FIN DE SEANCE" || z === "FIN DE SÉANCE") return "Étirements";
  return zone;
}

function getExerciseZones(ex) {
  if (!ex) return [];
  if (Array.isArray(ex.zones) && ex.zones.length) return ex.zones;
  return ex.zone ? [ex.zone] : [];
}

function getExerciseGroupes(ex) {
  if (!ex) return [];
  if (Array.isArray(ex.groupes) && ex.groupes.length) return ex.groupes;
  return ex.groupe ? ex.groupe.split("\n").filter(Boolean) : [];
}

function getExerciseNiveaux(ex, fallbackNames) {
  const raw = ex && Array.isArray(ex.niveaux) ? ex.niveaux : [];
  const custom = raw
    .map((n) => (typeof n === "string" ? { nom: n, consignes: {}, videoUrl: "" } : n))
    .filter((n) => n && n.nom && n.nom.trim());
  if (custom.length) return custom;
  const defaults = fallbackNames && fallbackNames.length ? fallbackNames : ["Bilatéral", "Unilatéral"];
  return defaults.map((nom) => ({ nom, consignes: {}, videoUrl: "" }));
}

function exDisplayName(ex) {
  if (!ex) return "";
  const nom = ex.nom.replace(/\n/g, " ");
  const groupes = getExerciseGroupes(ex);
  return groupes.length ? `${nom} (${groupes.join(", ")})` : nom;
}

const ZONE_RANK_ORDER = { "Mobilité": 0, "Échauffement": 1, "BAS DU CORPS": 2, "HAUT DU CORPS": 3, "CENTRE DU CORPS": 4, "Cardio": 5, "Étirements": 6 };
function zoneRank(label) {
  return label in ZONE_RANK_ORDER ? ZONE_RANK_ORDER[label] : 4.5;
}

// Clé composite (exercice + zone) pour permettre une sélection indépendante
// d'un même exercice selon la catégorie dans laquelle on le coche.
function selKey(exId, zoneLbl) {
  return `${exId}__${zoneLbl}`;
}

// À partir des clés composites cochées, construit la liste finale d'exerciceIds
// (dédupliquée) et le niveau retenu pour chacun (celui de sa zone principale
// si elle a été cochée, sinon celui de la première zone cochée).
function finalizeSelection(selectedKeys, niveauxByKey, exercisesMap) {
  const keysByExId = {};
  selectedKeys.forEach((k) => {
    const exId = k.split("__")[0];
    if (!keysByExId[exId]) keysByExId[exId] = [];
    keysByExId[exId].push(k);
  });
  const exerciceIds = Object.keys(keysByExId);
  const niveaux = {};
  exerciceIds.forEach((exId) => {
    const ex = exercisesMap[exId];
    const primaryZone = zoneLabel(getExerciseZones(ex)[0]);
    const preferredKey = selKey(exId, primaryZone);
    const keys = keysByExId[exId];
    const chosenKey = keys.includes(preferredKey) ? preferredKey : keys[0];
    if (niveauxByKey[chosenKey] != null) niveaux[exId] = niveauxByKey[chosenKey];
  });
  return { exerciceIds, niveaux };
}

// Regroupe chaque exercice sous sa seule zone principale (la première).
// Utilisé pour l'affichage des séries en cours de séance, afin de ne jamais
// dupliquer les champs de saisie d'un même exercice.
function groupExIdsByZone(exIds, exercises) {
  const order = [];
  const byZone = {};
  exIds.forEach((exId) => {
    const ex = exercises[exId];
    const zones = getExerciseZones(ex);
    const label = zoneLabel(zones[0]);
    if (!byZone[label]) {
      byZone[label] = [];
      order.push(label);
    }
    byZone[label].push(exId);
  });
  order.sort((a, b) => zoneRank(a) - zoneRank(b));
  return order.map((label) => [label, byZone[label]]);
}

// Regroupe chaque exercice sous TOUTES ses zones (un exercice avec plusieurs
// zones apparaît dans chacune). Utilisé pour le catalogue et les cases à
// cocher de sélection d'exercices, où la duplication est sans risque.
function groupExIdsByZoneMulti(exIds, exercises) {
  const order = [];
  const byZone = {};
  exIds.forEach((exId) => {
    const ex = exercises[exId];
    const zones = getExerciseZones(ex);
    (zones.length ? zones : [null]).forEach((zone) => {
      const label = zoneLabel(zone);
      if (!byZone[label]) {
        byZone[label] = [];
        order.push(label);
      }
      byZone[label].push(exId);
    });
  });
  order.sort((a, b) => zoneRank(a) - zoneRank(b));
  return order.map((label) => [label, byZone[label]]);
}

function PalierFrise({ palierActuel }) {
  const currentIndex = PALIERS_ACCOMPAGNEMENT.findIndex((p) => p.id === palierActuel);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "8px 4px 4px", marginBottom: 16 }}>
      <div style={{ position: "absolute", left: 24, right: 24, top: 15, height: 2, background: COLORS.cardBorder, zIndex: 0 }} />
      {PALIERS_ACCOMPAGNEMENT.map((p, i) => {
        const isActive = i === currentIndex;
        return (
          <div key={p.id} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div
              style={{
                width: isActive ? 22 : 12,
                height: isActive ? 22 : 12,
                borderRadius: "50%",
                background: isActive ? COLORS.accent : COLORS.bg2,
                border: `2px solid ${isActive ? COLORS.accent : COLORS.cardBorder}`,
                marginBottom: 6,
              }}
            />
            <span
              style={{
                fontSize: isActive ? 13 : 11,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? COLORS.accent : COLORS.textFaint,
                fontFamily: isActive ? FONT_DISPLAY : FONT_BODY,
                textAlign: "center",
              }}
            >
              {p.nom}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ProfileView({ profile, profileLoaded, persistProfile, activeClient, role, presentielCount, distancielCount, bookings, assignAccompagnementPresentiel, setAccompagnementOffsetPresentiel, assignAccompagnementDistanciel, setAccompagnementOffsetDistanciel, assignTypeSeance, addManualBooking, deleteManualBooking, validateDistancielSession, onChangePin, assignPalier, onGoToSuivi }) {
  const [local, setLocal] = useState(profile || {});
  const [dirty, setDirty] = useState(false);
  const [editingOffsetPresentiel, setEditingOffsetPresentiel] = useState(false);
  const [offsetInputPresentiel, setOffsetInputPresentiel] = useState("");
  const [editingTotalPresentiel, setEditingTotalPresentiel] = useState(false);
  const [totalInputPresentiel, setTotalInputPresentiel] = useState("");
  const [editingOffsetDistanciel, setEditingOffsetDistanciel] = useState(false);
  const [offsetInputDistanciel, setOffsetInputDistanciel] = useState("");
  const [editingTotalDistanciel, setEditingTotalDistanciel] = useState(false);
  const [totalInputDistanciel, setTotalInputDistanciel] = useState("");
  const [showManualBooking, setShowManualBooking] = useState(false);
  const [manualDateTime, setManualDateTime] = useState("");
  const [manualStatus, setManualStatus] = useState("effectuee");
  const [manualType, setManualType] = useState("presentiel");
  const [showChangePin, setShowChangePin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const isCoach = role === "coach";

  // Compatibilité : les clients créés avant la distinction présentiel/distanciel
  // n'ont que les anciens champs accompagnementTotal/accompagnementOffset, traités comme présentiel.
  const totalPresentiel = activeClient
    ? (activeClient.accompagnementPresentielTotal != null ? activeClient.accompagnementPresentielTotal : activeClient.accompagnementTotal)
    : null;
  const offsetPresentiel = activeClient
    ? (activeClient.accompagnementPresentielOffset != null ? activeClient.accompagnementPresentielOffset : (activeClient.accompagnementOffset || 0))
    : 0;
  const usedPresentiel = offsetPresentiel + presentielCount;
  const overLimitPresentiel = totalPresentiel != null && usedPresentiel > totalPresentiel;

  const totalDistanciel = activeClient ? activeClient.accompagnementDistancielTotal : null;
  const offsetDistanciel = activeClient && activeClient.accompagnementDistancielOffset != null ? activeClient.accompagnementDistancielOffset : 0;
  const usedDistanciel = offsetDistanciel + distancielCount;
  const overLimitDistanciel = totalDistanciel != null && usedDistanciel > totalDistanciel;

  
  const updateField = (key, value) => {
    setLocal((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const startEditOffsetPresentiel = () => {
    setOffsetInputPresentiel(String(offsetPresentiel));
    setEditingOffsetPresentiel(true);
  };
  const saveOffsetPresentiel = () => {
    setAccompagnementOffsetPresentiel(Math.max(0, Math.round(Number(offsetInputPresentiel)) || 0));
    setEditingOffsetPresentiel(false);
  };

  const startEditTotalPresentiel = () => {
    setTotalInputPresentiel(totalPresentiel != null ? String(totalPresentiel) : "");
    setEditingTotalPresentiel(true);
  };
  const saveTotalPresentiel = () => {
    const n = Math.round(Number(totalInputPresentiel));
    assignAccompagnementPresentiel(n > 0 ? n : null);
    setEditingTotalPresentiel(false);
  };

  const startEditOffsetDistanciel = () => {
    setOffsetInputDistanciel(String(offsetDistanciel));
    setEditingOffsetDistanciel(true);
  };
  const saveOffsetDistanciel = () => {
    setAccompagnementOffsetDistanciel(Math.max(0, Math.round(Number(offsetInputDistanciel)) || 0));
    setEditingOffsetDistanciel(false);
  };

  const startEditTotalDistanciel = () => {
    setTotalInputDistanciel(totalDistanciel != null ? String(totalDistanciel) : "");
    setEditingTotalDistanciel(true);
  };
  const saveTotalDistanciel = () => {
    const n = Math.round(Number(totalInputDistanciel));
    assignAccompagnementDistanciel(n > 0 ? n : null);
    setEditingTotalDistanciel(false);
  };

  const submitManualBooking = () => {
    if (!manualDateTime) return;
    const isoString = new Date(manualDateTime).toISOString();
    addManualBooking(isoString, manualStatus, manualType);
    setShowManualBooking(false);
    setManualDateTime("");
    setManualStatus("effectuee");
    setManualType("presentiel");
  };

  const submitChangePin = async () => {
    setPinError("");
    if (oldPinInput.length !== 4 || newPinInput.length !== 4) {
      setPinError("Le code actuel et le nouveau code doivent faire 4 chiffres.");
      return;
    }
    if (newPinInput !== newPinConfirm) {
      setPinError("Les deux nouveaux codes ne correspondent pas.");
      return;
    }
    setPinLoading(true);
    const result = await onChangePin(oldPinInput, newPinInput);
    setPinLoading(false);
    if (result.status === "ok") {
      setPinSuccess(true);
      setOldPinInput("");
      setNewPinInput("");
      setNewPinConfirm("");
      setTimeout(() => { setPinSuccess(false); setShowChangePin(false); }, 2000);
    } else if (result.status === "wrong_pin") {
      setPinError("Le code actuel est incorrect.");
    } else {
      setPinError("Erreur, réessaie.");
    }
  };

  return (
    <div>
      {activeClient && <PalierFrise palierActuel={activeClient.palierActuel} />}
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Profil{activeClient ? ` — ${activeClient.name}` : ""}</h2>
        <button
          style={{ ...styles.primaryBtn, opacity: dirty ? 1 : 0.5 }}
          disabled={!dirty}
          onClick={() => {
            persistProfile(local);
            setDirty(false);
          }}
        >
          Enregistrer
        </button>
      </div>

      <div style={{ ...styles.card, marginBottom: 16, borderColor: overLimitPresentiel ? COLORS.danger : COLORS.accent }}>
        <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
          Accompagnement présentiel
        </div>
        {activeClient.palierActuel && (
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 10 }}>
            Palier actuel : <strong style={{ color: COLORS.accent }}>{PALIERS_ACCOMPAGNEMENT.find((p) => p.id === activeClient.palierActuel)?.nom}</strong>
          </div>
        )}
        {isCoach && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 6 }}>Assigner un palier</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PALIERS_ACCOMPAGNEMENT.map((p) => (
                <button
                  key={p.id}
                  onClick={() => assignPalier(activeClient.palierActuel === p.id ? null : p.id)}
                  style={{
                    ...styles.secondaryBtn,
                    ...(activeClient.palierActuel === p.id ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}),
                  }}
                >
                  {p.nom}
                </button>
              ))}
            </div>
          </div>
        )}
        {isCoach && (
          <div style={{ marginBottom: 12 }}>
            {editingTotalPresentiel ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 12, color: COLORS.textDim }}>Nombre de séances présentiel</label>
                <input
                  type="number"
                  min={0}
                  value={totalInputPresentiel}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setTotalInputPresentiel(e.target.value)}
                  style={{ ...styles.numInput, width: 64 }}
                  autoFocus
                />
                <button style={styles.secondaryBtn} onClick={saveTotalPresentiel}>Valider</button>
                <button style={styles.linkBtn} onClick={() => setEditingTotalPresentiel(false)}>Annuler</button>
              </div>
            ) : (
              <button style={styles.linkBtn} onClick={startEditTotalPresentiel}>
                {totalPresentiel != null ? "Ajuster manuellement le total présentiel" : "Définir un total présentiel manuellement"}
              </button>
            )}
          </div>
        )}
                               <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: isCoach ? 6 : 12 }}>
          Format des séances : <strong style={{ color: COLORS.text }}>
            {(activeClient.typeSeance || "1h") === "30min" ? "30 minutes" : (activeClient.typeSeance || "1h") === "1h" ? "1 heure" : "1 heure 30"}
          </strong>
        </div>
        {isCoach && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {Object.keys(LIENS_CALENDLY).map((t) => (
              <button
                key={t}
                onClick={() => assignTypeSeance(t)}
                style={{
                  ...styles.secondaryBtn,
                  ...((activeClient.typeSeance || "1h") === t ? { background: COLORS.accent2, color: COLORS.bg, borderColor: COLORS.accent2 } : {}),
                }}
              >
                {t === "30min" ? "30 minutes" : t === "1h" ? "1 heure" : "1 heure 30"}
              </button>
            ))}
          </div>
        )}
        {totalPresentiel != null && (
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: overLimitPresentiel ? COLORS.danger : COLORS.text }}>
              {usedPresentiel} / {totalPresentiel}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>
              séances effectuées
              {offsetPresentiel > 0 && <span> (dont {offsetPresentiel} déjà comptabilisée{offsetPresentiel > 1 ? "s" : ""} avant l'appli)</span>}
            </div>
            {isCoach && (
              <div style={{ marginTop: 10 }}>
                {editingOffsetPresentiel ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: 12, color: COLORS.textDim }}>Séances déjà faites avant l'appli</label>
                    <input
                      type="number"
                      min={0}
                      value={offsetInputPresentiel}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setOffsetInputPresentiel(e.target.value)}
                      style={{ ...styles.numInput, width: 64 }}
                      autoFocus
                    />
                    <button style={styles.secondaryBtn} onClick={saveOffsetPresentiel}>Valider</button>
                    <button style={styles.linkBtn} onClick={() => setEditingOffsetPresentiel(false)}>Annuler</button>
                  </div>
                ) : (
                  <button style={styles.linkBtn} onClick={startEditOffsetPresentiel}>
                    Ajuster le nombre de séances de départ
                  </button>
                )}
              </div>
            )}
                        {overLimitPresentiel && (
              <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(255,107,107,0.1)", border: `1px solid ${COLORS.danger}`, borderRadius: 8, fontSize: 12, color: COLORS.danger, fontWeight: 600 }}>
                ⚠️ Le forfait présentiel est dépassé — pense à renouveler l'accompagnement.
              </div>
            )}
          </div>
        )}
        {!isCoach && totalPresentiel == null && (
          <div style={{ fontSize: 13, color: COLORS.textFaint, marginBottom: 4 }}>
            Séances à la carte, sans forfait particulier.
          </div>
        )}
        <a         
          href={LIENS_CALENDLY[activeClient.typeSeance || "1h"]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...styles.primaryBtn,
            display: "inline-block",
            textDecoration: "none",
            marginTop: 12,
          }}
        >
          Réserver un créneau
        </a>
      </div>

      <div style={{ ...styles.card, marginBottom: 16, borderColor: overLimitDistanciel ? COLORS.danger : COLORS.accent2 }}>
        <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
          Accompagnement distanciel
        </div>
        {isCoach && (
          <div style={{ marginBottom: 12 }}>
            {editingTotalDistanciel ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 12, color: COLORS.textDim }}>Nombre de séances distanciel</label>
                <input
                  type="number"
                  min={0}
                  value={totalInputDistanciel}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setTotalInputDistanciel(e.target.value)}
                  style={{ ...styles.numInput, width: 64 }}
                  autoFocus
                />
                <button style={styles.secondaryBtn} onClick={saveTotalDistanciel}>Valider</button>
                <button style={styles.linkBtn} onClick={() => setEditingTotalDistanciel(false)}>Annuler</button>
              </div>
            ) : (
              <button style={styles.secondaryBtn} onClick={startEditTotalDistanciel}>
                {totalDistanciel != null ? "Modifier le total distanciel" : "Définir un total distanciel"}
              </button>
            )}
          </div>
        )}
        {totalDistanciel ? (
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: overLimitDistanciel ? COLORS.danger : COLORS.text }}>
              {usedDistanciel} / {totalDistanciel}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>
              séances validées
              {offsetDistanciel > 0 && <span> (dont {offsetDistanciel} déjà comptabilisée{offsetDistanciel > 1 ? "s" : ""} avant l'appli)</span>}
            </div>
            {isCoach && (
              <div style={{ marginTop: 10 }}>
                {editingOffsetDistanciel ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ fontSize: 12, color: COLORS.textDim }}>Séances déjà faites avant l'appli</label>
                    <input
                      type="number"
                      min={0}
                      value={offsetInputDistanciel}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setOffsetInputDistanciel(e.target.value)}
                      style={{ ...styles.numInput, width: 64 }}
                      autoFocus
                    />
                    <button style={styles.secondaryBtn} onClick={saveOffsetDistanciel}>Valider</button>
                    <button style={styles.linkBtn} onClick={() => setEditingOffsetDistanciel(false)}>Annuler</button>
                  </div>
                ) : (
                  <button style={styles.linkBtn} onClick={startEditOffsetDistanciel}>
                    Ajuster le nombre de séances de départ
                  </button>
                )}
              </div>
            )}
                        {overLimitDistanciel && (
              <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(255,107,107,0.1)", border: `1px solid ${COLORS.danger}`, borderRadius: 8, fontSize: 12, color: COLORS.danger, fontWeight: 600 }}>
                ⚠️ Le forfait distanciel est dépassé — pense à renouveler l'accompagnement.
              </div>
            )}

            <button
              style={{ ...styles.primaryBtn, marginTop: 12 }}
              onClick={onGoToSuivi}
            >
              ▶ Démarrer ma séance
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: COLORS.textFaint }}>
            {isCoach ? "Définis un total ci-dessus." : "Aucun accompagnement distanciel assigné pour l'instant."}
          </div>
        )}
      </div>

      {isCoach && (
        <div style={{ marginBottom: 16 }}>
          {!showManualBooking ? (
            <button style={styles.secondaryBtn} onClick={() => setShowManualBooking(true)}>
              + Ajouter une séance à l'historique
            </button>
          ) : (
            <div style={styles.card}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>
                Ajouter une séance à l'historique
              </div>
              <div style={{ fontSize: 12, color: COLORS.textFaint, marginBottom: 14 }}>
                Utile pour une séance d'essai faite avant la création du compte, ou toute séance non enregistrée automatiquement.
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12, alignItems: "flex-end" }}>
                <div style={{ flex: "1 1 220px" }}>
                  <label style={styles.fieldLabel}>Date et heure</label>
                  <input
                    type="datetime-local"
                    value={manualDateTime}
                    onChange={(e) => setManualDateTime(e.target.value)}
                    style={{ ...styles.textInput, marginBottom: 0 }}
                  />
                </div>
                <div style={{ flex: "0 0 140px" }}>
                  <label style={styles.fieldLabel}>Type</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value)}
                    style={{ ...styles.textInput, marginBottom: 0 }}
                  >
                    <option value="presentiel">Présentiel</option>
                    <option value="distanciel">Distanciel</option>
                  </select>
                </div>
                <div style={{ flex: "0 0 140px" }}>
                  <label style={styles.fieldLabel}>Statut</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value)}
                    style={{ ...styles.textInput, marginBottom: 0 }}
                  >
                    <option value="effectuee">Effectuée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button style={styles.secondaryBtn} onClick={() => setShowManualBooking(false)}>Annuler</button>
                <button style={styles.primaryBtn} disabled={!manualDateTime} onClick={submitManualBooking}>Ajouter</button>
              </div>
            </div>
          )}
        </div>
      )}

      {(() => {
        const upcoming = (bookings || [])
          .filter((b) => b.status !== "annulee" && new Date(b.start_time) > new Date())
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        if (upcoming.length === 0) return null;
        return (
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Séances à venir
            </div>
            {upcoming.map((b, i) => (
              <div key={i} style={{ fontSize: 14, padding: "6px 0" }}>
               {new Date(b.start_time).toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} {b.cancel_url && (<a href={b.cancel_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 12, fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>Annuler</a>)} {b.reschedule_url && (<a href={b.reschedule_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 12, fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>Replanifier</a>)}
          </div>
                ))}
          </div>
        );
      })()}

      {(() => {
        const historique = (bookings || [])
          .slice()
          .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        if (historique.length === 0) return null;
        const STATUT_LABELS = {
          annulee: { label: "Annulée", bg: "rgba(255,107,107,0.14)", color: COLORS.danger },
          reservee: { label: "Réservée", bg: "rgba(255,176,102,0.14)", color: COLORS.accent2 },
          effectuee: { label: "Effectuée", bg: "rgba(92,184,92,0.14)", color: "#5CB85C" },
        };
        return (
          <div style={{ ...styles.card, marginBottom: 16, padding: 0, overflow: "hidden" }}>
            <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, padding: "16px 16px 0 16px" }}>
              Historique des séances
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {historique.map((b, i) => {
                    const statut = STATUT_LABELS[b.status] || STATUT_LABELS.reservee;
                    const typeLabel = (b.type || "presentiel") === "distanciel" ? "Distanciel" : "Présentiel";
                    const peutSupprimer = b.manual && (isCoach || (b.type === "distanciel"));
                    return (
                      <tr key={i}>
                        <td style={styles.td}>
                          {new Date(b.start_time).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontSize: 12, color: COLORS.textDim }}>{typeLabel}</span>
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              fontSize: 12,
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontWeight: 600,
                              background: statut.bg,
                              color: statut.color,
                            }}
                          >
                            {statut.label}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {peutSupprimer && (
                            <button
                              style={styles.dangerLinkBtn}
                              onClick={() => {
                                if (window.confirm("Supprimer cette séance de l'historique ?")) {
                                  deleteManualBooking(b.uri);
                                }
                              }}
                            >
                              Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      <p style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 16 }}>
        Ces informations aident le coach à personnaliser le suivi. Modifiable par le coach comme par le client.
      </p>
      <div style={styles.card}>
        {PROFILE_FIELDS.map((f, i) => (
          <div key={f.key} style={{ marginBottom: i === PROFILE_FIELDS.length - 1 ? 0 : 16 }}>
            <label style={styles.fieldLabel}>{f.label}</label>
            <textarea
              value={local[f.key] || ""}
              onChange={(e) => updateField(f.key, e.target.value)}
              rows={f.key === "objectifs" || f.key === "presentSportif" || f.key === "passeSportif" || f.key === "exercicesAEviter" ? 3 : 2}
              style={styles.textArea}
            />
          </div>
        ))}
      </div>

      {!isCoach && (
        <div style={{ marginTop: 24 }}>
          {!showChangePin ? (
            <button style={styles.secondaryBtn} onClick={() => setShowChangePin(true)}>
              Modifier mon code d'accès
            </button>
          ) : (
            <div style={styles.card}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>
                Modifier mon code d'accès
              </div>
              {pinSuccess ? (
                <div style={{ color: COLORS.accent, fontSize: 13, fontWeight: 600 }}>✓ Code modifié avec succès.</div>
              ) : (
                <>
                  <label style={styles.fieldLabel}>Code actuel</label>
                  <input
                    style={styles.textInput}
                    value={oldPinInput}
                    onChange={(e) => setOldPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    inputMode="numeric"
                  />
                  <label style={styles.fieldLabel}>Nouveau code (4 chiffres)</label>
                  <input
                    style={styles.textInput}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    inputMode="numeric"
                  />
                  <label style={styles.fieldLabel}>Confirme le nouveau code</label>
                  <input
                    style={styles.textInput}
                    value={newPinConfirm}
                    onChange={(e) => setNewPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    inputMode="numeric"
                    onKeyDown={(e) => e.key === "Enter" && submitChangePin()}
                  />
                  {pinError && <div style={{ color: COLORS.danger, fontSize: 12, marginBottom: 10 }}>{pinError}</div>}
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button style={styles.secondaryBtn} onClick={() => { setShowChangePin(false); setPinError(""); setOldPinInput(""); setNewPinInput(""); setNewPinConfirm(""); }}>
                      Annuler
                    </button>
                    <button style={styles.primaryBtn} onClick={submitChangePin} disabled={pinLoading}>
                      {pinLoading ? "..." : "Valider"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SuiviView({ data, persistSessions, role, activeClient, deleteProgrammeHistorique, deleteProgrammeDistancielHistorique, validateDistancielSession, deleteManualBooking }) {
  const exercises = exMap(data);
  const [expanded, setExpanded] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [quickDate, setQuickDate] = useState(todayISO());
  const sessionsSorted = useMemo(
    () => [...data.sessions].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [data.sessions]
  );

  const updateSession = (sessionId, updates) => {
    const newSessions = data.sessions.map((s) => (s.id === sessionId ? { ...s, ...updates } : s));
    persistSessions(newSessions);
  };

  const deleteSession = (sessionId) => {
    const session = data.sessions.find((s) => s.id === sessionId);
    const newSessions = data.sessions.filter((s) => s.id !== sessionId);
    persistSessions(newSessions);
    setExpanded((cur) => (cur === sessionId ? null : cur));
    // Si cette séance avait automatiquement validé une réservation distancielle
    // liée, on la retire aussi pour que le décompte du profil reste juste.
    if (session && session.distancielBookingUri) {
      deleteManualBooking(session.distancielBookingUri);
    }
  };

  const addSession = (session) => {
  const newSessions = [...data.sessions, session];
  persistSessions(newSessions);
  if (role === "client") {
     fetch("/api/session-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getClientToken()}`,
      },
      body: JSON.stringify({
        clientName: activeClient ? activeClient.name : "Un client",
        date: session.date,
      }),
    }).catch(() => {});
  }
  setShowNew(false);
  setExpanded(session.id);
};

  const assignedProgram = activeClient ? data.programs.find((p) => p.id === activeClient.programId) : null;
  const assignedProgramDistanciel = activeClient ? data.programs.find((p) => p.id === activeClient.programDistancielId) : null;
  const stMap = {};
  data.seanceTypes.forEach((s) => (stMap[s.id] = s));

  const programNameForSeance = (seanceNom) => {
    if (!seanceNom) return null;
    const st = data.seanceTypes.find((s) => s.nom === seanceNom);
    if (!st) return null;
    const progs = data.programs.filter((p) => p.seanceTypeIds.includes(st.id));
    if (progs.length === 0) return null;
    return progs.map((p) => p.nom).join(" / ");
  };

  const isDistancielSeance = (seanceNom) => {
    if (!seanceNom) return false;
    const st = data.seanceTypes.find((s) => s.nom === seanceNom);
    return !!st && st.mode === "distanciel";
  };

  const startFromTemplate = (seanceType) => {
    const baseEntries = makeEntries(seanceType.exerciceIds, exercises);
    const previousMap = getPreviousEntriesSameSeance(data.sessions, seanceType.nom, null);
    const entries = applyPreviousEntries(baseEntries, previousMap);
    if (seanceType.mode === "distanciel") {
      const bookingUri = uid("distanciel");
      addSession({ id: uid("se"), date: quickDate, seanceNom: seanceType.nom, entries, niveaux: seanceType.niveaux || {}, distancielBookingUri: bookingUri });
      validateDistancielSession(bookingUri);
    } else {
      addSession({ id: uid("se"), date: quickDate, seanceNom: seanceType.nom, entries, niveaux: seanceType.niveaux || {} });
    }
  };

  return (
    <div>
      {assignedProgram && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 10 }}>
            Programme présentiel en cours : <strong style={{ color: COLORS.accent }}>{assignedProgram.nom}</strong>
          </div>
          <label style={styles.fieldLabel}>Date de la séance</label>
          <input
            type="date"
            value={quickDate}
            onChange={(e) => setQuickDate(e.target.value)}
            style={{ ...styles.textInput, maxWidth: 200 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {assignedProgram.seanceTypeIds.map((stId) => {
              const st = stMap[stId];
              if (!st) return null;
              return (
                <div key={stId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", background: COLORS.bg2, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{st.nom}</div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.6 }}>
                      {groupExIdsByZone(st.exerciceIds, exercises).map(([label, ids]) => (
                        <div key={label}>
                          <span style={{ color: COLORS.accent2, fontWeight: 600 }}>{label} : </span>
                          {ids.map((exId) => exDisplayName(exercises[exId])).filter(Boolean).join(" · ")}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button style={styles.secondaryBtn} onClick={() => startFromTemplate(st)}>Démarrer</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {assignedProgramDistanciel && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent2 }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 10 }}>
            Programme distanciel en cours : <strong style={{ color: COLORS.accent2 }}>{assignedProgramDistanciel.nom}</strong>
            <span style={styles.pill}> {assignedProgramDistanciel.lieu === "maison" ? "Maison" : "Salle"}</span>
          </div>
          <label style={styles.fieldLabel}>Date de la séance</label>
          <input
            type="date"
            value={quickDate}
            onChange={(e) => setQuickDate(e.target.value)}
            style={{ ...styles.textInput, maxWidth: 200 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {assignedProgramDistanciel.seanceTypeIds.map((stId) => {
              const st = stMap[stId];
              if (!st) return null;
              return (
                <div key={stId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", background: COLORS.bg2, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{st.nom}</div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.6 }}>
                      {groupExIdsByZone(st.exerciceIds, exercises).map(([label, ids]) => (
                        <div key={label}>
                          <span style={{ color: COLORS.accent2, fontWeight: 600 }}>{label} : </span>
                          {ids.map((exId) => exDisplayName(exercises[exId])).filter(Boolean).join(" · ")}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button style={styles.secondaryBtn} onClick={() => startFromTemplate(st)}>Démarrer</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeClient && (((activeClient.programmeHistorique || []).length > 0) || ((activeClient.programmeDistancielHistorique || []).length > 0)) && (
        <div style={{ ...styles.card, marginBottom: 16, padding: 0, overflow: "hidden" }}>
          <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, padding: "16px 16px 0 16px" }}>
            Historique des programmes suivis
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Programme</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Période</th>
                  {role === "coach" && <th style={styles.th}></th>}
                </tr>
              </thead>
              <tbody>
                {[
                  ...(activeClient.programmeHistorique || []).map((h, i) => ({ ...h, originalIndex: i, typeLabel: "Présentiel" })),
                  ...(activeClient.programmeDistancielHistorique || []).map((h, i) => ({ ...h, originalIndex: i, typeLabel: "Distanciel" })),
                ]
                  .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut))
                  .map((h, i) => {
                    const prog = data.programs.find((p) => p.id === h.programId);
                    return (
                      <tr key={i}>
                        <td style={styles.td}>{prog ? prog.nom : "Programme supprimé"}</td>
                        <td style={styles.td}>
                          <span style={{ fontSize: 12, color: COLORS.textDim }}>{h.typeLabel}</span>
                        </td>
                        <td style={styles.td}>
                          {formatDateFR(h.dateDebut.slice(0, 10))}
                          {" → "}
                          {h.dateFin ? formatDateFR(h.dateFin.slice(0, 10)) : "en cours"}
                        </td>
                        {role === "coach" && (
                          <td style={styles.td}>
                            <button
                              style={styles.dangerLinkBtn}
                              onClick={() => {
                                if (window.confirm("Supprimer cette entrée de l'historique des programmes ?")) {
                                  if (h.typeLabel === "Présentiel") deleteProgrammeHistorique(h.originalIndex);
                                  else deleteProgrammeDistancielHistorique(h.originalIndex);
                                }
                              }}
                            >
                              Supprimer
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Séances enregistrées</h2>
        <button style={styles.primaryBtn} onClick={() => setShowNew(true)}>+ Nouvelle séance</button>
      </div>

      {showNew && (
        <NewSessionForm
          data={data}
          onCancel={() => setShowNew(false)}
          onSave={addSession}
        />
      )}

      {sessionsSorted.length === 0 && (
        <div style={styles.emptyState}>Aucune séance pour l'instant. Ajoute la première.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sessionsSorted.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            exercises={exercises}
            allSessions={data.sessions}
            programName={programNameForSeance(session.seanceNom)}
            isDistanciel={isDistancielSeance(session.seanceNom)}
            expanded={expanded === session.id}
            onToggle={() => setExpanded(expanded === session.id ? null : session.id)}
            onExpand={() => setExpanded(session.id)}
            onSave={(updates) => updateSession(session.id, updates)}
            onDelete={() => deleteSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
}

function formatTimer(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function playBeep(count = 2, toneDuration = 0.3) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const gap = toneDuration + 0.05;
    const playTone = (startTime) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.9, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + toneDuration - 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + toneDuration);
    };
    const now = ctx.currentTime;
    for (let i = 0; i < count; i++) {
      playTone(now + i * gap);
    }
    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 400 + count * gap * 1000);
  } catch (e) {}
}

function restDurationForSet(serie) {
  if (serie === 1) return 60;
  if (serie === 2) return 90;
  return 120;
}

function RestTimer({ duration }) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const beepedRef = useRef(false);

  useEffect(() => {
    setSecondsLeft(duration);
    setRunning(false);
    beepedRef.current = false;
  }, [duration]);

  useEffect(() => {
    if (secondsLeft === 0) {
      if (!beepedRef.current) {
        playBeep();
        beepedRef.current = true;
      }
    } else {
      beepedRef.current = false;
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft > 0]);

  const toggle = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(duration);
      setRunning(true);
      playBeep(1);
    } else if (running) {
      setRunning(false);
    } else {
      setRunning(true);
      playBeep(1);
    }
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(duration);
  };

  const finished = secondsLeft <= 0;

  return (
    <div style={styles.timerPanel}>
      <span style={{ ...styles.timerDisplay, color: finished ? COLORS.accent : COLORS.text }}>
        {formatTimer(secondsLeft)}
      </span>
      <button style={{ ...styles.timerBtn, ...(running ? styles.timerBtnActive : {}) }} onClick={toggle}>
        {finished ? "Relancer" : running ? "Pause" : "Démarrer"}
      </button>
      {(running || secondsLeft !== duration) && (
        <button style={styles.timerResetBtn} onClick={reset}>Réinitialiser</button>
      )}
      {finished && <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>Récupération terminée</span>}
    </div>
  );
}

function GainageTimer({ defaultDuration = 60 }) {
  const [duration, setDuration] = useState(defaultDuration);
  const [secondsLeft, setSecondsLeft] = useState(defaultDuration);
  const [running, setRunning] = useState(false);
  const beepedRef = useRef(false);

  useEffect(() => {
    if (!running) {
      setSecondsLeft(duration);
      beepedRef.current = false;
    }
  }, [duration]);

  useEffect(() => {
    if (secondsLeft === 0) {
      if (!beepedRef.current) {
        playBeep(2);
        beepedRef.current = true;
      }
    } else {
      beepedRef.current = false;
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft > 0]);

  const toggle = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(duration);
      setRunning(true);
      playBeep(1);
    } else if (running) {
      setRunning(false);
    } else {
      setRunning(true);
      playBeep(1);
    }
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(duration);
  };

  const finished = secondsLeft <= 0;
  const notStarted = !running && secondsLeft === duration;

  return (
    <div style={styles.timerPanel}>
      {notStarted && (
        <>
          <input
            type="number"
            min={5}
            max={600}
            value={duration}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setDuration(Math.max(5, Number(e.target.value) || defaultDuration))}
            style={{ ...styles.numInput, width: 56 }}
          />
          <span style={styles.unitLabel}>sec</span>
        </>
      )}
      <span style={{ ...styles.timerDisplay, color: finished ? COLORS.accent : COLORS.text }}>
        {formatTimer(secondsLeft)}
      </span>
      <button style={{ ...styles.timerBtn, ...(running ? styles.timerBtnActive : {}) }} onClick={toggle}>
        {finished ? "Relancer" : running ? "Pause" : "Démarrer"}
      </button>
      {(running || secondsLeft !== duration) && (
        <button style={styles.timerResetBtn} onClick={reset}>Réinitialiser</button>
      )}
      {finished && <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>Effort terminé</span>}
    </div>
  );
}

const WARMUP_WORK_SECONDS = 50;
const WARMUP_REST_SECONDS = 20;
const WARMUP_ROUND_REST_SECONDS = 60;
const CARDIO_WORK_SECONDS = 300;
const CARDIO_REST_SECONDS = 30;
const CARDIO_ROUND_REST_SECONDS = 60;

function buildCircuitPhases(exerciseNames, rounds, workSeconds, restSeconds, roundRestSeconds) {
  const phases = [];
  for (let r = 0; r < rounds; r++) {
    exerciseNames.forEach((name, idx) => {
      phases.push({ type: "work", label: name, duration: workSeconds, round: r + 1 });
      const isLastExerciseOfRound = idx === exerciseNames.length - 1;
      const isVeryLast = r === rounds - 1 && isLastExerciseOfRound;
      if (isVeryLast) return;
      if (isLastExerciseOfRound) {
        phases.push({ type: "roundRest", label: "Repos entre tours", duration: roundRestSeconds, round: r + 1 });
      } else {
        phases.push({ type: "rest", label: "Repos", duration: restSeconds, round: r + 1 });
      }
    });
  }
  return phases;
}

// Construit les phases du chrono directement depuis le tableau CT (postes × tours) :
// chaque tour = passer par tous les postes (avec l'exercice/niveau propre à ce tour),
// repos entre chaque poste, puis repos entre les tours.
function buildCTTablePhases(rows, rounds, workSeconds, restSeconds, roundRestSeconds, exercisesMap, levelNames) {
  const activeRows = rows.filter((row) => row.cells.some((c) => c.exerciceId));
  if (activeRows.length === 0) return [];
  const phases = [];
  for (let r = 0; r < rounds; r++) {
    activeRows.forEach((row, idx) => {
      const cell = row.cells[r] || {};
      const ex = exercisesMap[cell.exerciceId];
      const niveaux = getExerciseNiveaux(ex, levelNames);
      const niv = niveaux[(cell.niveau || 1) - 1];
      const label = ex
        ? `${exDisplayName(ex)}${niv ? " — " + niv.nom : ""}`
        : (row.groupe || `Exercice ${idx + 1}`);
      phases.push({ type: "work", label, duration: workSeconds, round: r + 1 });
      const isLastPosteOfRound = idx === activeRows.length - 1;
      const isVeryLast = r === rounds - 1 && isLastPosteOfRound;
      if (isVeryLast) return;
      if (isLastPosteOfRound) {
        phases.push({ type: "roundRest", label: "Repos entre tours", duration: roundRestSeconds, round: r + 1 });
      } else {
        phases.push({ type: "rest", label: "Repos", duration: restSeconds, round: r + 1 });
      }
    });
  }
  return phases;
}

function CircuitTimer({
  exerciseNames,
  title = "Circuit d'échauffement",
  defaultWork = WARMUP_WORK_SECONDS,
  defaultRest = WARMUP_REST_SECONDS,
  defaultRoundRest = WARMUP_ROUND_REST_SECONDS,
  defaultRounds = 2,
  workInMinutes = false,
  customPhases = null,
  customSummary = null,
}) {
  const [rounds, setRounds] = useState(defaultRounds);
  const [workSeconds, setWorkSeconds] = useState(defaultWork);
  const [restSeconds, setRestSeconds] = useState(defaultRest);
  const [roundRestSeconds, setRoundRestSeconds] = useState(defaultRoundRest);
  const [showSettings, setShowSettings] = useState(false);
  const [started, setStarted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);

  const phases = customPhases && customPhases.length
    ? customPhases
    : buildCircuitPhases(exerciseNames, rounds, workSeconds, restSeconds, roundRestSeconds);
  const currentPhase = phases[phaseIndex];
  const done = started && !running && secondsLeft === 0 && phaseIndex >= phases.length - 1;

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft > 0]);

  useEffect(() => {
    if (!started) return;
    if (secondsLeft !== 0) return;
    if (!running) return;
    if (phaseIndex >= phases.length - 1) {
      setRunning(false);
      playBeep(2);
    } else {
      const nextIdx = phaseIndex + 1;
      const enteringRoundRest = phases[nextIdx].type === "roundRest";
      playBeep(enteringRoundRest ? 1 : 1, enteringRoundRest ? 0.9 : 0.3);
      setPhaseIndex(nextIdx);
      setSecondsLeft(phases[nextIdx].duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const start = () => {
    setStarted(true);
    setPhaseIndex(0);
    setSecondsLeft(phases[0].duration);
    setRunning(true);
    playBeep(1);
  };

  const pauseResume = () => setRunning((r) => !r);

  const goBackPhase = () => {
    if (phaseIndex <= 0) {
      setSecondsLeft(phases[0].duration);
      return;
    }
    const prevIdx = phaseIndex - 1;
    const enteringRoundRest = phases[prevIdx].type === "roundRest";
    playBeep(1, enteringRoundRest ? 0.9 : 0.3);
    setPhaseIndex(prevIdx);
    setSecondsLeft(phases[prevIdx].duration);
  };

  const skipPhase = () => {
    if (phaseIndex >= phases.length - 1) {
      setRunning(false);
      setSecondsLeft(0);
      playBeep(2);
    } else {
      const nextIdx = phaseIndex + 1;
      const enteringRoundRest = phases[nextIdx].type === "roundRest";
      playBeep(1, enteringRoundRest ? 0.9 : 0.3);
      setPhaseIndex(nextIdx);
      setSecondsLeft(phases[nextIdx].duration);
    }
  };

  const stop = () => {
    setStarted(false);
    setRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(0);
  };

  const totalSeconds = phases.reduce((sum, p) => sum + p.duration, 0);

  if (!customPhases && exerciseNames.length === 0) return null;
  if (customPhases && customPhases.length === 0) return null;

  if (!started) {
    return (
      <div style={styles.circuitPanel}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={styles.circuitTitle}>{title}</div>
          {!customPhases && (
            <button style={styles.linkBtn} onClick={() => setShowSettings((s) => !s)}>
              {showSettings ? "Masquer les paramètres" : "Paramètres"}
            </button>
          )}
        </div>
        <div style={{ fontSize: 12, color: COLORS.textDim, margin: "4px 0 10px" }}>
          {customSummary || `${exerciseNames.length} exercice${exerciseNames.length > 1 ? "s" : ""} · ${workInMinutes ? formatTimer(workSeconds) : `${workSeconds}s`} d'effort / ${restSeconds}s de repos · ${roundRestSeconds}s entre les tours · durée totale ≈ ${formatTimer(totalSeconds)}`}
        </div>
        {!customPhases && showSettings && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12, padding: "10px 12px", background: COLORS.card, borderRadius: 8, border: `1px solid ${COLORS.cardBorder}` }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Effort {workInMinutes ? "(min / sec)" : "(s)"}</label>
              {workInMinutes ? (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={Math.floor(workSeconds / 60)}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const m = Math.max(0, Number(e.target.value) || 0);
                      const s = workSeconds % 60;
                      setWorkSeconds(Math.max(5, m * 60 + s));
                    }}
                    style={{ ...styles.numInput, width: 48 }}
                  />
                  <span style={{ fontSize: 12, color: COLORS.textFaint }}>min</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={workSeconds % 60}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const s = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                      const m = Math.floor(workSeconds / 60);
                      setWorkSeconds(Math.max(5, m * 60 + s));
                    }}
                    style={{ ...styles.numInput, width: 48 }}
                  />
                  <span style={{ fontSize: 12, color: COLORS.textFaint }}>sec</span>
                </div>
              ) : (
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={workSeconds}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setWorkSeconds(Math.max(5, Number(e.target.value) || defaultWork))}
                  style={{ ...styles.numInput, width: 64 }}
                />
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Repos entre exercices (s)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={restSeconds}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setRestSeconds(Math.max(5, Number(e.target.value) || defaultRest))}
                style={{ ...styles.numInput, width: 64 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Repos entre tours (s)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={roundRestSeconds}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setRoundRestSeconds(Math.max(5, Number(e.target.value) || defaultRoundRest))}
                style={{ ...styles.numInput, width: 64 }}
              />
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {!customPhases && (
            <>
              <label style={{ fontSize: 13, color: COLORS.textDim }}>Nombre de tours</label>
              <input
                type="number"
                min={1}
                max={10}
                value={rounds}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") { setRounds(""); return; }
                  setRounds(Math.max(1, Math.min(10, Number(raw) || 1)));
                }}
                onBlur={(e) => {
                  if (e.target.value === "" || Number(e.target.value) < 1) setRounds(1);
                }}
                style={{ ...styles.numInput, width: 56 }}
              />
            </>
          )}
          <button style={styles.timerBtn} onClick={start}>Démarrer le circuit</button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div style={styles.circuitPanel}>
        <div style={styles.circuitTitle}>Circuit terminé 🎉</div>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 10 }}>
          {rounds} tour{rounds > 1 ? "s" : ""} sur {exerciseNames.length} exercice{exerciseNames.length > 1 ? "s" : ""} complétés.
        </div>
        <button style={styles.timerBtn} onClick={stop}>Recommencer</button>
      </div>
    );
  }

  const isRest = currentPhase.type === "rest" || currentPhase.type === "roundRest";
  const isRoundRest = currentPhase.type === "roundRest";
  const totalRounds = customPhases ? Math.max(...phases.map((p) => p.round)) : rounds;
  const totalExercisesInRound = phases.filter((p) => p.round === currentPhase.round && p.type === "work").length;
  let exerciseIndexInRound = 0;
  for (let i = 0; i <= phaseIndex; i++) {
    if (phases[i].round === currentPhase.round && phases[i].type === "work") exerciseIndexInRound++;
  }

  return (
    <div style={styles.circuitPanel}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <div style={styles.circuitTitle}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: 12, color: COLORS.textFaint }}>Tour {currentPhase.round}/{totalRounds}</span>
          {totalExercisesInRound > 0 && (
            <span style={{ fontSize: 11, color: COLORS.textFaint }}>Exercice {exerciseIndexInRound}/{totalExercisesInRound}</span>
          )}
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: isRest ? COLORS.accent2 : COLORS.accent, marginBottom: 4 }}>
        {isRoundRest ? "Repos entre tours" : isRest ? "Repos" : currentPhase.label}
      </div>
      <div style={{ ...styles.circuitTimerDisplay, color: isRest ? COLORS.accent2 : COLORS.text }}>
        {formatTimer(secondsLeft)}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
        <button style={{ ...styles.timerBtn, ...(running ? styles.timerBtnActive : {}) }} onClick={pauseResume}>
          {running ? "Pause" : "Reprendre"}
        </button>
        <button style={styles.timerResetBtn} onClick={goBackPhase} disabled={phaseIndex <= 0} title="Revenir à l'exercice/repos précédent">
          ⏮ Revenir
        </button>
        <button style={styles.timerResetBtn} onClick={skipPhase}>Passer ⏭</button>
        <button style={styles.timerResetBtn} onClick={stop}>Arrêter</button>
      </div>
    </div>
  );
}

function groupBySeries(entries) {
  const byEx = {};
  entries.forEach((e, idx) => {
    if (!byEx[e.exerciceId]) byEx[e.exerciceId] = [];
    byEx[e.exerciceId].push({ ...e, _idx: idx });
  });
  return byEx;
}

const DEFAULT_BILAN = { difficulte: null, sensation: null, douleur: "", remarque: "" };
const DEFAULT_BILAN_AVANT = { forme: null, sommeil: null, alimentation: null, douleur: "", remarque: "" };

function SessionCard({ session, exercises, allSessions, programName, isDistanciel, expanded, onToggle, onExpand, onSave, onDelete }) {
  const [local, setLocal] = useState(session.entries);
  const [dirty, setDirty] = useState(false);
  const [bilan, setBilan] = useState(session.bilan || DEFAULT_BILAN);
  const [bilanDirty, setBilanDirty] = useState(false);
  const [bilanAvant, setBilanAvant] = useState(session.bilanAvant || DEFAULT_BILAN_AVANT);
  const [bilanAvantDirty, setBilanAvantDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openConsignes, setOpenConsignes] = useState({});
  const [openVideo, setOpenVideo] = useState({});
  const [openTimer, setOpenTimer] = useState({});
  const [niveauxParExercice, setNiveauxParExercice] = useState(session.niveaux || {});
  const [niveauxDirty, setNiveauxDirty] = useState(false);
  const [openNiveauConsignes, setOpenNiveauConsignes] = useState({});
  const [openNiveauVideo, setOpenNiveauVideo] = useState({});

  useEffect(() => {
    setNiveauxParExercice(session.niveaux || {});
    setNiveauxDirty(false);
  }, [session.niveaux]);

  useEffect(() => {
    setLocal(session.entries);
    setDirty(false);
  }, [session.entries]);

  useEffect(() => {
    setBilan(session.bilan || DEFAULT_BILAN);
    setBilanDirty(false);
  }, [session.bilan]);

  useEffect(() => {
    setBilanAvant(session.bilanAvant || DEFAULT_BILAN_AVANT);
    setBilanAvantDirty(false);
  }, [session.bilanAvant]);

  useEffect(() => {
    if (!expanded) setConfirmDelete(false);
  }, [expanded]);

  const grouped = groupBySeries(local);
  const exIds = Object.keys(grouped);
  const zoneGroups = groupExIdsByZone(exIds, exercises);
  const CORPS_DE_SEANCE_ZONES = ["BAS DU CORPS", "HAUT DU CORPS", "CENTRE DU CORPS"];
  const FIN_DE_SEANCE_ZONES = ["Cardio", "Étirements"];
  const DEBUT_DE_SEANCE_ZONES = ["Mobilité", "Échauffement"];
  const debutHeaderIndex = zoneGroups.findIndex(([label]) => DEBUT_DE_SEANCE_ZONES.includes(label));
  const corpsHeaderIndex = zoneGroups.findIndex(([label]) => CORPS_DE_SEANCE_ZONES.includes(label));
  const finHeaderIndex = zoneGroups.findIndex(([label]) => FIN_DE_SEANCE_ZONES.includes(label));

  const previousValues = useMemo(() => {
    const earlierSessions = (allSessions || [])
      .filter((s) => s.id !== session.id && s.date < session.date)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    const map = {};
    session.entries.forEach((e) => {
      const key = e.exerciceId + "_" + e.serie;
      if (map[key] !== undefined) return;
      for (const s of earlierSessions) {
        const match = s.entries.find(
          (en) => en.exerciceId === e.exerciceId && en.serie === e.serie && (en.reps != null || en.charge != null)
        );
        if (match) {
          map[key] = match;
          break;
        }
      }
    });
    return map;
  }, [allSessions, session.id, session.date, session.entries]);

  const updateField = (idx, field, value) => {
    const copy = local.map((e, i) => (i === idx ? { ...e, [field]: value === "" ? null : Number(value) } : e));
    setLocal(copy);
    setDirty(true);
  };

  // Valide (ou dévalide) une série individuellement, et enregistre tout de
  // suite — indépendamment du bouton "Enregistrer les modifications" — pour
  // que rien ne soit perdu si la séance n'est jamais explicitement clôturée.
  const toggleValidee = (idx) => {
    const copy = local.map((e, i) => (i === idx ? { ...e, validee: !e.validee } : e));
    setLocal(copy);
    onSave({ entries: copy, bilan, bilanAvant, niveaux: niveauxParExercice });
  };

  const addSerie = (exerciceId) => {
    const rowsForEx = local.filter((e) => e.exerciceId === exerciceId);
    const maxSerie = rowsForEx.length ? Math.max(...rowsForEx.map((e) => e.serie)) : 0;
    const template = rowsForEx[rowsForEx.length - 1];
    const newEntry = {
      exerciceId,
      serie: maxSerie + 1,
      reps: template ? template.reps : null,
      charge: template ? template.charge : null,
      validee: false,
    };
    setLocal((prev) => [...prev, newEntry]);
    setDirty(true);
  };

  const removeSerie = (exerciceId, serie) => {
    setLocal((prev) => prev.filter((e) => !(e.exerciceId === exerciceId && e.serie === serie)));
    setDirty(true);
  };

  const updateBilan = (field, value) => {
    setBilan((b) => ({ ...b, [field]: value }));
    setBilanDirty(true);
  };

  const updateBilanAvant = (field, value) => {
    setBilanAvant((b) => ({ ...b, [field]: value }));
    setBilanAvantDirty(true);
  };

  const requestDelete = (e) => {
    e.stopPropagation();
    onExpand();
    setConfirmDelete(true);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeaderRow} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text }}>
              {session.seanceNom && <span style={{ color: COLORS.accent }}>{session.seanceNom} — </span>}
              {formatDateFR(session.date)}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textDim }}>
              {exIds.length} exercice{exIds.length > 1 ? "s" : ""}
              {programName && <span style={{ color: COLORS.accent2 }}> · {programName}</span>}
              {isDistanciel && (
                <span style={{ marginLeft: 6, fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "rgba(255,176,102,0.14)", color: COLORS.accent2, fontWeight: 600 }}>
                  Distanciel
                </span>
              )}
            </div>
          </div>
          <button
            style={styles.trashBtn}
            onClick={requestDelete}
            title="Supprimer la séance"
            aria-label="Supprimer la séance"
          >
            🗑️
          </button>
        </div>
        <span style={{ color: COLORS.textFaint, fontSize: 18, flexShrink: 0, marginLeft: 8 }}>{expanded ? "−" : "+"}</span>
      </div>

      {confirmDelete && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 12, padding: "10px 12px", background: "rgba(255,107,107,0.08)", border: `1px solid ${COLORS.danger}`, borderRadius: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.text }}>Supprimer définitivement cette séance ?</span>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button style={styles.secondaryBtn} onClick={() => setConfirmDelete(false)}>Annuler</button>
            <button style={styles.dangerBtn} onClick={onDelete}>Supprimer</button>
          </div>
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 14 }}>
          <SessionBilanAvantForm bilan={bilanAvant} onChange={updateBilanAvant} />
          {zoneGroups.map(([label, ids], idx) => (
            <div key={label} style={{ marginBottom: 16 }}>
              {idx === debutHeaderIndex && (
                <div style={{ ...styles.sectionHeader, marginTop: 0 }}>Début de séance</div>
              )}
              {idx === corpsHeaderIndex && (
                <div style={styles.sectionHeader}>Corps de séance</div>
              )}
              {idx === finHeaderIndex && (
                <div style={styles.sectionHeader}>Fin de séance</div>
              )}
              <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                {label}
              </div>
              {label === "Échauffement" && ids.length > 0 && (() => {
                const warmupRounds = Math.max(1, ...ids.map((id) => (grouped[id] ? grouped[id].length : WARMUP_SERIES_COUNT)));
                return (
                  <CircuitTimer
                    key={ids.join(",") + "_" + warmupRounds}
                    defaultRounds={warmupRounds}
                    exerciseNames={ids.map((id) => (exercises[id] ? exercises[id].nom.replace(/\n/g, " ") : "Exercice"))}
                  />
                );
              })()}
              {label === "Cardio" && ids.length > 0 && (
                <CircuitTimer
                  key={ids.join(",")}
                  title="Circuit cardio"
                  defaultWork={CARDIO_WORK_SECONDS}
                  defaultRest={CARDIO_REST_SECONDS}
                  defaultRoundRest={CARDIO_ROUND_REST_SECONDS}
                  workInMinutes
                  exerciseNames={ids.map((id) => (exercises[id] ? exercises[id].nom.replace(/\n/g, " ") : "Exercice"))}
                />
              )}
              {ids.map((exId) => {
                const ex = exercises[exId];
                const rows = grouped[exId];
                const showConsignesBtn = ex && hasConsignes(ex);
                const showVideoBtn = ex && ex.videoUrl;
                const warmup = isWarmupExercise(ex);
                const endSession = isEndSessionExercise(ex);
                const mobility = isMobilityExercise(ex);
                const cardio = isCardioExercise(ex);
                const gainage = isGainageExercise(ex);
                const showTimerBtn = ex && getExerciseZones(ex).some((z) => zoneLabel(z) === "BAS DU CORPS" || zoneLabel(z) === "HAUT DU CORPS");
                return (
                  <div key={exId} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, color: COLORS.accent2, marginBottom: 6, fontFamily: FONT_BODY, fontWeight: 600 }}>
                      {ex ? exDisplayName(ex) : "Exercice"}
                      {warmup && <span style={{ color: COLORS.textFaint, fontWeight: 400, fontSize: 11 }}> — temps en secondes</span>}
                      {gainage && <span style={{ color: COLORS.textFaint, fontWeight: 400, fontSize: 11 }}> — temps d'effort en secondes</span>}
                    </div>
                    {ex && (() => {
                      const exNiveaux = getExerciseNiveaux(ex, null);
                      const selectedNiveau = exNiveaux[(niveauxParExercice[exId] || 1) - 1];
                      const nivHasConsignes = selectedNiveau && selectedNiveau.consignes && CONSIGNE_FIELDS.some((f) => (selectedNiveau.consignes[f.key] || "").trim());
                      const nivHasVideo = selectedNiveau && selectedNiveau.videoUrl;
                      return (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                            {exNiveaux.map((niv, idx) => {
                              const lvl = idx + 1;
                              const isActive = (niveauxParExercice[exId] || 1) === lvl;
                              return (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => {
                                    setNiveauxParExercice((p) => ({ ...p, [exId]: lvl }));
                                    setNiveauxDirty(true);
                                  }}
                                  title={niv.nom}
                                  style={{
                                    fontSize: 10,
                                    padding: "3px 8px",
                                    borderRadius: 12,
                                    border: `1px solid ${isActive ? COLORS.accent : COLORS.cardBorder}`,
                                    background: isActive ? COLORS.accent : COLORS.bg2,
                                    color: isActive ? COLORS.bg : COLORS.textDim,
                                    fontWeight: isActive ? 700 : 400,
                                    cursor: "pointer",
                                    fontFamily: FONT_BODY,
                                  }}
                                >
                                  {niv.nom}
                                </button>
                              );
                            })}
                            {nivHasConsignes && (
                              <button
                                type="button"
                                style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openNiveauConsignes[exId] ? styles.infoBtnActive : {}) }}
                                onClick={() => setOpenNiveauConsignes((p) => ({ ...p, [exId]: !p[exId] }))}
                              >
                                ℹ️
                              </button>
                            )}
                            {nivHasVideo && (
                              <button
                                type="button"
                                style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openNiveauVideo[exId] ? styles.infoBtnActive : {}) }}
                                onClick={() => setOpenNiveauVideo((p) => ({ ...p, [exId]: !p[exId] }))}
                              >
                                ▶️
                              </button>
                            )}
                          </div>
                          {openNiveauConsignes[exId] && nivHasConsignes && (
                            <ConsignesPanel ex={{ consignes: selectedNiveau.consignes }} />
                          )}
                          {openNiveauVideo[exId] && nivHasVideo && (
                            <VideoPanel url={selectedNiveau.videoUrl} />
                          )}
                        </div>
                      );
                    })()}
                    {(mobility || endSession) ? (
                      (showConsignesBtn || showVideoBtn) && (
                        <div style={styles.entryRow}>
                          {showConsignesBtn && (
                            <button
                              style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openConsignes[exId] ? styles.infoBtnActive : {}) }}
                              onClick={() => setOpenConsignes((p) => ({ ...p, [exId]: !p[exId] }))}
                              title="Voir les consignes"
                              aria-label="Voir les consignes"
                            >
                              ℹ️
                            </button>
                          )}
                          {showVideoBtn && (
                            <button
                              style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openVideo[exId] ? styles.infoBtnActive : {}) }}
                              onClick={() => setOpenVideo((p) => ({ ...p, [exId]: !p[exId] }))}
                              title="Voir la vidéo"
                              aria-label="Voir la vidéo"
                            >
                              ▶️
                            </button>
                          )}
                        </div>
                      )
                    ) : cardio ? (
                      <div style={rows[0] && rows[0].validee ? { ...styles.entryRow, ...styles.entryRowValidated } : styles.entryRow}>
                        <span style={styles.entryLabel}>Durée</span>
                        <input
                          type="number"
                          min={0}
                          value={rows[0] ? Math.floor((rows[0].reps ?? 0) / 60) : 0}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const m = Math.max(0, Number(e.target.value) || 0);
                            const s = (rows[0]?.reps ?? 0) % 60;
                            updateField(rows[0]._idx, "reps", String(m * 60 + s));
                          }}
                          style={{ ...styles.numInput, width: 50 }}
                        />
                        <span style={styles.unitLabel}>min</span>
                        <input
                          type="number"
                          min={0}
                          max={59}
                          value={rows[0] ? (rows[0].reps ?? 0) % 60 : 0}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const s = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                            const m = Math.floor((rows[0]?.reps ?? 0) / 60);
                            updateField(rows[0]._idx, "reps", String(m * 60 + s));
                          }}
                          style={{ ...styles.numInput, width: 50 }}
                        />
                        <span style={styles.unitLabel}>sec</span>
                        {rows[0] && (
                          <button
                            type="button"
                            onClick={() => toggleValidee(rows[0]._idx)}
                            title={rows[0].validee ? "Marquer comme non validée" : "Valider cette série"}
                            aria-label={rows[0].validee ? "Marquer comme non validée" : "Valider cette série"}
                            style={rows[0].validee ? { ...styles.validateSerieBtn, ...styles.validateSerieBtnActive } : styles.validateSerieBtn}
                          >
                            ✓
                          </button>
                        )}
                        {showConsignesBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openConsignes[exId] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenConsignes((p) => ({ ...p, [exId]: !p[exId] }))}
                            title="Voir les consignes"
                            aria-label="Voir les consignes"
                          >
                            ℹ️
                          </button>
                        )}
                        {showVideoBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openVideo[exId] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenVideo((p) => ({ ...p, [exId]: !p[exId] }))}
                            title="Voir la vidéo"
                            aria-label="Voir la vidéo"
                          >
                            ▶️
                          </button>
                        )}
                      </div>
                    ) : (
                    <>
                    {rows.map((row, rIdx) => {
                      const prev = previousValues[exId + "_" + row.serie];
                      const timerKey = exId + "_" + row.serie;
                      return (
                      <React.Fragment key={row._idx}>
                      <div style={row.validee ? { ...styles.entryRow, ...styles.entryRowValidated } : styles.entryRow}>
                        <span style={styles.entryLabel}>Set {row.serie}</span>
                        <button
                          type="button"
                          onClick={() => removeSerie(exId, row.serie)}
                          title="Retirer cette série"
                          aria-label="Retirer cette série"
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 5,
                            border: `1px solid ${COLORS.cardBorder}`,
                            background: COLORS.bg2,
                            color: COLORS.textFaint,
                            fontSize: 10,
                            cursor: "pointer",
                            flexShrink: 0,
                            padding: 0,
                          }}
                        >
                          ✕
                        </button>
                        <input
                          type="number"
                          value={row.reps ?? ""}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateField(row._idx, "reps", e.target.value)}
                          placeholder={warmup ? "Sec." : endSession ? "Resp." : gainage ? "Sec." : "Rép."}
                          style={styles.numInput}
                        />
                        <span style={styles.unitLabel}>{warmup ? "sec" : endSession ? "resp" : gainage ? "sec" : "rep"}</span>
                        {!endSession && !gainage && (
                          <>
                            <input
                              type="number"
                              value={row.charge ?? ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => updateField(row._idx, "charge", e.target.value)}
                              placeholder="Kg"
                              style={styles.numInput}
                            />
                            <span style={styles.unitLabel}>kg</span>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleValidee(row._idx)}
                          title={row.validee ? "Marquer comme non validée" : "Valider cette série"}
                          aria-label={row.validee ? "Marquer comme non validée" : "Valider cette série"}
                          style={row.validee ? { ...styles.validateSerieBtn, ...styles.validateSerieBtnActive } : styles.validateSerieBtn}
                        >
                          ✓
                        </button>
                        {prev && (
                          <span style={styles.prevValue}>
                            Dernière fois : {prev.reps ?? "—"}
                            {warmup ? "s" : endSession ? " resp." : gainage ? "s" : " rép."}
                            {!endSession && !gainage && <> · {prev.charge ?? "—"} kg</>}
                          </span>
                        )}
                        {gainage && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnTimer, ...(openTimer[timerKey] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenTimer((p) => ({ ...p, [timerKey]: !p[timerKey] }))}
                            title="Chrono d'effort"
                            aria-label="Chrono d'effort"
                          >
                            ⏱️ Chrono
                          </button>
                        )}
                        {showTimerBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnTimer, ...(openTimer[timerKey] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenTimer((p) => ({ ...p, [timerKey]: !p[timerKey] }))}
                            title="Chrono de récupération"
                            aria-label="Chrono de récupération"
                          >
                            ⏱️ Repos
                          </button>
                        )}
                        {rIdx === 0 && showConsignesBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openConsignes[exId] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenConsignes((p) => ({ ...p, [exId]: !p[exId] }))}
                            title="Voir les consignes"
                            aria-label="Voir les consignes"
                          >
                            ℹ️
                          </button>
                        )}
                        {rIdx === 0 && showVideoBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openVideo[exId] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenVideo((p) => ({ ...p, [exId]: !p[exId] }))}
                            title="Voir la vidéo"
                            aria-label="Voir la vidéo"
                          >
                            ▶️
                          </button>
                        )}
                      </div>
                      {openTimer[timerKey] && (gainage ? <GainageTimer defaultDuration={60} /> : <RestTimer duration={restDurationForSet(row.serie)} />)}
                      </React.Fragment>
                      );
                    })}
                    <button
                      type="button"
                      style={{ ...styles.linkBtn, fontSize: 11, marginTop: 2 }}
                      onClick={() => addSerie(exId)}
                    >
                      + Ajouter une série
                    </button>
                    </>
                    )}
                    {openConsignes[exId] && ex && <ConsignesPanel ex={ex} />}
                    {openVideo[exId] && ex && <VideoPanel url={ex.videoUrl} />}
                  </div>
                );
              })}
            </div>
          ))}

          <SessionBilanForm bilan={bilan} onChange={updateBilan} />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, gap: 10 }}>
            <button style={styles.dangerLinkBtn} onClick={() => setConfirmDelete(true)}>Supprimer la séance</button>
            <button
              style={{ ...styles.primaryBtn, opacity: (dirty || bilanDirty || bilanAvantDirty || niveauxDirty) ? 1 : 0.5 }}
              disabled={!dirty && !bilanDirty && !bilanAvantDirty && !niveauxDirty}
              onClick={() => {
                onSave({ entries: local, bilan, bilanAvant, niveaux: niveauxParExercice });
                setDirty(false);
                setBilanDirty(false);
                setBilanAvantDirty(false);
                setNiveauxDirty(false);
              }}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionBilanAvantForm({ bilan, onChange }) {
  const smileyFields = [
    { key: "forme", label: "Je suis en forme" },
    { key: "sommeil", label: "J'ai bien dormi" },
    { key: "alimentation", label: "J'ai bien mangé" },
  ];
  const smileyOptions = [
    { value: "sad", emoji: "😞", label: "Pas content" },
    { value: "neutral", emoji: "😐", label: "Normal" },
    { value: "happy", emoji: "😊", label: "Content" },
  ];
  return (
    <div style={{ ...styles.bilanPanel, marginTop: 0, marginBottom: 16 }}>
      <div style={{ ...styles.sectionHeader, marginTop: 0 }}>Bilan avant séance</div>

      {smileyFields.map((f) => (
        <div key={f.key} style={{ marginBottom: 16 }}>
          <label style={styles.fieldLabel}>{f.label}</label>
          <div style={{ display: "flex", gap: 10 }}>
            {smileyOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange(f.key, bilan[f.key] === opt.value ? null : opt.value)}
                style={{
                  ...styles.bilanSensationBtn,
                  ...(bilan[f.key] === opt.value ? styles.bilanSensationBtnActive : {}),
                }}
                title={opt.label}
              >
                <span style={{ fontSize: 24 }}>{opt.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginBottom: 16 }}>
        <label style={styles.fieldLabel}>J'ai une douleur ?</label>
        <textarea
          style={styles.textArea}
          rows={2}
          value={bilan.douleur || ""}
          onChange={(e) => onChange("douleur", e.target.value)}
          placeholder="Ex: légère tension dans le bas du dos..."
        />
      </div>

      <div>
        <label style={styles.fieldLabel}>Remarque</label>
        <textarea
          style={styles.textArea}
          rows={2}
          value={bilan.remarque || ""}
          onChange={(e) => onChange("remarque", e.target.value)}
          placeholder="Toute autre observation avant de commencer..."
        />
      </div>
    </div>
  );
}

function SessionBilanForm({ bilan, onChange }) {
  const sensationOptions = [
    { value: "sad", emoji: "😞", label: "Pas content" },
    { value: "neutral", emoji: "😐", label: "Normal" },
    { value: "happy", emoji: "😊", label: "Content" },
  ];
  return (
    <div style={styles.bilanPanel}>
      <div style={styles.sectionHeader}>Bilan après séance</div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.fieldLabel}>Difficulté ressentie (1 à 10)</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => onChange("difficulte", bilan.difficulte === n ? null : n)}
              style={{
                ...styles.bilanScaleBtn,
                ...(bilan.difficulte === n ? styles.bilanScaleBtnActive : {}),
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.fieldLabel}>Sensation</label>
        <div style={{ display: "flex", gap: 10 }}>
          {sensationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange("sensation", bilan.sensation === opt.value ? null : opt.value)}
              style={{
                ...styles.bilanSensationBtn,
                ...(bilan.sensation === opt.value ? styles.bilanSensationBtnActive : {}),
              }}
              title={opt.label}
            >
              <span style={{ fontSize: 24 }}>{opt.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.fieldLabel}>J'ai une douleur ?</label>
        <textarea
          style={styles.textArea}
          rows={2}
          value={bilan.douleur || ""}
          onChange={(e) => onChange("douleur", e.target.value)}
          placeholder="Ex: légère gêne à l'épaule droite pendant le développé..."
        />
      </div>

      <div>
        <label style={styles.fieldLabel}>Remarque</label>
        <textarea
          style={styles.textArea}
          rows={2}
          value={bilan.remarque || ""}
          onChange={(e) => onChange("remarque", e.target.value)}
          placeholder="Toute autre observation sur la séance..."
        />
      </div>
    </div>
  );
}

function NewSessionForm({ data, onCancel, onSave }) {
  const [date, setDate] = useState(todayISO());
  const [seanceTypeId, setSeanceTypeId] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [niveauxByKey, setNiveauxByKey] = useState({});
  const exercisesMap = exMap(data);

  const applyTemplate = (stId) => {
    setSeanceTypeId(stId);
    const st = data.seanceTypes.find((s) => s.id === stId);
    if (st) {
      const keys = st.exerciceIds.map((exId) => {
        const ex = exercisesMap[exId];
        return selKey(exId, zoneLabel(getExerciseZones(ex)[0]));
      });
      setSelectedKeys(keys);
      const niv = {};
      keys.forEach((k, i) => {
        const exId = st.exerciceIds[i];
        if (st.niveaux && st.niveaux[exId] != null) niv[k] = st.niveaux[exId];
      });
      setNiveauxByKey(niv);
    }
  };

  const toggleKey = (key) => {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  };

  const selectNiveau = (key, lvl) => {
    setNiveauxByKey((prev) => ({ ...prev, [key]: lvl }));
  };

  const save = () => {
    if (!date || selectedKeys.length === 0) return;
    const { exerciceIds, niveaux } = finalizeSelection(selectedKeys, niveauxByKey, exercisesMap);
    const baseEntries = makeEntries(exerciceIds, exercisesMap);
    const st = data.seanceTypes.find((s) => s.id === seanceTypeId);
    const previousMap = st ? getPreviousEntriesSameSeance(data.sessions, st.nom, null) : null;
    const entries = applyPreviousEntries(baseEntries, previousMap);
    onSave({ id: uid("se"), date, seanceNom: st ? st.nom : null, entries, niveaux });
  };

  return (
    <div style={{ ...styles.card, marginBottom: 14 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Nouvelle séance</div>
      <label style={styles.fieldLabel}>Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.textInput} />

      <label style={styles.fieldLabel}>Type de séance (optionnel, pré-remplit les exercices)</label>
      <select value={seanceTypeId} onChange={(e) => applyTemplate(e.target.value)} style={styles.textInput}>
        <option value="">— Choisir —</option>
        {data.seanceTypes.map((st) => (
          <option key={st.id} value={st.id}>{st.nom}</option>
        ))}
      </select>

      <label style={styles.fieldLabel}>Exercices de la séance</label>
      <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
        Un exercice présent dans plusieurs catégories peut être coché indépendamment dans chacune, avec son propre niveau.
      </p>
      <div style={styles.checklist}>
        {groupExIdsByZoneMulti(data.exercises.map((e) => e.id), exercisesMap).map(([label, ids]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
              {label}
            </div>
            {ids.map((exId) => {
              const ex = data.exercises.find((e) => e.id === exId);
              if (!ex) return null;
              const key = selKey(exId, label);
              const isChecked = selectedKeys.includes(key);
              return (
                <div key={key} style={{ marginBottom: 4 }}>
                  <label style={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleKey(key)}
                    />
                    <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                  </label>
                  {isChecked && (
                    <LevelPickerButtons
                      exercise={ex}
                      selected={niveauxByKey[key]}
                      onSelect={(lvl) => selectNiveau(key, lvl)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} onClick={save} disabled={selectedKeys.length === 0}>
          Créer la séance
        </button>
      </div>
    </div>
  );
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describePlateSlice(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

const LEGUMES_IDEAS = [
  "Brocolis vapeur",
  "Courgettes poêlées",
  "Épinards frais ou cuits",
  "Poivrons crus ou grillés",
  "Carottes râpées",
  "Salade verte",
  "Tomates",
  "Haricots verts",
  "Chou-fleur rôti",
  "Aubergines grillées",
  "Champignons poêlés",
  "Concombre",
];

const FRUITS_IDEAS = [
  "Pomme",
  "Banane",
  "Fraises",
  "Myrtilles",
  "Orange",
  "Kiwi",
  "Poire",
  "Ananas",
  "Raisin",
  "Pêche",
  "Melon",
  "Framboises",
];

const GLUCIDES_IDEAS_DEFAULT = [
  "Riz complet",
  "Quinoa",
  "Patate douce",
  "Pâtes complètes",
  "Flocons d'avoine",
  "Pain complet",
  "Pain de seigle",
  "Boulgour",
  "Pommes de terre",
  "Sarrasin",
  "Légumineuses (pois chiches...)",
  "Riz basmati",
  "Semoule complète",
];

const MATIN_GLUCIDES_IDEAS = ["Flocons d'avoine", "Pain complet", "Pain de seigle"];

const MIDI_GLUCIDES_IDEAS = GLUCIDES_IDEAS_DEFAULT.filter(
  (i) => i !== "Flocons d'avoine" && i !== "Pain complet"
);

const PROTEINES_IDEAS_DEFAULT = [
  "Blanc de poulet",
  "Œufs",
  "Poisson blanc ou saumon",
  "Tofu ferme",
  "Lentilles",
  "Fromage blanc / skyr",
  "Jambon blanc",
  "Viande rouge maigre",
  "Crevettes",
  "Steak haché 5%",
  "Fromage cottage",
  "Tempeh",
];

// 7 entrées (une par jour) : "Shaker de protéine" apparaît 3 fois dans la semaine
const GOUTER_PROTEINES_IDEAS = [
  "Shaker de protéine",
  "Fromage blanc / skyr",
  "Œufs",
  "Shaker de protéine",
  "Jambon blanc",
  "Fromage cottage",
  "Shaker de protéine",
];

function getAlimentationSections(mealTime) {
  const isFruitMode = mealTime === "matin" || mealTime === "gouter";
  const glucidesIdeas =
    mealTime === "matin" || mealTime === "gouter" ? MATIN_GLUCIDES_IDEAS
    : mealTime === "midi" ? MIDI_GLUCIDES_IDEAS
    : GLUCIDES_IDEAS_DEFAULT;
  const proteinesIdeas = mealTime === "gouter" ? GOUTER_PROTEINES_IDEAS : PROTEINES_IDEAS_DEFAULT;
  return [
    {
      key: "legumes",
      title: isFruitMode ? "Fruits" : "Légumes",
      subtitle: "La moitié de l'assiette",
      color: isFruitMode ? "#E091C4" : "#5CB85C",
      colorStroke: isFruitMode ? "#9C3D7A" : "#2E7D32",
      ideas: isFruitMode ? FRUITS_IDEAS : LEGUMES_IDEAS,
    },
    {
      key: "proteines",
      title: "Protéines",
      subtitle: "Le premier quart",
      color: "#E57373",
      colorStroke: "#C62828",
      ideas: proteinesIdeas,
    },
    {
      key: "glucides",
      title: "Glucides complexes",
      subtitle: "Le deuxième quart",
      color: "#FFB74D",
      colorStroke: "#E65100",
      ideas: glucidesIdeas,
    },
  ];
}

function CTView({ data, activeClient, clientId, role, persistLibrary }) {
  const [mode, setMode] = useState("chrono");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [niveauxByKey, setNiveauxByKey] = useState({});
  const [loadedSettings, setLoadedSettings] = useState({
    work: WARMUP_WORK_SECONDS,
    rest: WARMUP_REST_SECONDS,
    roundRest: WARMUP_ROUND_REST_SECONDS,
    rounds: 5,
  });
  const exercisesMap = exMap(data);
  const toggleKey = (key) => setSelectedKeys((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));
  const { exerciceIds: selectedIds, niveaux: resolvedNiveaux } = finalizeSelection(selectedKeys, niveauxByKey, exercisesMap);
  const names = selectedIds.map((id) => {
    const ex = exercisesMap[id];
    if (!ex) return "Exercice";
    const niv = getExerciseNiveaux(ex, null)[(resolvedNiveaux[id] || 1) - 1];
    return niv ? `${ex.nom.replace(/\n/g, " ")} — ${niv.nom}` : ex.nom.replace(/\n/g, " ");
  });

  const assignedCtProgram = activeClient ? data.ctPrograms.find((p) => p.id === activeClient.ctProgramId) : null;
  const ctMap = {};
  data.ctTypes.forEach((c) => (ctMap[c.id] = c));

  const loadCTType = (ct) => {
    const keys = ct.exerciceIds.map((exId) => {
      const ex = exercisesMap[exId];
      return selKey(exId, zoneLabel(getExerciseZones(ex)[0]));
    });
    setSelectedKeys(keys);
    const niv = {};
    keys.forEach((k, i) => {
      const exId = ct.exerciceIds[i];
      if (ct.niveaux && ct.niveaux[exId] != null) niv[k] = ct.niveaux[exId];
    });
    setNiveauxByKey(niv);
    setLoadedSettings({
      work: ct.workSeconds ?? WARMUP_WORK_SECONDS,
      rest: ct.restSeconds ?? WARMUP_REST_SECONDS,
      roundRest: ct.roundRestSeconds ?? WARMUP_ROUND_REST_SECONDS,
      rounds: ct.rounds ?? 5,
    });
  };

  return (
    <div>
      <h2 style={styles.h2}>Circuit training</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "chrono" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("chrono")}
        >
          ⏱️ Chrono
        </button>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "tableau" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("tableau")}
        >
          📋 Tableau
        </button>
      </div>

      {mode === "tableau" ? (
                <CTTableView clientId={clientId} role={role} data={data} persistLibrary={persistLibrary} />
      ) : (
      <>
      <p style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 16 }}>
        Choisis les exercices du circuit, puis lance le chrono. Même principe que le circuit d'échauffement : temps d'effort, repos entre exercices, repos entre tours.
      </p>

      {data.ctTypes.length > 0 && (
        <div style={{ ...styles.card, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
            Circuits enregistrés
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.ctTypes.map((ct) => (
              <button key={ct.id} style={styles.secondaryBtn} onClick={() => loadCTType(ct)}>
                {ct.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      {assignedCtProgram && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 10 }}>
            Programme CT en cours : <strong style={{ color: COLORS.accent }}>{assignedCtProgram.nom}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {assignedCtProgram.ctTypeIds.map((ctId) => {
              const ct = ctMap[ctId];
              if (!ct) return null;
              return (
                <div key={ctId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 10px", background: COLORS.bg2, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{ct.nom}</div>
                    <div style={{ fontSize: 11, color: COLORS.textDim }}>
                      {ct.exerciceIds.map((exId) => exercisesMap[exId] ? exercisesMap[exId].nom.replace(/\n/g, " ") : "").filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <button style={styles.secondaryBtn} onClick={() => loadCTType(ct)}>Charger</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.checklist}>
        {groupExIdsByZoneMulti(data.exercises.map((e) => e.id), exercisesMap).map(([label, ids]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
              {label}
            </div>
            {ids.map((exId) => {
              const ex = exercisesMap[exId];
              const key = selKey(exId, label);
              const isChecked = selectedKeys.includes(key);
              return (
                <div key={key} style={{ marginBottom: 4 }}>
                  <label style={styles.checkItem}>
                    <input type="checkbox" checked={isChecked} onChange={() => toggleKey(key)} />
                    <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                  </label>
                  {isChecked && (
                    <LevelPickerButtons
                      exercise={ex}
                      selected={niveauxByKey[key]}
                      onSelect={(lvl) => setNiveauxByKey((p) => ({ ...p, [key]: lvl }))}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedIds.length > 0 ? (
        <div style={{ marginTop: 16 }}>
          <CircuitTimer
            key={selectedIds.join(",")}
            title="Circuit training"
            exerciseNames={names}
            defaultWork={loadedSettings.work}
            defaultRest={loadedSettings.rest}
            defaultRoundRest={loadedSettings.roundRest}
            defaultRounds={loadedSettings.rounds}
          />
        </div>
      ) : (
        <div style={styles.emptyState}>Sélectionne au moins un exercice pour démarrer le circuit.</div>
      )}
      </>
      )}
    </div>
  );
}

const ctTableKey = (clientId) => `ct-table-v1-${clientId}`;
const ctTableDraftKey = (clientId) => `ct-table-draft-v1-${clientId}`;

function CTTableGridEditor({ data, rows, setRows, rounds, setRounds, levelNames, showPoids = true, isCoach = true, showHeaderControls = true }) {
  const exercisesMap = exMap(data);
  const groupeOptions = [...new Set(data.exercises.flatMap((e) => getExerciseGroupes(e)))].sort();
  const exercisesForGroupe = (groupe) =>
    groupe ? data.exercises.filter((e) => getExerciseGroupes(e).includes(groupe)) : data.exercises;
  const [openCellConsignes, setOpenCellConsignes] = useState({});
  const [openCellVideo, setOpenCellVideo] = useState({});

  const setRoundCount = (n) => {
    const newRounds = Math.max(1, Math.min(10, n));
    setRounds(newRounds);
    setRows((prev) =>
      prev.map((row) => {
        const cells = row.cells.slice(0, newRounds);
        while (cells.length < newRounds) cells.push({ exerciceId: "", poids: "" });
        return { ...row, cells };
      })
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: uid("ctrow"), groupe: "", cells: Array.from({ length: rounds }, () => ({ exerciceId: "", poids: "" })) },
    ]);
  };

  const removeRow = (rowId) => setRows((prev) => prev.filter((r) => r.id !== rowId));

  const updateRowGroupe = (rowId, groupe) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, groupe } : r)));

  const updateCell = (rowId, cellIdx, field, value) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, cells: r.cells.map((c, i) => (i === cellIdx ? { ...c, [field]: value } : c)) }
          : r
      )
    );

  return (
    <div>
      {isCoach && showHeaderControls && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <label style={{ fontSize: 13, color: COLORS.textDim }}>Nombre de tours (CT)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={rounds}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setRoundCount(Number(e.target.value) || 1)}
            style={{ ...styles.numInput, width: 56 }}
          />
          <button style={styles.secondaryBtn} onClick={addRow}>+ Ajouter un exercice</button>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ ...styles.table, minWidth: 180 + rounds * 170 }}>
          <thead>
            <tr>
              <th style={styles.th}>Exercice</th>
              {Array.from({ length: rounds }, (_, i) => (
                <th key={i} style={{ ...styles.th, textAlign: "center" }}>CT {i + 1}</th>
              ))}
              {isCoach && <th style={styles.th}></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ ...styles.td, minWidth: 150 }}>
                  {isCoach ? (
                    <select
                      style={{ ...styles.textInput, marginBottom: 0, fontSize: 13, fontWeight: 600 }}
                      value={row.groupe}
                      onChange={(e) => updateRowGroupe(row.id, e.target.value)}
                    >
                      <option value="">— Groupe musculaire —</option>
                      {groupeOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ fontWeight: 600 }}>{row.groupe || "—"}</span>
                  )}
                </td>
                {row.cells.map((cell, i) => {
                  const options = exercisesForGroupe(row.groupe);
                  const cellLevelNames = getExerciseNiveaux(exercisesMap[cell.exerciceId], levelNames);
                  const selectedLevel = cellLevelNames[(cell.niveau || 1) - 1];
                  const exName = cell.exerciceId
                    ? `${exDisplayName(exercisesMap[cell.exerciceId])} — ${selectedLevel ? selectedLevel.nom : ""}`
                    : cell.exercice || "";
                  const cellKey = `${row.id}_${i}`;
                  const levelHasConsignes = selectedLevel && selectedLevel.consignes && CONSIGNE_FIELDS.some((f) => (selectedLevel.consignes[f.key] || "").trim());
                  const levelHasVideo = selectedLevel && selectedLevel.videoUrl;
                  return (
                  <td key={i} style={{ ...styles.td, minWidth: 160 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {isCoach ? (
                        <>
                          <select
                            style={{ ...styles.textInput, marginBottom: 0, fontSize: 12 }}
                            value={cell.exerciceId || ""}
                            onChange={(e) => updateCell(row.id, i, "exerciceId", e.target.value)}
                          >
                            <option value="">— Exercice —</option>
                            {options.map((ex) => (
                              <option key={ex.id} value={ex.id}>{exDisplayName(ex)}</option>
                            ))}
                          </select>
                          {cell.exerciceId && (
                            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                              {cellLevelNames.map((_, idx) => {
                                const lvl = idx + 1;
                                const isActive = (cell.niveau || 1) === lvl;
                                return (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => updateCell(row.id, i, "niveau", lvl)}
                                    style={{
                                      width: 22,
                                      height: 22,
                                      borderRadius: 6,
                                      border: `1px solid ${isActive ? COLORS.accent : COLORS.cardBorder}`,
                                      background: isActive ? COLORS.accent : COLORS.bg2,
                                      color: isActive ? COLORS.bg : COLORS.textDim,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      fontFamily: FONT_BODY,
                                      padding: 0,
                                    }}
                                    title={cellLevelNames[lvl - 1].nom}
                                  >
                                    {lvl}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {cell.exerciceId && selectedLevel && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 10, color: COLORS.accent2 }}>{selectedLevel.nom}</span>
                              {levelHasConsignes && (
                                <button
                                  type="button"
                                  style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openCellConsignes[cellKey] ? styles.infoBtnActive : {}), padding: "3px 6px", fontSize: 10 }}
                                  onClick={() => setOpenCellConsignes((p) => ({ ...p, [cellKey]: !p[cellKey] }))}
                                >
                                  ℹ️
                                </button>
                              )}
                              {levelHasVideo && (
                                <button
                                  type="button"
                                  style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openCellVideo[cellKey] ? styles.infoBtnActive : {}), padding: "3px 6px", fontSize: 10 }}
                                  onClick={() => setOpenCellVideo((p) => ({ ...p, [cellKey]: !p[cellKey] }))}
                                >
                                  ▶️
                                </button>
                              )}
                            </div>
                          )}
                          {openCellConsignes[cellKey] && selectedLevel && levelHasConsignes && (
                            <ConsignesPanel ex={{ consignes: selectedLevel.consignes }} />
                          )}
                          {openCellVideo[cellKey] && selectedLevel && levelHasVideo && (
                            <VideoPanel url={selectedLevel.videoUrl} />
                          )}
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: COLORS.textDim }}>{exName || "—"}</span>
                      )}
                      {showPoids && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <input
                            type="number"
                            style={{ ...styles.numInput, width: 60 }}
                            value={cell.poids}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => updateCell(row.id, i, "poids", e.target.value)}
                            placeholder="Kg"
                          />
                          <span style={styles.unitLabel}>kg</span>
                        </div>
                      )}
                    </div>
                  </td>
                  );
                })}
                {isCoach && (
                  <td style={styles.td}>
                    <button style={styles.trashBtn} onClick={() => removeRow(row.id)} title="Supprimer cet exercice" aria-label="Supprimer cet exercice">🗑️</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CTTableView({ clientId, role, data, persistLibrary }) {
  const isCoach = role === "coach";
  const [rounds, setRounds] = useState(5);
  const [rows, setRows] = useState([
    { id: uid("ctrow"), groupe: "", cells: Array.from({ length: 5 }, () => ({ exerciceId: "", poids: "" })) },
  ]);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [history, setHistory] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingLevels, setEditingLevels] = useState(false);
  const [levelNamesInput, setLevelNamesInput] = useState(null);
  const [timerWorkSeconds, setTimerWorkSeconds] = useState(WARMUP_WORK_SECONDS);
  const [timerRestSeconds, setTimerRestSeconds] = useState(WARMUP_REST_SECONDS);
  const [timerRoundRestSeconds, setTimerRoundRestSeconds] = useState(WARMUP_ROUND_REST_SECONDS);
  const [showTimer, setShowTimer] = useState(false);

  const levelNames = data.ctLevelNames && data.ctLevelNames.length
    ? data.ctLevelNames
    : ["Bilatéral", "Unilatéral"];

  const startEditLevels = () => {
    setLevelNamesInput([...levelNames]);
    setEditingLevels(true);
  };

  const saveLevelNames = () => {
    const cleaned = levelNamesInput.map((n, i) => n.trim() || `Niveau ${i + 1}`);
    persistLibrary({
      exercises: data.exercises,
      seanceTypes: data.seanceTypes,
      programs: data.programs,
      ctTypes: data.ctTypes,
      ctPrograms: data.ctPrograms,
      alimentationVideos: data.alimentationVideos,
      ctLevelNames: cleaned,
    });
    setEditingLevels(false);
  };

  const exercisesMap = exMap(data);
  const modelesAvecTableau = data.ctTypes.filter((ct) => ct.table && Array.isArray(ct.table.rows));

  const loadFromModele = (ct) => {
    setRounds(ct.table.rounds);
    setRows(ct.table.rows.map((r) => ({ ...r, id: uid("ctrow"), cells: r.cells.map((c) => ({ ...c, poids: "" })) })));
  };

  useEffect(() => {
    if (!clientId) return;
    setHistoryLoaded(false);
    (async () => {
      let h = null;
      try {
        const r = await window.storage.get(ctTableKey(clientId), true);
        if (r && r.value) h = JSON.parse(r.value);
      } catch (e) {}
      setHistory(h || []);
      setHistoryLoaded(true);
    })();
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    setDraftLoaded(false);
    (async () => {
      let d = null;
      try {
        const r = await window.storage.get(ctTableDraftKey(clientId), true);
        if (r && r.value) d = JSON.parse(r.value);
      } catch (e) {}
      if (d && d.rows) {
        setRounds(d.rounds || 5);
        setRows(d.rows);
      }
      setDraftLoaded(true);
    })();
  }, [clientId]);

  useEffect(() => {
    if (!clientId || !draftLoaded) return;
    const id = setTimeout(() => {
      window.storage.set(ctTableDraftKey(clientId), JSON.stringify({ rounds, rows }), true).catch(() => {});
    }, 500);
    return () => clearTimeout(id);
  }, [clientId, draftLoaded, rounds, rows]);

  const validateSession = async () => {
    setSaving(true);
    const entry = { id: uid("ctsession"), date: todayISO(), rounds, rows };
    const newHistory = [entry, ...(history || [])];
    setHistory(newHistory);
    try { await window.storage.set(ctTableKey(clientId), JSON.stringify(newHistory), true); } catch (e) {}
    setSaving(false);
  };

  const deleteHistoryEntry = async (entryId) => {
    const newHistory = (history || []).filter((h) => h.id !== entryId);
    setHistory(newHistory);
    try { await window.storage.set(ctTableKey(clientId), JSON.stringify(newHistory), true); } catch (e) {}
  };

  return (
    <div>
      <p style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 14 }}>
        Chaque ligne est un exercice (choisis son groupe musculaire), chaque colonne un tour. L'exercice choisi peut évoluer à chaque tour ; note le poids utilisé dans chaque case.
      </p>

      {isCoach && modelesAvecTableau.length > 0 && (
        <div style={{ ...styles.card, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
            Modèles de tableau enregistrés (créés depuis Séances)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {modelesAvecTableau.map((ct) => (
              <button key={ct.id} style={styles.secondaryBtn} onClick={() => loadFromModele(ct)}>
                {ct.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      {isCoach && (
        <div style={{ marginBottom: 14 }}>
          <button style={styles.linkBtn} onClick={startEditLevels}>Renommer les niveaux par défaut</button>
        </div>
      )}

      {isCoach && editingLevels && (
        <div style={{ ...styles.card, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Niveaux par défaut</div>
          <div style={{ fontSize: 11, color: COLORS.textFaint, marginBottom: 10 }}>
            Utilisés uniquement pour les exercices sans niveaux personnalisés (réglables dans la fiche de chaque exercice).
          </div>
          <ExerciseLevelsFields niveaux={levelNamesInput} onChange={setLevelNamesInput} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={styles.secondaryBtn} onClick={() => setEditingLevels(false)}>Annuler</button>
            <button style={styles.primaryBtn} onClick={saveLevelNames}>Enregistrer</button>
          </div>
        </div>
      )}

      <CTTableGridEditor
        data={data}
        rows={rows}
        setRows={setRows}
        rounds={rounds}
        setRounds={setRounds}
        levelNames={levelNames}
        showPoids={true}
        isCoach={isCoach}
      />

      {isCoach && (
        <div style={{ ...styles.card, marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 10 }}>⏱️ Chrono synchronisé avec le tableau</div>
          <p style={{ fontSize: 12, color: COLORS.textDim, marginTop: -4, marginBottom: 10 }}>
            {rows.filter((r) => r.cells.some((c) => c.exerciceId)).length} exercice(s) × {rounds} tour(s) = un chrono qui enchaîne automatiquement chaque exercice, dans l'ordre du tableau, tour après tour.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Effort (s)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={timerWorkSeconds}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setTimerWorkSeconds(Math.max(5, Number(e.target.value) || WARMUP_WORK_SECONDS))}
                style={{ ...styles.numInput, width: 64 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Repos entre exercices (s)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={timerRestSeconds}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setTimerRestSeconds(Math.max(5, Number(e.target.value) || WARMUP_REST_SECONDS))}
                style={{ ...styles.numInput, width: 64 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Repos entre tours (s)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={timerRoundRestSeconds}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setTimerRoundRestSeconds(Math.max(5, Number(e.target.value) || WARMUP_ROUND_REST_SECONDS))}
                style={{ ...styles.numInput, width: 64 }}
              />
            </div>
          </div>
          {!showTimer ? (
            <button style={styles.primaryBtn} onClick={() => setShowTimer(true)}>▶️ Démarrer le chrono synchronisé</button>
          ) : (
            <CircuitTimer
              key={JSON.stringify(rows) + rounds + timerWorkSeconds + timerRestSeconds + timerRoundRestSeconds}
              title="Circuit CT synchronisé"
              exerciseNames={[]}
              customPhases={buildCTTablePhases(rows, rounds, timerWorkSeconds, timerRestSeconds, timerRoundRestSeconds, exercisesMap, levelNames)}
              customSummary={`${rows.filter((r) => r.cells.some((c) => c.exerciceId)).length} exercice(s) × ${rounds} tour(s) · ${timerWorkSeconds}s d'effort / ${timerRestSeconds}s de repos / ${timerRoundRestSeconds}s entre les tours`}
            />
          )}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <button style={{ ...styles.primaryBtn, opacity: saving ? 0.6 : 1 }} onClick={validateSession} disabled={saving}>
          {saving ? "Enregistrement…" : "✓ Valider la séance"}
        </button>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={styles.sectionHeader}>Historique des séances CT</div>
        {!historyLoaded ? (
          <div style={{ ...styles.emptyState, padding: "20px 0" }}>Chargement…</div>
        ) : history.length === 0 ? (
          <div style={{ ...styles.emptyState, padding: "20px 0" }}>Aucune séance CT validée pour l'instant.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((entry) => (
              <div key={entry.id} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: COLORS.text }}>{formatDateFR(entry.date)}</div>
                  {isCoach && (
                    <button style={styles.dangerLinkBtn} onClick={() => deleteHistoryEntry(entry.id)}>Supprimer</button>
                  )}
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ ...styles.table, minWidth: 160 + entry.rounds * 150 }}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Exercice</th>
                        {Array.from({ length: entry.rounds }, (_, i) => (
                          <th key={i} style={{ ...styles.th, textAlign: "center" }}>CT {i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {entry.rows.map((row) => (
                        <tr key={row.id}>
                          <td style={{ ...styles.td, fontWeight: 600 }}>{row.groupe || row.label || "—"}</td>
                          {row.cells.map((cell, i) => {
                            const cellLevelNames = getExerciseNiveaux(exercisesMap[cell.exerciceId], levelNames);
                            const histLevel = cellLevelNames[(cell.niveau || 1) - 1];
                            const exName = cell.exerciceId
                              ? `${exDisplayName(exercisesMap[cell.exerciceId])} — ${histLevel ? histLevel.nom : ""}`
                              : cell.exercice || "";
                            return (
                            <td key={i} style={styles.td}>
                              <div style={{ fontSize: 12, color: COLORS.textDim }}>{exName || "—"}</div>
                              <div style={{ fontSize: 13, color: COLORS.accent2, fontWeight: 600 }}>{cell.poids ? `${cell.poids} kg` : "—"}</div>
                            </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const photoJournalKey = (clientId) => `photo-journal-v1-${clientId}`;
const hydrationKey = (clientId) => `hydration-v1-${clientId}`;

function compressImageFile(file, maxWidth = 480, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function plateFeedback(selected, legumesLabel) {
  const hasLegumes = selected.legumes.length > 0;
  const hasProteines = selected.proteines.length > 0;
  const hasGlucides = selected.glucides.length > 0;
  const missing = [];
  if (!hasProteines) missing.push("des protéines");
  if (!hasGlucides) missing.push("des glucides");
  if (!hasLegumes) missing.push(`des ${legumesLabel.toLowerCase()}`);

  if (missing.length === 0) return { text: "Ton assiette est complète, bravo !", ok: true };
  if (missing.length === 3) return { text: "Sélectionne des aliments dans chaque catégorie de l'assiette.", ok: false };
  return { text: `Il te manque ${missing.join(" et ")}.`, ok: false };
}

function ProteinShakerIcon({ size = 40, color = "#333" }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 26 C18 12, 40 12, 40 26" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="12" r="4" stroke={color} strokeWidth="2.5" />
      <path d="M22 10 L44 3 L48 7 L27 15 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="10" y="24" width="38" height="10" rx="3.5" stroke={color} strokeWidth="3" />
      <path d="M14 34 L17 74 Q17 78 21 78 L37 78 Q41 78 41 74 L44 34" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="33" y1="42" x2="33" y2="54" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="58" x2="33" y2="72" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WaterGlassIcon({ size = 40, color = "#333" }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10 L46 10 L41 74 Q40.5 78 36.5 78 L23.5 78 Q19.5 78 19 74 Z" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M17.5 38 L42.5 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      <path d="M19.3 40 L40.7 40 L37 72 Q36.6 75 33.6 75 L26.4 75 Q23.4 75 23 72 Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.12" />
    </svg>
  );
}

const CATEGORY_META = {
  glucides: { label: "Glucides complexes", color: "#FFB74D" },
  proteines: { label: "Protéines", color: "#E57373" },
  legumes: { label: "Légumes", color: "#5CB85C" },
  fruits: { label: "Fruits", color: "#E091C4" },
};

const CATEGORY_DISPLAY_ORDER = ["glucides", "fruits", "legumes", "proteines"];

const WEEK_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const MEAL_PLANS = [
  {
    id: "plan1",
    name: "Plan 1",
    description: "Glucides complexes à chaque repas",
    meals: {
      matin: ["proteines", "fruits", "glucides"],
      midi: ["glucides", "proteines", "legumes"],
      gouter: ["proteines", "fruits", "glucides"],
      soir: ["glucides", "proteines", "legumes"],
    },
  },
  {
    id: "plan2",
    name: "Plan 2",
    description: "Pas de glucides complexes le soir",
    meals: {
      matin: ["glucides", "proteines", "fruits"],
      midi: ["proteines", "legumes", "glucides"],
      gouter: ["glucides", "proteines", "fruits"],
      soir: ["proteines", "legumes"],
    },
  },
  {
    id: "plan3",
    name: "Plan 3",
    description: "Pas de glucides complexes le matin ni le soir",
    meals: {
      matin: ["proteines", "fruits"],
      midi: ["proteines", "legumes", "glucides"],
      gouter: ["glucides", "proteines", "fruits"],
      soir: ["proteines", "legumes"],
    },
  },
  {
    id: "plan4",
    name: "Plan 4",
    description: "Glucides complexes uniquement au midi",
    meals: {
      matin: ["proteines", "fruits"],
      midi: ["legumes", "proteines", "glucides"],
      gouter: ["proteines", "fruits"],
      soir: ["legumes", "proteines"],
    },
  },
  {
    id: "plan5",
    name: "Plan 5",
    description: "Aucun glucide complexe, sauf matin/goûter",
    meals: {
      matin: ["proteines", "fruits"],
      midi: ["legumes", "proteines"],
      gouter: ["proteines", "fruits"],
      soir: ["legumes", "proteines"],
    },
  },
];

function AlimentationView({ clientId, role, data, persistLibrary, activeClient, assignMealPlan }) {
  const cx = 150;
  const cy = 150;
  const r = 120;
  const vegPath = describePlateSlice(cx, cy, r, 0, 180);
  const proteinPath = describePlateSlice(cx, cy, r, 180, 270);
  const carbsPath = describePlateSlice(cx, cy, r, 270, 360);
  const svgRef = useRef(null);

  const anchors = {
    legumes: polarToCartesian(cx, cy, r * 0.55, 90),
    proteines: polarToCartesian(cx, cy, r * 0.55, 225),
    glucides: polarToCartesian(cx, cy, r * 0.55, 315),
  };
  const slicePaths = { legumes: vegPath, proteines: proteinPath, glucides: carbsPath };

  const [openSection, setOpenSection] = useState(null);
  const [selected, setSelected] = useState({ legumes: [], proteines: [], glucides: [] });

  const [photos, setPhotos] = useState(null);
  const [photosLoaded, setPhotosLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [validating, setValidating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [hydration, setHydration] = useState({});
  const [previewExample, setPreviewExample] = useState(null);
  const [hydrationLoaded, setHydrationLoaded] = useState(false);
  const [mealTime, setMealTime] = useState(() => {
    const h = new Date().getHours();
    if (h < 11) return "matin";
    if (h < 15) return "midi";
    if (h < 18) return "gouter";
    return "soir";
  });

  useEffect(() => {
    if (!clientId) return;
    setPhotosLoaded(false);
    (async () => {
      let p = null;
      try {
        const r = await window.storage.get(photoJournalKey(clientId), true);
        if (r && r.value) p = JSON.parse(r.value);
      } catch (e) {}
      setPhotos(p || []);
      setPhotosLoaded(true);
    })();
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    setHydrationLoaded(false);
    (async () => {
      let h = null;
      try {
        const r = await window.storage.get(hydrationKey(clientId), true);
        if (r && r.value) h = JSON.parse(r.value);
      } catch (e) {}
      setHydration(h || {});
      setHydrationLoaded(true);
    })();
  }, [clientId]);

  const persistPhotos = async (newPhotos) => {
    setPhotos(newPhotos);
    try { await window.storage.set(photoJournalKey(clientId), JSON.stringify(newPhotos), true); } catch (e) {}
  };

  const persistHydration = async (newHydration) => {
    setHydration(newHydration);
    try { await window.storage.set(hydrationKey(clientId), JSON.stringify(newHydration), true); } catch (e) {}
  };

  const addWaterGlass = () => {
    const current = hydration[selectedDate] || 0;
    persistHydration({ ...hydration, [selectedDate]: current + 1 });
  };

  const removeWaterGlass = () => {
    const current = hydration[selectedDate] || 0;
    persistHydration({ ...hydration, [selectedDate]: Math.max(0, current - 1) });
  };

  const waterGlasses = hydration[selectedDate] || 0;

  const hydrationSmiley = (count) => {
    if (count >= 5) return { emoji: "😊", label: "Bonne hydratation" };
    if (count >= 3) return { emoji: "😐", label: "Hydratation correcte" };
    return { emoji: "😞", label: "Pas assez d'eau" };
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError("");
    setUploading(true);
    try {
      const dataUrl = await compressImageFile(file);
      const entry = {
        id: "photo" + Math.random().toString(36).slice(2, 9),
        dataUrl,
        date: selectedDate,
        addedBy: role === "coach" ? "Coach" : "Client",
        repas: mealTime,
      };
      const filtered = (photos || []).filter((p) => !(p.date === selectedDate && p.repas === mealTime));
      await persistPhotos([entry, ...filtered]);
    } catch (err) {
      setPhotoError("Impossible d'ajouter cette photo, réessaie.");
    }
    setUploading(false);
  };

  const deletePhoto = async (id) => {
    await persistPhotos((photos || []).filter((p) => p.id !== id));
  };

  const validatePlate = async () => {
    const totalSelected = selected.legumes.length + selected.proteines.length + selected.glucides.length;
    if (totalSelected === 0) {
      setPhotoError("Sélectionne au moins un aliment avant de valider ton assiette.");
      return;
    }
    setPhotoError("");
    setValidating(true);
    try {
      const svgEl = svgRef.current;
      const serialized = new XMLSerializer().serializeToString(svgEl);
      const dataUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(serialized)));
      const captionParts = [];
      if (selected.legumes.length) captionParts.push("Légumes: " + selected.legumes.join(", "));
      if (selected.proteines.length) captionParts.push("Protéines: " + selected.proteines.join(", "));
      if (selected.glucides.length) captionParts.push("Glucides: " + selected.glucides.join(", "));
      const entry = {
        id: "plate" + Math.random().toString(36).slice(2, 9),
        dataUrl,
        date: selectedDate,
        addedBy: role === "coach" ? "Coach" : "Client",
        caption: captionParts.join(" · "),
        repas: mealTime,
      };
      const filtered = (photos || []).filter((p) => !(p.date === selectedDate && p.repas === mealTime));
      await persistPhotos([entry, ...filtered]);
    } catch (err) {
      setPhotoError("Impossible d'enregistrer l'assiette, réessaie.");
    }
    setValidating(false);
  };

  const toggleSection = (key) => setOpenSection((cur) => (cur === key ? null : key));
  const toggleIdea = (key, idea) => {
    setSelected((s) => {
      const list = s[key] || [];
      const next = list.includes(idea) ? list.filter((i) => i !== idea) : [...list, idea];
      return { ...s, [key]: next };
    });
  };

  const sections = getAlimentationSections(mealTime);
  const activeSection = sections.find((s) => s.key === openSection);
  const feedback = plateFeedback(selected, sections[0].title);
  const isCoach = role === "coach";

  const [openVideoMeal, setOpenVideoMeal] = useState(null);
  const [editingVideoMeal, setEditingVideoMeal] = useState(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const alimentationVideos = data.alimentationVideos || { matin: "", midi: "", gouter: "", soir: "" };
  const mealVideoOptions = [
    { key: "matin", label: "🌅 Matin" },
    { key: "midi", label: "☀️ Midi" },
    { key: "gouter", label: "🍎 Goûter" },
    { key: "soir", label: "🌙 Soir" },
  ];

  const startEditVideo = (key) => {
    setVideoUrlInput(alimentationVideos[key] || "");
    setEditingVideoMeal(key);
  };

  const saveVideo = (key) => {
    const newVideos = { ...alimentationVideos, [key]: videoUrlInput.trim() };
    persistLibrary({
      exercises: data.exercises,
      seanceTypes: data.seanceTypes,
      programs: data.programs,
      ctTypes: data.ctTypes,
      ctPrograms: data.ctPrograms,
      alimentationVideos: newVideos,
    });
    setEditingVideoMeal(null);
  };

  return (
    <div>
      <h2 style={styles.h2}>Alimentation</h2>
      <p style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 16 }}>
        Le principe de l'assiette équilibrée : la moitié en {sections[0].title.toLowerCase()}, un quart en protéines, un quart en glucides complexes. Clique sur une partie de l'assiette pour choisir des aliments.
      </p>

      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
          Tutos préparation d'assiette
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {mealVideoOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setOpenVideoMeal((cur) => (cur === opt.key ? null : opt.key))}
              style={{
                ...styles.secondaryBtn,
                ...(openVideoMeal === opt.key ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}),
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {openVideoMeal && (
          <div>
            {isCoach && editingVideoMeal === openVideoMeal ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  style={{ ...styles.textInput, marginBottom: 0, flex: "1 1 220px" }}
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  autoFocus
                />
                <button style={styles.primaryBtn} onClick={() => saveVideo(openVideoMeal)}>Enregistrer</button>
                <button style={styles.linkBtn} onClick={() => setEditingVideoMeal(null)}>Annuler</button>
              </div>
            ) : alimentationVideos[openVideoMeal] ? (
              <div>
                <VideoPanel url={alimentationVideos[openVideoMeal]} />
                {isCoach && (
                  <button style={styles.linkBtn} onClick={() => startEditVideo(openVideoMeal)}>Changer la vidéo</button>
                )}
              </div>
            ) : isCoach ? (
              <button style={styles.secondaryBtn} onClick={() => startEditVideo(openVideoMeal)}>+ Ajouter une vidéo</button>
            ) : (
              <div style={{ fontSize: 12, color: COLORS.textFaint }}>Aucune vidéo ajoutée pour ce moment de la journée.</div>
            )}
          </div>
        )}
      </div>

      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
          Plan alimentaire de la semaine
        </div>
        {isCoach && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, alignItems: "flex-start" }}>
            {MEAL_PLANS.map((plan) => {
              const isSelected = activeClient && activeClient.mealPlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => assignMealPlan(isSelected ? null : plan.id)}
                  style={{
                    ...styles.secondaryBtn,
                    ...(isSelected ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}),
                  }}
                >
                  {plan.name}{isSelected ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        )}
        {activeClient && activeClient.mealPlanId ? (
          (() => {
            const plan = MEAL_PLANS.find((p) => p.id === activeClient.mealPlanId);
            if (!plan) return null;
            const mealOrder = [
              { key: "matin", label: "🌅 Matin", offset: 0 },
              { key: "midi", label: "☀️ Midi", offset: 1 },
              { key: "gouter", label: "🍎 Goûter", offset: 2 },
              { key: "soir", label: "🌙 Soir", offset: 4 },
            ];
            const [exampleMealKey, exampleDayIndex] = previewExample || [null, null];
            const fillPlateExample = (mealKey, mealOffset, dayIndex) => {
              const mealSections = getAlimentationSections(mealKey);
              const pick = (ideas) => ideas[(dayIndex + mealOffset) % ideas.length];
              const proteinesIdeas = mealSections.find((s) => s.key === "proteines").ideas;
              const glucidesIdeas = mealSections.find((s) => s.key === "glucides").ideas;
              const legumesOrFruitsIdeas = mealSections.find((s) => s.key === "legumes").ideas;
              const newSelected = { legumes: [], proteines: [], glucides: [] };
              plan.meals[mealKey].forEach((catKey) => {
                if (catKey === "proteines") newSelected.proteines.push(pick(proteinesIdeas));
                else if (catKey === "glucides") newSelected.glucides.push(pick(glucidesIdeas));
                else if (catKey === "legumes" || catKey === "fruits") newSelected.legumes.push(pick(legumesOrFruitsIdeas));
              });
              setMealTime(mealKey);
              setSelected(newSelected);
              setOpenSection(null);
              setPreviewExample([mealKey, dayIndex]);
            };
            return (
              <div>
                <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>
                  {plan.name} assigné{!isCoach ? " par ton coach" : ""}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>{plan.description}</div>
                <div style={{ fontSize: 11, color: COLORS.textFaint, marginBottom: 10 }}>Clique sur une case pour voir un exemple de repas différent chaque jour.</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ ...styles.table, minWidth: 640 }}>
                    <thead>
                      <tr>
                        <th style={styles.th}></th>
                        {WEEK_DAYS.map((day) => (
                          <th key={day} style={{ ...styles.th, textAlign: "center" }}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mealOrder.map((meal) => (
                        <tr key={meal.key}>
                          <td style={{ ...styles.td, fontWeight: 600, whiteSpace: "nowrap" }}>{meal.label}</td>
                          {WEEK_DAYS.map((day, dayIndex) => {
                            const isActive = exampleMealKey === meal.key && exampleDayIndex === dayIndex;
                            return (
                            <td
                              key={day}
                              onClick={() => fillPlateExample(meal.key, meal.offset, dayIndex)}
                              style={{
                                ...styles.td,
                                textAlign: "center",
                                cursor: "pointer",
                                background: isActive ? "rgba(255,122,26,0.14)" : undefined,
                                borderRadius: isActive ? 8 : undefined,
                              }}
                            >
                              <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                                {[...plan.meals[meal.key]]
                                  .sort((a, b) => CATEGORY_DISPLAY_ORDER.indexOf(a) - CATEGORY_DISPLAY_ORDER.indexOf(b))
                                  .map((catKey) => (
                                  <span
                                    key={catKey}
                                    style={{
                                      fontSize: 9,
                                      padding: "2px 6px",
                                      borderRadius: 10,
                                      background: CATEGORY_META[catKey].color,
                                      color: "#1A1613",
                                      fontWeight: 700,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {CATEGORY_META[catKey].label}
                                  </span>
                                ))}
                                {isActive && <span style={{ fontSize: 9, color: COLORS.accent, fontWeight: 700, marginTop: 2 }}>✓ affiché</span>}
                              </div>
                            </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()
        ) : (
          <div style={{ fontSize: 13, color: COLORS.textFaint }}>
            {isCoach ? "Choisis un plan alimentaire ci-dessus." : "Aucun plan alimentaire assigné pour l'instant."}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 6 }}>Date du repas</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ ...styles.textInput, maxWidth: 200, marginBottom: 0 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 6 }}>Ce repas, c'est :</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { key: "matin", label: "🌅 Matin" },
            { key: "midi", label: "☀️ Midi" },
            { key: "gouter", label: "🍎 Goûter" },
            { key: "soir", label: "🌙 Soir" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setMealTime(opt.key)}
              style={{
                ...styles.secondaryBtn,
                ...(mealTime === opt.key ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}),
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {mealTime === "gouter" && (
        <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: COLORS.accent2, marginBottom: 10, fontStyle: "italic" }}>
          Pour le goûter, prends une assiette plus petite que pour le matin, le midi et le soir.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
        <svg
          ref={svgRef}
          width={mealTime === "gouter" ? "170" : "260"}
          height={mealTime === "gouter" ? "170" : "260"}
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          style={{ background: COLORS.bg }}
        >
          <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={COLORS.cardBorder} strokeWidth="2" />
          {sections.map((section) => (
            <path
              key={section.key}
              d={slicePaths[section.key]}
              fill={section.color}
              stroke={COLORS.bg}
              strokeWidth="3"
              opacity={openSection && openSection !== section.key ? 0.45 : 1}
              style={{ cursor: "pointer" }}
              onClick={() => toggleSection(section.key)}
            />
          ))}
          {sections.map((section) =>
            selected[section.key].length > 0 ? (
              <text
                key={section.key}
                x={anchors[section.key].x}
                y={anchors[section.key].y}
                textAnchor="middle"
                style={{ pointerEvents: "none", fontSize: mealTime === "gouter" ? 14 : 9, fontWeight: 700, fill: "#1A1613" }}
              >
                {selected[section.key].map((idea, i) => (
                  <tspan key={idea} x={anchors[section.key].x} dy={i === 0 ? -((selected[section.key].length - 1) * (mealTime === "gouter" ? 8.5 : 5.5)) : (mealTime === "gouter" ? 17 : 11)}>
                    {idea}
                  </tspan>
                ))}
              </text>
            ) : null
          )}
        </svg>

        <button
          onClick={() => toggleIdea("proteines", "Shaker de protéine")}
          title="Un shaker de protéine compte comme une portion de protéines"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            background: selected.proteines.includes("Shaker de protéine") ? "#E57373" : COLORS.card,
            border: `2px solid ${selected.proteines.includes("Shaker de protéine") ? "#C62828" : COLORS.cardBorder}`,
            borderRadius: 14,
            padding: "12px 14px",
            cursor: "pointer",
            fontFamily: FONT_BODY,
          }}
        >
          <ProteinShakerIcon size={90} color={selected.proteines.includes("Shaker de protéine") ? "#1A1613" : COLORS.textDim} />
          <span style={{ fontSize: 11, color: selected.proteines.includes("Shaker de protéine") ? "#1A1613" : COLORS.textDim, fontWeight: 600, textAlign: "center", maxWidth: 70 }}>
            {selected.proteines.includes("Shaker de protéine") ? "✓ Shaker ajouté" : "Shaker protéine"}
          </span>
        </button>

        <button
          onClick={addWaterGlass}
          title={`Ajouter un verre d'eau bu le ${formatDateFR(selectedDate)}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            background: waterGlasses > 0 ? "#7DB4FF" : COLORS.card,
            border: `2px solid ${waterGlasses > 0 ? "#1565C0" : COLORS.cardBorder}`,
            borderRadius: 14,
            padding: "12px 14px",
            cursor: "pointer",
            fontFamily: FONT_BODY,
          }}
        >
          <WaterGlassIcon size={90} color={waterGlasses > 0 ? "#0A2540" : COLORS.textDim} />
          <span style={{ fontSize: 11, color: waterGlasses > 0 ? "#0A2540" : COLORS.textDim, fontWeight: 600, textAlign: "center", maxWidth: 90 }}>
            💧 {waterGlasses} verre{waterGlasses > 1 ? "s" : ""} d'eau
          </span>
          {waterGlasses > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); removeWaterGlass(); }}
              style={{ fontSize: 10, color: "#0A2540", textDecoration: "underline", cursor: "pointer" }}
            >
              retirer un verre
            </span>
          )}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {sections.map((section) => (
          <div key={section.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.textDim }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: section.color, flexShrink: 0 }} />
            {section.title}
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          fontWeight: 600,
          color: feedback.ok ? COLORS.accent : COLORS.textDim,
          marginBottom: 20,
        }}
      >
        {feedback.ok ? "✓ " : ""}{feedback.text}
      </div>

      {activeSection ? (
        <div style={{ ...styles.card, borderLeft: `4px solid ${activeSection.color}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: COLORS.text }}>{activeSection.title}</div>
              <span style={{ fontSize: 12, color: COLORS.textFaint }}>{activeSection.subtitle} — clique pour sélectionner</span>
            </div>
            <button style={styles.linkBtn} onClick={() => setOpenSection(null)}>fermer</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {activeSection.ideas.map((idea) => {
              const isSelected = selected[activeSection.key].includes(idea);
              return (
                <button
                  key={idea}
                  onClick={() => toggleIdea(activeSection.key, idea)}
                  style={{
                    fontSize: 12,
                    padding: "6px 12px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontFamily: FONT_BODY,
                    background: isSelected ? activeSection.color : COLORS.bg2,
                    border: `1px solid ${isSelected ? activeSection.colorStroke : COLORS.cardBorder}`,
                    color: isSelected ? "#1A1613" : COLORS.textDim,
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {isSelected ? "✓ " : ""}{idea}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>Clique sur l'assiette pour voir les propositions de chaque catégorie.</div>
      )}

      <div style={{ marginTop: 28 }}>
        <div style={styles.sectionHeader}>Journal photo</div>
        <p style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 14 }}>
          Prends en photo tes repas, ou enregistre directement ton assiette sélectionnée, pour garder une trace visuelle de ton alimentation.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={{ ...styles.primaryBtn, opacity: validating ? 0.6 : 1 }}
            onClick={validatePlate}
            disabled={validating}
          >
            {validating ? "Enregistrement…" : "✓ Valider mon assiette"}
          </button>
          <label style={{ ...styles.secondaryBtn, display: "inline-block", cursor: "pointer", opacity: uploading ? 0.6 : 1 }}>
            {uploading ? "Ajout en cours…" : "📷 Ajouter une photo"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelected}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        </div>
        {photoError && <div style={{ color: COLORS.danger, fontSize: 12, marginTop: 8 }}>{photoError}</div>}

        {!photosLoaded ? (
          <div style={{ ...styles.emptyState, padding: "20px 0" }}>Chargement du journal…</div>
        ) : photos.length === 0 ? (
          <div style={{ ...styles.emptyState, padding: "20px 0" }}>Aucune photo pour l'instant.</div>
        ) : (
          (() => {
            const byDate = {};
            const dateOrder = [];
            photos.forEach((p) => {
              if (!byDate[p.date]) {
                byDate[p.date] = [];
                dateOrder.push(p.date);
              }
              byDate[p.date].push(p);
            });
            dateOrder.sort((a, b) => (a < b ? 1 : -1));
            const MEAL_DISPLAY_ORDER = ["matin", "midi", "gouter", "soir"];
            Object.keys(byDate).forEach((date) => {
              byDate[date].sort((a, b) => MEAL_DISPLAY_ORDER.indexOf(a.repas) - MEAL_DISPLAY_ORDER.indexOf(b.repas));
            });
            return dateOrder.map((date) => {
              const dayWater = hydration[date] || 0;
              const smiley = hydrationSmiley(dayWater);
              return (
              <div key={date} style={{ marginTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent2 }}>
                    {formatDateFR(date)}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, display: "flex", alignItems: "center", gap: 4 }} title={smiley.label}>
                    💧 {dayWater} verre{dayWater > 1 ? "s" : ""} d'eau {smiley.emoji}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
                  {byDate[date].map((p) => (
                    <div key={p.id} style={{ position: "relative" }}>
                      <img
                        src={p.dataUrl}
                        alt={p.caption ? `Assiette du ${formatDateFR(p.date)}` : `Repas du ${formatDateFR(p.date)}`}
                        title={p.caption || ""}
                        style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 10, border: `1px solid ${COLORS.cardBorder}`, display: "block", background: p.caption ? COLORS.bg2 : undefined }}
                      />
                      {p.repas && (
                        <span
                          style={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            fontSize: 14,
                            background: "rgba(0,0,0,0.6)",
                            borderRadius: "50%",
                            width: 22,
                            height: 22,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title={p.repas === "matin" ? "Matin" : p.repas === "midi" ? "Midi" : p.repas === "gouter" ? "Goûter" : "Soir"}
                        >
                          {p.repas === "matin" ? "🌅" : p.repas === "midi" ? "☀️" : p.repas === "gouter" ? "🍎" : "🌙"}
                        </span>
                      )}
                      <div style={{ fontSize: 10, color: COLORS.textFaint, marginTop: 4 }}>
                        {p.addedBy}
                      </div>
                      {p.caption && (
                        <div style={{ fontSize: 11, color: COLORS.accent, marginTop: 2, letterSpacing: 1 }}>
                          {"✓".repeat(p.caption.split(" · ").filter(Boolean).length)}
                        </div>
                      )}
                      <button
                        onClick={() => deletePhoto(p.id)}
                        title="Supprimer la photo"
                        aria-label="Supprimer la photo"
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: "none",
                          background: "rgba(0,0,0,0.6)",
                          color: "#fff",
                          fontSize: 12,
                          cursor: "pointer",
                          lineHeight: 1,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              );
            });
          })()
        )}
      </div>
    </div>
  );
}

function ProgressionView({ data }) {
  const zones = useMemo(() => {
    const seen = [];
    data.exercises.forEach((e) => {
      getExerciseZones(e).forEach((z) => {
        const label = zoneLabel(z);
        if (!seen.includes(label)) seen.push(label);
      });
    });
    const rank = (label) => {
      if (label === "Mobilité") return 0;
      if (label === "Échauffement") return 1;
      return 2;
    };
    seen.sort((a, b) => rank(a) - rank(b));
    return seen;
  }, [data.exercises]);

  const [zone, setZone] = useState(zones[0] || "");
  const exercisesInZone = useMemo(
    () => data.exercises.filter((e) => getExerciseZones(e).some((z) => zoneLabel(z) === zone)),
    [data.exercises, zone]
  );
  const [exId, setExId] = useState(exercisesInZone[0]?.id || "");

  const changeZone = (newZone) => {
    setZone(newZone);
    const first = data.exercises.find((e) => getExerciseZones(e).some((z) => zoneLabel(z) === newZone));
    setExId(first ? first.id : "");
  };

  const points = useMemo(() => {
    const rows = [];
    [...data.sessions]
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .forEach((s) => {
        const entries = s.entries.filter((e) => e.exerciceId === exId && (e.reps != null || e.charge != null));
        if (entries.length === 0) return;
        const bestReps = Math.max(...entries.map((e) => e.reps ?? 0));
        const bestCharge = Math.max(...entries.map((e) => e.charge ?? 0));
        rows.push({ date: formatDateFR(s.date), reps: bestReps || null, charge: bestCharge || null });
      });
    return rows;
  }, [data.sessions, exId]);

  const ex = data.exercises.find((e) => e.id === exId);
  const isCardio = isCardioExercise(ex);

  return (
    <div>
      <h2 style={styles.h2}>Progression par exercice</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <label style={styles.fieldLabel}>Partie du corps</label>
          <select value={zone} onChange={(e) => changeZone(e.target.value)} style={styles.textInput}>
            {zones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <label style={styles.fieldLabel}>Exercice</label>
          <select value={exId} onChange={(e) => setExId(e.target.value)} style={styles.textInput}>
            {exercisesInZone.map((e) => (
              <option key={e.id} value={e.id}>{exDisplayName(e)}</option>
            ))}
          </select>
        </div>
      </div>

      {points.length === 0 ? (
        <div style={styles.emptyState}>Pas encore de données pour {ex ? ex.nom.replace(/\n/g, " ") : "cet exercice"}.</div>
      ) : (
        <>
          <div style={{ ...styles.card, marginTop: 16, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              {isCardio ? (
                <LineChart data={points} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.cardBorder} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={COLORS.textFaint} tick={{ fontSize: 11, fill: COLORS.textDim }} />
                  <YAxis
                    stroke={COLORS.accent}
                    tick={{ fontSize: 11, fill: COLORS.textDim }}
                    tickFormatter={(v) => formatTimer(v)}
                  />
                  <Tooltip
                    contentStyle={{ background: COLORS.bg2, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [formatTimer(v), "Temps d'effort"]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="reps" name="Temps d'effort" stroke={COLORS.accent} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                </LineChart>
              ) : (
                <LineChart data={points} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.cardBorder} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={COLORS.textFaint} tick={{ fontSize: 11, fill: COLORS.textDim }} />
                  <YAxis yAxisId="left" stroke={COLORS.accent} tick={{ fontSize: 11, fill: COLORS.textDim }} />
                  <YAxis yAxisId="right" orientation="right" stroke={COLORS.accent2} tick={{ fontSize: 11, fill: COLORS.textDim }} />
                  <Tooltip contentStyle={{ background: COLORS.bg2, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="left" type="monotone" dataKey="reps" name="Répétitions" stroke={COLORS.accent} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  <Line yAxisId="right" type="monotone" dataKey="charge" name="Charge (kg)" stroke={COLORS.accent2} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div style={{ ...styles.card, marginTop: 14, padding: 0, overflow: "hidden" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  {isCardio ? (
                    <th style={styles.th}>Temps d'effort</th>
                  ) : (
                    <>
                      <th style={styles.th}>Répétitions</th>
                      <th style={styles.th}>Charge (kg)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {points.slice().reverse().map((p, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{p.date}</td>
                    {isCardio ? (
                      <td style={styles.td}>{p.reps != null ? formatTimer(p.reps) : "—"}</td>
                    ) : (
                      <>
                        <td style={styles.td}>{p.reps ?? "—"}</td>
                        <td style={styles.td}>{p.charge ?? "—"}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ProgrammesView({ data, persistLibrary, role, activeClient, assignProgram, assignProgramDistanciel, assignCtProgram }) {
  const [showNewProgram, setShowNewProgram] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [showNewCTProgram, setShowNewCTProgram] = useState(false);
  const [editingCTProgramId, setEditingCTProgramId] = useState(null);
  const isCoach = role === "coach";

  const stMap = {};
  data.seanceTypes.forEach((s) => (stMap[s.id] = s));
  const ctMap = {};
  data.ctTypes.forEach((c) => (ctMap[c.id] = c));
  const exMapLocal = exMap(data);

  const programsPresentielCatalogue = data.programs.filter((p) => (p.mode || "presentiel") === "presentiel");
  const programsDistancielCatalogue = data.programs.filter((p) => p.mode === "distanciel");

  // Le client ne voit que ses propres programmes assignés (présentiel + distanciel), pas le catalogue complet
  const programsVisibles = isCoach
    ? data.programs
    : data.programs.filter((p) => activeClient && (p.id === activeClient.programId || p.id === activeClient.programDistancielId));
  const ctProgramsVisibles = isCoach
    ? data.ctPrograms
    : data.ctPrograms.filter((p) => activeClient && p.id === activeClient.ctProgramId);

  const addProgram = (pr) => {
    const newLib = { ...data, programs: [...data.programs, { id: uid("pr"), ...pr }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setShowNewProgram(false);
  };

  const updateProgram = (programId, updates) => {
    const newLib = {
      ...data,
      programs: data.programs.map((p) => (p.id === programId ? { ...p, ...updates } : p)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setEditingProgramId(null);
  };

  const addCTProgram = (pr) => {
    const newLib = { ...data, ctPrograms: [...data.ctPrograms, { id: uid("ctpr"), ...pr }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setShowNewCTProgram(false);
  };

  const updateCTProgram = (programId, updates) => {
    const newLib = {
      ...data,
      ctPrograms: data.ctPrograms.map((p) => (p.id === programId ? { ...p, ...updates } : p)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setEditingCTProgramId(null);
  };

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Programmes musculation</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewProgram(true)}>+ Nouveau programme</button>
        )}
      </div>

      {isCoach && activeClient && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 8 }}>
            Programme présentiel assigné à <strong style={{ color: COLORS.text }}>{activeClient.name}</strong>
          </div>
          <select
            value={activeClient.programId || ""}
            onChange={(e) => assignProgram(e.target.value)}
            style={{ ...styles.textInput, marginBottom: 0 }}
          >
            <option value="">— Aucun programme assigné —</option>
            {programsPresentielCatalogue.map((pr) => (
              <option key={pr.id} value={pr.id}>{pr.nom}</option>
            ))}
          </select>
        </div>
      )}

      {isCoach && activeClient && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent2 }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 8 }}>
            Programme distanciel assigné à <strong style={{ color: COLORS.text }}>{activeClient.name}</strong>
          </div>
          <select
            value={activeClient.programDistancielId || ""}
            onChange={(e) => assignProgramDistanciel(e.target.value)}
            style={{ ...styles.textInput, marginBottom: 0 }}
          >
            <option value="">— Aucun programme assigné —</option>
            {programsDistancielCatalogue.map((pr) => (
              <option key={pr.id} value={pr.id}>{pr.nom} ({pr.lieu === "maison" ? "Maison" : "Salle"})</option>
            ))}
          </select>
        </div>
      )}

      {!isCoach && activeClient && activeClient.programId && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim }}>
            Ton programme présentiel actuel : <strong style={{ color: COLORS.accent }}>{data.programs.find((p) => p.id === activeClient.programId)?.nom || "—"}</strong>
          </div>
        </div>
      )}

      {!isCoach && activeClient && activeClient.programDistancielId && (() => {
        const progDist = data.programs.find((p) => p.id === activeClient.programDistancielId);
        return (
          <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent2 }}>
            <div style={{ fontSize: 13, color: COLORS.textDim }}>
              Ton programme distanciel actuel : <strong style={{ color: COLORS.accent2 }}>{progDist ? progDist.nom : "—"}</strong>
              {progDist && <span style={styles.pill}> {progDist.lieu === "maison" ? "Maison" : "Salle"}</span>}
            </div>
          </div>
        );
      })()}

      {showNewProgram && (
        <NewProgramForm data={data} onCancel={() => setShowNewProgram(false)} onSave={addProgram} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {!isCoach && programsVisibles.length === 0 && (
          <div style={styles.emptyState}>Aucun programme assigné pour l'instant.</div>
        )}
        {programsVisibles.map((pr) => {
          const isAssigned = activeClient && (activeClient.programId === pr.id || activeClient.programDistancielId === pr.id);
          if (isCoach && editingProgramId === pr.id) {
            return (
              <EditProgramForm
                key={pr.id}
                data={data}
                program={pr}
                onCancel={() => setEditingProgramId(null)}
                onSave={(updates) => updateProgram(pr.id, updates)}
              />
            );
          }
          return (
          <div key={pr.id} style={{ ...styles.card, borderColor: isAssigned ? COLORS.accent : COLORS.cardBorder }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text }}>{pr.nom}</div>
                {isAssigned && <span style={styles.pill}>Assigné</span>}
                {pr.mode === "distanciel" && (
                  <span style={styles.pill}>Distanciel · {pr.lieu === "maison" ? "Maison" : "Salle"}</span>
                )}
              </div>
              {isCoach && (
                <button style={styles.linkBtn} onClick={() => setEditingProgramId(pr.id)}>Modifier</button>
              )}
            </div>
            {pr.seanceTypeIds.map((stId) => {
              const st = stMap[stId];
              if (!st) return null;
              return (
                <div key={stId} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${COLORS.cardBorder}` }}>
                  <div style={{ fontSize: 13, color: COLORS.accent2, fontWeight: 600 }}>{st.nom}</div>
                  <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
                    {groupExIdsByZone(st.exerciceIds, exMapLocal).map(([label, ids]) => (
                      <div key={label}>
                        <span style={{ color: COLORS.textFaint }}>{label} : </span>
                        {ids.map((exId) => exDisplayName(exMapLocal[exId])).filter(Boolean).join(" · ")}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          );
        })}
      </div>

      <div style={styles.rowBetween}>
        <h2 style={{ ...styles.h2, marginTop: 32 }}>Programmes CT</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewCTProgram(true)}>+ Nouveau programme CT</button>
        )}
      </div>

      {isCoach && activeClient && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 8 }}>
            Programme CT assigné à <strong style={{ color: COLORS.text }}>{activeClient.name}</strong>
          </div>
          <select
            value={activeClient.ctProgramId || ""}
            onChange={(e) => assignCtProgram(e.target.value)}
            style={{ ...styles.textInput, marginBottom: 0 }}
          >
            <option value="">— Aucun programme CT assigné —</option>
            {data.ctPrograms.map((pr) => (
              <option key={pr.id} value={pr.id}>{pr.nom}</option>
            ))}
          </select>
        </div>
      )}

      {!isCoach && activeClient && activeClient.ctProgramId && (
        <div style={{ ...styles.card, marginBottom: 16, borderColor: COLORS.accent }}>
          <div style={{ fontSize: 13, color: COLORS.textDim }}>
            Ton programme CT actuel : <strong style={{ color: COLORS.accent }}>{data.ctPrograms.find((p) => p.id === activeClient.ctProgramId)?.nom || "—"}</strong>
          </div>
        </div>
      )}

      {isCoach && showNewCTProgram && (
        <NewCTProgramForm data={data} onCancel={() => setShowNewCTProgram(false)} onSave={addCTProgram} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ctProgramsVisibles.length === 0 && (
          <div style={styles.emptyState}>{isCoach ? "Aucun programme CT créé pour l'instant." : "Aucun programme CT assigné pour l'instant."}</div>
        )}
        {ctProgramsVisibles.map((pr) => {
          const isAssigned = activeClient && activeClient.ctProgramId === pr.id;
          if (isCoach && editingCTProgramId === pr.id) {
            return (
              <EditCTProgramForm
                key={pr.id}
                data={data}
                program={pr}
                onCancel={() => setEditingCTProgramId(null)}
                onSave={(updates) => updateCTProgram(pr.id, updates)}
              />
            );
          }
          return (
          <div key={pr.id} style={{ ...styles.card, borderColor: isAssigned ? COLORS.accent : COLORS.cardBorder }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text }}>{pr.nom}</div>
                {isAssigned && <span style={styles.pill}>Assigné</span>}
              </div>
              {isCoach && (
                <button style={styles.linkBtn} onClick={() => setEditingCTProgramId(pr.id)}>Modifier</button>
              )}
            </div>
            {pr.ctTypeIds.map((ctId) => {
              const ct = ctMap[ctId];
              if (!ct) return null;
              return (
                <div key={ctId} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${COLORS.cardBorder}` }}>
                  <div style={{ fontSize: 13, color: COLORS.accent2, fontWeight: 600 }}>{ct.nom}</div>
                  <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.6 }}>
                    {ct.exerciceIds.map((exId) => exDisplayName(exMapLocal[exId])).filter(Boolean).join(" · ")}
                  </div>
                </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
}

function seanceCategory(nom) {
  const n = nom.trim().toLowerCase();
  if (n.startsWith("full body")) return "Full body";
  if (n.startsWith("lower")) return "Lower";
  if (n.startsWith("upper")) return "Upper";
  return "Autres";
}

const SEANCE_CATEGORY_ORDER = ["Full body", "Lower", "Upper", "Autres"];

function groupSeanceTypesByCategory(seanceTypes) {
  const byCat = {};
  seanceTypes.forEach((st) => {
    const cat = seanceCategory(st.nom);
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(st);
  });
  return SEANCE_CATEGORY_ORDER.map((cat) => [cat, byCat[cat] || []]).filter(([, list]) => list.length > 0);
}

function SeanceTypesView({ data, persistLibrary, role, activeClient }) {
  const [showNewSeance, setShowNewSeance] = useState(false);
  const [editingSeanceTypeId, setEditingSeanceTypeId] = useState(null);
  const [showNewCT, setShowNewCT] = useState(false);
  const [editingCTTypeId, setEditingCTTypeId] = useState(null);
  const isCoach = role === "coach";

  const addSeanceType = (st) => {
    const newLib = { ...data, seanceTypes: [...data.seanceTypes, { id: uid("st"), ...st }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setShowNewSeance(false);
  };

  const updateSeanceType = (seanceTypeId, updates) => {
    const newLib = {
      ...data,
      seanceTypes: data.seanceTypes.map((s) => (s.id === seanceTypeId ? { ...s, ...updates } : s)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setEditingSeanceTypeId(null);
  };

  const addCTType = (ct) => {
    const newLib = { ...data, ctTypes: [...data.ctTypes, { id: uid("ctst"), ...ct }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setShowNewCT(false);
  };

  const updateCTType = (ctTypeId, updates) => {
    const newLib = {
      ...data,
      ctTypes: data.ctTypes.map((c) => (c.id === ctTypeId ? { ...c, ...updates } : c)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setEditingCTTypeId(null);
  };

  // Le client ne voit que les séances/circuits inclus dans ses programmes assignés (présentiel + distanciel)
  let seanceTypesVisibles = data.seanceTypes;
  let ctTypesVisibles = data.ctTypes;
  if (!isCoach) {
    const programme = activeClient ? data.programs.find((p) => p.id === activeClient.programId) : null;
    const programmeDistanciel = activeClient ? data.programs.find((p) => p.id === activeClient.programDistancielId) : null;
    const idsAutorises = [
      ...(programme ? programme.seanceTypeIds : []),
      ...(programmeDistanciel ? programmeDistanciel.seanceTypeIds : []),
    ];
    seanceTypesVisibles = data.seanceTypes.filter((st) => idsAutorises.includes(st.id));

    const ctProgramme = activeClient ? data.ctPrograms.find((p) => p.id === activeClient.ctProgramId) : null;
    const ctIdsAutorises = ctProgramme ? ctProgramme.ctTypeIds : [];
    ctTypesVisibles = data.ctTypes.filter((ct) => ctIdsAutorises.includes(ct.id));
  }

  const grouped = groupSeanceTypesByCategory(seanceTypesVisibles);

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Séances</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewSeance(true)}>+ Nouveau type</button>
        )}
      </div>
      {isCoach && showNewSeance && (
        <NewSeanceTypeForm data={data} onCancel={() => setShowNewSeance(false)} onSave={addSeanceType} />
      )}
      {!isCoach && grouped.length === 0 && (
        <div style={{ ...styles.emptyState, marginTop: 16 }}>Aucune séance dans ton programme pour l'instant.</div>
      )}
      {grouped.map(([category, list]) => (
        <div key={category} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
            {category}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.map((st) =>
              isCoach && editingSeanceTypeId === st.id ? (
                <EditSeanceTypeForm
                  key={st.id}
                  data={data}
                  seanceType={st}
                  onCancel={() => setEditingSeanceTypeId(null)}
                  onSave={(updates) => updateSeanceType(st.id, updates)}
                />
              ) : (
                <div key={st.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 12px", background: COLORS.bg2, borderRadius: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{st.nom}</div>
                      <span style={styles.pill}>
                        {(st.mode || "presentiel") === "presentiel" ? "Présentiel" : st.lieu === "maison" ? "Distanciel · Maison" : "Distanciel · Salle"}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textFaint }}>{st.exerciceIds.length} exercice{st.exerciceIds.length > 1 ? "s" : ""}</div>
                  </div>
                  {isCoach && (
                    <button style={styles.linkBtn} onClick={() => setEditingSeanceTypeId(st.id)}>Modifier</button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      ))}

      <div style={styles.rowBetween}>
        <h2 style={{ ...styles.h2, marginTop: 32 }}>Circuits training (CT)</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewCT(true)}>+ Nouveau circuit</button>
        )}
      </div>
      {isCoach && showNewCT && (
        <NewCTTypeForm data={data} onCancel={() => setShowNewCT(false)} onSave={addCTType} />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {ctTypesVisibles.length === 0 && (
          <div style={styles.emptyState}>{isCoach ? "Aucun circuit CT créé pour l'instant." : "Aucun circuit CT dans ton programme pour l'instant."}</div>
        )}
        {ctTypesVisibles.map((ct) =>
          isCoach && editingCTTypeId === ct.id ? (
            <EditCTTypeForm
              key={ct.id}
              data={data}
              ctType={ct}
              onCancel={() => setEditingCTTypeId(null)}
              onSave={(updates) => updateCTType(ct.id, updates)}
            />
          ) : (
            <div key={ct.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 12px", background: COLORS.bg2, borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{ct.nom}</div>
                <div style={{ fontSize: 11, color: COLORS.textFaint }}>{ct.exerciceIds.length} exercice{ct.exerciceIds.length > 1 ? "s" : ""}</div>
              </div>
              {isCoach && (
                <button style={styles.linkBtn} onClick={() => setEditingCTTypeId(ct.id)}>Modifier</button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const CONSIGNE_FIELDS = [
  { key: "positionDepart", label: "Position de départ" },
  { key: "mouvementAller", label: "Mouvement allé" },
  { key: "positionArrivee", label: "Position d'arrivée" },
  { key: "mouvementRetour", label: "Mouvement retour" },
  { key: "respiration", label: "Respiration" },
];

function hasConsignes(ex) {
  if (!ex || !ex.consignes) return false;
  return CONSIGNE_FIELDS.some((f) => (ex.consignes[f.key] || "").trim());
}

function ConsignesFields({ value, onChange }) {
  const v = value || {};
  return (
    <>
      {CONSIGNE_FIELDS.map((f) => (
        <div key={f.key}>
          <label style={styles.fieldLabel}>{f.label}</label>
          <textarea
            style={styles.textArea}
            rows={2}
            value={v[f.key] || ""}
            onChange={(e) => onChange({ ...v, [f.key]: e.target.value })}
          />
        </div>
      ))}
    </>
  );
}

function ConsignesPanel({ ex }) {
  return (
    <div style={styles.consignesPanel}>
      {CONSIGNE_FIELDS.map((f) =>
        (ex.consignes[f.key] || "").trim() ? (
          <div key={f.key} style={{ marginBottom: 6 }}>
            <span style={{ color: COLORS.accent2, fontWeight: 600 }}>{f.label} : </span>
            <span style={{ color: COLORS.textDim }}>{ex.consignes[f.key]}</span>
          </div>
        ) : null
      )}
    </div>
  );
}

function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function VideoPanel({ url }) {
  const id = getYouTubeId(url);
  if (!id) {
    return <div style={{ ...styles.consignesPanel, color: COLORS.textFaint }}>Lien vidéo invalide.</div>;
  }
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  const thumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.videoWrapper}
      title="Regarder sur YouTube"
    >
      <img src={thumbUrl} alt="Miniature de la vidéo" style={styles.videoThumb} />
      <span style={styles.videoPlayOverlay}>▶</span>
      <span style={styles.videoOpenLabel}>Regarder sur YouTube ↗</span>
    </a>
  );
}

function ExercisesView({ data, persistLibrary, role }) {
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [openConsignes, setOpenConsignes] = useState({});
  const [openVideo, setOpenVideo] = useState({});
  const isCoach = role === "coach";

  const addExercise = (ex) => {
    const newLib = { ...data, exercises: [...data.exercises, { id: uid("ex"), ...ex }] };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setShowNewExercise(false);
  };

  const updateExercise = (exId, updates) => {
    const newLib = {
      ...data,
      exercises: data.exercises.map((e) => (e.id === exId ? { ...e, ...updates } : e)),
    };
    persistLibrary({ exercises: newLib.exercises, seanceTypes: newLib.seanceTypes, programs: newLib.programs, ctTypes: newLib.ctTypes, ctPrograms: newLib.ctPrograms, alimentationVideos: newLib.alimentationVideos, ctLevelNames: newLib.ctLevelNames });
    setEditingExerciseId(null);
  };

  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.h2}>Catalogue d'exercices</h2>
        {isCoach && (
          <button style={styles.primaryBtn} onClick={() => setShowNewExercise(true)}>+ Nouvel exercice</button>
        )}
      </div>
      {isCoach && showNewExercise && (
        <NewExerciseForm data={data} onCancel={() => setShowNewExercise(false)} onSave={addExercise} />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {groupExIdsByZoneMulti(data.exercises.map((e) => e.id), exMap(data)).map(([label, ids]) => (
          <div key={label} style={styles.card}>
            <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              {label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ids.map((exId) => {
                const ex = data.exercises.find((e) => e.id === exId);
                if (!ex) return null;
                if (isCoach && editingExerciseId === exId) {
                  return (
                    <EditExerciseForm
                      key={ex.id}
                      data={data}
                      exercise={ex}
                      onCancel={() => setEditingExerciseId(null)}
                      onSave={(updates) => updateExercise(ex.id, updates)}
                    />
                  );
                }
                const showConsignesBtn = hasConsignes(ex);
                const showVideoBtn = !!ex.videoUrl;
                return (
                  <div key={ex.id} style={{ padding: "8px 12px", background: COLORS.bg2, borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{ex.nom.replace(/\n/g, " ")}</div>
                        <div style={{ fontSize: 11, color: COLORS.textFaint }}>{ex.groupe}</div>
                      </div>
                      {isCoach && (
                        <button style={styles.linkBtn} onClick={() => setEditingExerciseId(ex.id)}>Modifier</button>
                      )}
                    </div>
                    {(showConsignesBtn || showVideoBtn) && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {showConsignesBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnConsignes, ...(openConsignes[ex.id] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenConsignes((p) => ({ ...p, [ex.id]: !p[ex.id] }))}
                          >
                            ℹ️
                          </button>
                        )}
                        {showVideoBtn && (
                          <button
                            style={{ ...styles.infoBtn, ...styles.infoBtnVideo, ...(openVideo[ex.id] ? styles.infoBtnActive : {}) }}
                            onClick={() => setOpenVideo((p) => ({ ...p, [ex.id]: !p[ex.id] }))}
                          >
                            ▶️
                          </button>
                        )}
                      </div>
                    )}
                    {openConsignes[ex.id] && <ConsignesPanel ex={ex} />}
                    {openVideo[ex.id] && <VideoPanel url={ex.videoUrl} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 12 }}>
        {data.exercises.length} exercices au catalogue
      </div>
    </div>
  );
}

function NewProgramForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [ids, setIds] = useState([]);
  const [mode, setMode] = useState("presentiel");
  const [lieu, setLieu] = useState("salle");
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const seanceTypesDisponibles = data.seanceTypes.filter((st) => {
    const stMode = st.mode || "presentiel";
    if (mode === "presentiel") return stMode === "presentiel";
    return stMode === "distanciel" && (st.lieu || "salle") === lieu;
  });
  return (
    <div style={{ ...styles.card, marginBottom: 14 }}>
      <label style={styles.fieldLabel}>Nom du programme</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Programme prise de masse" />
      <label style={styles.fieldLabel}>Mode</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "presentiel" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("presentiel")}
        >
          Présentiel
        </button>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "distanciel" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("distanciel")}
        >
          Distanciel
        </button>
      </div>
      {mode === "distanciel" && (
        <>
          <label style={styles.fieldLabel}>Lieu</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              style={{ ...styles.secondaryBtn, ...(lieu === "salle" ? { background: COLORS.accent2, color: COLORS.bg, borderColor: COLORS.accent2 } : {}) }}
              onClick={() => setLieu("salle")}
            >
              Salle de sport
            </button>
            <button
              style={{ ...styles.secondaryBtn, ...(lieu === "maison" ? { background: COLORS.accent2, color: COLORS.bg, borderColor: COLORS.accent2 } : {}) }}
              onClick={() => setLieu("maison")}
            >
              Maison
            </button>
          </div>
        </>
      )}
      <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
        Seules les séances taguées {mode === "presentiel" ? "Présentiel" : lieu === "maison" ? "Distanciel · Maison" : "Distanciel · Salle"} sont proposées ci-dessous.
      </p>
      <label style={styles.fieldLabel}>Séances incluses</label>
      <div style={styles.checklist}>
        {seanceTypesDisponibles.length === 0 && (
          <div style={{ fontSize: 12, color: COLORS.textFaint, padding: "6px 2px" }}>
            Aucune séance de ce type pour l'instant. Crée d'abord une séance avec ce tag dans l'onglet "Séances".
          </div>
        )}
        {seanceTypesDisponibles.map((st) => (
          <label key={st.id} style={styles.checkItem}>
            <input type="checkbox" checked={ids.includes(st.id)} onChange={() => toggle(st.id)} />
            <span style={{ marginLeft: 8 }}>{st.nom}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom || ids.length === 0}
          onClick={() => onSave({ nom, seanceTypeIds: ids, mode, lieu: mode === "distanciel" ? lieu : null })}
        >
          Créer
        </button>
      </div>
    </div>
  );
}

function EditProgramForm({ data, program, onCancel, onSave }) {
  const [nom, setNom] = useState(program.nom);
  const [ids, setIds] = useState(program.seanceTypeIds);
  const [mode, setMode] = useState(program.mode || "presentiel");
  const [lieu, setLieu] = useState(program.lieu || "salle");
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const seanceTypesDisponibles = data.seanceTypes.filter((st) => {
    const stMode = st.mode || "presentiel";
    if (mode === "presentiel") return stMode === "presentiel";
    return stMode === "distanciel" && (st.lieu || "salle") === lieu;
  });
  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier le programme</div>
      <label style={styles.fieldLabel}>Nom du programme</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />
      <label style={styles.fieldLabel}>Mode</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "presentiel" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("presentiel")}
        >
          Présentiel
        </button>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "distanciel" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("distanciel")}
        >
          Distanciel
        </button>
      </div>
      {mode === "distanciel" && (
        <>
          <label style={styles.fieldLabel}>Lieu</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              style={{ ...styles.secondaryBtn, ...(lieu === "salle" ? { background: COLORS.accent2, color: COLORS.bg, borderColor: COLORS.accent2 } : {}) }}
              onClick={() => setLieu("salle")}
            >
              Salle de sport
            </button>
            <button
              style={{ ...styles.secondaryBtn, ...(lieu === "maison" ? { background: COLORS.accent2, color: COLORS.bg, borderColor: COLORS.accent2 } : {}) }}
              onClick={() => setLieu("maison")}
            >
              Maison
            </button>
          </div>
        </>
      )}
      <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
        Seules les séances taguées {mode === "presentiel" ? "Présentiel" : lieu === "maison" ? "Distanciel · Maison" : "Distanciel · Salle"} sont proposées ci-dessous.
      </p>
      <label style={styles.fieldLabel}>Séances incluses</label>
      <div style={styles.checklist}>
        {seanceTypesDisponibles.length === 0 && (
          <div style={{ fontSize: 12, color: COLORS.textFaint, padding: "6px 2px" }}>
            Aucune séance de ce type pour l'instant. Crée d'abord une séance avec ce tag dans l'onglet "Séances".
          </div>
        )}
        {seanceTypesDisponibles.map((st) => (
          <label key={st.id} style={styles.checkItem}>
            <input type="checkbox" checked={ids.includes(st.id)} onChange={() => toggle(st.id)} />
            <span style={{ marginLeft: 8 }}>{st.nom}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom || ids.length === 0}
          onClick={() => onSave({ nom, seanceTypeIds: ids, mode, lieu: mode === "distanciel" ? lieu : null })}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function TypeSeanceModeSelector({ mode, setMode, lieu, setLieu }) {
  return (
    <>
      <label style={styles.fieldLabel}>Type de séance</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          style={{ ...styles.secondaryBtn, ...(mode === "presentiel" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("presentiel")}
        >
          Présentiel
        </button>
        <button
          type="button"
          style={{ ...styles.secondaryBtn, ...(mode === "distanciel" && lieu === "salle" ? { background: COLORS.accent2, color: COLORS.bg, borderColor: COLORS.accent2 } : {}) }}
          onClick={() => { setMode("distanciel"); setLieu("salle"); }}
        >
          Distanciel · Salle
        </button>
        <button
          type="button"
          style={{ ...styles.secondaryBtn, ...(mode === "distanciel" && lieu === "maison" ? { background: COLORS.accent2, color: COLORS.bg, borderColor: COLORS.accent2 } : {}) }}
          onClick={() => { setMode("distanciel"); setLieu("maison"); }}
        >
          Distanciel · Maison
        </button>
      </div>
    </>
  );
}

function NewSeanceTypeForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [niveauxByKey, setNiveauxByKey] = useState({});
  const [mode, setMode] = useState("presentiel");
  const [lieu, setLieu] = useState("salle");
  const toggleKey = (key) => setSelectedKeys((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));
  const exercisesMap = exMap(data);
  return (
    <div style={{ ...styles.card, marginTop: 10 }}>
      <label style={styles.fieldLabel}>Nom du type de séance</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Full body E" />
      <TypeSeanceModeSelector mode={mode} setMode={setMode} lieu={lieu} setLieu={setLieu} />
      <label style={styles.fieldLabel}>Exercices inclus</label>
      <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
        Un exercice présent dans plusieurs catégories peut être coché indépendamment dans chacune, avec son propre niveau.
      </p>
      <div style={styles.checklist}>
        {groupExIdsByZoneMulti(data.exercises.map((e) => e.id), exercisesMap).map(([label, exIds]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
              {label}
            </div>
            {exIds.map((exId) => {
              const ex = exercisesMap[exId];
              const key = selKey(exId, label);
              const isChecked = selectedKeys.includes(key);
              return (
                <div key={key} style={{ marginBottom: 4 }}>
                  <label style={styles.checkItem}>
                    <input type="checkbox" checked={isChecked} onChange={() => toggleKey(key)} />
                    <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                  </label>
                  {isChecked && (
                    <LevelPickerButtons
                      exercise={ex}
                      selected={niveauxByKey[key]}
                      onSelect={(lvl) => setNiveauxByKey((p) => ({ ...p, [key]: lvl }))}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom}
          onClick={() => {
            const { exerciceIds, niveaux } = finalizeSelection(selectedKeys, niveauxByKey, exercisesMap);
            onSave({ nom, exerciceIds, niveaux, mode, lieu: mode === "distanciel" ? lieu : null });
          }}
        >
          Créer
        </button>
      </div>
    </div>
  );
}

function EditSeanceTypeForm({ data, seanceType, onCancel, onSave }) {
  const [nom, setNom] = useState(seanceType.nom);
  const exercisesMap = exMap(data);
  const [mode, setMode] = useState(seanceType.mode || "presentiel");
  const [lieu, setLieu] = useState(seanceType.lieu || "salle");
  const [selectedKeys, setSelectedKeys] = useState(() =>
    seanceType.exerciceIds.map((exId) => selKey(exId, zoneLabel(getExerciseZones(exercisesMap[exId])[0])))
  );
  const [niveauxByKey, setNiveauxByKey] = useState(() => {
    const niv = {};
    seanceType.exerciceIds.forEach((exId) => {
      const key = selKey(exId, zoneLabel(getExerciseZones(exercisesMap[exId])[0]));
      if (seanceType.niveaux && seanceType.niveaux[exId] != null) niv[key] = seanceType.niveaux[exId];
    });
    return niv;
  });
  const toggleKey = (key) => setSelectedKeys((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));
  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier la séance</div>
      <label style={styles.fieldLabel}>Nom du type de séance</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />
      <TypeSeanceModeSelector mode={mode} setMode={setMode} lieu={lieu} setLieu={setLieu} />
      <label style={styles.fieldLabel}>Exercices inclus</label>
      <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
        Un exercice présent dans plusieurs catégories peut être coché indépendamment dans chacune, avec son propre niveau.
      </p>
      <div style={styles.checklist}>
        {groupExIdsByZoneMulti(data.exercises.map((e) => e.id), exercisesMap).map(([label, exIds]) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
              {label}
            </div>
            {exIds.map((exId) => {
              const ex = exercisesMap[exId];
              const key = selKey(exId, label);
              const isChecked = selectedKeys.includes(key);
              return (
                <div key={key} style={{ marginBottom: 4 }}>
                  <label style={styles.checkItem}>
                    <input type="checkbox" checked={isChecked} onChange={() => toggleKey(key)} />
                    <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                  </label>
                  {isChecked && (
                    <LevelPickerButtons
                      exercise={ex}
                      selected={niveauxByKey[key]}
                      onSelect={(lvl) => setNiveauxByKey((p) => ({ ...p, [key]: lvl }))}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom}
          onClick={() => {
            const { exerciceIds, niveaux } = finalizeSelection(selectedKeys, niveauxByKey, exercisesMap);
            onSave({ nom, exerciceIds, niveaux, mode, lieu: mode === "distanciel" ? lieu : null });
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function CTSettingsFields({ workSeconds, setWorkSeconds, restSeconds, setRestSeconds, roundRestSeconds, setRoundRestSeconds, rounds, setRounds }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 6 }}>
      <div>
        <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Effort (s)</label>
        <input
          type="number"
          min={5}
          max={600}
          value={workSeconds}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setWorkSeconds(Math.max(5, Number(e.target.value) || WARMUP_WORK_SECONDS))}
          style={{ ...styles.numInput, width: 64 }}
        />
      </div>
      <div>
        <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Récupération (s)</label>
        <input
          type="number"
          min={5}
          max={600}
          value={restSeconds}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setRestSeconds(Math.max(5, Number(e.target.value) || WARMUP_REST_SECONDS))}
          style={{ ...styles.numInput, width: 64 }}
        />
      </div>
      <div>
        <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Entre circuits (s)</label>
        <input
          type="number"
          min={5}
          max={600}
          value={roundRestSeconds}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setRoundRestSeconds(Math.max(5, Number(e.target.value) || WARMUP_ROUND_REST_SECONDS))}
          style={{ ...styles.numInput, width: 64 }}
        />
      </div>
      <div>
        <label style={{ fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 }}>Nombre de tours</label>
        <input
          type="number"
          min={1}
          max={10}
          value={rounds}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") { setRounds(""); return; }
            setRounds(Math.max(1, Math.min(10, Number(raw) || 1)));
          }}
          onBlur={(e) => {
            if (e.target.value === "" || Number(e.target.value) < 1) setRounds(1);
          }}
          style={{ ...styles.numInput, width: 56 }}
        />
      </div>
    </div>
  );
}

function NewCTTypeForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [mode, setMode] = useState("liste");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [niveauxByKey, setNiveauxByKey] = useState({});
  const [workSeconds, setWorkSeconds] = useState(WARMUP_WORK_SECONDS);
  const [restSeconds, setRestSeconds] = useState(WARMUP_REST_SECONDS);
  const [roundRestSeconds, setRoundRestSeconds] = useState(WARMUP_ROUND_REST_SECONDS);
  const [rounds, setRounds] = useState(5);
  const [tableRows, setTableRows] = useState([
    { id: uid("ctrow"), groupe: "", cells: Array.from({ length: 5 }, () => ({ exerciceId: "", poids: "" })) },
  ]);
  const toggleKey = (key) => setSelectedKeys((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));
  const exercisesMap = exMap(data);
  const levelNames = data.ctLevelNames && data.ctLevelNames.length
    ? data.ctLevelNames
    : ["Bilatéral", "Unilatéral"];

  const buildTableExerciceIdsAndNiveaux = () => {
    const exerciceIds = [];
    const niveaux = {};
    tableRows.forEach((row) => {
      row.cells.forEach((cell) => {
        if (cell.exerciceId && !exerciceIds.includes(cell.exerciceId)) {
          exerciceIds.push(cell.exerciceId);
          if (cell.niveau != null) niveaux[cell.exerciceId] = cell.niveau;
        }
      });
    });
    return { exerciceIds, niveaux };
  };

  return (
    <div style={{ ...styles.card, marginTop: 10 }}>
      <label style={styles.fieldLabel}>Nom du circuit (ex: CTA, CTB, CTC)</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: CTA" />
      <label style={styles.fieldLabel}>Réglages du circuit</label>
      <CTSettingsFields
        workSeconds={workSeconds} setWorkSeconds={setWorkSeconds}
        restSeconds={restSeconds} setRestSeconds={setRestSeconds}
        roundRestSeconds={roundRestSeconds} setRoundRestSeconds={setRoundRestSeconds}
        rounds={rounds} setRounds={setRounds}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 12 }}>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "liste" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("liste")}
        >
          Liste d'exercices
        </button>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "tableau" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("tableau")}
        >
          📋 Tableau (par tour)
        </button>
      </div>

      {mode === "liste" ? (
        <>
          <label style={styles.fieldLabel}>Exercices inclus</label>
          <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
            Un exercice présent dans plusieurs catégories peut être coché indépendamment dans chacune, avec son propre niveau.
          </p>
          <div style={styles.checklist}>
            {groupExIdsByZoneMulti(data.exercises.map((e) => e.id), exercisesMap).map(([label, exIds]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
                  {label}
                </div>
                {exIds.map((exId) => {
                  const ex = exercisesMap[exId];
                  const key = selKey(exId, label);
                  const isChecked = selectedKeys.includes(key);
                  return (
                    <div key={key} style={{ marginBottom: 4 }}>
                      <label style={styles.checkItem}>
                        <input type="checkbox" checked={isChecked} onChange={() => toggleKey(key)} />
                        <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                      </label>
                      {isChecked && (
                        <LevelPickerButtons
                          exercise={ex}
                          selected={niveauxByKey[key]}
                          onSelect={(lvl) => setNiveauxByKey((p) => ({ ...p, [key]: lvl }))}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <label style={styles.fieldLabel}>Exercices par tour</label>
          <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
            Ce modèle pourra être chargé directement dans l'onglet CT → Tableau, avec cette structure déjà prête.
          </p>
          <CTTableGridEditor
            data={data}
            rows={tableRows}
            setRows={setTableRows}
            rounds={rounds}
            setRounds={setRounds}
            levelNames={levelNames}
            showPoids={false}
            isCoach={true}
          />
        </>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom || (mode === "liste" ? selectedKeys.length === 0 : tableRows.every((r) => r.cells.every((c) => !c.exerciceId)))}
          onClick={() => {
            if (mode === "liste") {
              const { exerciceIds, niveaux } = finalizeSelection(selectedKeys, niveauxByKey, exercisesMap);
              onSave({ nom, exerciceIds, niveaux, workSeconds, restSeconds, roundRestSeconds, rounds });
            } else {
              const { exerciceIds, niveaux } = buildTableExerciceIdsAndNiveaux();
              onSave({ nom, exerciceIds, niveaux, workSeconds, restSeconds, roundRestSeconds, rounds, table: { rounds, rows: tableRows } });
            }
          }}
        >
          Créer
        </button>
      </div>
    </div>
  );
}

function EditCTTypeForm({ data, ctType, onCancel, onSave }) {
  const [nom, setNom] = useState(ctType.nom);
  const exercisesMap = exMap(data);
  const [mode, setMode] = useState(ctType.table ? "tableau" : "liste");
  const [selectedKeys, setSelectedKeys] = useState(() =>
    ctType.exerciceIds.map((exId) => selKey(exId, zoneLabel(getExerciseZones(exercisesMap[exId])[0])))
  );
  const [niveauxByKey, setNiveauxByKey] = useState(() => {
    const niv = {};
    ctType.exerciceIds.forEach((exId) => {
      const key = selKey(exId, zoneLabel(getExerciseZones(exercisesMap[exId])[0]));
      if (ctType.niveaux && ctType.niveaux[exId] != null) niv[key] = ctType.niveaux[exId];
    });
    return niv;
  });
  const [workSeconds, setWorkSeconds] = useState(ctType.workSeconds ?? WARMUP_WORK_SECONDS);
  const [restSeconds, setRestSeconds] = useState(ctType.restSeconds ?? WARMUP_REST_SECONDS);
  const [roundRestSeconds, setRoundRestSeconds] = useState(ctType.roundRestSeconds ?? WARMUP_ROUND_REST_SECONDS);
  const [rounds, setRounds] = useState(ctType.rounds ?? 2);
  const [tableRows, setTableRows] = useState(
    ctType.table && Array.isArray(ctType.table.rows)
      ? ctType.table.rows
      : [{ id: uid("ctrow"), groupe: "", cells: Array.from({ length: ctType.rounds ?? 5 }, () => ({ exerciceId: "", poids: "" })) }]
  );
  const toggleKey = (key) => setSelectedKeys((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));
  const levelNames = data.ctLevelNames && data.ctLevelNames.length
    ? data.ctLevelNames
    : ["Bilatéral", "Unilatéral"];

  const buildTableExerciceIdsAndNiveaux = () => {
    const exerciceIds = [];
    const niveaux = {};
    tableRows.forEach((row) => {
      row.cells.forEach((cell) => {
        if (cell.exerciceId && !exerciceIds.includes(cell.exerciceId)) {
          exerciceIds.push(cell.exerciceId);
          if (cell.niveau != null) niveaux[cell.exerciceId] = cell.niveau;
        }
      });
    });
    return { exerciceIds, niveaux };
  };

  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier le circuit</div>
      <label style={styles.fieldLabel}>Nom du circuit</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />
      <label style={styles.fieldLabel}>Réglages du circuit</label>
      <CTSettingsFields
        workSeconds={workSeconds} setWorkSeconds={setWorkSeconds}
        restSeconds={restSeconds} setRestSeconds={setRestSeconds}
        roundRestSeconds={roundRestSeconds} setRoundRestSeconds={setRoundRestSeconds}
        rounds={rounds} setRounds={setRounds}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 12 }}>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "liste" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("liste")}
        >
          Liste d'exercices
        </button>
        <button
          style={{ ...styles.secondaryBtn, ...(mode === "tableau" ? { background: COLORS.accent, color: COLORS.bg, borderColor: COLORS.accent } : {}) }}
          onClick={() => setMode("tableau")}
        >
          📋 Tableau (par tour)
        </button>
      </div>

      {mode === "liste" ? (
        <>
          <label style={styles.fieldLabel}>Exercices inclus</label>
          <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
            Un exercice présent dans plusieurs catégories peut être coché indépendamment dans chacune, avec son propre niveau.
          </p>
          <div style={styles.checklist}>
            {groupExIdsByZoneMulti(data.exercises.map((e) => e.id), exercisesMap).map(([label, exIds]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 0 4px" }}>
                  {label}
                </div>
                {exIds.map((exId) => {
                  const ex = exercisesMap[exId];
                  const key = selKey(exId, label);
                  const isChecked = selectedKeys.includes(key);
                  return (
                    <div key={key} style={{ marginBottom: 4 }}>
                      <label style={styles.checkItem}>
                        <input type="checkbox" checked={isChecked} onChange={() => toggleKey(key)} />
                        <span style={{ marginLeft: 8 }}>{exDisplayName(ex)}</span>
                      </label>
                      {isChecked && (
                        <LevelPickerButtons
                          exercise={ex}
                          selected={niveauxByKey[key]}
                          onSelect={(lvl) => setNiveauxByKey((p) => ({ ...p, [key]: lvl }))}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <label style={styles.fieldLabel}>Exercices par tour</label>
          <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: -4, marginBottom: 8 }}>
            Ce modèle pourra être chargé directement dans l'onglet CT → Tableau, avec cette structure déjà prête.
          </p>
          <CTTableGridEditor
            data={data}
            rows={tableRows}
            setRows={setTableRows}
            rounds={rounds}
            setRounds={setRounds}
            levelNames={levelNames}
            showPoids={false}
            isCoach={true}
          />
        </>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom}
          onClick={() => {
            if (mode === "liste") {
              const { exerciceIds, niveaux } = finalizeSelection(selectedKeys, niveauxByKey, exercisesMap);
              onSave({ nom, exerciceIds, niveaux, workSeconds, restSeconds, roundRestSeconds, rounds });
            } else {
              const { exerciceIds, niveaux } = buildTableExerciceIdsAndNiveaux();
              onSave({ nom, exerciceIds, niveaux, workSeconds, restSeconds, roundRestSeconds, rounds, table: { rounds, rows: tableRows } });
            }
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function NewCTProgramForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [ids, setIds] = useState([]);
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <div style={{ ...styles.card, marginBottom: 14 }}>
      <label style={styles.fieldLabel}>Nom du programme CT</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Programme CT découverte" />
      <label style={styles.fieldLabel}>Circuits inclus</label>
      <div style={styles.checklist}>
        {data.ctTypes.map((ct) => (
          <label key={ct.id} style={styles.checkItem}>
            <input type="checkbox" checked={ids.includes(ct.id)} onChange={() => toggle(ct.id)} />
            <span style={{ marginLeft: 8 }}>{ct.nom}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} disabled={!nom || ids.length === 0} onClick={() => onSave({ nom, ctTypeIds: ids })}>
          Créer
        </button>
      </div>
    </div>
  );
}

function EditCTProgramForm({ data, program, onCancel, onSave }) {
  const [nom, setNom] = useState(program.nom);
  const [ids, setIds] = useState(program.ctTypeIds);
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier le programme CT</div>
      <label style={styles.fieldLabel}>Nom du programme CT</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />
      <label style={styles.fieldLabel}>Circuits inclus</label>
      <div style={styles.checklist}>
        {data.ctTypes.map((ct) => (
          <label key={ct.id} style={styles.checkItem}>
            <input type="checkbox" checked={ids.includes(ct.id)} onChange={() => toggle(ct.id)} />
            <span style={{ marginLeft: 8 }}>{ct.nom}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button style={styles.primaryBtn} disabled={!nom || ids.length === 0} onClick={() => onSave({ nom, ctTypeIds: ids })}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function ExerciseLevelsFields({ niveaux, onChange }) {
  const values = niveaux || [];
  const updateAt = (i, v) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  const removeAt = (i) => onChange(values.filter((_, idx) => idx !== i));
  const addLevel = () => onChange([...values, ""]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 }}>
      {values.map((v, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.textFaint, width: 16 }}>{i + 1}.</span>
          <input
            style={{ ...styles.textInput, marginBottom: 0, flex: 1 }}
            value={v}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder={`Ex: ${["Poids du corps", "Élastique léger", "Élastique moyen", "Charge légère", "Charge lourde"][i] || `Niveau ${i + 1}`}`}
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            title="Retirer ce niveau"
            aria-label="Retirer ce niveau"
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              border: `1px solid ${COLORS.cardBorder}`,
              background: COLORS.bg2,
              color: COLORS.textFaint,
              fontSize: 12,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
      ))}
      {values.length === 0 && (
        <div style={{ fontSize: 12, color: COLORS.textFaint }}>Aucun niveau pour l'instant.</div>
      )}
      <button type="button" style={{ ...styles.secondaryBtn, alignSelf: "flex-start" }} onClick={addLevel}>
        + Ajouter un niveau
      </button>
    </div>
  );
}

function LevelPickerButtons({ exercise, selected, onSelect, fallbackNames }) {
  const niveaux = getExerciseNiveaux(exercise, fallbackNames);
  if (!niveaux.length) return null;
  return (
    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4, marginLeft: 22 }}>
      {niveaux.map((niv, idx) => {
        const lvl = idx + 1;
        const isActive = (selected || 1) === lvl;
        return (
          <button
            key={lvl}
            type="button"
            onClick={(e) => { e.preventDefault(); onSelect(lvl); }}
            title={niv.nom}
            style={{
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 12,
              border: `1px solid ${isActive ? COLORS.accent : COLORS.cardBorder}`,
              background: isActive ? COLORS.accent : COLORS.bg2,
              color: isActive ? COLORS.bg : COLORS.textDim,
              fontWeight: isActive ? 700 : 400,
              cursor: "pointer",
              fontFamily: FONT_BODY,
            }}
          >
            {niv.nom}
          </button>
        );
      })}
    </div>
  );
}

function ExerciseLevelsWithDetailsFields({ niveaux, onChange }) {
  const values = niveaux || [];
  const [expandedIdx, setExpandedIdx] = useState(null);

  const updateAt = (i, patch) => onChange(values.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const removeAt = (i) => {
    onChange(values.filter((_, idx) => idx !== i));
    if (expandedIdx === i) setExpandedIdx(null);
  };
  const addLevel = () => onChange([...values, { nom: "", consignes: {}, videoUrl: "" }]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 6 }}>
      {values.map((v, i) => (
        <div key={i} style={{ border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: COLORS.textFaint, width: 16 }}>{i + 1}.</span>
            <input
              style={{ ...styles.textInput, marginBottom: 0, flex: 1 }}
              value={v.nom || ""}
              onChange={(e) => updateAt(i, { nom: e.target.value })}
              placeholder={`Ex: ${["Poids du corps", "Élastique léger", "Élastique moyen", "Charge légère", "Charge lourde"][i] || `Niveau ${i + 1}`}`}
            />
            <button
              type="button"
              style={styles.linkBtn}
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            >
              {expandedIdx === i ? "Fermer" : "Tips/Vidéo"}
            </button>
            <button
              type="button"
              onClick={() => removeAt(i)}
              title="Retirer ce niveau"
              aria-label="Retirer ce niveau"
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: `1px solid ${COLORS.cardBorder}`,
                background: COLORS.bg2,
                color: COLORS.textFaint,
                fontSize: 12,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
          {expandedIdx === i && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.cardBorder}` }}>
              <div style={{ fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                Tips de ce niveau (optionnel)
              </div>
              <ConsignesFields value={v.consignes || {}} onChange={(c) => updateAt(i, { consignes: c })} />
              <label style={styles.fieldLabel}>Lien vidéo YouTube de ce niveau (optionnel)</label>
              <input
                style={styles.textInput}
                value={v.videoUrl || ""}
                onChange={(e) => updateAt(i, { videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          )}
        </div>
      ))}
      {values.length === 0 && (
        <div style={{ fontSize: 12, color: COLORS.textFaint }}>Aucun niveau pour l'instant.</div>
      )}
      <button type="button" style={{ ...styles.secondaryBtn, alignSelf: "flex-start" }} onClick={addLevel}>
        + Ajouter un niveau
      </button>
    </div>
  );
}

function MultiSelectWithCustom({ options, selected, onToggle, onAddCustom, onRemoveOption, formatLabel, placeholder }) {
  const [customInput, setCustomInput] = useState("");
  const submitCustom = () => {
    const v = customInput.trim();
    if (!v) return;
    onAddCustom(v);
    setCustomInput("");
  };
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <span
              key={opt}
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 20,
                background: isSelected ? COLORS.accent : COLORS.bg2,
                border: `1px solid ${isSelected ? COLORS.accent : COLORS.cardBorder}`,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => onToggle(opt)}
                style={{
                  fontSize: 12,
                  padding: "6px 4px 6px 12px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: FONT_BODY,
                  color: isSelected ? COLORS.bg : COLORS.textDim,
                  fontWeight: isSelected ? 700 : 400,
                }}
              >
                {isSelected ? "✓ " : ""}{formatLabel ? formatLabel(opt) : opt}
              </button>
              <button
                type="button"
                onClick={() => onRemoveOption(opt)}
                title="Retirer cette option de la liste"
                aria-label="Retirer cette option de la liste"
                style={{
                  fontSize: 12,
                  padding: "6px 10px 6px 4px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: FONT_BODY,
                  color: isSelected ? COLORS.bg : COLORS.textFaint,
                  opacity: 0.75,
                }}
              >
                ✕
              </button>
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ ...styles.textInput, marginBottom: 0 }}
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), submitCustom())}
          placeholder={placeholder}
        />
        <button type="button" style={styles.secondaryBtn} onClick={submitCustom}>+ Ajouter</button>
      </div>
    </div>
  );
}

function NewExerciseForm({ data, onCancel, onSave }) {
  const [nom, setNom] = useState("");
  const [consignes, setConsignes] = useState({});
  const [videoUrl, setVideoUrl] = useState("");
  const [maison, setMaison] = useState(false);
  const [niveaux, setNiveaux] = useState([
    { nom: "Bilatéral", consignes: {}, videoUrl: "" },
    { nom: "Unilatéral", consignes: {}, videoUrl: "" },
  ]);

  const [zoneOptions, setZoneOptions] = useState([...new Set([...STANDARD_ZONES, ...data.exercises.flatMap((e) => getExerciseZones(e))])]);
  const [groupeOptions, setGroupeOptions] = useState([...new Set(data.exercises.flatMap((e) => getExerciseGroupes(e)))].sort());
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedGroupes, setSelectedGroupes] = useState([]);

  const toggleZone = (z) => setSelectedZones((p) => (p.includes(z) ? p.filter((x) => x !== z) : [...p, z]));
  const addCustomZone = (z) => {
    if (!zoneOptions.includes(z)) setZoneOptions((p) => [...p, z]);
    setSelectedZones((p) => (p.includes(z) ? p : [...p, z]));
  };
  const removeZoneOption = (z) => {
    setZoneOptions((p) => p.filter((x) => x !== z));
    setSelectedZones((p) => p.filter((x) => x !== z));
  };
  const toggleGroupe = (g) => setSelectedGroupes((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  const addCustomGroupe = (g) => {
    if (!groupeOptions.includes(g)) setGroupeOptions((p) => [...p, g]);
    setSelectedGroupes((p) => (p.includes(g) ? p : [...p, g]));
  };
  const removeGroupeOption = (g) => {
    setGroupeOptions((p) => p.filter((x) => x !== g));
    setSelectedGroupes((p) => p.filter((x) => x !== g));
  };

  return (
    <div style={{ ...styles.card, marginTop: 10 }}>
      <label style={styles.fieldLabel}>Nom de l'exercice</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />

      <label style={styles.fieldLabel}>Zones (une ou plusieurs)</label>
      <MultiSelectWithCustom
        options={zoneOptions}
        selected={selectedZones}
        onToggle={toggleZone}
        onAddCustom={addCustomZone}
        onRemoveOption={removeZoneOption}
        formatLabel={zoneLabel}
        placeholder="Ex: BAS DU CORPS"
      />

      <label style={styles.fieldLabel}>Groupes musculaires (un ou plusieurs)</label>
      <MultiSelectWithCustom
        options={groupeOptions}
        selected={selectedGroupes}
        onToggle={toggleGroupe}
        onAddCustom={addCustomGroupe}
        onRemoveOption={removeGroupeOption}
        placeholder="Ex: Quadriceps"
      />

      <label style={{ ...styles.checkItem, marginTop: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={maison} onChange={(e) => setMaison(e.target.checked)} />
        <span style={{ marginLeft: 8 }}>Faisable à la maison (sans machine de musculation)</span>
      </label>

      <label style={styles.fieldLabel}>Niveaux de cet exercice (optionnel, pour le tableau CT)</label>
      <ExerciseLevelsWithDetailsFields niveaux={niveaux} onChange={setNiveaux} />

      <div style={{ marginTop: 4, marginBottom: 6, fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Tips (optionnel)
      </div>
      <ConsignesFields value={consignes} onChange={setConsignes} />

      <label style={styles.fieldLabel}>Lien vidéo YouTube (optionnel)</label>
      <input
        style={styles.textInput}
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom || selectedZones.length === 0 || selectedGroupes.length === 0}
          onClick={() =>
            onSave({
              nom,
              zone: selectedZones[0],
              zones: selectedZones,
              groupe: selectedGroupes.join("\n"),
              groupes: selectedGroupes,
              niveaux,
              consignes,
              videoUrl: videoUrl.trim(),
              maison,
            })
          }
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

function EditExerciseForm({ data, exercise, onCancel, onSave }) {
  const [nom, setNom] = useState(exercise.nom);
  const [consignes, setConsignes] = useState(exercise.consignes || {});
  const [videoUrl, setVideoUrl] = useState(exercise.videoUrl || "");
  const [maison, setMaison] = useState(!!exercise.maison);
  const [niveaux, setNiveaux] = useState(
    Array.isArray(exercise.niveaux) && exercise.niveaux.length
      ? exercise.niveaux.map((n) => (typeof n === "string" ? { nom: n, consignes: {}, videoUrl: "" } : n))
      : [
          { nom: "Bilatéral", consignes: {}, videoUrl: "" },
          { nom: "Unilatéral", consignes: {}, videoUrl: "" },
        ]
  );

  const [zoneOptions, setZoneOptions] = useState([...new Set([...STANDARD_ZONES, ...data.exercises.flatMap((e) => getExerciseZones(e))])]);
  const [groupeOptions, setGroupeOptions] = useState([...new Set(data.exercises.flatMap((e) => getExerciseGroupes(e)))].sort());
  const [selectedZones, setSelectedZones] = useState(getExerciseZones(exercise));
  const [selectedGroupes, setSelectedGroupes] = useState(getExerciseGroupes(exercise));

  const toggleZone = (z) => setSelectedZones((p) => (p.includes(z) ? p.filter((x) => x !== z) : [...p, z]));
  const addCustomZone = (z) => {
    if (!zoneOptions.includes(z)) setZoneOptions((p) => [...p, z]);
    setSelectedZones((p) => (p.includes(z) ? p : [...p, z]));
  };
  const removeZoneOption = (z) => {
    setZoneOptions((p) => p.filter((x) => x !== z));
    setSelectedZones((p) => p.filter((x) => x !== z));
  };
  const toggleGroupe = (g) => setSelectedGroupes((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  const addCustomGroupe = (g) => {
    if (!groupeOptions.includes(g)) setGroupeOptions((p) => [...p, g]);
    setSelectedGroupes((p) => (p.includes(g) ? p : [...p, g]));
  };
  const removeGroupeOption = (g) => {
    setGroupeOptions((p) => p.filter((x) => x !== g));
    setSelectedGroupes((p) => p.filter((x) => x !== g));
  };

  return (
    <div style={{ ...styles.card, borderColor: COLORS.accent2 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: COLORS.text, marginBottom: 12 }}>Modifier l'exercice</div>
      <label style={styles.fieldLabel}>Nom de l'exercice</label>
      <input style={styles.textInput} value={nom} onChange={(e) => setNom(e.target.value)} />

      <label style={styles.fieldLabel}>Zones (une ou plusieurs)</label>
      <MultiSelectWithCustom
        options={zoneOptions}
        selected={selectedZones}
        onToggle={toggleZone}
        onAddCustom={addCustomZone}
        onRemoveOption={removeZoneOption}
        formatLabel={zoneLabel}
        placeholder="Ex: BAS DU CORPS"
      />

      <label style={styles.fieldLabel}>Groupes musculaires (un ou plusieurs)</label>
      <MultiSelectWithCustom
        options={groupeOptions}
        selected={selectedGroupes}
        onToggle={toggleGroupe}
        onAddCustom={addCustomGroupe}
        onRemoveOption={removeGroupeOption}
        placeholder="Ex: Quadriceps"
      />

      <label style={{ ...styles.checkItem, marginTop: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={maison} onChange={(e) => setMaison(e.target.checked)} />
        <span style={{ marginLeft: 8 }}>Faisable à la maison (sans machine de musculation)</span>
      </label>

      <label style={styles.fieldLabel}>Niveaux de cet exercice (optionnel, pour le tableau CT)</label>
      <ExerciseLevelsWithDetailsFields niveaux={niveaux} onChange={setNiveaux} />

      <div style={{ marginTop: 4, marginBottom: 6, fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Tips (optionnel)
      </div>
      <ConsignesFields value={consignes} onChange={setConsignes} />

      <label style={styles.fieldLabel}>Lien vidéo YouTube (optionnel)</label>
      <input
        style={styles.textInput}
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Annuler</button>
        <button
          style={styles.primaryBtn}
          disabled={!nom || selectedZones.length === 0 || selectedGroupes.length === 0}
          onClick={() =>
            onSave({
              nom,
              zone: selectedZones[0],
              zones: selectedZones,
              groupe: selectedGroupes.join("\n"),
              groupes: selectedGroupes,
              niveaux,
              consignes,
              videoUrl: videoUrl.trim(),
              maison,
            })
          }
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: FONT_BODY,
    background: COLORS.bg,
    color: COLORS.text,
    minHeight: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    background: COLORS.bg,
    borderRadius: 12,
  },
  spinner: {
    width: 28,
    height: 28,
    border: `3px solid ${COLORS.cardBorder}`,
    borderTopColor: COLORS.accent,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  header: {
    padding: "16px 20px",
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.bg2,
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  roleBadge: {
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    background: "rgba(255,122,26,0.15)",
    color: COLORS.accent,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: COLORS.textFaint,
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline",
  },
  tabRow: {
    display: "flex",
    gap: 6,
    overflowX: "auto",
    flexWrap: "nowrap",
    WebkitOverflowScrolling: "touch",
    paddingBottom: 2,
    marginBottom: -2,
  },
  tabBtn: {
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  body: {
    padding: 20,
  },
  h2: {
    fontFamily: FONT_DISPLAY,
    fontSize: 18,
    color: COLORS.text,
    margin: "0 0 14px 0",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 12,
    padding: 16,
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  primaryBtn: {
    background: COLORS.accent,
    color: COLORS.bg,
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  secondaryBtn: {
    background: "transparent",
    color: COLORS.text,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  dangerBtn: {
    background: COLORS.danger,
    color: "#2A0E0E",
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  dangerLinkBtn: {
    background: "none",
    border: "none",
    color: COLORS.danger,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: FONT_BODY,
    padding: 0,
  },
  trashBtn: {
    background: "rgba(255,107,107,0.12)",
    border: `1px solid rgba(255,107,107,0.35)`,
    color: COLORS.danger,
    fontSize: 16,
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: 8,
    flexShrink: 0,
    lineHeight: 1,
  },
  roleBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 18px",
    borderRadius: 12,
    border: "none",
    background: COLORS.accent,
    cursor: "pointer",
  },
  clientBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.card,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
  },
  emptyState: {
    color: COLORS.textFaint,
    fontSize: 13,
    padding: "30px 0",
    textAlign: "center",
  },
  entryRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: 5,
    marginBottom: 6,
    overflowX: "auto",
    paddingBottom: 2,
  },
  prevValue: {
    fontSize: 12,
    color: COLORS.accent2,
    opacity: 0.75,
    marginLeft: 8,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  infoBtn: {
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    marginLeft: 4,
    padding: "6px 10px",
    lineHeight: 1,
    flexShrink: 0,
    borderRadius: 8,
    fontFamily: FONT_BODY,
    whiteSpace: "nowrap",
  },
  infoBtnConsignes: {
    background: "rgba(255,176,102,0.14)",
    border: `1px solid rgba(255,176,102,0.5)`,
    color: COLORS.accent2,
  },
  infoBtnVideo: {
    background: "rgba(255,122,26,0.14)",
    border: `1px solid rgba(255,122,26,0.5)`,
    color: COLORS.accent,
  },
  infoBtnTimer: {
    background: "rgba(120,180,255,0.14)",
    border: `1px solid rgba(120,180,255,0.5)`,
    color: "#7DB4FF",
  },
  infoBtnActive: {
    background: COLORS.accent,
    borderColor: COLORS.accent,
    color: COLORS.bg,
  },
  validateSerieBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.bg2,
    color: COLORS.textFaint,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
    lineHeight: 1,
  },
  validateSerieBtnActive: {
    background: "#5CB85C",
    borderColor: "#5CB85C",
    color: "#0F1A0F",
  },
  entryRowValidated: {
    background: "rgba(92,184,92,0.08)",
    borderRadius: 8,
    padding: "4px 6px",
    margin: "-4px -6px 6px -6px",
  },
  consignesPanel: {
    marginTop: 8,
    marginBottom: 4,
    padding: "10px 12px",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    fontSize: 12,
  },
  timerPanel: {
    marginTop: 8,
    marginBottom: 4,
    padding: "10px 12px",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  timerDisplay: {
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    fontVariantNumeric: "tabular-nums",
    minWidth: 64,
  },
  timerBtn: {
    background: COLORS.accent,
    color: COLORS.bg,
    border: "none",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  timerBtnActive: {
    background: COLORS.accent2,
  },
  timerResetBtn: {
    background: "transparent",
    color: COLORS.textDim,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  circuitPanel: {
    background: COLORS.bg2,
    border: `1px solid ${COLORS.accent}`,
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 14,
  },
  circuitTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: 14,
    color: COLORS.accent,
  },
  sectionHeader: {
    fontFamily: FONT_DISPLAY,
    fontSize: 16,
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: `2px solid ${COLORS.accent}`,
  },
  bilanPanel: {
    marginTop: 8,
    padding: "14px 16px",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 10,
  },
  bilanScaleBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.card,
    color: COLORS.textDim,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  accompagnementStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.card,
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT_BODY,
    lineHeight: 1,
  },
  bilanScaleBtnActive: {
    background: COLORS.accent,
    borderColor: COLORS.accent,
    color: COLORS.bg,
  },
  bilanSensationBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "8px 16px",
    borderRadius: 10,
    border: `1px solid ${COLORS.cardBorder}`,
    background: COLORS.card,
    color: COLORS.textDim,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  },
  bilanSensationBtnActive: {
    background: "rgba(255,122,26,0.14)",
    borderColor: COLORS.accent,
    color: COLORS.accent,
  },
  circuitTimerDisplay: {
    fontFamily: FONT_DISPLAY,
    fontSize: 40,
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1.1,
  },
  videoWrapper: {
    position: "relative",
    display: "block",
    width: "100%",
    paddingTop: "56.25%",
    height: 0,
    overflow: "hidden",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
    border: `1px solid ${COLORS.cardBorder}`,
    background: "#000",
    textDecoration: "none",
  },
  videoThumb: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.75,
  },
  videoPlayOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(255,122,26,0.9)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    paddingLeft: 4,
  },
  videoOpenLabel: {
    position: "absolute",
    bottom: 8,
    right: 10,
    fontSize: 11,
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    padding: "3px 8px",
    borderRadius: 6,
  },
  entryLabel: {
    fontSize: 12,
    color: COLORS.textDim,
    width: 34,
    flexShrink: 0,
  },
  unitLabel: {
    fontSize: 12,
    color: COLORS.textFaint,
    flexShrink: 0,
  },
  numInput: {
    width: 58,
    flexShrink: 0,
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 6,
    padding: "6px 6px",
    color: COLORS.text,
    fontSize: 13,
    fontFamily: FONT_BODY,
  },
  textInput: {
    width: "100%",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: COLORS.text,
    fontSize: 13,
    fontFamily: FONT_BODY,
    marginBottom: 12,
    boxSizing: "border-box",
  },
  textArea: {
    width: "100%",
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: COLORS.text,
    fontSize: 13,
    fontFamily: FONT_BODY,
    boxSizing: "border-box",
    resize: "vertical",
  },
  fieldLabel: {
    display: "block",
    fontSize: 12,
    color: COLORS.textDim,
    marginBottom: 6,
    marginTop: 4,
  },
  checklist: {
    maxHeight: 220,
    overflowY: "auto",
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    fontSize: 13,
    padding: "5px 2px",
    color: COLORS.text,
    cursor: "pointer",
  },
  pill: {
    fontSize: 12,
    padding: "5px 10px",
    borderRadius: 20,
    background: COLORS.bg2,
    border: `1px solid ${COLORS.cardBorder}`,
    color: COLORS.textDim,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: 11,
    color: COLORS.textFaint,
    padding: "10px 14px",
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  td: {
    fontSize: 13,
    padding: "9px 14px",
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    color: COLORS.text,
  },
  toast: {
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    background: COLORS.accent,
    color: COLORS.bg,
    padding: "8px 18px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
};
