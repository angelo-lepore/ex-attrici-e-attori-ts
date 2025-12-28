// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.
// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: "American" | "British" | "Australian" | "Israeli-American" |
    "South African" | "French" | "Indian" | "Israeli" | "Spanish" |
    "South Korean" | "Chinese";
};

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:
// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

function isPerson(dati: unknown): dati is Person {
  if (typeof dati !== "object" || dati === null) {
    return false;
  }
  const obj = dati as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.birth_year === "number" &&
    (obj.death_year === undefined || typeof obj.death_year === "number") &&
    typeof obj.biography === "string" &&
    typeof obj.image === "string"
  );
}

function isActress(dati: unknown): dati is Actress {
  if (!isPerson(dati)) {
    return false;
  }

  const obj = dati as Record<string, unknown>;

  return (
    Array.isArray(obj.most_famous_movies) &&
    obj.most_famous_movies.length === 3 &&
    obj.most_famous_movies.every(movie => typeof movie === "string") &&
    typeof obj.awards === "string" &&
    typeof obj.nationality === "string" &&
    [ "American", "British", "Australian", "Israeli-American", "South African", "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese",
    ].includes(obj.nationality)
  );
}

async function getActress (id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error("Dati non validi");
    } else {
      return dati;
    }
  } catch (error) {
    console.error("Errore nella chiamata API:", error);
    return null;
  }
}

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:
// GET /actresses
// La funzione deve restituire un array di oggetti Actress.
// Può essere anche un array vuoto.

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`);
    if (!response.ok) {
      throw new Error("Errore nella chiamata API");
    }
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error("Dati non validi");
    }
    const actresses: Actress[] = dati.filter(isActress);
    return actresses;
  } catch (error) {
    console.error("Errore nella chiamata API:", error);
    return [];
  }
}

// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
  const promises = ids.map(id => getActress(id));
  const actresses = await Promise.all(promises);
  return actresses;
} catch (error) {
  console.error("Errore nel recupero delle attrici:", error);
  return [];
}
}

// 🎯 BONUS 1
// Crea le funzioni:

// createActress
// updateActress

// Utilizza gli Utility Types:

// Omit: per creare un'attrice senza passare id, che verrà generato casualmente.
// Partial: per permettere l’aggiornamento di qualsiasi proprietà tranne id e name.

function createActress(data: Omit<Actress, "id">): Actress {
  return {
    ...data,
    id: Math.floor(Math.random() * 10000),
  };
}

function updateActress( actress: Actress, updates: Partial<Actress>): Actress {
  return {
    ...actress,
    ...updates,
    id: actress.id,
    name: actress.name,
  };
}

// 🎯 BONUS 2
// Crea un tipo Actor, che estende Person con le seguenti differenze rispetto ad Actress:

// known_for: una tuple di 3 stringhe
// awards: array di una o due stringhe
// nationality: le stesse di Actress più:
// Scottish, New Zealand, Hong Kong, German, Canadian, Irish.

// Implementa anche le versioni getActor, getAllActors, getActors, createActor, updateActor.

type Actor = Person & {
  known_for: [string, string, string];
  awards: [string] | [string, string];
  nationality: "American" | "British" | "Australian" | "Israeli-American" |
    "South African" | "French" | "Indian" | "Israeli" | "Spanish" |
    "South Korean" | "Chinese" | "Scottish" | "New Zealand" | "Hong Kong" |
    "German" | "Canadian" | "Irish";
};

function isActor(dati: unknown): dati is Actor {
  if (!isPerson(dati)) {
    return false;
  }

  const obj = dati as Record<string, unknown>;

  return (
    Array.isArray(obj.known_for) &&
    obj.known_for.length === 3 &&
    obj.known_for.every(movie => typeof movie === "string") &&
    Array.isArray(obj.awards) &&
    (obj.awards.length === 1 || obj.awards.length === 2) &&
    obj.awards.every(award => typeof award === "string") &&
    typeof obj.nationality === "string" &&
    [ "American", "British", "Australian", "Israeli-American", "South African", "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese", "Scottish", "New Zealand", "Hong Kong", "German", "Canadian", "Irish"
    ].includes(obj.nationality)
  );
}

async function getActor (id: number): Promise<Actor | null> {
  try {
    const response = await fetch(`http://localhost:3333/actors/${id}`);
    const dati: unknown = await response.json();
    if (!isActor(dati)) {
      throw new Error("Dati non validi");
    } else {
      return dati;
    }
  } catch (error) {
    console.error("Errore nella chiamata API:", error);
    return null;
  }
}

async function getAllActors(): Promise<Actor[]> {
  try {
    const response = await fetch(`http://localhost:3333/actors`);
    if (!response.ok) {
      throw new Error("Errore nella chiamata API");
    }
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error("Dati non validi");
    }
    const actors: Actor[] = dati.filter(isActor);
    return actors;
  } catch (error) {
    console.error("Errore nella chiamata API:", error);
    return [];
  }
}

async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
  const promises = ids.map(id => getActor(id));
  const actors = await Promise.all(promises);
  return actors;
  } catch (error) {
  console.error("Errore nel recupero degli attori:", error);
  return [];
  }
}

function createActor(data: Omit<Actor, "id">): Actor {
  return {
    ...data,
    id: Math.floor(Math.random() * 10000),
  };
}

function updateActor(actor: Actor, updates: Partial<Actor>): Actor {
  return {
    ...actor,
    ...updates,
    id: actor.id,
    name: actor.name,
  };
}

// 🎯 BONUS 3
// Crea la funzione createRandomCouple che usa getAllActresses e getAllActors per restituire un’array che ha sempre 
// due elementi: al primo posto una Actress casuale e al secondo posto un Actor casuale.

async function createRandomCouple(): Promise<[Actress, Actor] | null> {
  const [actresses, actors] = await Promise.all([getAllActresses(), getAllActors()]);
  if (actresses.length === 0 || actors.length === 0) {
    return null;
  }
  const randomActress = actresses[Math.floor(Math.random() * actresses.length)];
  const randomActor = actors[Math.floor(Math.random() * actors.length)];
  return [randomActress, randomActor];
}

// Esempi di utilizzo Actress
getActress(1).then(actress => console.log(actress));
getAllActresses().then(actresses => console.log(actresses));
getActresses([1, 2, 3]).then(actresses => console.log(actresses));

// Esempi di utilizzo Actor
getActor(1).then(actor => console.log(actor));
getAllActors().then(actors => console.log(actors));
getActors([1, 2, 3]).then(actors => console.log(actors));

// Esempio di utilizzo createRandomCouple
createRandomCouple().then(couple => console.log(couple));
