export type NatoEntry = {
  char: string;
  word: string;
  pronunciation: string;
};

export const NATO_LETTERS: NatoEntry[] = [
  { char: "A", word: "Alfa", pronunciation: "AL-fah" },
  { char: "B", word: "Bravo", pronunciation: "BRAH-voh" },
  { char: "C", word: "Charlie", pronunciation: "CHAR-lee" },
  { char: "D", word: "Delta", pronunciation: "DELL-tah" },
  { char: "E", word: "Echo", pronunciation: "ECK-oh" },
  { char: "F", word: "Foxtrot", pronunciation: "FOKS-trot" },
  { char: "G", word: "Golf", pronunciation: "GOLF" },
  { char: "H", word: "Hotel", pronunciation: "hoh-TELL" },
  { char: "I", word: "India", pronunciation: "IN-dee-ah" },
  { char: "J", word: "Juliett", pronunciation: "JEW-lee-ett" },
  { char: "K", word: "Kilo", pronunciation: "KEY-loh" },
  { char: "L", word: "Lima", pronunciation: "LEE-mah" },
  { char: "M", word: "Mike", pronunciation: "MIKE" },
  { char: "N", word: "November", pronunciation: "no-VEM-ber" },
  { char: "O", word: "Oscar", pronunciation: "OSS-cah" },
  { char: "P", word: "Papa", pronunciation: "pah-PAH" },
  { char: "Q", word: "Quebec", pronunciation: "keh-BECK" },
  { char: "R", word: "Romeo", pronunciation: "ROW-me-oh" },
  { char: "S", word: "Sierra", pronunciation: "see-AIR-rah" },
  { char: "T", word: "Tango", pronunciation: "TANG-go" },
  { char: "U", word: "Uniform", pronunciation: "YOU-nee-form" },
  { char: "V", word: "Victor", pronunciation: "VIK-tah" },
  { char: "W", word: "Whiskey", pronunciation: "WISS-key" },
  { char: "X", word: "X-ray", pronunciation: "ECKS-ray" },
  { char: "Y", word: "Yankee", pronunciation: "YANG-key" },
  { char: "Z", word: "Zulu", pronunciation: "ZOO-loo" },
];

export const NATO_DIGITS: NatoEntry[] = [
  { char: "0", word: "Nadazero", pronunciation: "NAH-dah-ZAY-roh" },
  { char: "1", word: "Unaone", pronunciation: "OO-nah-WUN" },
  { char: "2", word: "Bissotwo", pronunciation: "BEES-soh-TOO" },
  { char: "3", word: "Terrathree", pronunciation: "TAY-rah-TREE" },
  { char: "4", word: "Kartefour", pronunciation: "KAR-tay-FOWER" },
  { char: "5", word: "Pantafive", pronunciation: "PAN-tah-FIVE" },
  { char: "6", word: "Soxisix", pronunciation: "SOK-see-SIX" },
  { char: "7", word: "Setteseven", pronunciation: "SAY-tay-SEVEN" },
  { char: "8", word: "Oktoeight", pronunciation: "OK-toh-AIT" },
  { char: "9", word: "Novenine", pronunciation: "NO-vay-NINER" },
];

/**
 * Plausible non-NATO words that share each letter's initial. Used as quiz
 * distractors so every choice starts with the prompt letter — you can't win by
 * matching first letters; you have to actually know the NATO word.
 */
export const DECOYS: Record<string, string[]> = {
  A: ["Anchor", "Apollo", "Atlas", "Aspen"],
  B: ["Boston", "Bishop", "Bronze", "Bengal"],
  C: ["Cobra", "Canyon", "Cairo", "Comet"],
  D: ["Denver", "Dallas", "Diamond", "Dragon"],
  E: ["Eagle", "Everest", "Ember", "Edison"],
  F: ["Falcon", "Forest", "Fresno", "Fusion"],
  G: ["Gamma", "Garden", "Geneva", "Granite"],
  H: ["Harbor", "Havana", "Hunter", "Horizon"],
  I: ["Iceland", "Indigo", "Igloo", "Ivory"],
  J: ["Jupiter", "Jasmine", "Jaguar", "Jordan"],
  K: ["Kansas", "Kelvin", "Kodiak", "Karat"],
  L: ["London", "Lincoln", "Legend", "Lotus"],
  M: ["Metro", "Mango", "Madrid", "Marble"],
  N: ["Nectar", "Nevada", "Nimbus", "Nomad"],
  O: ["Orbit", "Ontario", "Olive", "Omega"],
  P: ["Panama", "Pluto", "Pepper", "Phoenix"],
  Q: ["Quartz", "Quasar", "Quiver", "Quantum"],
  R: ["Rocket", "Raven", "Ranger", "Rio"],
  S: ["Sonar", "Saturn", "Sahara", "Silver"],
  T: ["Tokyo", "Titan", "Timber", "Tundra"],
  U: ["Uranus", "Utah", "Umbra", "Union"],
  V: ["Vector", "Vegas", "Voyage", "Velvet"],
  W: ["Willow", "Winter", "Wizard", "Wagon"],
  X: ["Xenon", "Xylophone", "Xander", "Ximena"],
  Y: ["Yellow", "Yukon", "Yonder", "Yodel"],
  Z: ["Zebra", "Zenith", "Zephyr", "Zodiac"],
};

const LETTER_MAP: Record<string, NatoEntry> = Object.fromEntries(
  [...NATO_LETTERS, ...NATO_DIGITS].map((e) => [e.char, e]),
);

export type SpellToken =
  | { kind: "nato"; input: string; entry: NatoEntry }
  | { kind: "space" }
  | { kind: "other"; input: string };

/**
 * Turn arbitrary user text into a spellable token stream.
 * Letters and digits map to NATO words; spaces and punctuation pass through
 * visibly so a spoken confirmation code keeps its shape.
 */
export function spell(input: string): SpellToken[] {
  const tokens: SpellToken[] = [];
  for (const raw of input) {
    if (raw === " ") {
      tokens.push({ kind: "space" });
      continue;
    }
    const key = raw.toUpperCase();
    const entry = LETTER_MAP[key];
    if (entry) {
      tokens.push({ kind: "nato", input: raw, entry });
    } else {
      tokens.push({ kind: "other", input: raw });
    }
  }
  return tokens;
}

/** Spoken form: "Lima Uniform India Sierra". Non-letters render literally. */
export function spokenForm(input: string): string {
  return spell(input)
    .map((t) => {
      if (t.kind === "nato") return t.entry.word;
      if (t.kind === "space") return "/";
      return t.input;
    })
    .filter((s) => s.trim().length > 0)
    .join(" ");
}
