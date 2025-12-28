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

function isActress(dati: unknown): dati is Actress {
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
    typeof obj.image === "string" &&
    Array.isArray(obj.most_famous_movies) &&
    obj.most_famous_movies.length === 3 &&
    obj.most_famous_movies.every(movie => typeof movie === "string") &&
    typeof obj.awards === "string" &&
    typeof obj.nationality === "string" &&
    [
      "American",
      "British",
      "Australian",
      "Israeli-American",
      "South African",
      "French",
      "Indian",
      "Israeli",
      "Spanish",
      "South Korean",
      "Chinese",
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

// Esempi di utilizzo (puoi rimuoverli in produzione)
getActress(1).then(actress => console.log(actress));
getAllActresses().then(actresses => console.log(actresses));
getActresses([1, 2, 3]).then(actresses => console.log(actresses));
