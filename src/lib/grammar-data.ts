export interface GrammarExample {
  de: string;
  en: string;
}

export interface GrammarExercise {
  prompt: string;
  answer: string;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface GrammarChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  // A1/A2 style fields
  explanation?: string;
  rule?: string;
  table?: GrammarTable;
  notes?: string[];
  // B1+ style fields
  icon?: string;
  difficulty?: "easy" | "medium" | "hard";
  estimatedMinutes?: number;
  tags?: string[];
  theory?: { heading: string; body: string }[];
  // Shared
  examples: GrammarExample[];
  mistakes: string[];
  exercises: GrammarExercise[];
  speakingPrompts: string[];
  summary: string;
  aiPrompt: string;
  cefrLevel?: string;
  color?: string;
}

// ─── A0: Grundlagen ───────────────────────────────────────────────────────────
export const A0_GRAMMAR_CHAPTERS: GrammarChapter[] = [
  {
    id: "a0-ch01",
    number: 1,
    title: "German Sounds",
    subtitle: "Pronunciation & Phonetics",
    explanation:
      "German pronunciation is very consistent — once you learn the rules, every word is pronounced exactly as written. Key sounds differ from English, especially the umlauts (ä, ö, ü) and the letter combinations ch, sch, and st.",
    rule:
      "ä = 'eh' like in 'bed' · ö = round lips and say 'e' · ü = round lips and say 'ee' · ch = soft 'kh' after e/i, guttural after a/o/u · sch = 'sh' · st/sp at start = 'sht'/'shp'",
    table: {
      headers: ["Letter/Combo", "Sound", "Example", "Meaning"],
      rows: [
        ["ä", "eh (like 'bed')", "Bär", "bear"],
        ["ö", "ur (lips rounded)", "schön", "beautiful"],
        ["ü", "ew (lips rounded)", "über", "over/above"],
        ["ß (Eszett)", "ss", "Straße", "street"],
        ["ch (after e/i)", "soft, like 'hue'", "ich", "I"],
        ["ch (after a/o/u)", "guttural 'kh'", "Buch", "book"],
        ["sch", "sh", "Schule", "school"],
        ["sp / st (start)", "shp / sht", "sprechen / Stadt", "speak / city"],
        ["ei", "eye", "Eis", "ice cream"],
        ["ie", "ee", "lieben", "to love"],
        ["eu / äu", "oy", "Freude", "joy"],
      ],
    },
    notes: [
      "German vowels are pure — no diphthong glide at the end (unlike English).",
      "Every letter is pronounced. German has almost no silent letters.",
      "The letter 'v' sounds like English 'f' in most German words (Vater = FAH-ter).",
      "The letter 'w' sounds like English 'v' (Wasser = VAS-ser).",
      "The letter 'z' sounds like 'ts' (Zeit = TSAIT).",
    ],
    examples: [
      { de: "Ich heiße Anna.", en: "My name is Anna. (note: heiße has ß)" },
      { de: "Schön, Sie kennenzulernen.", en: "Nice to meet you. (sch + ö)" },
      { de: "Sprechen Sie Deutsch?", en: "Do you speak German? (sp = shp)" },
      { de: "Die Straße ist lang.", en: "The street is long. (ß = ss)" },
      { de: "Über den Wolken.", en: "Above the clouds. (ü sound)" },
    ],
    mistakes: [
      "Pronouncing 'w' as English 'w' — it should sound like 'v'.",
      "Pronouncing 'v' as English 'v' — it should sound like 'f' in most words.",
      "Ignoring the umlaut dots (ä/ö/ü) — they completely change the vowel sound.",
      "Treating 'ie' and 'ei' the same — 'ie' = ee, 'ei' = eye.",
    ],
    exercises: [
      { prompt: "How do you pronounce the German letter 'w'?", answer: "Like English 'v'" },
      { prompt: "What sound does 'sch' make?", answer: "sh (like 'sh' in 'shoe')" },
      { prompt: "How do you pronounce 'ei'?", answer: "Like English 'eye' (as in 'Eis' = ice)" },
      { prompt: "What does 'ß' (Eszett) sound like?", answer: "Like 'ss'" },
      { prompt: "How is 'sp' pronounced at the start of a German word?", answer: "'shp' (like 'shp' in 'Sprechen')" },
    ],
    speakingPrompts: [
      "Say these words aloud: Schule, sprechen, über, schön, Straße.",
      "Practise: 'Ich spreche ein bisschen Deutsch.' (I speak a little German.)",
      "Try tongue twisters: 'Fischers Fritze fischt frische Fische.'",
    ],
    summary:
      "German spelling and pronunciation are highly consistent. Master the umlauts (ä, ö, ü), the ch/sch/ß sounds, and the w=v / v=f rule, and you can pronounce almost any German word correctly.",
    aiPrompt:
      "Quiz me on German pronunciation rules: umlauts, sch, ch, ei vs ie, w vs v, and ß. Give me words to pronounce and explain the rules when I get them wrong.",
  },
  {
    id: "a0-ch02",
    number: 2,
    title: "The Alphabet",
    subtitle: "Das Alphabet",
    explanation:
      "The German alphabet has 26 letters — the same as English — plus 4 extra characters: ä, ö, ü (umlauts) and ß (Eszett). Knowing the alphabet lets you spell your name, understand abbreviations, and look up words in a dictionary.",
    rule:
      "26 standard letters + ä, ö, ü, ß · Most letters sound different from English · Learn the alphabet song to memorise letter names · ß = 'ss', used in Switzerland as 'ss'",
    table: {
      headers: ["Letter", "German Name (approx.)", "Letter", "German Name (approx.)"],
      rows: [
        ["A a", "ah", "N n", "en"],
        ["B b", "bay", "O o", "oh"],
        ["C c", "tsay", "P p", "pay"],
        ["D d", "day", "Q q", "koo"],
        ["E e", "ay", "R r", "err"],
        ["F f", "eff", "S s", "ess"],
        ["G g", "gay", "T t", "tay"],
        ["H h", "hah", "U u", "oo"],
        ["I i", "ee", "V v", "fow"],
        ["J j", "yot", "W w", "vay"],
        ["K k", "kah", "X x", "iks"],
        ["L l", "ell", "Y y", "üp-si-lon"],
        ["M m", "em", "Z z", "tset"],
        ["Ä ä", "ah-umlaut", "Ö ö", "oh-umlaut"],
        ["Ü ü", "oo-umlaut", "ß", "ess-tset"],
      ],
    },
    notes: [
      "When spelling out loud, Germans say the letter names — e.g. your name 'Anna' = 'Ah-En-En-Ah'.",
      "The letter J is pronounced 'yot' and sounds like English 'y' (ja = yes).",
      "The letter Z sounds like 'ts' — Zeit (time) = TSAIT.",
      "In Switzerland, ß is replaced by 'ss' — Straße becomes Strasse.",
      "Umlauts (ä, ö, ü) are sometimes written as ae, oe, ue when special characters aren't available.",
    ],
    examples: [
      { de: "Wie schreibt man das? — A-N-N-A", en: "How do you spell that? — A-N-N-A" },
      { de: "Mein Name ist Schmidt: S-C-H-M-I-D-T", en: "My name is Schmidt: S-C-H-M-I-D-T" },
      { de: "Das ist ein Ü — Ü wie Übung.", en: "That's a Ü — Ü as in Übung (exercise)." },
      { de: "Z wie Zebra.", en: "Z as in Zebra." },
    ],
    mistakes: [
      "Pronouncing J as English 'j' (jay) — it's 'yot', sounds like 'y'.",
      "Pronouncing Z as English 'z' — it's 'ts'.",
      "Forgetting that V sounds like 'f' in most German words.",
      "Mixing up ä/a, ö/o, ü/u — the umlauts are distinct letters with different sounds.",
    ],
    exercises: [
      { prompt: "Spell your first name using German letter names.", answer: "Practice saying each letter with its German pronunciation." },
      { prompt: "What does the letter 'J' sound like in German?", answer: "'yot' — sounds like English 'y'" },
      { prompt: "How many extra characters does German have beyond the standard 26?", answer: "4: ä, ö, ü, ß" },
      { prompt: "What is the German name for the letter Z?", answer: "tset (sounds like 'ts')" },
    ],
    speakingPrompts: [
      "Recite the German alphabet from A to Z.",
      "Spell your full name using German letter names.",
      "Spell these words: Deutsch, Schule, München.",
    ],
    summary:
      "German uses the same 26 letters as English, plus ä, ö, ü, and ß. Key differences: J = y sound, Z = ts sound, V = f sound, W = v sound. The umlauts are completely separate letters — never skip the dots.",
    aiPrompt:
      "Help me practise the German alphabet. Give me words to spell out letter by letter using German letter names, and correct me if I use wrong letter names.",
  },
  {
    id: "a0-ch03",
    number: 3,
    title: "Numbers 0–20",
    subtitle: "Zahlen 0–20",
    explanation:
      "Numbers are essential from day one — for telling time, prices, ages, phone numbers, and addresses. German numbers follow a clear pattern after 12, making them easy to learn systematically.",
    rule:
      "0–12: unique words (learn by heart) · 13–19: add '-zehn' (ten) to the base number · Exception: 16 = sechzehn (not sechszehn), 17 = siebzehn (not siebenzehn) · 20 = zwanzig",
    table: {
      headers: ["Number", "German", "Number", "German"],
      rows: [
        ["0", "null", "11", "elf"],
        ["1", "eins", "12", "zwölf"],
        ["2", "zwei", "13", "dreizehn"],
        ["3", "drei", "14", "vierzehn"],
        ["4", "vier", "15", "fünfzehn"],
        ["5", "fünf", "16", "sechzehn"],
        ["6", "sechs", "17", "siebzehn"],
        ["7", "sieben", "18", "achtzehn"],
        ["8", "acht", "19", "neunzehn"],
        ["9", "neun", "20", "zwanzig"],
        ["10", "zehn", "", ""],
      ],
    },
    notes: [
      "16 is 'sechzehn' — the 's' from 'sechs' drops before '-zehn'.",
      "17 is 'siebzehn' — the 'en' from 'sieben' drops before '-zehn'.",
      "In German, 'zwei' (2) is sometimes said as 'zwo' on the phone to avoid confusion with 'drei' (3).",
      "'eins' is used when counting (eins, zwei, drei…). When saying '1 apple', use 'ein/eine' depending on gender.",
      "German phone numbers are often read in pairs: 06 21 = 'null sechs, ein und zwanzig'.",
    ],
    examples: [
      { de: "Ich bin 25 Jahre alt.", en: "I am 25 years old." },
      { de: "Das kostet 15 Euro.", en: "That costs 15 euros." },
      { de: "Meine Nummer ist 0176 12 34 56 7.", en: "My number is 0176 12 34 56 7." },
      { de: "Es ist 8 Uhr.", en: "It is 8 o'clock." },
      { de: "Ich wohne in der Mozartstraße 7.", en: "I live at 7 Mozart Street." },
    ],
    mistakes: [
      "Saying 'sechszehn' instead of 'sechzehn' (drop the 's').",
      "Saying 'siebenzehn' instead of 'siebzehn' (drop the 'en').",
      "Confusing 'zwei' and 'drei' — on the phone, use 'zwo' for 2.",
      "Using 'eins' when counting objects — use 'ein/eine' with nouns instead.",
    ],
    exercises: [
      { prompt: "How do you say '16' in German?", answer: "sechzehn" },
      { prompt: "How do you say '17' in German?", answer: "siebzehn" },
      { prompt: "Count from 1 to 10 in German.", answer: "eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn" },
      { prompt: "How do you say '0' in German?", answer: "null" },
      { prompt: "What is the German word for '20'?", answer: "zwanzig" },
    ],
    speakingPrompts: [
      "Count from 0 to 20 in German without looking.",
      "Say your age in German: 'Ich bin ___ Jahre alt.'",
      "Say a phone number digit by digit in German.",
    ],
    summary:
      "0–12 are unique words to memorise. 13–19 follow the pattern: base + zehn. Watch out for sechzehn (not sechszehn) and siebzehn (not siebenzehn). 20 = zwanzig.",
    aiPrompt:
      "Quiz me on German numbers 0–20. Say a number in English and ask me to say it in German, then correct me and explain any exceptions like 16 or 17.",
  },
];

export const GRAMMAR_CHAPTERS: GrammarChapter[] = [
  {
    id: "ch01",
    number: 1,
    title: "Personal Pronouns",
    subtitle: "Nominative",
    explanation:
      "Personal pronouns replace names. In German, you must pick the right pronoun based on who you are talking about. The nominative pronouns are used for the subject of a sentence — the person doing the action.",
    rule:
      "ich (I) · du (you, informal) · er (he) · sie (she) · es (it) · wir (we) · ihr (you all, informal) · sie (they) · Sie (you, formal)",
    table: {
      headers: ["Pronoun", "German", "Usage"],
      rows: [
        ["I", "ich", "speaker"],
        ["you (informal)", "du", "friend/family/child"],
        ["he", "er", "male person or thing"],
        ["she", "sie", "female person or thing"],
        ["it", "es", "neuter thing"],
        ["we", "wir", "speaker + others"],
        ["you (plural)", "ihr", "group, informal"],
        ["they", "sie", "multiple people"],
        ["you (formal)", "Sie", "strangers, bosses — always capitalized"],
      ],
    },
    notes: [
      '"Sie" (formal you) is always capitalized, even in the middle of a sentence.',
      '"sie" (lowercase) means either she or they — context tells you which.',
      "Use du for friends, family, and children. Use Sie for strangers, bosses, and formal situations.",
    ],
    examples: [
      { de: "Ich lerne Deutsch.", en: "I am learning German." },
      { de: "Du sprichst gut.", en: "You speak well." },
      { de: "Er kommt aus Berlin.", en: "He comes from Berlin." },
      { de: "Sie ist Lehrerin.", en: "She is a teacher." },
      { de: "Es ist kalt.", en: "It is cold." },
      { de: "Wir gehen ins Kino.", en: "We are going to the cinema." },
      { de: "Ihr seid müde.", en: "You all are tired." },
      { de: "Sie kommen morgen.", en: "They are coming tomorrow." },
      { de: "Sie sprechen Deutsch.", en: "You speak German. (formal)" },
    ],
    mistakes: [
      "Don't write 'ich' with a capital I (unlike English). Only capitalize at the start of a sentence.",
      "Don't confuse 'sie' (she/they) with 'Sie' (formal you).",
      "Don't use 'du' when speaking formally — always use 'Sie' with strangers.",
    ],
    exercises: [
      { prompt: "Fill in: ___ lerne Deutsch. (I)", answer: "Ich" },
      { prompt: "Fill in: ___ kommt aus Berlin. (He)", answer: "Er" },
      { prompt: "Fill in: ___ gehen ins Kino. (We)", answer: "Wir" },
      { prompt: "Translate: You speak well. (informal)", answer: "Du sprichst gut." },
      { prompt: "Translate: She is tired.", answer: "Sie ist müde." },
    ],
    speakingPrompts: [
      "Say aloud: Ich bin [your name]. Ich komme aus [your city].",
      "Say aloud all 9 pronouns with their English meaning.",
      "Make a sentence for each pronoun.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 1: Personal Pronouns (Nominative).

The 9 German pronouns are: ich (I), du (you, informal), er (he), sie (she), es (it), wir (we), ihr (you all), sie (they), Sie (you, formal — always capitalized).

Key rules:
- Use du for friends/family, Sie for strangers/bosses
- 'sie' lowercase = she or they (context tells you which)
- 'ich' is NOT capitalized in German

Please drill me with these exercise types:
1. Fill-in-the-blank: give me a sentence with ___ and I pick the correct pronoun
2. Translate a short English sentence using the right pronoun
3. Spot-the-mistake: show me a wrong sentence and I correct it

Start with 5 drills, one at a time. Wait for my answer before continuing. Give me immediate feedback — say if I'm right/wrong and explain why. Keep it beginner-friendly. Auf geht's!`,
    summary:
      "9 pronouns: ich du er sie es wir ihr sie Sie. Nominative = subject. 'Sie' (formal) always capitalized. 'sie' = she or they.",
  },
  {
    id: "ch02",
    number: 2,
    title: "Nominative Case",
    subtitle: "Articles & Gender",
    explanation:
      "Every German noun has a grammatical gender: masculine (der), feminine (die), or neuter (das). The article you use depends on the gender. In the nominative case, the noun is the subject — the one doing the action.",
    rule:
      "Definite: der (m) · die (f) · das (n) · die (pl)\nIndefinite: ein (m/n) · eine (f) · no plural form",
    table: {
      headers: ["Gender", "Definite", "Indefinite", "Example"],
      rows: [
        ["Masculine (m)", "der", "ein", "der Hund / ein Hund"],
        ["Feminine (f)", "die", "eine", "die Frau / eine Frau"],
        ["Neuter (n)", "das", "ein", "das Kind / ein Kind"],
        ["Plural (pl)", "die", "—", "die Kinder / — Kinder"],
      ],
    },
    notes: [
      "All German nouns are capitalized: der Hund, die Frau, das Kind.",
      "Grammatical gender must be memorized with each noun.",
      "There is no indefinite article for plurals (just use the noun alone or 'keine').",
    ],
    examples: [
      { de: "Der Hund schläft.", en: "The dog is sleeping. (masc.)" },
      { de: "Die Frau arbeitet.", en: "The woman is working. (fem.)" },
      { de: "Das Kind spielt.", en: "The child is playing. (neut.)" },
      { de: "Die Kinder spielen.", en: "The children are playing. (plural)" },
      { de: "Ein Mann ist hier.", en: "A man is here." },
      { de: "Eine Frau ist hier.", en: "A woman is here." },
      { de: "Das Handy ist neu.", en: "The phone is new." },
    ],
    mistakes: [
      "Don't guess gender — learn der/die/das with every new noun.",
      "Don't forget to capitalize all nouns.",
      "There's no 'eine' for plural — just say 'Kinder spielen' or 'keine Kinder'.",
    ],
    exercises: [
      { prompt: "Fill in: ___ Hund schläft. (The, masc.)", answer: "Der" },
      { prompt: "Fill in: ___ Frau ist hier. (A, fem.)", answer: "Eine" },
      { prompt: "Fill in: ___ Kind spielt. (The, neut.)", answer: "Das" },
      { prompt: "Translate: The dog is new.", answer: "Der Hund ist neu." },
      { prompt: "Translate: A woman is here.", answer: "Eine Frau ist hier." },
    ],
    speakingPrompts: [
      "Say: Der Mann, die Frau, das Kind — and point to something for each.",
      "Name 5 objects around you with their correct article.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 2: Nominative Case — Articles & Gender.

German has 3 grammatical genders:
- Masculine: der Hund, ein Mann
- Feminine: die Frau, eine Katze  
- Neuter: das Kind, ein Buch
- Plural: die Kinder (no indefinite article)

Key rules:
- All German nouns are capitalized
- Gender must be memorized with each noun — there are no reliable rules
- Indefinite article for m/n = ein, for f = eine, no plural form

Please drill me with:
1. Give me a noun and I say the correct article (der/die/das)
2. Give me a sentence with ___ and I fill in the right article
3. Spot-the-mistake: find the wrong article
4. Translate short sentences with articles

Do 5 drills one at a time. Wait for my answer, then give feedback and explain the gender. Auf geht's!`,
    summary:
      "3 genders: der (m) die (f) das (n). Plural = die. Indefinite: ein / eine. All nouns capitalized. Learn gender with every noun.",
  },
  {
    id: "ch03",
    number: 3,
    title: "Present Tense",
    subtitle: "Regular Verbs",
    explanation:
      "To conjugate a regular verb in German, remove '-en' from the infinitive to get the stem, then add the correct ending for each pronoun.",
    rule:
      "Stem + endings:\nich → -e · du → -st · er/sie/es → -t · wir → -en · ihr → -t · sie/Sie → -en\n\nSpecial rule: stems ending in -t or -d add an extra -e before the ending (du arbeitest, er arbeitet).",
    table: {
      headers: ["Pronoun", "Ending", "lernen", "wohnen", "arbeiten"],
      rows: [
        ["ich", "-e", "lerne", "wohne", "arbeite"],
        ["du", "-st", "lernst", "wohnst", "arbeitest"],
        ["er/sie/es", "-t", "lernt", "wohnt", "arbeitet"],
        ["wir", "-en", "lernen", "wohnen", "arbeiten"],
        ["ihr", "-t", "lernt", "wohnt", "arbeitet"],
        ["sie/Sie", "-en", "lernen", "wohnen", "arbeiten"],
      ],
    },
    notes: [
      "The infinitive (dictionary form) almost always ends in -en.",
      "ich and wir/sie/Sie share the same endings (-e and -en).",
      "Verbs with stems in -t/-d: arbeit→, red→ insert an 'e' for pronunciation.",
    ],
    examples: [
      { de: "Ich lerne Deutsch.", en: "I learn German." },
      { de: "Du lernst schnell.", en: "You learn quickly." },
      { de: "Er lernt jeden Tag.", en: "He learns every day." },
      { de: "Wir lernen zusammen.", en: "We learn together." },
      { de: "Ihr lernt gut.", en: "You all learn well." },
      { de: "Sie lernen Englisch.", en: "They learn English." },
      { de: "Du arbeitest viel.", en: "You work a lot." },
      { de: "Er arbeitet hier.", en: "He works here." },
    ],
    mistakes: [
      "Don't forget to remove '-en' first: lern-en → lern-.",
      "Don't add extra endings: NOT 'du lernest' — just 'du lernst'.",
      "Don't forget the extra -e in arbeit-e-st, red-e-t.",
    ],
    exercises: [
      { prompt: "Conjugate 'lernen' for 'er'.", answer: "er lernt" },
      { prompt: "Conjugate 'spielen' for 'wir'.", answer: "wir spielen" },
      { prompt: "Conjugate 'arbeiten' for 'du'.", answer: "du arbeitest" },
      { prompt: "Conjugate 'wohnen' for 'sie' (they).", answer: "sie wohnen" },
      { prompt: "Translate: She plays football.", answer: "Sie spielt Fußball." },
    ],
    speakingPrompts: [
      "Conjugate 'spielen' aloud for all 9 pronouns.",
      "Say: Ich wohne in [city]. Ich lerne Deutsch.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 3: Present Tense — Regular Verb Conjugation.

How to conjugate: Remove -en from the infinitive → add endings:
- ich → -e (lerne)
- du → -st (lernst)
- er/sie/es → -t (lernt)
- wir → -en (lernen)
- ihr → -t (lernt)
- sie/Sie → -en (lernen)

Special rule: stems ending in -t or -d insert an extra -e:
- arbeiten → du arbeitest, er arbeitet
- reden → du redest, er redet

Verbs to practice: lernen, wohnen, spielen, kaufen, hören, machen, arbeiten, kochen

Please drill me with:
1. Give me verb + pronoun → I conjugate it
2. Fill-in-the-blank sentence
3. Translate sentences using regular verbs
4. Spot-the-mistake

5 drills, one at a time. Wait for my answer. Give feedback with explanation. Auf geht's!`,
    summary:
      "Remove -en → add: -e -st -t -en -t -en. Stems in -t/-d insert extra -e. Verb goes in position 2.",
  },
  {
    id: "ch04",
    number: 4,
    title: "Irregular Verbs",
    subtitle: "Strong Verb Vowel Changes",
    explanation:
      "Some German verbs change their stem vowel in the du and er/sie/es forms. These are called strong verbs. You must memorize these — they don't follow the regular pattern.",
    rule:
      "Vowel changes:\na → ä (fahren, schlafen, waschen, tragen)\ne → i (sprechen, treffen, nehmen)\ne → ie (lesen, sehen)\n\nChange only happens for du and er/sie/es forms.",
    table: {
      headers: ["Verb", "ich", "du ⚡", "er/sie/es ⚡", "wir"],
      rows: [
        ["fahren (a→ä)", "fahre", "fährst", "fährt", "fahren"],
        ["schlafen (a→ä)", "schlafe", "schläfst", "schläft", "schlafen"],
        ["sprechen (e→i)", "spreche", "sprichst", "spricht", "sprechen"],
        ["lesen (e→ie)", "lese", "liest", "liest", "lesen"],
        ["sehen (e→ie)", "sehe", "siehst", "sieht", "sehen"],
        ["nehmen (irreg.)", "nehme", "nimmst", "nimmt", "nehmen"],
      ],
    },
    notes: [
      "ich, wir, ihr, sie/Sie forms stay regular — only du and er/sie/es change.",
      "'nehmen' is extra irregular: du nimmst, er nimmt.",
      "Always learn strong verbs with their vowel change noted.",
    ],
    examples: [
      { de: "Ich fahre nach Berlin.", en: "I drive to Berlin." },
      { de: "Du fährst schnell.", en: "You drive fast." },
      { de: "Er schläft lange.", en: "He sleeps long." },
      { de: "Du sprichst gut.", en: "You speak well." },
      { de: "Er spricht Deutsch.", en: "He speaks German." },
      { de: "Ich lese ein Buch.", en: "I read a book." },
      { de: "Du liest viel.", en: "You read a lot." },
      { de: "Sie sieht fern.", en: "She watches TV." },
      { de: "Er nimmt den Bus.", en: "He takes the bus." },
    ],
    mistakes: [
      "Don't apply vowel change to ich or wir: NOT 'ich fähre' — correct: 'ich fahre'.",
      "Don't forget 'nehmen': du nimmst (not 'nehmst'), er nimmt.",
      "'treffen' → du triffst, er trifft (double ff).",
    ],
    exercises: [
      { prompt: "Conjugate 'fahren' for 'du'.", answer: "du fährst" },
      { prompt: "Conjugate 'schlafen' for 'er'.", answer: "er schläft" },
      { prompt: "Conjugate 'lesen' for 'sie' (she).", answer: "sie liest" },
      { prompt: "Conjugate 'nehmen' for 'du'.", answer: "du nimmst" },
      { prompt: "Translate: He speaks German.", answer: "Er spricht Deutsch." },
    ],
    speakingPrompts: [
      "Say: Ich spreche Deutsch. Du sprichst gut. Er spricht langsam.",
      "Conjugate 'fahren' aloud for all pronouns.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 4: Irregular Verbs — Strong Verb Vowel Changes.

Strong verbs change their stem vowel ONLY in du and er/sie/es forms. The ich, wir, ihr, sie forms are regular.

Vowel change patterns:
- a → ä: fahren (du fährst, er fährt), schlafen (du schläfst), tragen (du trägst)
- e → i: sprechen (du sprichst, er spricht), treffen (du triffst), nehmen (du nimmst — extra irregular!)
- e → ie: lesen (du liest, er liest), sehen (du siehst, er sieht)

Critical: nehmen → du nimmst, er nimmt (not 'nehmst'!)

Please drill me with:
1. Give me a strong verb + pronoun → I conjugate it
2. Fill-in-the-blank with a strong verb
3. Full conjugation: give me a verb and I conjugate all 6 forms
4. Spot-the-mistake

5 drills, one at a time. Correct me immediately. Focus especially on nehmen — it's tricky. Auf geht's!`,
    summary:
      "Strong verbs change stem vowel in du/er forms only. a→ä, e→i, e→ie. 'nehmen' is extra irregular: nimmst/nimmt. Memorize these verbs.",
  },
  {
    id: "ch05",
    number: 5,
    title: "Sentence Structure",
    subtitle: "Verb in Position 2",
    explanation:
      "In German main clauses, the verb ALWAYS occupies the second position, no matter what comes first. If you move a time or place word to the front, the subject shifts after the verb.",
    rule:
      "Normal order: Subject (pos.1) + Verb (pos.2) + Rest\nInverted order: Time/Place (pos.1) + Verb (pos.2) + Subject + Rest\n\nVerb NEVER moves from position 2.",
    table: {
      headers: ["Position 1", "Position 2 (Verb)", "Position 3+"],
      rows: [
        ["Ich", "lerne", "heute Deutsch."],
        ["Heute", "lerne", "ich Deutsch."],
        ["Er", "spielt", "morgen Fußball."],
        ["Morgen", "spielt", "er Fußball."],
        ["Wir", "gehen", "jetzt ins Kino."],
        ["Jetzt", "gehen", "wir ins Kino."],
      ],
    },
    notes: [
      "Position 2 means the second 'chunk', not the second word.",
      "Time expressions like 'heute', 'morgen', 'jetzt' can go to position 1.",
      "This is called 'verb-second' (V2) word order — a core German rule.",
    ],
    examples: [
      { de: "Ich lerne heute Deutsch.", en: "I learn German today." },
      { de: "Heute lerne ich Deutsch.", en: "Today I learn German." },
      { de: "Er spielt morgen Fußball.", en: "He plays football tomorrow." },
      { de: "Morgen spielt er Fußball.", en: "Tomorrow he plays football." },
      { de: "Wir gehen jetzt ins Kino.", en: "We are going to the cinema now." },
      { de: "Jetzt gehen wir ins Kino.", en: "Now we are going to the cinema." },
    ],
    mistakes: [
      "WRONG: 'Heute ich lerne Deutsch.' — verb must be in position 2.",
      "WRONG: 'Morgen er spielt Fußball.' — after fronting, verb comes before subject.",
      "Don't move the verb to position 1 in statements (that's only for questions).",
    ],
    exercises: [
      { prompt: "Reorder: heute / ich / Deutsch / lerne", answer: "Heute lerne ich Deutsch." },
      { prompt: "Reorder: spielt / Fußball / morgen / er", answer: "Morgen spielt er Fußball." },
      { prompt: "Translate: Now she works.", answer: "Jetzt arbeitet sie." },
      { prompt: "Translate: Today we go to the cinema.", answer: "Heute gehen wir ins Kino." },
    ],
    speakingPrompts: [
      "Say: Heute lerne ich Deutsch. Morgen spiele ich Fußball.",
      "Take any sentence and put the time word first — say it aloud.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 5: Sentence Structure — Verb in Position 2 (V2 word order).

The core rule: In a German main clause, the VERB always occupies the SECOND position — no matter what comes first.

Normal order: Ich lerne heute Deutsch. (Subject → Verb → Rest)
Inverted: Heute lerne ich Deutsch. (Time word → Verb → Subject → Rest)

The verb NEVER moves from position 2. If you put something else at position 1, the subject shifts to position 3.

Time/place words that can go to position 1: heute, morgen, jetzt, dort, manchmal, oft, abends, in Berlin...

Please drill me with:
1. Scrambled words → I put them in the correct order
2. Sentence with time word at position 1 → I rewrite it inverted
3. Spot-the-mistake: I find where V2 rule is broken
4. Translate sentences (some with fronted elements)

5 drills, one at a time. For each answer, show me the position breakdown [1][2][3+]. Auf geht's!`,
    summary:
      "Verb ALWAYS in position 2. Move time/place to position 1 → subject follows verb. This is V2 word order.",
  },
  {
    id: "ch06",
    number: 6,
    title: "Questions",
    subtitle: "Yes/No & W-Questions",
    explanation:
      "To form a yes/no question, put the verb first. For information questions, start with a W-question word, then the verb, then the subject.",
    rule:
      "Yes/No: Verb + Subject + Rest?\nW-Question: W-word + Verb + Subject + Rest?\n\nW-words: was (what) · wo (where) · woher (from where) · wann (when) · wie (how) · wer (who) · warum (why) · wie viel (how much)",
    table: {
      headers: ["W-Word", "Meaning", "Example"],
      rows: [
        ["was", "what", "Was machst du?"],
        ["wo", "where", "Wo wohnst du?"],
        ["woher", "from where", "Woher kommst du?"],
        ["wann", "when", "Wann kommt er?"],
        ["wie", "how", "Wie heißt du?"],
        ["wer", "who", "Wer ist das?"],
        ["warum", "why", "Warum lernst du Deutsch?"],
        ["wie viel", "how much/many", "Wie viel kostet das?"],
      ],
    },
    notes: [
      "In yes/no questions the verb jumps to position 1.",
      "W-questions: the W-word is position 1, verb is still position 2.",
      "'Wer' is already the subject, so: 'Wer kommt?' — no separate subject needed.",
    ],
    examples: [
      { de: "Lernst du Deutsch?", en: "Are you learning German?" },
      { de: "Arbeitet er heute?", en: "Is he working today?" },
      { de: "Wo wohnst du?", en: "Where do you live?" },
      { de: "Was machst du?", en: "What are you doing?" },
      { de: "Woher kommst du?", en: "Where are you from?" },
      { de: "Wann kommt er?", en: "When is he coming?" },
      { de: "Wie heißt du?", en: "What is your name?" },
      { de: "Wer ist das?", en: "Who is that?" },
    ],
    mistakes: [
      "WRONG: 'Wo du wohnst?' — verb must come before subject in questions.",
      "Don't add 'do/does' translations — German questions just invert verb+subject.",
      "WRONG: 'Was du machst?' — W-word + verb + subject.",
    ],
    exercises: [
      { prompt: "Make a yes/no question: du / lernst / Deutsch", answer: "Lernst du Deutsch?" },
      { prompt: "Make a W-question: Wo / du / wohnst", answer: "Wo wohnst du?" },
      { prompt: "Translate: What is your name?", answer: "Wie heißt du?" },
      { prompt: "Translate: When does he come?", answer: "Wann kommt er?" },
      { prompt: "Translate: Where are you from?", answer: "Woher kommst du?" },
    ],
    speakingPrompts: [
      "Ask a classmate: Wie heißt du? Woher kommst du? Wo wohnst du?",
      "Turn these statements into questions: Du lernst Deutsch. Er arbeitet hier.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 6: Questions — Yes/No and W-Questions.

Yes/No questions: Verb comes FIRST, then subject.
- Lernst du Deutsch? / Arbeitet er heute?

W-Questions: W-word (position 1) + Verb (position 2) + Subject + Rest
- Wo wohnst du? / Was machst du? / Wie heißt du?

The 8 W-words:
was (what), wo (where), woher (from where), wann (when), wie (how), wer (who), warum (why), wie viel (how much/many)

Special: 'Wer' is already the subject → Wer kommt? (no extra subject needed)
No 'do/does' in German — just invert verb and subject.

Please drill me with:
1. Turn a statement into a yes/no question
2. Turn a statement into a W-question (I choose the right W-word)
3. Translate English questions to German
4. Spot-the-mistake in a malformed question

5 drills, one at a time. Correct me and explain. Auf geht's!`,
    summary:
      "Yes/No → Verb first. W-Questions → W-word + verb + subject. W-words: was wo woher wann wie wer warum.",
  },
  {
    id: "ch07",
    number: 7,
    title: "Numbers & Time",
    subtitle: "Zahlen und Uhrzeit",
    explanation:
      "German numbers follow a logical pattern. From 21 upward, the ones digit comes first, connected by 'und': einundzwanzig (one-and-twenty). Telling time uses official (24h) or informal (12h) formats.",
    rule:
      "1–12: eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf\n13–19: dreizehn … neunzehn\n20, 30…: zwanzig, dreißig, vierzig, fünfzig, sechzig…\n21: einundzwanzig · 34: vierunddreißig\n\nTime: Es ist [Stunde] Uhr [Minuten].\nInformal: viertel nach (quarter past) · halb (half past minus one hour!) · viertel vor (quarter to)",
    notes: [
      "'Halb zehn' means 9:30 — half (way) TO ten, not half past ten!",
      "Official time: Es ist acht Uhr fünfzehn. (8:15)",
      "Numbers 21–99: ones + 'und' + tens. No space: vierundzwanzig.",
    ],
    examples: [
      { de: "Es ist acht Uhr.", en: "It is 8 o'clock." },
      { de: "Es ist acht Uhr fünfzehn.", en: "It is 8:15." },
      { de: "Es ist viertel nach acht.", en: "It is quarter past eight." },
      { de: "Es ist halb neun.", en: "It is 8:30." },
      { de: "Es ist viertel vor neun.", en: "It is 8:45." },
      { de: "Ich habe vierunddreißig Bücher.", en: "I have 34 books." },
      { de: "Sie ist einundzwanzig Jahre alt.", en: "She is 21 years old." },
    ],
    mistakes: [
      "'Halb zehn' = 9:30, NOT 10:30. Think: halfway to ten.",
      "Don't say 'zwanzigeins' — say 'einundzwanzig' (ones first + und + tens).",
      "'dreißig' is spelled with ß, not 'dreissig'.",
    ],
    exercises: [
      { prompt: "How do you say 34 in German?", answer: "vierunddreißig" },
      { prompt: "What time is 'halb zehn'?", answer: "9:30" },
      { prompt: "Say 8:15 in official time.", answer: "acht Uhr fünfzehn" },
      { prompt: "Say 'quarter to nine' in German.", answer: "viertel vor neun" },
      { prompt: "How do you say 21?", answer: "einundzwanzig" },
    ],
    speakingPrompts: [
      "Count from 1 to 20 aloud.",
      "Say the current time in German — both official and informal.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 7: Numbers & Time (Zahlen und Uhrzeit).

Numbers:
- 1–12: eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf
- 13–19: add -zehn (dreizehn, vierzehn…)
- 20, 30…: zwanzig, dreißig (note ß!), vierzig, fünfzig…
- 21–99: ones FIRST + und + tens → einundzwanzig, vierunddreißig

Telling time:
- Official: Es ist acht Uhr fünfzehn. (8:15)
- Informal: viertel nach acht (8:15), halb neun (8:30 — halfway TO nine!), viertel vor neun (8:45)
- TRAP: 'halb zehn' = 9:30, NOT 10:30!

Please drill me with:
1. Give me a number in digits → I write it in German words
2. Give me a time in digits → I say it officially AND informally
3. Give me informal time → I tell you what the clock shows
4. Translate sentences with numbers/time

5 drills, one at a time. Pay special attention to the 'halb' trap! Auf geht's!`,
    summary:
      "21–99: ones + und + tens. 'halb X' = X minus 30 min. viertel nach = +15 min. viertel vor = -15 min.",
  },
  {
    id: "ch08",
    number: 8,
    title: "Ordinal Numbers & Dates",
    subtitle: "Ordinalzahlen und Datum",
    explanation:
      "Ordinal numbers (first, second, third…) are formed by adding '-te' to numbers 1–19 and '-ste' to numbers 20+. Dates use 'am' + ordinal number + month.",
    rule:
      "1–19: add -te (erste, zweite, dritte*, vierte, fünfte, sechste, sieb-te*, achte, neunte…)\n20+: add -ste (zwanzigste, dreißigste…)\n\nDates: am + [ordinal] + [month]\nam ersten Mai · am zwanzigsten Juli",
    notes: [
      "Exceptions: erst- (not einte), dritt- (not dreite), siebt- (not siebente).",
      "'am' triggers dative — ordinal gets '-en': am ersten, am dritten.",
      "Written dates: 1. Mai (the dot means ordinal in German).",
    ],
    examples: [
      { de: "Heute ist der erste Mai.", en: "Today is the first of May." },
      { de: "Ich habe am zwanzigsten Juli Geburtstag.", en: "My birthday is on the 20th of July." },
      { de: "Er kommt am dritten März.", en: "He comes on the 3rd of March." },
      { de: "Das ist mein zweites Buch.", en: "That is my second book." },
      { de: "Sie wohnt im dritten Stock.", en: "She lives on the third floor." },
    ],
    mistakes: [
      "WRONG: 'am einste Mai' — it's 'am ersten Mai' (ordinal gets -en after 'am').",
      "Don't forget exceptions: erste, dritte, siebte.",
      "'am' always takes dative — ordinal ending is always -en.",
    ],
    exercises: [
      { prompt: "How do you say 'on the 1st of May'?", answer: "am ersten Mai" },
      { prompt: "What is the ordinal for 3?", answer: "dritte/dritten" },
      { prompt: "How do you say 'on the 20th of July'?", answer: "am zwanzigsten Juli" },
      { prompt: "What is the ordinal for 7?", answer: "siebte" },
      { prompt: "Translate: Today is the 5th of March.", answer: "Heute ist der fünfte März." },
    ],
    speakingPrompts: [
      "Say your birthday in German: Ich habe am ___ Geburtstag.",
      "Count ordinals 1st to 10th aloud.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 8: Ordinal Numbers & Dates.

Formation rules:
- 1–19: add -te → zweite, vierte, fünfte, sechste, achte, neunte…
- 20+: add -ste → zwanzigste, dreißigste…
- Irregular exceptions (must memorize): erste (not 'einte'), dritte (not 'dreite'), siebte (not 'siebente')

Dates use 'am' + ordinal with dative ending -en:
- am ersten Mai, am zwanzigsten Juli, am dritten März
- Written shorthand: 1. Mai (the dot = ordinal in German)

'am' always triggers dative → ending is always -en: am ersten, am dritten, am zwanzigsten

Please drill me with:
1. Give me a number → I say the ordinal
2. Give me a date in digits → I write it fully in German (am ___ ___)
3. Spot-the-mistake (wrong ordinal or ending)
4. Translate: "My birthday is on the 15th of August"

5 drills, one at a time. Focus on the three irregular ones. Auf geht's!`,
    summary:
      "1–19 → -te. 20+ → -ste. Exceptions: erst-, dritt-, siebt-. After 'am' → -en ending. Written: 1. Mai.",
  },
  {
    id: "ch09",
    number: 9,
    title: "Negation",
    subtitle: "Nicht vs. Kein",
    explanation:
      "German has two negation words. 'Kein' negates nouns (replaces ein/keine article or negates uncounted nouns). 'Nicht' negates verbs, adjectives, adverbs, and specific nouns with definite articles.",
    rule:
      "kein/keine/kein = no / not a (for nouns)\nnicht = not (for verbs, adjectives, specific nouns)\n\nPlacement of 'nicht': usually at the end, or before adjective/adverb/specific element.",
    notes: [
      "'Kein' declines like 'ein': kein (m/n nom.), keine (f/pl nom.), keinen (m acc.)…",
      "'Nicht' comes at the end for general negation of the verb.",
      "If negating a specific adjective or adverb, 'nicht' comes directly before it.",
    ],
    examples: [
      { de: "Das ist kein Buch.", en: "That is not a book." },
      { de: "Ich habe keine Zeit.", en: "I have no time." },
      { de: "Er hat keinen Hund.", en: "He has no dog." },
      { de: "Ich schlafe nicht.", en: "I am not sleeping." },
      { de: "Das ist nicht mein Auto.", en: "That is not my car." },
      { de: "Sie ist nicht müde.", en: "She is not tired." },
      { de: "Er kommt heute nicht.", en: "He is not coming today." },
    ],
    mistakes: [
      "WRONG: 'Das ist nicht Buch.' — use 'kein' for nouns without definite article.",
      "WRONG: 'Ich habe nicht Zeit.' — 'Zeit' without article → 'keine Zeit'.",
      "Don't put 'nicht' randomly — learn its standard end-of-clause position.",
    ],
    exercises: [
      { prompt: "Negate: Das ist ein Buch.", answer: "Das ist kein Buch." },
      { prompt: "Negate: Ich schlafe. (verb negation)", answer: "Ich schlafe nicht." },
      { prompt: "Negate: Er hat einen Hund.", answer: "Er hat keinen Hund." },
      { prompt: "Negate: Sie ist müde.", answer: "Sie ist nicht müde." },
      { prompt: "Negate: Ich habe Zeit.", answer: "Ich habe keine Zeit." },
    ],
    speakingPrompts: [
      "Say 3 things you don't have: Ich habe kein/keine…",
      "Say 3 things you don't do: Ich … nicht.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 9: Negation — 'nicht' vs 'kein'.

The two negation words:
- kein/keine/kein = no / not a → used to negate NOUNS (replaces ein/keine or negates bare nouns)
  - kein (m/n nom.), keine (f/pl), keinen (m acc.), keinem (m/n dat.)…
  - Examples: Das ist kein Buch. / Ich habe keine Zeit. / Er hat keinen Hund.
- nicht = not → used to negate VERBS, adjectives, adverbs, or nouns with definite articles
  - Usually goes at the END of the clause
  - Examples: Ich schlafe nicht. / Sie ist nicht müde. / Das ist nicht mein Auto.

Decision rule: Does a noun follow without a definite article? → kein. Everything else → nicht.

Please drill me with:
1. Negate a sentence (I decide kein or nicht)
2. Fill-in-the-blank with the right form of kein
3. Spot-the-mistake
4. Translate negated English sentences

5 drills one at a time. Explain my choice each time. Auf geht's!`,
    summary:
      "kein = no/not a (for nouns). nicht = not (for verbs/adj/specific). kein declines like ein. nicht usually at end of clause.",
  },
  {
    id: "ch10",
    number: 10,
    title: "Accusative Case",
    subtitle: "Direct Object & Articles",
    explanation:
      "The accusative case marks the direct object — the thing receiving the action. Only the masculine article changes: der → den, ein → einen. Feminine, neuter, and plural stay the same.",
    rule:
      "Masculine: der → den · ein → einen\nFeminine: die → die · eine → eine (no change)\nNeuter: das → das · ein → ein (no change)\nPlural: die → die (no change)\n\nCommon accusative verbs: haben, sehen, kaufen, brauchen, nehmen, essen, trinken",
    table: {
      headers: ["Gender", "Nominative", "Accusative", "Change?"],
      rows: [
        ["Masculine (m)", "der / ein", "den / einen", "✓ changes"],
        ["Feminine (f)", "die / eine", "die / eine", "✗ same"],
        ["Neuter (n)", "das / ein", "das / ein", "✗ same"],
        ["Plural", "die / —", "die / —", "✗ same"],
      ],
    },
    notes: [
      "Only masculine changes — feminine, neuter, plural stay the same as nominative.",
      "A quick test: accusative answers 'wen?' (whom) or 'was?' (what).",
      "Personal pronoun changes covered in Chapter 11.",
    ],
    examples: [
      { de: "Ich sehe den Mann.", en: "I see the man. (masc. → den)" },
      { de: "Ich kaufe einen Stift.", en: "I buy a pen. (masc. → einen)" },
      { de: "Er trinkt die Milch.", en: "He drinks the milk. (fem. → die, unchanged)" },
      { de: "Wir essen das Brot.", en: "We eat the bread. (neut. → das, unchanged)" },
      { de: "Sie braucht eine Tasche.", en: "She needs a bag. (fem. → eine, unchanged)" },
      { de: "Ich habe keinen Stift.", en: "I have no pen. (kein masc. → keinen)" },
    ],
    mistakes: [
      "Only masculine changes! WRONG: 'Ich sehe die Frau' is already correct (not 'den Frau').",
      "WRONG: 'Ich kaufe einen Buch' — Buch is neuter, so 'ein Buch'.",
      "Watch out for kein: keinen (m acc.), keine (f/pl acc.), kein (n acc.).",
    ],
    exercises: [
      { prompt: "Fill in: Ich sehe ___ Mann. (the)", answer: "den" },
      { prompt: "Fill in: Er kauft ___ Stift. (a, masc.)", answer: "einen" },
      { prompt: "Fill in: Wir essen ___ Brot. (the, neut.)", answer: "das" },
      { prompt: "Translate: I need a bag.", answer: "Ich brauche eine Tasche." },
      { prompt: "Translate: She sees the child.", answer: "Sie sieht das Kind." },
    ],
    speakingPrompts: [
      "Say: Ich kaufe ___ (name 5 things with correct articles).",
      "Look around and say what you see: Ich sehe den/die/das…",
    ],
    summary:
      "Accusative = direct object. Only masculine changes: der→den, ein→einen. Feminine/neuter/plural unchanged. Test: wen/was?",
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 10: Accusative Case — Direct Object & Articles.

The accusative marks the direct object (answers: wen? / was?).

Article changes — ONLY masculine changes:
- der → den (Ich sehe den Mann.)
- ein → einen (Ich kaufe einen Stift.)
- kein → keinen (Ich habe keinen Stift.)
- Feminine, neuter, plural: NO change (die/das/eine stay the same)

Common accusative verbs: haben, sehen, kaufen, brauchen, nehmen, essen, trinken, lieben, kennen, finden

Quick test: Ask "wen?" or "was?" about the object. If it's masculine → change to den/einen.

Please drill me with:
1. Give me a sentence → I identify the direct object and its correct article
2. Fill-in-the-blank with correct accusative article
3. Translate sentences with masculine/feminine/neuter objects (mixed!)
4. Spot-the-mistake

5 drills one at a time. Remind me only masculine changes! Auf geht's!`,
  },
  {
    id: "ch11",
    number: 11,
    title: "Accusative Pronouns",
    subtitle: "Personal Pronouns in Accusative",
    explanation:
      "Personal pronouns also change in the accusative. These replace the direct object noun.",
    rule:
      "ich → mich · du → dich · er → ihn · sie → sie · es → es · wir → uns · ihr → euch · sie/Sie → sie/Sie",
    table: {
      headers: ["Nominative", "Accusative", "English"],
      rows: [
        ["ich", "mich", "me"],
        ["du", "dich", "you (inf.)"],
        ["er", "ihn", "him"],
        ["sie", "sie", "her / them"],
        ["es", "es", "it"],
        ["wir", "uns", "us"],
        ["ihr", "euch", "you all"],
        ["Sie", "Sie", "you (formal)"],
      ],
    },
    notes: [
      "Only 'er → ihn' and 'ich → mich', 'du → dich' are the big changes to memorize.",
      "'sie' (she) and 'sie' (they) stay 'sie' in accusative.",
      "'es' stays 'es'. 'wir → uns', 'ihr → euch'.",
    ],
    examples: [
      { de: "Ich sehe ihn.", en: "I see him." },
      { de: "Liebst du mich?", en: "Do you love me?" },
      { de: "Wir kennen sie.", en: "We know her/them." },
      { de: "Er ruft uns an.", en: "He calls us." },
      { de: "Ich verstehe dich nicht.", en: "I don't understand you." },
      { de: "Sie sehen euch.", en: "They see you all." },
    ],
    mistakes: [
      "WRONG: 'Ich sehe er.' — accusative of er is ihn.",
      "WRONG: 'Liebst du ich?' — accusative of ich is mich.",
      "Don't confuse 'sie' (her/them) with 'Sie' (formal you) in accusative — both stay the same.",
    ],
    exercises: [
      { prompt: "Replace: Ich sehe den Mann. (ihn)", answer: "Ich sehe ihn." },
      { prompt: "Fill in: Liebst du ___? (me)", answer: "mich" },
      { prompt: "Fill in: Wir rufen ___ an. (you, informal sing.)", answer: "dich" },
      { prompt: "Translate: She knows us.", answer: "Sie kennt uns." },
      { prompt: "Translate: I don't understand him.", answer: "Ich verstehe ihn nicht." },
    ],
    speakingPrompts: [
      "Say: Ich sehe dich. Du siehst mich. Er sieht ihn. Sie sieht sie.",
      "Tell a partner: Ich mag dich! Ich verstehe dich nicht!",
    ],
    summary:
      "ich→mich · du→dich · er→ihn · sie→sie · es→es · wir→uns · ihr→euch · sie→sie. Only masculine changes significantly.",
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 11: Accusative Pronouns.

Pronoun changes in the accusative (direct object):
- ich → mich (me)
- du → dich (you)
- er → ihn (him) ← biggest change to memorize!
- sie → sie (her/them) ← stays the same
- es → es (it) ← stays the same
- wir → uns (us)
- ihr → euch (you all)
- sie/Sie → sie/Sie (them/you formal)

Key: only 'er → ihn' is a big change. 'ich → mich' and 'du → dich' are also important.

Please drill me with:
1. Replace the noun object with the correct pronoun: "Ich sehe den Mann." → "Ich sehe ihn."
2. Fill-in-the-blank: "Liebst du ___?" (me)
3. Translate short sentences using accusative pronouns
4. Spot-the-mistake

5 drills one at a time. Focus especially on er→ihn. Auf geht's!`,
  },
  {
    id: "ch12",
    number: 12,
    title: "Accusative Prepositions",
    subtitle: "DOGFU",
    explanation:
      "Certain prepositions always trigger the accusative case. A helpful mnemonic is DOGFU: durch, ohne, gegen, für, um.",
    rule:
      "durch (through) · ohne (without) · gegen (against/around) · für (for) · um (around/at)\n\nAll these prepositions → accusative case follows.",
    table: {
      headers: ["Preposition", "Meaning", "Example"],
      rows: [
        ["durch", "through", "durch den Park"],
        ["ohne", "without", "ohne meinen Hund"],
        ["gegen", "against / around", "gegen den Plan / gegen 3 Uhr"],
        ["für", "for", "für dich / für meinen Vater"],
        ["um", "around / at (time)", "um den See / um 8 Uhr"],
      ],
    },
    notes: [
      "After these prepositions, masculine articles change: der → den, ein → einen.",
      "'für' is the most common — used constantly in daily German.",
      "'gegen' can mean 'against' or 'around (time)': gegen drei Uhr = around 3 o'clock.",
    ],
    examples: [
      { de: "Das ist für dich.", en: "That is for you." },
      { de: "Ich gehe durch den Park.", en: "I walk through the park." },
      { de: "Er kommt ohne seinen Hund.", en: "He comes without his dog." },
      { de: "Sie ist gegen den Plan.", en: "She is against the plan." },
      { de: "Wir laufen um den See.", en: "We run around the lake." },
      { de: "Ich kaufe ein Geschenk für meinen Vater.", en: "I buy a gift for my father." },
    ],
    mistakes: [
      "WRONG: 'für der Mann' — always accusative: 'für den Mann'.",
      "Don't forget: 'ohne meinen Hund' not 'ohne mein Hund' (mein + masc. acc. → meinen).",
      "Memorize DOGFU — these prepositions never change to dative.",
    ],
    exercises: [
      { prompt: "Fill in: Das ist ___ dich. (for)", answer: "für" },
      { prompt: "Fill in: Er geht durch ___ Park. (the, masc.)", answer: "den" },
      { prompt: "Fill in: Sie kommt ohne ___ Bruder. (her, masc.)", answer: "ihren" },
      { prompt: "Translate: I walk through the city.", answer: "Ich gehe durch die Stadt." },
      { prompt: "Translate: It is for you (informal).", answer: "Es ist für dich." },
    ],
    speakingPrompts: [
      "Say the DOGFU prepositions aloud with an example each.",
      "Make a sentence with 'für' about a person you know.",
    ],
    summary:
      "DOGFU: durch ohne gegen für um → always accusative. Masculine changes: der→den, ein→einen. Memorize these 5.",
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 12: Accusative Prepositions — DOGFU.

These 5 prepositions ALWAYS take the accusative case:
- durch (through) — durch den Park, durch die Stadt
- ohne (without) — ohne meinen Hund, ohne dich
- gegen (against / around time) — gegen den Wind, gegen 3 Uhr
- für (for) — für dich, für meinen Vater, für das Kind
- um (around / at a time) — um den See, um 8 Uhr

Because they take accusative: masculine article changes (der→den, ein→einen, mein→meinen).
Feminine, neuter, plural don't change.

Memory trick: DOGFU (D-O-G-F-U)

Please drill me with:
1. Fill-in-the-blank with the correct preposition
2. Fill-in-the-blank with the correct article after the preposition
3. Translate sentences using DOGFU prepositions
4. Spot-the-mistake (wrong case after preposition)

5 drills one at a time. Test all 5 prepositions. Auf geht's!`,
  },
  {
    id: "ch13",
    number: 13,
    title: "Dative Case",
    subtitle: "Indirect Object & Articles",
    explanation:
      "The dative case marks the indirect object — usually the person receiving something or the person to/for whom something is done. All articles change in the dative.",
    rule:
      "Definite: dem (m) · der (f) · dem (n) · den+n (pl)\nIndefinite: einem (m) · einer (f) · einem (n)\n\nPlural dative: noun gets extra -n if it doesn't already end in -n or -s.",
    table: {
      headers: ["Gender", "Nominative", "Accusative", "Dative"],
      rows: [
        ["Masculine", "der / ein", "den / einen", "dem / einem"],
        ["Feminine", "die / eine", "die / eine", "der / einer"],
        ["Neuter", "das / ein", "das / ein", "dem / einem"],
        ["Plural", "die / —", "die / —", "den+n / —"],
      ],
    },
    notes: [
      "A quick test: dative answers 'wem?' (to whom?).",
      "Plural dative: die Kinder → den Kindern (extra -n added).",
      "Dative is used after specific verbs AND dative prepositions (Chapter 15).",
    ],
    examples: [
      { de: "Ich gebe dem Mann das Buch.", en: "I give the man the book." },
      { de: "Er hilft der Frau.", en: "He helps the woman." },
      { de: "Sie gibt einem Kind Essen.", en: "She gives a child food." },
      { de: "Wir helfen den Kindern.", en: "We help the children." },
      { de: "Ich kaufe meiner Mutter Blumen.", en: "I buy my mother flowers." },
    ],
    mistakes: [
      "WRONG: 'Ich helfe der Mann' — masculine dative is 'dem': 'Ich helfe dem Mann'.",
      "Don't forget plural -n: 'den Kindern', 'den Männern', not 'den Kinder'.",
      "Feminine dative is 'der' — same form as masculine nominative! Watch the context.",
    ],
    exercises: [
      { prompt: "Fill in: Ich helfe ___ Mann. (the, dative)", answer: "dem" },
      { prompt: "Fill in: Sie gibt ___ Frau ein Buch. (the, dative)", answer: "der" },
      { prompt: "Fill in: Wir helfen ___ Kindern. (the, plural dative)", answer: "den" },
      { prompt: "Translate: I give the child a gift.", answer: "Ich gebe dem Kind ein Geschenk." },
      { prompt: "Translate: He helps the woman.", answer: "Er hilft der Frau." },
    ],
    speakingPrompts: [
      "Say: Ich gebe dem Mann / der Frau / dem Kind … etwas.",
      "Practice: Wem hilfst du? — Ich helfe dem/der…",
    ],
    summary:
      "Dative = indirect object (wem?). dem(m) · der(f) · dem(n) · den+n(pl). Plural nouns add -n. Feminine dative = 'der'.",
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 13: Dative Case — Indirect Object & Articles.

The dative marks the indirect object (answers: wem? = to whom?).

Article changes in dative:
- Masculine: der → dem, ein → einem
- Feminine: die → der, eine → einer  ← careful! Fem. dative = 'der' (looks like masc. nominative)
- Neuter: das → dem, ein → einem
- Plural: die → den + noun gets extra -n (den Kindern, den Männern)

All cases summary so far:
| | m | f | n | pl |
|Nom| der/ein | die/eine | das/ein | die |
|Acc| den/einen | die/eine | das/ein | die |
|Dat| dem/einem | der/einer | dem/einem | den |

Common dative verbs: geben, helfen, danken, antworten, gehören, gefallen, schenken

Please drill me with:
1. Fill-in-the-blank with the dative article
2. Identify: is this noun nominative, accusative, or dative?
3. Translate sentences with dative objects
4. Spot-the-mistake

5 drills one at a time. Warn me when feminine dative looks like masculine nominative! Auf geht's!`,
  },
  {
    id: "ch14",
    number: 14,
    title: "Dative Pronouns",
    subtitle: "Personal Pronouns in Dative",
    explanation:
      "Personal pronouns have their own dative forms, used as indirect objects or after dative verbs and prepositions.",
    rule:
      "ich → mir · du → dir · er → ihm · sie → ihr · es → ihm · wir → uns · ihr → euch · sie/Sie → ihnen/Ihnen",
    table: {
      headers: ["Nominative", "Accusative", "Dative", "English"],
      rows: [
        ["ich", "mich", "mir", "me / to me"],
        ["du", "dich", "dir", "you / to you"],
        ["er", "ihn", "ihm", "him / to him"],
        ["sie", "sie", "ihr", "her / to her"],
        ["es", "es", "ihm", "it / to it"],
        ["wir", "uns", "uns", "us / to us"],
        ["ihr", "euch", "euch", "you all / to you all"],
        ["sie/Sie", "sie/Sie", "ihnen/Ihnen", "them/you / to them/you"],
      ],
    },
    notes: [
      "Common dative verbs: helfen, danken, antworten, gehören, gefallen, schmecken, gehen (Wie geht es dir?).",
      "'uns' and 'euch' are the same in both accusative and dative.",
      "'Ihnen' (formal) is always capitalized.",
    ],
    examples: [
      { de: "Wie geht es dir?", en: "How are you?" },
      { de: "Ich helfe ihm.", en: "I help him." },
      { de: "Das gehört mir.", en: "That belongs to me." },
      { de: "Es gefällt ihr.", en: "She likes it. (lit: it pleases her)" },
      { de: "Ich danke Ihnen.", en: "I thank you. (formal)" },
      { de: "Er antwortet uns nicht.", en: "He doesn't answer us." },
    ],
    mistakes: [
      "WRONG: 'Ich helfe er.' — dative of 'er' is 'ihm'.",
      "WRONG: 'Das gehört ich.' — dative of 'ich' is 'mir'.",
      "Don't confuse 'ihr' (dative of sie/she) with 'ihr' (possessive her/your).",
    ],
    exercises: [
      { prompt: "Fill in: Ich helfe ___. (him)", answer: "ihm" },
      { prompt: "Fill in: Das gehört ___. (me)", answer: "mir" },
      { prompt: "Fill in: Wie geht es ___? (you, informal)", answer: "dir" },
      { prompt: "Translate: She thanks us.", answer: "Sie dankt uns." },
      { prompt: "Translate: I answer her.", answer: "Ich antworte ihr." },
    ],
    speakingPrompts: [
      "Ask a partner: Wie geht es dir? Answer: Es geht mir gut/schlecht.",
      "Say: Das gefällt mir. Das schmeckt mir nicht.",
    ],
    summary:
      "Dative pronouns: mir dir ihm ihr ihm uns euch ihnen/Ihnen. Used after dative verbs (helfen, gefallen, gehören…) and dative prepositions.",
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 14: Dative Pronouns.

Pronoun forms across all cases:
| Nominative | Accusative | Dative |
|------------|------------|--------|
| ich | mich | mir |
| du | dich | dir |
| er | ihn | ihm |
| sie (she) | sie | ihr |
| es | es | ihm |
| wir | uns | uns |
| ihr | euch | euch |
| sie/Sie | sie/Sie | ihnen/Ihnen |

Common dative verbs (always take dative object): helfen, danken, antworten, gehören, gefallen, schmecken, passen
Classic phrase: Wie geht es dir? — Es geht mir gut.

Please drill me with:
1. Give me a dative verb + English subject/object → I translate using correct dative pronoun
2. Fill-in-the-blank: "Ich helfe ___." (him/her/them)
3. Replace noun with pronoun: "Ich danke meiner Mutter." → "Ich danke ihr."
4. Spot-the-mistake

5 drills one at a time. Mix all pronouns. Auf geht's!`,
  },
  {
    id: "ch15",
    number: 15,
    title: "Dative Prepositions",
    subtitle: "aus bei mit nach seit von zu",
    explanation:
      "These 7 prepositions always take the dative case. Many form contractions with definite articles.",
    rule:
      "aus (from/out of) · bei (at/near/with) · mit (with/by) · nach (after/to) · seit (since/for) · von (from/by/of) · zu (to)\n\nContractions: bei + dem = beim · zu + dem = zum · zu + der = zur · von + dem = vom",
    table: {
      headers: ["Preposition", "Meaning", "Example", "Contraction"],
      rows: [
        ["aus", "from / out of", "Ich komme aus Berlin.", "—"],
        ["bei", "at / near / with", "Er ist beim Arzt.", "bei + dem = beim"],
        ["mit", "with / by", "Wir fahren mit dem Bus.", "—"],
        ["nach", "after / to (cities)", "Ich fahre nach Berlin.", "—"],
        ["seit", "since / for", "Seit drei Jahren lerne ich.", "—"],
        ["von", "from / by / of", "Ein Geschenk vom Vater.", "von + dem = vom"],
        ["zu", "to", "Ich gehe zum Supermarkt.", "zu + dem = zum, zu + der = zur"],
      ],
    },
    notes: [
      "'seit' uses present tense in German for something that started in the past and continues now: 'Ich lerne seit drei Jahren Deutsch.'",
      "'nach' for cities/countries (no article): 'Ich fahre nach Berlin'. 'zu' for places with article: 'Ich gehe zum Supermarkt'.",
      "'bei' means at someone's house: 'Ich bin bei meiner Freundin.'",
    ],
    examples: [
      { de: "Ich komme aus Deutschland.", en: "I come from Germany." },
      { de: "Wir fahren mit dem Bus.", en: "We travel by bus." },
      { de: "Er ist bei seiner Mutter.", en: "He is at his mother's." },
      { de: "Ich gehe zum Supermarkt.", en: "I go to the supermarket." },
      { de: "Sie lernt seit drei Jahren Deutsch.", en: "She has been learning German for 3 years." },
      { de: "Das ist ein Geschenk von meinem Vater.", en: "That is a gift from my father." },
      { de: "Nach der Schule gehe ich nach Hause.", en: "After school I go home." },
    ],
    mistakes: [
      "WRONG: 'Ich fahre zu Berlin.' — cities use 'nach': 'Ich fahre nach Berlin'.",
      "WRONG: 'Ich lerne seit drei Jahren Deutsch gelernt.' — no perfect tense with 'seit', use present.",
      "Don't forget contractions: zum, zur, beim, vom — these are standard spoken German.",
    ],
    exercises: [
      { prompt: "Fill in: Ich komme ___ Deutschland. (from)", answer: "aus" },
      { prompt: "Fill in: Wir fahren ___ dem Zug. (by/with)", answer: "mit" },
      { prompt: "Fill in: Ich gehe ___ Supermarkt. (to the, contraction)", answer: "zum" },
      { prompt: "Translate: She comes from Berlin.", answer: "Sie kommt aus Berlin." },
      { prompt: "Translate: I have been learning for 2 years.", answer: "Ich lerne seit zwei Jahren." },
    ],
    speakingPrompts: [
      "Say: Ich komme aus ___. Ich fahre mit dem/der…",
      "Practice contractions: zum / zur / beim / vom — use each in a sentence.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 15: Dative Prepositions (aus bei mit nach seit von zu).

Your role: Quiz me on which preposition fits each context. Test contractions (beim/zum/zur/vom), the 'seit' + present tense rule, and the difference between 'nach' (cities) vs 'zu' (places with article). Give fill-in and translation tasks.

Start with: "Dative prepositions! Fill in: Wir fahren ___ dem Bus. (with/by) — go!"`,
    summary:
      "AUMNSV-Z: aus bei mit nach seit von zu → always dative. Contractions: beim vom zum zur. 'seit' + present tense.",
  },
  {
    id: "ch16",
    number: 16,
    title: "Possessive Articles",
    subtitle: "mein dein sein ihr unser euer Ihr",
    explanation:
      "Possessive articles show ownership. They decline like 'ein/kein' — their endings change based on the gender and case of the noun they describe.",
    rule:
      "Stems: mein (my) · dein (your inf.) · sein (his/its) · ihr (her/their) · unser (our) · euer (your pl.) · Ihr (your formal)\n\nEndings (like ein): nom: -/e/- · acc: -en/e/- · dat: -em/er/em\n\neuer → eure (drops the e before ending): eure, euren, eurem",
    table: {
      headers: ["Case", "Masc.", "Fem.", "Neut.", "Plural"],
      rows: [
        ["Nominative", "mein", "meine", "mein", "meine"],
        ["Accusative", "meinen", "meine", "mein", "meine"],
        ["Dative", "meinem", "meiner", "meinem", "meinen"],
      ],
    },
    notes: [
      "The stem is fixed; endings change based on gender + case of the following noun.",
      "'sein' = his or its. 'ihr' = her or their — same form, context matters.",
      "'euer' drops the middle 'e' when an ending is added: euer → eure (not 'euere').",
    ],
    examples: [
      { de: "Das ist mein Bruder.", en: "That is my brother. (m nom.)" },
      { de: "Ich sehe meinen Bruder.", en: "I see my brother. (m acc.)" },
      { de: "Ich helfe meiner Schwester.", en: "I help my sister. (f dat.)" },
      { de: "Er spricht mit seinem Vater.", en: "He speaks with his father. (m dat.)" },
      { de: "Das ist unser Haus.", en: "That is our house. (n nom.)" },
      { de: "Wie heißt eure Lehrerin?", en: "What is your (pl.) teacher's name?" },
    ],
    mistakes: [
      "WRONG: 'Ich sehe mein Bruder.' — masculine accusative needs -en: 'meinen Bruder'.",
      "WRONG: 'euere Lehrerin' — drop the middle e: 'eure Lehrerin'.",
      "Don't confuse 'ihr' (possessive her/their) with 'Ihr' (formal your).",
    ],
    exercises: [
      { prompt: "Fill in: Das ist ___ Buch. (my, neut. nom.)", answer: "mein" },
      { prompt: "Fill in: Ich sehe ___ Bruder. (my, masc. acc.)", answer: "meinen" },
      { prompt: "Fill in: Er hilft ___ Mutter. (his, fem. dat.)", answer: "seiner" },
      { prompt: "Translate: That is our house.", answer: "Das ist unser Haus." },
      { prompt: "Translate: I see your (pl.) teacher.", answer: "Ich sehe eure Lehrerin." },
    ],
    speakingPrompts: [
      "Describe your family: Das ist mein Vater, meine Mutter, mein Bruder…",
      "Say: Ich sehe meinen/meine/mein…",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 16: Possessive Articles (mein dein sein ihr unser euer Ihr).

Your role: Ask me to produce possessive article forms in all genders and cases. Correct my mistakes, explain the pattern briefly, and keep us moving. Vary between nominative, accusative, and dative. Randomly use different possessive stems (mein/dein/sein/ihr etc.).

Start with: "Let's drill possessive articles! Fill in the correct form: Das ist ___ Bruder. (mein, masc. nom.) — go!"`,
    summary:
      "Possessives: mein dein sein ihr unser euer Ihr. Endings like ein/kein. euer → eure (drop middle e). Agree with following noun in gender/case.",
  },
  {
    id: "ch17",
    number: 17,
    title: "Modal Verbs",
    subtitle: "können müssen wollen sollen dürfen möchten",
    explanation:
      "Modal verbs express ability, necessity, desire, or permission. They have irregular conjugations and always work as a pair with an infinitive verb, which goes to the END of the sentence.",
    rule:
      "können (can) · müssen (must) · wollen (want to) · sollen (should/supposed to) · dürfen (may/allowed to) · möchten (would like to)\n\nSentence structure: Subject + modal (pos.2) + … + infinitive (end)\n\nKey pattern: ich/er/sie/es form is IDENTICAL for all modals.",
    table: {
      headers: ["Pronoun", "können", "müssen", "wollen", "dürfen", "möchten"],
      rows: [
        ["ich", "kann", "muss", "will", "darf", "möchte"],
        ["du", "kannst", "musst", "willst", "darfst", "möchtest"],
        ["er/sie/es", "kann", "muss", "will", "darf", "möchte"],
        ["wir", "können", "müssen", "wollen", "dürfen", "möchten"],
        ["ihr", "könnt", "müsst", "wollt", "dürft", "möchtet"],
        ["sie/Sie", "können", "müssen", "wollen", "dürfen", "möchten"],
      ],
    },
    notes: [
      "Modals for ich and er/sie/es have the same form (no ending): ich kann, er kann.",
      "'möchten' is a special form — has no infinitive *möchen* in common use.",
      "With modals, the infinitive does NOT use 'zu'.",
    ],
    examples: [
      { de: "Ich kann Deutsch sprechen.", en: "I can speak German." },
      { de: "Wir müssen jetzt lernen.", en: "We must study now." },
      { de: "Er will ein Auto kaufen.", en: "He wants to buy a car." },
      { de: "Sie darf hier nicht parken.", en: "She is not allowed to park here." },
      { de: "Ich möchte Kaffee trinken.", en: "I would like to drink coffee." },
      { de: "Ihr sollt leise sein.", en: "You all should be quiet." },
      { de: "Kannst du mir helfen?", en: "Can you help me?" },
    ],
    mistakes: [
      "WRONG: 'Ich kann Deutsch zu sprechen.' — NO 'zu' with modals.",
      "WRONG: 'Ich muss lernen jetzt.' — infinitive must go to the END.",
      "Don't add -e to ich: 'ich kann' not 'ich kane'.",
    ],
    exercises: [
      { prompt: "Fill in: Ich ___ Deutsch sprechen. (can)", answer: "kann" },
      { prompt: "Fill in: Wir ___ jetzt gehen. (must)", answer: "müssen" },
      { prompt: "Fill in: Er ___ ein Buch kaufen. (wants to)", answer: "will" },
      { prompt: "Translate: I would like to eat.", answer: "Ich möchte essen." },
      { prompt: "Translate: Can you help me?", answer: "Kannst du mir helfen?" },
    ],
    speakingPrompts: [
      "Say 3 things you can do: Ich kann…",
      "Say 3 things you want to do: Ich will / Ich möchte…",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 17: Modal Verbs (können müssen wollen sollen dürfen möchten).

Your role: Give me sentences to complete using the right modal verb and correct infinitive placement. Correct errors, explain the pattern briefly. Mix all six modals, all persons. Also test the rule: no 'zu' with modals.

Start with: "Modal verbs time! Fill in: Ich ___ Deutsch sprechen. (can) — go!"`,
    summary:
      "Modals: können müssen wollen sollen dürfen möchten. Structure: modal(pos.2) + infinitive(end). ich = er form. No 'zu'.",
  },
  {
    id: "ch18",
    number: 18,
    title: "Separable Verbs",
    subtitle: "Trennbare Verben",
    explanation:
      "Separable verbs have a prefix that detaches and moves to the END of the sentence in main clauses. The verb stem stays in position 2 and conjugates normally.",
    rule:
      "Structure: Verb stem (pos.2, conjugated) + … + prefix (end)\n\nCommon separable verbs: anrufen (to call), aufstehen (to get up), einkaufen (to shop), fernsehen (to watch TV), mitkommen (to come along), abfahren (to depart)\n\nWith modal verbs: the separable verb stays TOGETHER as infinitive at the end.",
    notes: [
      "The prefix is always stressed when spoken: ANrufen, AUFstehen.",
      "Common prefixes: an-, auf-, aus-, ein-, mit-, ab-, vor-, zurück-, fern-.",
      "With modals: 'Ich möchte einkaufen.' — the verb stays together.",
    ],
    examples: [
      { de: "Ich rufe dich an.", en: "I'll call you. (anrufen → rufe…an)" },
      { de: "Wir stehen früh auf.", en: "We get up early. (aufstehen → stehen…auf)" },
      { de: "Er kauft heute ein.", en: "He goes shopping today. (einkaufen → kauft…ein)" },
      { de: "Sie sieht jeden Abend fern.", en: "She watches TV every evening." },
      { de: "Kommst du mit?", en: "Are you coming along?" },
      { de: "Ich möchte morgen einkaufen.", en: "I'd like to go shopping tomorrow. (modal → stays together)" },
    ],
    mistakes: [
      "WRONG: 'Ich anrufe dich.' — prefix must go to the end: 'Ich rufe dich an.'",
      "WRONG: 'Wir stehen auf früh.' — prefix goes to the very end after all other elements.",
      "WRONG: 'Ich möchte ein kaufen.' — with modals, keep it together: 'einkaufen'.",
    ],
    exercises: [
      { prompt: "Conjugate: anrufen with 'ich'.", answer: "Ich rufe … an." },
      { prompt: "Make a sentence: wir / aufstehen / früh", answer: "Wir stehen früh auf." },
      { prompt: "Fill in: Er ___ heute ___. (einkaufen)", answer: "kauft … ein" },
      { prompt: "Translate: Are you coming along?", answer: "Kommst du mit?" },
      { prompt: "Translate: I would like to watch TV.", answer: "Ich möchte fernsehen." },
    ],
    speakingPrompts: [
      "Say: Ich stehe um 7 Uhr auf. Ich rufe dich um 8 Uhr an.",
      "Make sentences with anrufen, aufstehen, and einkaufen.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 18: Separable Verbs (Trennbare Verben).

Your role: Give me sentences where I must correctly place the separable prefix at the end. Also test me with modal + separable verb combinations. Use common verbs: anrufen, aufstehen, einkaufen, fernsehen, mitkommen, abfahren.

Start with: "Separable verbs! Rearrange: ich / anrufen / dich — go!"`,
    summary:
      "Separable verbs: stem(pos.2) + prefix(end). Prefix detaches in main clauses. With modals: stays together at end. Prefix is stressed.",
  },
  {
    id: "ch19",
    number: 19,
    title: "Conjunctions",
    subtitle: "Coordinating — ADUSO",
    explanation:
      "Coordinating conjunctions connect two main clauses. They sit at 'position zero' — before both clauses — and do NOT change the word order of the second clause.",
    rule:
      "ADUSO: aber (but) · denn (because) · und (and) · sondern (but rather) · oder (or)\n\nPosition: Clause 1 + conjunction + Clause 2 (normal V2 order)\n'sondern' is used after a NEGATIVE clause to give the real alternative.",
    notes: [
      "These conjunctions are at position 0 — they don't affect V2 order of the following clause.",
      "'aber' = but (just contrasting). 'sondern' = but rather (correcting a negative).",
      "Comma before all conjunctions except 'und' and 'oder' (optional for those in informal writing).",
    ],
    examples: [
      { de: "Ich lerne Deutsch, aber ich bin müde.", en: "I'm learning German, but I'm tired." },
      { de: "Er kocht, und sie liest.", en: "He cooks and she reads." },
      { de: "Kommt er, oder bleibt er?", en: "Is he coming, or is he staying?" },
      { de: "Sie lernt nicht Spanisch, sondern Deutsch.", en: "She's not learning Spanish, but rather German." },
      { de: "Ich bleibe zu Hause, denn ich bin krank.", en: "I stay home because I'm sick." },
    ],
    mistakes: [
      "WRONG: 'Ich lerne Deutsch, aber bin ich müde.' — no inversion after coordinating conjunctions.",
      "Use 'sondern' only after negation. Use 'aber' for general contrast.",
      "WRONG: 'Ich bleibe zu Hause, weil ich bin krank.' — 'weil' (subordinating) sends verb to end.",
    ],
    exercises: [
      { prompt: "Join: Ich lerne Deutsch. Ich bin müde. (but)", answer: "Ich lerne Deutsch, aber ich bin müde." },
      { prompt: "Join: Er kommt nicht. Er geht. (but rather)", answer: "Er kommt nicht, sondern er geht." },
      { prompt: "Fill in: Ich bleibe zu Hause, ___ ich bin krank. (because)", answer: "denn" },
      { prompt: "Translate: She sings and he dances.", answer: "Sie singt und er tanzt." },
    ],
    speakingPrompts: [
      "Say 2 sentences connected with 'aber': Ich mag… aber ich mag … nicht.",
      "Use 'und' to connect 3 activities you do.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 19: Coordinating Conjunctions (ADUSO: aber denn und sondern oder).

Your role: Give me two clauses to join with the right conjunction. Test all five (aber/denn/und/sondern/oder), especially 'sondern' after negatives. Correct word order errors and explain briefly.

Start with: "Conjunctions! Join these: 'Ich lerne Deutsch.' + 'Ich bin müde.' using 'aber' — go!"`,
    summary:
      "ADUSO: aber denn und sondern oder → position 0, no word-order change. Comma before them. 'sondern' only after negatives.",
  },
  {
    id: "ch20",
    number: 20,
    title: "Imperative",
    subtitle: "Commands",
    explanation:
      "The imperative is used to give commands or instructions. German has three imperative forms: du (informal singular), ihr (informal plural), and Sie (formal).",
    rule:
      "du: verb stem (drop -st, no pronoun) → Kauf das! / Lern!\nihr: ihr-form without pronoun → Kauft das!\nSie: infinitive + Sie → Kaufen Sie das!\n\nSeparable verbs: prefix still goes to end → Ruf mich an!\nStrong verbs with e→i change keep the change: sprechen → Sprich!",
    notes: [
      "For 'du' imperative: just use the verb stem. Strong verbs with vowel change (e→i) keep it.",
      "For 'du' verbs with stem in -t/-d, add -e: arbeite!, rede!",
      "The Sie imperative looks like an infinitive question: 'Kommen Sie bitte!'",
    ],
    examples: [
      { de: "Kauf das Buch!", en: "Buy the book! (du)" },
      { de: "Kauft das Buch!", en: "Buy the book! (ihr)" },
      { de: "Kaufen Sie das Buch!", en: "Buy the book! (Sie)" },
      { de: "Lern Deutsch!", en: "Learn German! (du)" },
      { de: "Ruf mich an!", en: "Call me! (du — separable)" },
      { de: "Sprich lauter!", en: "Speak louder! (du — strong verb)" },
      { de: "Seid ruhig!", en: "Be quiet! (ihr — sein)" },
      { de: "Seien Sie bitte ruhig!", en: "Please be quiet! (Sie — sein)" },
    ],
    mistakes: [
      "WRONG: 'Du kauf das!' — drop 'du' in imperatives.",
      "WRONG: 'Spreche lauter!' — strong e→i verbs don't add -e: 'Sprich lauter!'",
      "WRONG: 'Anrufe mich!' — separable: 'Ruf mich an!'",
    ],
    exercises: [
      { prompt: "Give du-imperative of 'lernen'.", answer: "Lern!" },
      { prompt: "Give ihr-imperative of 'kaufen'.", answer: "Kauft!" },
      { prompt: "Give Sie-imperative of 'kommen'.", answer: "Kommen Sie!" },
      { prompt: "Translate: Call me! (du, anrufen)", answer: "Ruf mich an!" },
      { prompt: "Translate: Speak louder! (du)", answer: "Sprich lauter!" },
    ],
    speakingPrompts: [
      "Give 3 commands to a friend (du form).",
      "Give the same commands formally (Sie form).",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 20: Imperative (Commands — du/ihr/Sie forms).

Your role: Give me a verb and a target form (du/ihr/Sie) and ask me to produce the correct imperative. Include separable verbs, strong verbs with e→i change, and 'sein'. Correct mistakes and explain the rule briefly.

Start with: "Imperative drill! Give the du-form of 'lernen' — go!"`,
    summary:
      "du: stem (no pronoun, e→i change kept). ihr: ihr-form no pronoun. Sie: infinitive + Sie. Separable prefix to end. sein is irregular: sei/seid/seien Sie.",
  },
  {
    id: "ch21",
    number: 21,
    title: "Past Tense",
    subtitle: "Präteritum of sein & haben",
    explanation:
      "In spoken German, the simple past (Präteritum) is mainly used for 'sein' and 'haben'. For other verbs, you use the Perfekt (Chapter 22). These two must be memorized.",
    rule:
      "sein (to be): ich war · du warst · er war · wir waren · ihr wart · sie waren\nhaben (to have): ich hatte · du hattest · er hatte · wir hatten · ihr hattet · sie hatten",
    table: {
      headers: ["Pronoun", "sein (was/were)", "haben (had)"],
      rows: [
        ["ich", "war", "hatte"],
        ["du", "warst", "hattest"],
        ["er/sie/es", "war", "hatte"],
        ["wir", "waren", "hatten"],
        ["ihr", "wart", "hattet"],
        ["sie/Sie", "waren", "hatten"],
      ],
    },
    notes: [
      "In spoken German, use Präteritum ONLY for sein and haben. Use Perfekt for everything else.",
      "Written German uses Präteritum more broadly, but for A1 speaking focus on sein/haben.",
      "'war' and 'hatte' are the most useful forms — ich/er/sie/es are identical.",
    ],
    examples: [
      { de: "Ich war in Berlin.", en: "I was in Berlin." },
      { de: "Du warst müde.", en: "You were tired." },
      { de: "Wir waren zu Hause.", en: "We were at home." },
      { de: "Ich hatte keine Zeit.", en: "I had no time." },
      { de: "Er hatte Hunger.", en: "He was hungry." },
      { de: "Wir hatten viel Spaß.", en: "We had a lot of fun." },
    ],
    mistakes: [
      "WRONG: 'Ich war gehabt Zeit.' — Präteritum doesn't combine with participles.",
      "Don't use 'hatte gehabt' or 'war gewesen' — just 'hatte' and 'war' for A1.",
      "WRONG: 'Wir sind gewesen' for 'we were' — use 'wir waren' instead.",
    ],
    exercises: [
      { prompt: "Fill in: Ich ___ in München. (was)", answer: "war" },
      { prompt: "Fill in: Wir ___ keine Zeit. (had)", answer: "hatten" },
      { prompt: "Fill in: Du ___ müde. (were)", answer: "warst" },
      { prompt: "Translate: He was hungry.", answer: "Er hatte Hunger." },
      { prompt: "Translate: They were at home.", answer: "Sie waren zu Hause." },
    ],
    speakingPrompts: [
      "Say where you were yesterday: Ich war…",
      "Say what you had or didn't have: Ich hatte / Ich hatte keine…",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 21: Präteritum of sein and haben.

Your role: Drill me on all forms of 'war' (sein) and 'hatte' (haben) across all pronouns. Ask fill-in sentences, translation tasks, and short speaking scenarios. Remind me that in spoken German only these two verbs use Präteritum — everything else uses Perfekt.

Start with: "Präteritum time! Fill in: Ich ___ in Berlin. (was) — go!"`,
    summary:
      "Präteritum of sein: war warst war waren wart waren. Haben: hatte hattest hatte hatten hattet hatten. Use these for past in spoken German.",
  },
  {
    id: "ch22",
    number: 22,
    title: "Perfekt",
    subtitle: "Present Perfect Tense",
    explanation:
      "The Perfekt is the main spoken past tense in German. It uses a helper verb (haben or sein) in position 2 and a past participle at the end of the sentence.",
    rule:
      "Structure: Subject + haben/sein (pos.2) + … + Partizip II (end)\n\nRegular participles: ge- + stem + -t (gemacht, gelernt, gekauft)\nIrregular participles: ge- + stem change + -en (gegessen, gelesen, gesprochen, gefahren, genommen)\n\nSein is used with: verbs of movement or change of state (gehen→gegangen, fahren→gefahren, kommen→gekommen, bleiben→geblieben, werden→geworden)",
    table: {
      headers: ["Infinitive", "Helper", "Partizip II", "Type"],
      rows: [
        ["lernen", "haben", "gelernt", "regular (ge-+stem+-t)"],
        ["kaufen", "haben", "gekauft", "regular"],
        ["machen", "haben", "gemacht", "regular"],
        ["essen", "haben", "gegessen", "irregular (ge-+change+-en)"],
        ["lesen", "haben", "gelesen", "irregular"],
        ["sprechen", "haben", "gesprochen", "irregular"],
        ["fahren", "sein", "gefahren", "irregular + sein"],
        ["gehen", "sein", "gegangen", "irregular + sein"],
        ["kommen", "sein", "gekommen", "irregular + sein"],
        ["bleiben", "sein", "geblieben", "irregular + sein"],
        ["einkaufen", "haben", "eingekauft", "separable (ge- between)"],
        ["studieren", "haben", "studiert", "no ge- (-ieren verbs)"],
      ],
    },
    notes: [
      "Most verbs use 'haben'. Motion/state-change verbs use 'sein'.",
      "Separable verbs: ge- goes between prefix and stem: eingekauft, angerufen.",
      "Verbs ending in -ieren: no 'ge-' prefix → studiert, telefoniert.",
    ],
    examples: [
      { de: "Ich habe Deutsch gelernt.", en: "I learned/have learned German." },
      { de: "Wir haben das Buch gekauft.", en: "We bought the book." },
      { de: "Er hat gegessen.", en: "He has eaten." },
      { de: "Sie hat das Buch gelesen.", en: "She read the book." },
      { de: "Ich bin nach Berlin gefahren.", en: "I went/drove to Berlin." },
      { de: "Er ist nach Hause gegangen.", en: "He went home." },
      { de: "Wir sind lange geblieben.", en: "We stayed a long time." },
      { de: "Ich habe eingekauft.", en: "I went shopping. (separable)" },
    ],
    mistakes: [
      "WRONG: 'Ich habe nach Berlin gegangen.' — fahren/gehen use 'sein', not 'haben'.",
      "WRONG: 'Ich bin Deutsch gelernt.' — lernen uses 'haben': 'Ich habe gelernt'.",
      "Don't put the participle in position 2 — it ALWAYS goes to the end.",
    ],
    exercises: [
      { prompt: "Form Perfekt: ich / Deutsch lernen", answer: "Ich habe Deutsch gelernt." },
      { prompt: "Form Perfekt: er / nach Berlin fahren", answer: "Er ist nach Berlin gefahren." },
      { prompt: "Form Perfekt: wir / das Buch lesen", answer: "Wir haben das Buch gelesen." },
      { prompt: "Form Perfekt: sie / nach Hause gehen", answer: "Sie ist nach Hause gegangen." },
      { prompt: "Translate: I bought a book.", answer: "Ich habe ein Buch gekauft." },
    ],
    speakingPrompts: [
      "Say 3 things you did today using Perfekt: Ich habe… / Ich bin…",
      "Tell a partner about your weekend using 3 Perfekt sentences.",
    ],
    aiPrompt: `You are my German A1 tutor. We are practicing Chapter 22: Perfekt (Present Perfect Tense).

Your role: Ask me to form Perfekt sentences. Cover: regular verbs (ge-+stem+-t), irregular verbs (ge-+stem+-en), haben vs sein choice, separable verbs (ge- between prefix/stem), and -ieren verbs (no ge-). Correct mistakes and explain the rule. This is the most important spoken past tense!

Start with: "Perfekt practice! Form the Perfekt: ich / Deutsch lernen — go!"`,
    summary:
      "Perfekt = haben/sein (pos.2) + Partizip II (end). Regular: ge-+stem+-t. Irregular: ge-+stem+-en. sein for movement/change. Separable: ge- between prefix+stem.",
  },
];

// ─── A2 Grammar Chapters ──────────────────────────────────────────────────────

export const A2_GRAMMAR_CHAPTERS: GrammarChapter[] = [
  {
    id: "a2ch01",
    number: 1,
    title: "Two-Way Prepositions",
    subtitle: "Wechselpräpositionen",
    explanation:
      "Nine German prepositions can take either Dativ or Akkusativ depending on meaning. The key question is: are we describing a LOCATION (Wo? → Dativ) or a MOVEMENT/DESTINATION (Wohin? → Akkusativ)? These prepositions are: in, an, auf, neben, hinter, über, unter, vor, zwischen.",
    rule:
      "Wo? (location/static) → Dativ | Wohin? (movement/destination) → Akkusativ",
    table: {
      headers: ["Preposition", "Dativ (Wo?)", "Akkusativ (Wohin?)"],
      rows: [
        ["in", "Das Buch ist in der Tasche.", "Ich lege das Buch in die Tasche."],
        ["an", "Das Bild hängt an der Wand.", "Ich hänge das Bild an die Wand."],
        ["auf", "Die Tasse steht auf dem Tisch.", "Ich stelle die Tasse auf den Tisch."],
        ["neben", "Er sitzt neben dem Fenster.", "Er setzt sich neben das Fenster."],
        ["unter", "Die Katze liegt unter dem Bett.", "Die Katze geht unter das Bett."],
        ["über", "Das Bild hängt über dem Sofa.", "Ich hänge es über das Sofa."],
        ["vor", "Das Auto steht vor dem Haus.", "Er fährt das Auto vor das Haus."],
        ["hinter", "Er schläft hinter der Tür.", "Er geht hinter die Tür."],
        ["zwischen", "Das Glas steht zwischen den Tellern.", "Stell das Glas zwischen die Teller."],
      ],
    },
    notes: [
      "Key verb pairs signal case: sitzen/setzen, stehen/stellen, liegen/legen, hängen (static) vs hängen (movement).",
      "Contractions: im (in dem), ins (in das), am (an dem), ans (an das), vom (von dem), zum (zu dem).",
      "Movement verbs like gehen, fahren, laufen, legen, stellen always trigger Akkusativ.",
      "State/position verbs like sein, stehen, liegen, sitzen, hängen always trigger Dativ.",
    ],
    examples: [
      { de: "Das Buch ist in der Tasche.", en: "The book is in the bag. (Wo? → Dativ)" },
      { de: "Ich lege das Buch in die Tasche.", en: "I put the book into the bag. (Wohin? → Akkusativ)" },
      { de: "Die Tasse steht auf dem Tisch.", en: "The cup is on the table. (Dativ)" },
      { de: "Ich stelle die Tasse auf den Tisch.", en: "I place the cup onto the table. (Akkusativ)" },
      { de: "Er geht ins Kino.", en: "He goes to the cinema. (ins = in das → Akkusativ)" },
      { de: "Er ist im Kino.", en: "He is at the cinema. (im = in dem → Dativ)" },
    ],
    mistakes: [
      "Don't use Akkusativ for location: ❌ Ich bin in die Küche. ✓ Ich bin in der Küche.",
      "Don't use Dativ for movement: ❌ Ich gehe in dem Supermarkt. ✓ Ich gehe in den Supermarkt.",
      "Remember: stellen/legen/setzen/hängen (movement) → Akkusativ.",
    ],
    exercises: [
      { prompt: "Fill in: Das Buch liegt ___ dem Tisch. (on, location)", answer: "auf" },
      { prompt: "Fill in (correct case): Ich lege das Buch auf ___ Tisch. (der/den)", answer: "den (Akkusativ — movement)" },
      { prompt: "Fill in (correct case): Die Lampe hängt über ___ Tisch. (der/den)", answer: "dem (Dativ — location)" },
      { prompt: "Translate: He puts the cup onto the table.", answer: "Er stellt die Tasse auf den Tisch." },
      { prompt: "Translate: She is sitting next to the window.", answer: "Sie sitzt neben dem Fenster." },
    ],
    speakingPrompts: [
      "Look around your room. Say where 5 things are using Dativ (Wo ist... ?).",
      "Now say where you would put those 5 things using Akkusativ (Ich stelle... / Ich lege...).",
      "Practice: ins vs im — use each in a sentence.",
    ],
    summary:
      "9 prepositions: in, an, auf, neben, hinter, über, unter, vor, zwischen. Wo? → Dativ. Wohin? → Akkusativ. Stehen/liegen/sitzen → Dativ. Stellen/legen/setzen → Akkusativ.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 1: Two-Way Prepositions (Wechselpräpositionen).

The 9 prepositions are: in, an, auf, neben, hinter, über, unter, vor, zwischen.
Rule: Wo? (location) → Dativ | Wohin? (movement/destination) → Akkusativ

Key verb pairs: liegen/legen, stehen/stellen, sitzen/setzen, hängen(static)/hängen(movement)
Contractions: im, ins, am, ans

Please drill me with:
1. Fill-in-the-blank with correct case (der/die/das → dem/der/dem or den/die/das)
2. Choose Dativ or Akkusativ for a given sentence
3. Translate sentences that require these prepositions
4. Identify whether the verb signals location or movement

Correct all mistakes and explain WHY the case changes. Start with: "Two-way preposition drill! Where is the book? Das Buch liegt ___ dem Tisch. (in/auf/an?) — go!"`,
  },

  {
    id: "a2ch02",
    number: 2,
    title: "Verbs with Two Objects",
    subtitle: "Dativ & Akkusativ",
    explanation:
      "Some German verbs take two objects: one in Dativ (the person who receives) and one in Akkusativ (the thing being given or shown). Common verbs include: geben, zeigen, schenken, schicken, erklären, bringen, verkaufen, leihen, kaufen. The word order changes depending on whether the objects are nouns or pronouns.",
    rule:
      "Noun + Noun: Dativ before Akkusativ | Pronoun replaces either: pronoun comes first | Two pronouns: Akkusativ before Dativ",
    table: {
      headers: ["Structure", "Example", "Translation"],
      rows: [
        ["Dativ noun + Akkusativ noun", "Ich gebe dem Mann das Buch.", "I give the man the book."],
        ["Dativ pronoun + Akkusativ noun", "Ich gebe ihm das Buch.", "I give him the book."],
        ["Dativ noun + Akkusativ pronoun", "Ich gebe es dem Mann.", "I give it to the man."],
        ["Two pronouns (Akk first!)", "Ich gebe es ihm.", "I give it to him."],
      ],
    },
    notes: [
      "WHO receives = Dativ. WHAT is given = Akkusativ.",
      "When both objects are nouns: Dativ before Akkusativ.",
      "When using a pronoun: pronoun comes before the noun.",
      "When both are pronouns: Akkusativ pronoun comes BEFORE Dativ pronoun.",
    ],
    examples: [
      { de: "Ich gebe dem Mann das Buch.", en: "I give the man the book." },
      { de: "Ich gebe ihm das Buch.", en: "I give him the book." },
      { de: "Ich gebe es dem Mann.", en: "I give it to the man." },
      { de: "Ich gebe es ihm.", en: "I give it to him." },
      { de: "Sie zeigt ihrer Freundin die Stadt.", en: "She shows her friend the city." },
      { de: "Er schenkt ihr eine Rose.", en: "He gives her a rose (as a gift)." },
    ],
    mistakes: [
      "Don't put Akkusativ before Dativ when both are nouns: ❌ Ich gebe das Buch dem Mann. ✓ Ich gebe dem Mann das Buch.",
      "Don't forget: when BOTH are pronouns, Akkusativ comes FIRST: ✓ Ich gebe es ihm.",
      "Don't confuse ihm (Dativ, he) and ihn (Akkusativ, he).",
    ],
    exercises: [
      { prompt: "Fill in: Ich zeige ___ Mutter die Stadt. (my, Dativ)", answer: "meiner" },
      { prompt: "Rewrite with pronouns: Ich gebe dem Kind das Buch.", answer: "Ich gebe es ihm." },
      { prompt: "Translate: She sends her friend a letter.", answer: "Sie schickt ihrer Freundin einen Brief." },
      { prompt: "Fill in: Ich bringe ___ den Kaffee. (him, Dativ pronoun)", answer: "ihm" },
      { prompt: "Correct word order: Ich erkläre das Problem meinem Lehrer.", answer: "Ich erkläre meinem Lehrer das Problem." },
    ],
    speakingPrompts: [
      "Say: I give my mother flowers / I send my friend a message / I show my teacher the homework.",
      "Practice substituting nouns with pronouns in your sentences.",
      "Roleplay: You're giving a gift. Use schenken with full Dativ + Akkusativ objects.",
    ],
    summary:
      "Dativ = receiver (person). Akkusativ = thing given. Noun+Noun: Dativ first. With pronoun: pronoun first. Two pronouns: Akkusativ before Dativ.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 2: Verbs with Two Objects (Dativ & Akkusativ).

Key verbs: geben, zeigen, schenken, schicken, erklären, bringen, verkaufen, leihen, kaufen
WHO receives = Dativ | WHAT is given/shown = Akkusativ

Word order rules:
- Noun + Noun → Dativ before Akkusativ: Ich gebe dem Mann das Buch.
- Pronoun + Noun → pronoun comes first: Ich gebe ihm das Buch.
- Two pronouns → Akkusativ before Dativ: Ich gebe es ihm.

Please drill me with:
1. Build sentences from given elements (verb + person + thing)
2. Replace nouns with pronouns
3. Correct wrong word order
4. Translate English sentences

Correct mistakes and explain the word-order rule. Start with: "Dativ + Akkusativ drill! Ich gebe ___ ___ (the man / the book). Fill in the correct forms!"`,
  },

  {
    id: "a2ch03",
    number: 3,
    title: "Reflexive Verbs",
    subtitle: "Reflexivverben",
    explanation:
      "Reflexive verbs describe actions that the subject performs on itself. They require a reflexive pronoun (mich, dich, sich, uns, euch, sich) that reflects back to the subject. Many German verbs are reflexive that aren't in English — e.g., sich freuen (to be happy), sich beeilen (to hurry), sich interessieren für (to be interested in).",
    rule:
      "Subject + conjugated verb + reflexive pronoun (+ rest of sentence)",
    table: {
      headers: ["Person", "Reflexive Pronoun", "Example"],
      rows: [
        ["ich", "mich", "Ich wasche mich."],
        ["du", "dich", "Du wäschst dich."],
        ["er/sie/es", "sich", "Er wäscht sich."],
        ["wir", "uns", "Wir waschen uns."],
        ["ihr", "euch", "Ihr wascht euch."],
        ["sie/Sie", "sich", "Sie waschen sich."],
      ],
    },
    notes: [
      "In Perfekt: haben + reflexive pronoun + Partizip II. Er hat sich gewaschen.",
      "Reflexive pronoun goes directly after the conjugated verb.",
      "In a Nebensatz: reflexive pronoun follows the subject. Ich weiß, dass er sich freut.",
      "Some verbs can be reflexive OR non-reflexive with different meanings: Er wäscht das Auto. vs. Er wäscht sich.",
    ],
    examples: [
      { de: "Ich ziehe mich an.", en: "I get dressed." },
      { de: "Beeile dich!", en: "Hurry up!" },
      { de: "Sie freut sich auf den Urlaub.", en: "She is looking forward to the holiday." },
      { de: "Wir treffen uns um 8 Uhr.", en: "We meet at 8 o'clock." },
      { de: "Er hat sich erkältet.", en: "He caught a cold." },
      { de: "Ich interessiere mich für Musik.", en: "I am interested in music." },
    ],
    mistakes: [
      "Don't omit the reflexive pronoun: ❌ Ich freue auf den Urlaub. ✓ Ich freue mich auf den Urlaub.",
      "Don't use the wrong reflexive pronoun: ❌ Du wäscht mich. ✓ Du wäschst dich.",
      "In Perfekt, don't move the reflexive pronoun to the end: ❌ Er hat gewaschen sich. ✓ Er hat sich gewaschen.",
    ],
    exercises: [
      { prompt: "Fill in: Ich ___ ___ beeile. (verb + reflex.pronoun)", answer: "beeile mich" },
      { prompt: "Fill in: Er freut ___ auf das Konzert.", answer: "sich" },
      { prompt: "Perfekt: sie / sich waschen", answer: "Sie hat sich gewaschen." },
      { prompt: "Translate: We are meeting at 7.", answer: "Wir treffen uns um 7 Uhr." },
      { prompt: "Translate: Are you interested in sport?", answer: "Interessierst du dich für Sport?" },
    ],
    speakingPrompts: [
      "Describe your morning routine using 5 reflexive verbs: sich waschen, sich anziehen, sich kämmen, sich beeilen, sich setzen.",
      "Say what you are looking forward to using: Ich freue mich auf…",
      "Say what you are interested in: Ich interessiere mich für…",
    ],
    summary:
      "Reflexive verbs need reflexive pronouns: mich, dich, sich, uns, euch, sich. Pronoun goes after conjugated verb. Perfekt: haben + sich + Partizip II.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 3: Reflexive Verbs (Reflexivverben).

Reflexive pronouns: ich→mich, du→dich, er/sie/es→sich, wir→uns, ihr→euch, sie/Sie→sich

Key verbs: sich anziehen, sich beeilen, sich freuen (auf/über), sich fühlen, sich interessieren für, sich treffen, sich waschen, sich setzen, sich ärgern, sich entspannen, sich erkälten

Perfekt: haben + reflexive pronoun + Partizip II

Please drill me with:
1. Fill-in-the-blank (missing reflexive pronoun)
2. Form Perfekt sentences with reflexive verbs
3. Translate sentences using common reflexive verbs
4. Spot the mistake in wrong sentences

Start with: "Reflexive verb drill! Ich ___ mich / dich / sich? Er freut ___ auf das Wochenende. Fill in!"`,
  },

  {
    id: "a2ch04",
    number: 4,
    title: "Verbs with Fixed Prepositions",
    subtitle: "Verben mit festen Präpositionen",
    explanation:
      "Many German verbs are always paired with a specific preposition and a specific case. You must learn verb + preposition + case as one unit, because you cannot always predict which preposition a verb takes. These are called fixed or collocated prepositions.",
    rule:
      "Learn verb + preposition + case as a set. The preposition determines the case.",
    table: {
      headers: ["Verb + Preposition", "Case", "Example"],
      rows: [
        ["warten auf", "Akkusativ", "Ich warte auf den Bus."],
        ["sich freuen auf", "Akkusativ", "Ich freue mich auf den Urlaub."],
        ["sich freuen über", "Akkusativ", "Ich freue mich über das Geschenk."],
        ["sich interessieren für", "Akkusativ", "Er interessiert sich für Musik."],
        ["denken an", "Akkusativ", "Ich denke an dich."],
        ["träumen von", "Dativ", "Sie träumt von einer Reise."],
        ["sprechen mit", "Dativ", "Ich spreche mit meinem Lehrer."],
        ["sich ärgern über", "Akkusativ", "Er ärgert sich über den Stau."],
        ["sich kümmern um", "Akkusativ", "Sie kümmert sich um die Kinder."],
        ["Angst haben vor", "Dativ", "Er hat Angst vor Hunden."],
      ],
    },
    notes: [
      "sich freuen auf = forward-looking anticipation (future). Ich freue mich auf morgen.",
      "sich freuen über = happiness about something present or past. Ich freue mich über das Geschenk.",
      "Most prepositions in these combinations are fixed — you cannot substitute another preposition.",
      "When the object is a thing (not a person), you can use a da-word instead (covered in Ch.5).",
    ],
    examples: [
      { de: "Ich warte auf den Zug.", en: "I am waiting for the train." },
      { de: "Sie freut sich auf die Party.", en: "She is looking forward to the party." },
      { de: "Er freut sich über die Note.", en: "He is happy about the grade." },
      { de: "Ich denke oft an meine Familie.", en: "I often think about my family." },
      { de: "Sie träumt von einem Haus am Meer.", en: "She dreams of a house by the sea." },
    ],
    mistakes: [
      "Don't mix up freuen auf (future) and freuen über (present/past result): ❌ Ich freue mich auf das Geschenk. (if you already received it) ✓ Ich freue mich über das Geschenk.",
      "Don't forget the reflexive pronoun with reflexive verbs: ❌ Ich freue auf die Ferien. ✓ Ich freue mich auf die Ferien.",
      "Don't change the case: warten auf always takes Akkusativ, not Dativ.",
    ],
    exercises: [
      { prompt: "Fill in: Ich warte ___ den Bus. (preposition)", answer: "auf" },
      { prompt: "Fill in: Sie träumt ___ einer Weltreise.", answer: "von" },
      { prompt: "Fill in (freuen): Er ___ sich ___ das Wochenende. (looking forward to)", answer: "freut … auf" },
      { prompt: "Translate: I am interested in German culture.", answer: "Ich interessiere mich für die deutsche Kultur." },
      { prompt: "Translate: She is afraid of spiders.", answer: "Sie hat Angst vor Spinnen." },
    ],
    speakingPrompts: [
      "Say 3 things you are looking forward to: Ich freue mich auf…",
      "Say 2 things you are interested in: Ich interessiere mich für…",
      "Say what you are waiting for right now: Ich warte auf…",
    ],
    summary:
      "Learn verb + preposition + case as fixed units. Key pairs: warten auf (Akk), sich freuen auf (Akk, future), sich freuen über (Akk, present/past), träumen von (Dat), sprechen mit (Dat).",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 4: Verbs with Fixed Prepositions.

Key verb + preposition + case combinations:
- warten auf + Akk
- sich freuen auf + Akk (future anticipation)
- sich freuen über + Akk (current/past happiness)
- sich interessieren für + Akk
- denken an + Akk
- träumen von + Dat
- sprechen mit + Dat
- sich ärgern über + Akk
- sich kümmern um + Akk
- Angst haben vor + Dat

Please drill me with:
1. Fill in the correct preposition
2. Fill in the correct article (with correct case)
3. Distinguish freuen auf vs freuen über
4. Translate sentences

Correct all mistakes and explain the rule. Start with: "Fixed preposition drill! Ich warte ___ den Zug. Which preposition?"`,
  },

  {
    id: "a2ch05",
    number: 5,
    title: "Da-Words & Wo-Words",
    subtitle: "Pronominaladverbien",
    explanation:
      "Da-words (daran, dafür, damit, darauf, darüber, etc.) replace prepositional phrases that refer to THINGS or IDEAS. Wo-words (worauf, wofür, womit, woran, worüber, etc.) are used in QUESTIONS about THINGS or IDEAS. Crucially: these words are NEVER used for people. For people, use normal pronouns (ihn, ihr, ihnen) with prepositions.",
    rule:
      "For things/ideas: da(r) + preposition | For questions about things: wo(r) + preposition | For people: preposition + pronoun (auf ihn, mit ihr, an sie)",
    table: {
      headers: ["Preposition", "Da-word", "Wo-word"],
      rows: [
        ["auf", "darauf", "worauf"],
        ["für", "dafür", "wofür"],
        ["mit", "damit", "womit"],
        ["an", "daran", "woran"],
        ["über", "darüber", "worüber"],
        ["in", "darin", "worin"],
        ["von", "davon", "wovon"],
        ["zu", "dazu", "wozu"],
        ["nach", "danach", "wonach"],
      ],
    },
    notes: [
      "Add 'r' before prepositions starting with a vowel: darauf (not daauf), worüber (not woüber).",
      "Da-words = answers. Wo-words = questions. Both = only for things/ideas, NEVER people.",
      "For people: Auf wen wartest du? Ich warte auf ihn. NOT: Worauf wartest du? (for a person).",
      "Da-words often replace a whole clause: Ich freue mich darauf, dass… (I look forward to the fact that…)",
    ],
    examples: [
      { de: "Worauf wartest du? — Darauf warte ich.", en: "What are you waiting for? — I'm waiting for that." },
      { de: "Wofür interessierst du dich? — Ich interessiere mich dafür.", en: "What are you interested in? — I'm interested in that." },
      { de: "Ich denke oft daran.", en: "I often think about it." },
      { de: "Auf wen wartest du? — Auf meinen Freund.", en: "Who are you waiting for? — For my friend. (person → use pronoun)" },
      { de: "Womit schreibst du? — Damit. (mit einem Stift)", en: "What are you writing with? — With that. (with a pen)" },
    ],
    mistakes: [
      "Don't use da-/wo-words for people: ❌ Worauf wartest du? (person) ✓ Auf wen wartest du?",
      "Don't forget the 'r' before vowels: ❌ daauf ✓ darauf | ❌ woüber ✓ worüber",
      "Don't confuse da (there, adverb) with da- (prefix in da-words).",
    ],
    exercises: [
      { prompt: "Form a da-word: auf → ?", answer: "darauf" },
      { prompt: "Form a wo-word: über → ?", answer: "worüber" },
      { prompt: "Replace: Ich warte auf den Zug. → Ich warte ___.", answer: "darauf" },
      { prompt: "Question (thing): ___ wartest du? (What are you waiting for?)", answer: "Worauf" },
      { prompt: "Question (person): ___ wartest du? (Who are you waiting for?)", answer: "Auf wen" },
    ],
    speakingPrompts: [
      "Answer questions using da-words: Wartest du auf den Bus? Ja, ich warte darauf.",
      "Ask questions using wo-words about 3 things you own or use daily.",
      "Practice distinguishing person vs thing: make one sentence for each.",
    ],
    summary:
      "Da(r)+preposition = answer about things. Wo(r)+preposition = question about things. Add -r- before vowels. NEVER for people — use preposition + pronoun instead.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 5: Da-Words and Wo-Words (Pronominaladverbien).

Rules:
- da(r) + preposition = answers about things/ideas: darauf, dafür, damit, daran, darüber, darin, davon, dazu
- wo(r) + preposition = questions about things/ideas: worauf, wofür, womit, woran, worüber, worin, wovon, wozu
- Add 'r' before prepositions starting with a vowel: darauf, worüber (NOT daauf, woüber)
- NEVER for people → use: auf ihn, mit ihr, von wem, für wen

Please drill me with:
1. Form da-words and wo-words from given prepositions
2. Replace full prepositional phrases with da-words
3. Form questions using wo-words
4. Choose between person and thing (decide: da-word or pronoun)

Correct all errors and explain WHY. Start with: "Da-word drill! Replace: Ich denke an die Arbeit. → Ich denke ___?"`,
  },

  {
    id: "a2ch06",
    number: 6,
    title: "Subordinating Conjunctions",
    subtitle: "dass, weil, obwohl",
    explanation:
      "Subordinating conjunctions introduce dependent clauses (Nebensätze). The key rule: in a Nebensatz, the conjugated verb goes to the END of the clause. The three most important conjunctions at A2 are: dass (that), weil (because), and obwohl (although/even though). A Nebensatz is always separated from the main clause by a comma.",
    rule:
      "Main clause + comma + subordinating conjunction + subject + ... + VERB (end)",
    table: {
      headers: ["Conjunction", "Meaning", "Example"],
      rows: [
        ["dass", "that", "Ich glaube, dass er kommt."],
        ["weil", "because", "Ich schlafe, weil ich müde bin."],
        ["obwohl", "although", "Obwohl es regnet, gehe ich spazieren."],
        ["wenn", "when/if", "Ich rufe an, wenn ich Zeit habe."],
        ["ob", "whether/if", "Ich weiß nicht, ob er kommt."],
      ],
    },
    notes: [
      "Nebensatz verb always goes to the end — even modals: Ich komme nicht, weil ich arbeiten muss.",
      "If the Nebensatz comes FIRST, the main clause inverts: subject and verb swap. Obwohl es regnet, GEHE ICH spazieren.",
      "Comma is ALWAYS required between main clause and Nebensatz.",
      "obwohl = contrast/surprise. Similar to 'but' in meaning. Don't confuse with trotzdem (Ch.9).",
    ],
    examples: [
      { de: "Ich glaube, dass du Recht hast.", en: "I believe that you are right." },
      { de: "Ich schlafe früh, weil ich müde bin.", en: "I go to sleep early because I am tired." },
      { de: "Obwohl es regnet, gehe ich spazieren.", en: "Although it is raining, I am going for a walk." },
      { de: "Er kommt nicht, weil er arbeiten muss.", en: "He is not coming because he has to work." },
      { de: "Ich weiß nicht, ob sie heute kommt.", en: "I don't know whether she is coming today." },
    ],
    mistakes: [
      "Don't forget verb-final order: ❌ Ich komme nicht, weil ich bin müde. ✓ Ich komme nicht, weil ich müde bin.",
      "Don't forget inversion when Nebensatz leads: ❌ Obwohl es regnet, ich gehe. ✓ Obwohl es regnet, gehe ich.",
      "Don't forget the comma: ❌ Ich glaube dass er kommt. ✓ Ich glaube, dass er kommt.",
    ],
    exercises: [
      { prompt: "Combine: Ich bin müde. Ich gehe früh schlafen. (weil)", answer: "Ich gehe früh schlafen, weil ich müde bin." },
      { prompt: "Combine: Es ist kalt. Ich gehe spazieren. (obwohl)", answer: "Obwohl es kalt ist, gehe ich spazieren." },
      { prompt: "Fill in verb position: Ich glaube, dass er morgen ___. (kommen)", answer: "kommt" },
      { prompt: "Translate: I know that she speaks German.", answer: "Ich weiß, dass sie Deutsch spricht." },
      { prompt: "Translate: Although he is tired, he works.", answer: "Obwohl er müde ist, arbeitet er." },
    ],
    speakingPrompts: [
      "Say 3 reasons why you like/dislike something using weil: Ich mag… weil…",
      "Express a contrast using obwohl: Obwohl ich müde bin, …",
      "Say 2 things you believe using dass: Ich glaube, dass…",
    ],
    summary:
      "dass, weil, obwohl → verb goes to END of Nebensatz. Always use comma. When Nebensatz leads, main clause inverts (verb before subject).",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 6: Subordinating Conjunctions (dass, weil, obwohl).

Key rule: In a Nebensatz, the conjugated verb goes to the END.
- dass = that: Ich glaube, dass er kommt.
- weil = because: Ich schlafe, weil ich müde bin.
- obwohl = although: Obwohl es regnet, gehe ich spazieren.
- Comma always between main clause and Nebensatz
- When Nebensatz starts the sentence → main clause inverts

Please drill me with:
1. Combine two sentences with weil / obwohl / dass
2. Fix verb position in incorrect Nebensätze
3. Write sentences starting with obwohl (inversion practice)
4. Translate complex sentences

Correct mistakes and explain the rule. Start with: "Nebensatz drill! Combine: Ich bin müde. Ich gehe schlafen. (weil) → ?"`,
  },

  {
    id: "a2ch07",
    number: 7,
    title: "Indirect Questions",
    subtitle: "Indirekte Fragen",
    explanation:
      "Indirect questions are questions embedded inside another clause. They behave exactly like Nebensätze: the verb goes to the END. For W-questions (Wer, Was, Wo, Wann, etc.), you keep the W-word. For yes/no questions, you use 'ob' (whether). Indirect questions are polite and common in formal German.",
    rule:
      "W-question → keep the W-word, verb to end | Yes/No question → use 'ob', verb to end",
    table: {
      headers: ["Question type", "Direct", "Indirect"],
      rows: [
        ["W-question", "Wo wohnt er?", "Ich weiß nicht, wo er wohnt."],
        ["W-question", "Wann kommt sie?", "Kannst du mir sagen, wann sie kommt?"],
        ["Yes/No", "Kommt er heute?", "Ich weiß nicht, ob er heute kommt."],
        ["Yes/No", "Spricht sie Deutsch?", "Ich frage mich, ob sie Deutsch spricht."],
      ],
    },
    notes: [
      "No question mark at the end of indirect questions — they are statements.",
      "Polite starters: Können Sie mir sagen... / Ich möchte wissen... / Weißt du... / Darf ich fragen...",
      "Ob = whether/if — ONLY for yes/no indirect questions. Never use ob for W-questions.",
      "The main verb of the outer clause is NOT affected — only the embedded verb goes to the end.",
    ],
    examples: [
      { de: "Können Sie mir sagen, wo der Bahnhof ist?", en: "Could you tell me where the train station is?" },
      { de: "Ich weiß nicht, ob du heute kommst.", en: "I don't know whether you are coming today." },
      { de: "Er fragt, wann das Konzert beginnt.", en: "He asks when the concert begins." },
      { de: "Ich möchte wissen, wie viel das kostet.", en: "I would like to know how much this costs." },
      { de: "Weißt du, ob der Zug schon weg ist?", en: "Do you know whether the train has already left?" },
    ],
    mistakes: [
      "Don't keep direct question word order: ❌ Ich weiß nicht, wo ist er. ✓ Ich weiß nicht, wo er ist.",
      "Don't use ob with W-questions: ❌ Ich weiß nicht, ob wo er wohnt. ✓ Ich weiß nicht, wo er wohnt.",
      "Don't add a question mark to indirect questions: ❌ Ich weiß nicht, wo er wohnt? ✓ Ich weiß nicht, wo er wohnt.",
    ],
    exercises: [
      { prompt: "Make indirect: Wo ist das Hotel? (Ich weiß nicht, ...)", answer: "Ich weiß nicht, wo das Hotel ist." },
      { prompt: "Make indirect: Kommt sie morgen? (Ich frage mich, ob ...)", answer: "Ich frage mich, ob sie morgen kommt." },
      { prompt: "Translate: Could you tell me when the store opens?", answer: "Können Sie mir sagen, wann das Geschäft öffnet?" },
      { prompt: "Translate: I don't know whether he speaks German.", answer: "Ich weiß nicht, ob er Deutsch spricht." },
      { prompt: "Fix: Ich möchte wissen, wie viel kostet das.", answer: "Ich möchte wissen, wie viel das kostet." },
    ],
    speakingPrompts: [
      "Politely ask for directions using indirect questions: Können Sie mir sagen, wo… ist?",
      "Express uncertainty about 3 things: Ich weiß nicht, ob… / Ich bin nicht sicher, ob…",
      "Ask a question about time, price, or place using an indirect form.",
    ],
    summary:
      "Indirect questions: verb to END. W-question → keep W-word. Yes/No → use ob. No question mark. Polite starters: Können Sie mir sagen... / Ich weiß nicht...",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 7: Indirect Questions (Indirekte Fragen).

Rules:
- Embedded verb goes to the END (same as Nebensatz)
- W-questions: keep the W-word → Ich weiß nicht, wo er wohnt.
- Yes/No questions: use 'ob' → Ich weiß nicht, ob er kommt.
- No question mark — these are statements
- Polite starters: Können Sie mir sagen... / Ich möchte wissen... / Weißt du...

Please drill me with:
1. Convert direct questions to indirect questions
2. Choose between W-word and ob
3. Fix incorrect word order
4. Form polite requests using indirect questions

Correct mistakes and explain. Start with: "Indirect question drill! Make indirect: Wo ist der Bahnhof? → Ich weiß nicht, ___"`,
  },

  {
    id: "a2ch08",
    number: 8,
    title: "Temporal Conjunctions: als vs wenn",
    subtitle: "Temporale Konjunktionen",
    explanation:
      "Als and wenn are both temporal conjunctions meaning 'when', but they are NOT interchangeable. Als refers to a single, completed past event. Wenn refers to repeated events (past or present) or future/conditional events. Both create Nebensätze with verb-final order.",
    rule:
      "als = one-time past event | wenn = repeated events (past/present) OR any future/present/conditional event",
    table: {
      headers: ["Conjunction", "Use", "Example"],
      rows: [
        ["als", "one-time past", "Als ich jung war, spielte ich Fußball."],
        ["als", "single past event", "Als er ankam, war ich nicht da."],
        ["wenn", "repeated past", "Immer wenn ich in Berlin war, besuchte ich das Museum."],
        ["wenn", "present/future", "Wenn es regnet, bleibe ich zu Hause."],
        ["wenn", "conditional (if)", "Wenn ich Zeit habe, komme ich."],
      ],
    },
    notes: [
      "A key signal for wenn in the past: immer wenn (every time when) → repeated → wenn.",
      "Both als and wenn create Nebensätze → verb goes to end.",
      "When the wenn/als clause comes first, the main clause inverts (verb before subject).",
      "als is ONLY for the past (Präteritum/Perfekt). Never use als for present or future.",
    ],
    examples: [
      { de: "Als ich ein Kind war, liebte ich Eis.", en: "When I was a child, I loved ice cream. (one-time past state)" },
      { de: "Wenn es regnet, nehme ich einen Regenschirm.", en: "When it rains, I take an umbrella. (general/repeated)" },
      { de: "Immer wenn ich Berlin besuchte, aß ich Currywurst.", en: "Every time I visited Berlin, I ate currywurst. (repeated past)" },
      { de: "Als er ankam, schlief ich schon.", en: "When he arrived, I was already sleeping. (single past moment)" },
      { de: "Wenn du Hunger hast, essen wir.", en: "When you are hungry, we'll eat. (future/conditional)" },
    ],
    mistakes: [
      "Don't use wenn for a single past event: ❌ Wenn ich jung war, spielte ich Fußball. ✓ Als ich jung war…",
      "Don't use als for present or repeated situations: ❌ Als es regnet, bleibe ich zu Hause. ✓ Wenn es regnet…",
      "Don't forget verb-final: ❌ Als ich war jung… ✓ Als ich jung war…",
    ],
    exercises: [
      { prompt: "Choose: ___ ich ein Kind war, hatte ich keine Angst. (als/wenn)", answer: "Als (single past state)" },
      { prompt: "Choose: ___ es schneit, fahren wir Ski. (als/wenn)", answer: "Wenn (general/repeated)" },
      { prompt: "Choose: ___ er anrief, war ich nicht da. (als/wenn)", answer: "Als (single past event)" },
      { prompt: "Translate: When I was a student, I lived in Munich.", answer: "Als ich Student war, lebte ich in München." },
      { prompt: "Translate: When I have time, I read books. (general)", answer: "Wenn ich Zeit habe, lese ich Bücher." },
    ],
    speakingPrompts: [
      "Share a childhood memory: Als ich ein Kind war, …",
      "Talk about something you always do in a certain situation: Immer wenn … / Wenn …",
      "Describe what happened when something occurred: Als ich … ankam, …",
    ],
    summary:
      "als = single past event. wenn = repeated/general/future/conditional. Both: verb to end. When clause leads → main clause inverts.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 8: Temporal Conjunctions — als vs wenn.

Rules:
- als = ONE single, completed past event: Als ich jung war... / Als er ankam...
- wenn = REPEATED events (immer wenn), PRESENT situations, FUTURE/CONDITIONAL events
- Both create Nebensätze → verb to end
- Both can lead the sentence → main clause inverts

Please drill me with:
1. Choose between als and wenn for given sentences
2. Combine two clauses with the correct conjunction
3. Translate temporal sentences
4. Spot and correct mistakes

Correct all errors and explain the key distinction. Start with: "als vs wenn drill! Choose: ___ ich jung war, spielte ich draußen. (als/wenn) → Why?"`,
  },

  {
    id: "a2ch09",
    number: 9,
    title: "Adverbial Connectors",
    subtitle: "deshalb & trotzdem",
    explanation:
      "Deshalb (therefore/so) and trotzdem (nevertheless/still) are adverbial connectors that link two main clauses. They express logical consequence (deshalb) or unexpected/contrasting consequence (trotzdem). Crucially: when these words start the second clause, they occupy Position 1, which forces INVERSION: the verb comes before the subject.",
    rule:
      "Connector at Position 1 → Verb at Position 2 → Subject at Position 3. [Clause 1], [deshalb/trotzdem] + VERB + SUBJECT + …",
    table: {
      headers: ["Connector", "Meaning", "Example"],
      rows: [
        ["deshalb", "therefore/so", "Ich bin krank, deshalb gehe ich zum Arzt."],
        ["trotzdem", "nevertheless/still", "Es regnet, trotzdem gehe ich spazieren."],
        ["deshalb", "alternative position", "Ich bin krank. Deshalb gehe ich zum Arzt."],
      ],
    },
    notes: [
      "deshalb vs weil: both express reason/consequence, but different structures. weil = Nebensatz (verb last). deshalb = two main clauses (verb second).",
      "trotzdem vs obwohl: same contrast, different structure. obwohl = Nebensatz (verb last). trotzdem = two main clauses (verb second).",
      "You can also start a new sentence: Ich bin krank. Deshalb gehe ich nicht.",
      "Other similar connectors: deswegen, darum (= deshalb). dennoch, trotz allem (= trotzdem).",
    ],
    examples: [
      { de: "Ich bin krank, deshalb gehe ich zum Arzt.", en: "I am sick, therefore I am going to the doctor." },
      { de: "Es regnet, trotzdem gehe ich spazieren.", en: "It is raining, nevertheless I am going for a walk." },
      { de: "Sie hat keine Zeit, trotzdem hilft sie mir.", en: "She has no time, still she helps me." },
      { de: "Er hat Hunger, deshalb kocht er.", en: "He is hungry, so he is cooking." },
    ],
    mistakes: [
      "Don't forget inversion: ❌ Ich bin krank, deshalb ich gehe. ✓ Ich bin krank, deshalb gehe ich.",
      "Don't use deshalb like a conjunction (verb-last): ❌ …deshalb er krank ist. deshalb is NOT a Nebensatz connector.",
      "Don't confuse with weil/obwohl which DO send verb to end.",
    ],
    exercises: [
      { prompt: "Connect: Er ist müde. Er schläft. (deshalb)", answer: "Er ist müde, deshalb schläft er." },
      { prompt: "Connect: Es ist kalt. Sie geht spazieren. (trotzdem)", answer: "Es ist kalt, trotzdem geht sie spazieren." },
      { prompt: "Translate: I am tired, so I go to bed.", answer: "Ich bin müde, deshalb gehe ich ins Bett." },
      { prompt: "Translate: He has no money, but he buys a coffee anyway.", answer: "Er hat kein Geld, trotzdem kauft er einen Kaffee." },
      { prompt: "Fix: Sie hat keine Zeit, trotzdem sie hilft.", answer: "Sie hat keine Zeit, trotzdem hilft sie." },
    ],
    speakingPrompts: [
      "Give a reason and consequence: Ich lerne Deutsch, deshalb …",
      "Express something you do despite a difficulty: Ich bin müde, trotzdem …",
      "Compare: say a reason using weil AND deshalb.",
    ],
    summary:
      "deshalb = logical consequence (so/therefore). trotzdem = unexpected contrast (still/nevertheless). Both force inversion: connector + VERB + subject. Compare: weil/obwohl = Nebensatz (verb last).",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 9: Adverbial Connectors — deshalb & trotzdem.

deshalb = therefore/so → logical consequence
trotzdem = nevertheless/still → unexpected contrast

CRITICAL RULE: Both cause inversion → connector + VERB + subject
Example: Es regnet, trotzdem GEHE ICH spazieren.

Compare structures:
- weil (Nebensatz): …weil ich müde BIN.
- deshalb (main clause): Ich bin müde, deshalb GEHE ich schlafen.
- obwohl (Nebensatz): Obwohl es regnet, GEHE ich…
- trotzdem (main clause): Es regnet, trotzdem GEHE ich…

Please drill me with:
1. Connect sentences with deshalb or trotzdem
2. Fix inversion errors
3. Translate sentences
4. Convert between weil↔deshalb and obwohl↔trotzdem

Correct all mistakes. Start with: "Connector drill! Connect: Er ist krank. Er geht zur Arbeit. (trotzdem) → ?"`,
  },

  {
    id: "a2ch10",
    number: 10,
    title: "Infinitive Clauses",
    subtitle: "zu & um...zu",
    explanation:
      "Infinitive clauses use 'zu' before the infinitive. They replace a full Nebensatz when the subject of both clauses is the same. 'Um...zu' expresses PURPOSE (in order to). Both constructions place the infinitive at the END. With separable verbs, 'zu' goes between the prefix and the verb stem.",
    rule:
      "zu + infinitive (at end) | um + … + zu + infinitive (purpose) | Separable: prefix + zu + stem (e.g., einzukaufen)",
    table: {
      headers: ["Structure", "Example", "Translation"],
      rows: [
        ["zu + infinitive", "Ich habe keine Zeit, das Buch zu lesen.", "I have no time to read the book."],
        ["um...zu + infinitive", "Ich lerne Deutsch, um in Berlin zu studieren.", "I learn German in order to study in Berlin."],
        ["separable verb", "Ich gehe in den Supermarkt, um einzukaufen.", "I go to the supermarket to shop."],
        ["separable verb", "Es ist wichtig, früh aufzustehen.", "It is important to get up early."],
      ],
    },
    notes: [
      "Same-subject rule: zu-infinitive only works when both clauses share the same subject.",
      "um...zu adds PURPOSE: why something is done. Always comma before um.",
      "For separable verbs: zu goes INSIDE the word, between prefix and stem: aufzustehen, einzukaufen, anzurufen.",
      "After modal-like expressions: Es ist wichtig/schön/schwer + zu + infinitive.",
      "Verbs that take a zu-infinitive: hoffen, versuchen, vorhaben, anfangen, aufhören, beginnen, vergessen, etc.",
    ],
    examples: [
      { de: "Ich versuche, Deutsch zu sprechen.", en: "I try to speak German." },
      { de: "Sie hofft, bald eine Arbeit zu finden.", en: "She hopes to find a job soon." },
      { de: "Er fährt nach Berlin, um seine Familie zu besuchen.", en: "He drives to Berlin in order to visit his family." },
      { de: "Es ist schwer, früh aufzustehen.", en: "It is hard to get up early." },
      { de: "Ich habe vergessen, ihn anzurufen.", en: "I forgot to call him." },
    ],
    mistakes: [
      "Don't forget zu: ❌ Ich versuche Deutsch sprechen. ✓ Ich versuche, Deutsch zu sprechen.",
      "Don't use zu after modal verbs: ❌ Ich muss zu gehen. ✓ Ich muss gehen. (modals take bare infinitive)",
      "Don't put zu at the end with separable verbs: ❌ aufzustehen zu ✓ aufzustehen",
    ],
    exercises: [
      { prompt: "Form: Ich hoffe / bald Urlaub haben (zu)", answer: "Ich hoffe, bald Urlaub zu haben." },
      { prompt: "Form purpose clause: Ich lerne Deutsch / einen Job in Deutschland finden (um...zu)", answer: "Ich lerne Deutsch, um einen Job in Deutschland zu finden." },
      { prompt: "Separable: Es ist wichtig / früh aufstehen", answer: "Es ist wichtig, früh aufzustehen." },
      { prompt: "Translate: She forgets to call.", answer: "Sie vergisst anzurufen." },
      { prompt: "Translate: I go to the gym in order to stay fit.", answer: "Ich gehe ins Fitnessstudio, um fit zu bleiben." },
    ],
    speakingPrompts: [
      "Say 3 things you try to do: Ich versuche, …",
      "Say why you are learning German: Ich lerne Deutsch, um…",
      "Say what is easy/hard for you: Es ist leicht/schwer, … zu…",
    ],
    summary:
      "zu + infinitive = complement clause (same subject). um...zu = purpose (in order to). Separable verbs: prefix+zu+stem. No zu after modals.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 10: Infinitive Clauses (zu & um...zu).

Rules:
- zu + infinitive: Ich versuche, Deutsch zu sprechen.
- um...zu + infinitive = purpose: Ich lerne Deutsch, um zu arbeiten.
- Separable verbs: zu goes inside → aufzustehen, einzukaufen, anzurufen
- Comma before the infinitive clause
- NO zu after modal verbs (müssen, können, wollen...)

Key verbs that take zu: hoffen, versuchen, vergessen, anfangen, aufhören, vorhaben, beginnen

Please drill me with:
1. Build infinitive clauses from given elements
2. Form um...zu clauses expressing purpose
3. Handle separable verbs correctly
4. Translate sentences

Correct mistakes and explain. Start with: "Infinitive clause drill! Combine: Ich hoffe. Ich finde bald einen Job. (zu) → ?"`,
  },

  {
    id: "a2ch11",
    number: 11,
    title: "Comparative & Superlative",
    subtitle: "Komparativ & Superlativ",
    explanation:
      "German comparatives add -er to the adjective. Superlatives use am…-sten (predicate) or the definite article + -st- (attributive). Many common adjectives have irregular forms. Comparisons use als (than). Equality uses so…wie (as…as). The comparative form is used before nouns with declension endings added on top.",
    rule:
      "Comparative: adjective + -er | Superlative (predicate): am + adjective + -sten | Superlative (attributive): der/die/das + adjective + -ste/-sten",
    table: {
      headers: ["Base", "Comparative", "Superlative (pred.)", "Superlative (attr.)"],
      rows: [
        ["schnell", "schneller", "am schnellsten", "der schnellste"],
        ["alt", "älter", "am ältesten", "der älteste"],
        ["groß", "größer", "am größten", "der größte"],
        ["gut", "besser", "am besten", "der beste"],
        ["viel", "mehr", "am meisten", "die meisten"],
        ["gern", "lieber", "am liebsten", "—"],
        ["hoch", "höher", "am höchsten", "der höchste"],
        ["nah", "näher", "am nächsten", "der nächste"],
      ],
    },
    notes: [
      "Many one-syllable adjectives with a/o/u get an umlaut in comparative and superlative: alt→älter, groß→größer, jung→jünger, kalt→kälter.",
      "als = than (comparison). Er ist größer als sie.",
      "so...wie = as...as (equality). Er ist so groß wie sie.",
      "Comparative adjectives before nouns add the same endings as regular adjectives.",
      "gern, lieber, am liebsten are used with verbs: Ich esse gern Pizza. Ich esse lieber Pasta. Ich esse am liebsten Sushi.",
    ],
    examples: [
      { de: "Berlin ist größer als München.", en: "Berlin is bigger than Munich." },
      { de: "Er ist so alt wie ich.", en: "He is as old as I am." },
      { de: "Das ist der schnellste Zug.", en: "That is the fastest train." },
      { de: "Sie lernt am fleißigsten.", en: "She studies most diligently." },
      { de: "Ich fahre lieber mit dem Zug.", en: "I prefer to travel by train." },
    ],
    mistakes: [
      "Don't use mehr + adjective for comparative (that's French/English logic): ❌ mehr interessant ✓ interessanter",
      "Don't forget the umlaut: ❌ alter ✓ älter | ❌ grosser ✓ größer",
      "Don't confuse als (comparison) with wie (equality/similarity): ❌ Er ist groß wie sein Bruder (comparison) ✓ Er ist größer als sein Bruder",
    ],
    exercises: [
      { prompt: "Comparative: schnell → ?", answer: "schneller" },
      { prompt: "Superlative (predicate): interessant → ?", answer: "am interessantesten" },
      { prompt: "Fill in: Berlin ist ___ als Hamburg. (groß)", answer: "größer" },
      { prompt: "Translate: This is the best restaurant.", answer: "Das ist das beste Restaurant." },
      { prompt: "Translate: I like coffee more than tea.", answer: "Ich trinke lieber Kaffee als Tee." },
    ],
    speakingPrompts: [
      "Compare two cities, people, or objects using als: … ist größer/schöner/besser als …",
      "Say what you prefer using lieber: Ich esse/lese/fahre lieber…",
      "Describe the best / the most beautiful / the fastest thing you know.",
    ],
    summary:
      "Comparative: +er (+ umlaut for many). Superlative predicate: am…sten. Superlative attributive: definite article + st-. Irregulars: gut/besser/am besten, viel/mehr/am meisten, gern/lieber/am liebsten. als = than, so…wie = as…as.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 11: Comparative & Superlative (Komparativ & Superlativ).

Rules:
- Comparative: + -er (groß→größer, alt→älter with umlaut)
- Superlative predicate: am + stem + -sten (am schnellsten, am ältesten)
- Superlative attributive: der/die/das + stem + -ste (der schnellste Zug)
- Comparison: als (than) | Equality: so...wie
- Irregulars: gut→besser→am besten | viel→mehr→am meisten | gern→lieber→am liebsten | hoch→höher→am höchsten

Please drill me with:
1. Form comparative and superlative of given adjectives
2. Compare two things using als
3. Translate comparison sentences
4. Handle irregular forms

Correct all mistakes. Start with: "Comparative drill! Form comparative and superlative: schnell → ?"`,
  },

  {
    id: "a2ch12",
    number: 12,
    title: "Adjective Declension: Definite Articles",
    subtitle: "Nach dem bestimmten Artikel",
    explanation:
      "When an adjective follows a definite article (der, die, das, dem, den, etc.), it takes either an -e or -en ending. The definite article already carries the case/gender/number information, so the adjective only needs to add a 'weak' signal. The pattern is: -e in most singular nominative and accusative forms, -en everywhere else.",
    rule:
      "After der/die/das: adjective ends in -e (Nom.sg and Akk.sg neuter/feminine) or -en (everywhere else)",
    table: {
      headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
      rows: [
        ["Nominative", "der alt-e Mann", "die alt-e Frau", "das alt-e Kind", "die alt-en Kinder"],
        ["Accusative", "den alt-en Mann", "die alt-e Frau", "das alt-e Kind", "die alt-en Kinder"],
        ["Dative", "dem alt-en Mann", "der alt-en Frau", "dem alt-en Kind", "den alt-en Kindern"],
        ["Genitive", "des alt-en Mannes", "der alt-en Frau", "des alt-en Kindes", "der alt-en Kinder"],
      ],
    },
    notes: [
      "Memory trick: -e endings appear in a 'cross' pattern: Nom.masc., Nom.fem., Akk.fem., Nom.neut., Akk.neut. → these 5 are -e. All others are -en.",
      "Dative ALWAYS ends in -en after definite articles.",
      "Plural ALWAYS ends in -en after definite articles.",
      "Genitive ALWAYS ends in -en after definite articles.",
    ],
    examples: [
      { de: "Der alte Mann schläft.", en: "The old man is sleeping. (Nom. masc. → -e)" },
      { de: "Ich sehe den alten Mann.", en: "I see the old man. (Akk. masc. → -en)" },
      { de: "Ich helfe dem alten Mann.", en: "I help the old man. (Dat. masc. → -en)" },
      { de: "Das kleine Kind lacht.", en: "The small child is laughing. (Nom. neut. → -e)" },
      { de: "Ich mag die neuen Schuhe.", en: "I like the new shoes. (Akk. plural → -en)" },
    ],
    mistakes: [
      "Don't add -en in Nom. sg. neuter or feminine: ❌ das alten Kind ✓ das alte Kind",
      "Don't add -e in Dative: ❌ mit dem alte Mann ✓ mit dem alten Mann",
      "Don't forget adjective endings before nouns — they are required in German.",
    ],
    exercises: [
      { prompt: "Fill in: Der ___ Mann kommt. (alt)", answer: "alte" },
      { prompt: "Fill in: Ich sehe den ___ Hund. (klein)", answer: "kleinen" },
      { prompt: "Fill in: Mit dem ___ Freund. (gut)", answer: "guten" },
      { prompt: "Fill in: Das ___ Kind spielt. (klein)", answer: "kleine" },
      { prompt: "Translate: I like the new film.", answer: "Ich mag den neuen Film." },
    ],
    speakingPrompts: [
      "Describe a person using 3 adjectives after the definite article: Der… Mann / Die… Frau…",
      "Point to objects around you and describe them: Das rote Buch, der große Tisch…",
      "Practice dative: Ich helfe dem alten / jungen / netten…",
    ],
    summary:
      "After definite articles: -e in Nom.sg and Akk.sg (fem./neut.), -en everywhere else. Dative, genitive, plural → always -en.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 12: Adjective Declension after Definite Articles.

After der/die/das/dem/den: adjective takes -e or -en

Pattern:
- Nominative singular: der alte Mann | die alte Frau | das alte Kind → all -e
- Accusative: den alten Mann (-en) | die alte Frau (-e) | das alte Kind (-e)
- Dative: dem alten Mann | der alten Frau | dem alten Kind → all -en
- Plural: die alten Kinder (all cases) → all -en
- Genitive → all -en

Memory: Dative, Genitive, Plural, Acc.masc → always -en. Nom.sg + Akk.fem/neut → -e

Please drill me with:
1. Fill in the adjective ending
2. Form full noun phrases with the correct ending
3. Translate sentences with adjective + definite article
4. Spot the wrong ending

Start with: "Adjective declension drill! Der ___ Mann kommt. (alt) → Which ending: -e or -en?"`,
  },

  {
    id: "a2ch13",
    number: 13,
    title: "Adjective Declension: Indefinite Articles",
    subtitle: "Nach dem unbestimmten Artikel",
    explanation:
      "After indefinite articles (ein, kein, mein, dein, sein, ihr, unser, euer, ihr/Ihr), adjectives need to show the gender/case information that the article doesn't always provide. Where the article ending is 'weak' or absent, the adjective must provide a 'strong' signal. This results in -er (masc.nom.), -es (neut.nom./akk.), -e (fem.nom./akk., all plural), and -en elsewhere.",
    rule:
      "After ein/kein/possessives: adjective adds strong ending where article has no gender signal, -en elsewhere",
    table: {
      headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural (kein/mein)"],
      rows: [
        ["Nominative", "ein gut-er Mann", "eine gut-e Frau", "ein gut-es Kind", "keine alt-en Kinder"],
        ["Accusative", "einen gut-en Mann", "eine gut-e Frau", "ein gut-es Kind", "keine alt-en Kinder"],
        ["Dative", "einem gut-en Mann", "einer gut-en Frau", "einem gut-en Kind", "keinen alt-en Kindern"],
        ["Genitive", "eines gut-en Mannes", "einer gut-en Frau", "eines gut-en Kindes", "keiner alt-en Kinder"],
      ],
    },
    notes: [
      "The 'strong' endings replace the missing gender signal: masc.nom.→-er, neut.nom.→-es, neut.akk.→-es. This is the key difference from definite article declension.",
      "After plural possessives (meine, keine, etc.), adjective always ends -en.",
      "Dative and genitive after ein-words → always -en (just like definite).",
      "The adjective must 'save' the information ein loses: 'ein' alone doesn't show masculine vs. neuter, so the adjective shows it.",
    ],
    examples: [
      { de: "Ein guter Mann kommt.", en: "A good man is coming. (Nom. masc. → -er)" },
      { de: "Das ist ein kleines Kind.", en: "That is a small child. (Nom. neut. → -es)" },
      { de: "Ich habe einen guten Freund.", en: "I have a good friend. (Akk. masc. → -en)" },
      { de: "Meine alten Schuhe sind kaputt.", en: "My old shoes are broken. (Plural → -en)" },
      { de: "Er hilft einer alten Frau.", en: "He helps an old woman. (Dat. fem. → -en)" },
    ],
    mistakes: [
      "Don't use -e for masculine nominative: ❌ ein gute Mann ✓ ein guter Mann",
      "Don't use -e for neuter nominative/accusative: ❌ ein gute Kind ✓ ein gutes Kind",
      "Don't forget -en in dative: ❌ mit einem gute Freund ✓ mit einem guten Freund",
    ],
    exercises: [
      { prompt: "Fill in: Das ist ein ___ Haus. (schön, neuter nom.)", answer: "schönes" },
      { prompt: "Fill in: Ich sehe einen ___ Hund. (groß, masc. akk.)", answer: "großen" },
      { prompt: "Fill in: Er ist ein ___ Lehrer. (gut, masc. nom.)", answer: "guter" },
      { prompt: "Fill in: Mit meiner ___ Schwester. (älter, fem. dat.)", answer: "älteren" },
      { prompt: "Translate: I have a new car.", answer: "Ich habe ein neues Auto." },
    ],
    speakingPrompts: [
      "Describe a person you know: Er ist ein … Mensch. Sie ist eine … Frau.",
      "Talk about something you own: Ich habe einen/eine/ein …",
      "Practice dative: Ich helfe einem/einer … Freund/Freundin.",
    ],
    summary:
      "After ein/kein/possessives: masc.nom.→-er, neut.nom./akk.→-es, fem.nom./akk.→-e, plural→-en, dative/genitive→-en. Adjective compensates for what ein doesn't show.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 13: Adjective Declension after Indefinite Articles (ein, kein, mein, dein, sein, ihr, unser...).

Key endings (where different from definite article):
- Masculine Nominative: ein gut-ER Mann (strong -er, article doesn't show masc.)
- Neuter Nominative: ein gut-ES Kind (strong -es)
- Neuter Accusative: ein gut-ES Kind (strong -es)
- Feminine Nom/Akk: eine gut-E Frau (like definite)
- Dative, Genitive, Plural → always -en (like definite)

Please drill me with:
1. Fill in adjective endings after ein-words
2. Build phrases (article + adjective + noun) in different cases
3. Translate sentences
4. Spot and correct errors

Correct all mistakes and explain the logic. Start with: "Indefinite article adjective drill! Das ist ein ___ Kind. (klein) — -es or -e?"`,
  },

  {
    id: "a2ch14",
    number: 14,
    title: "Adjective Declension: No Article",
    subtitle: "Nullartikel — starke Deklination",
    explanation:
      "When there is NO article before an adjective, the adjective itself must carry all the gender, case, and number information. These are called 'strong' endings because they mirror the definite article endings. This happens with food, drinks, materials, and abstract nouns without an article — very common in everyday spoken German.",
    rule:
      "No article → adjective copies the definite article ending (minus the 'd/di' base). Strong endings show full case/gender information.",
    table: {
      headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
      rows: [
        ["Nominative", "kalt-er Kaffee", "frisch-e Milch", "kalt-es Wasser", "nett-e Leute"],
        ["Accusative", "kalt-en Kaffee", "frisch-e Milch", "kalt-es Wasser", "nett-e Leute"],
        ["Dative", "kalt-em Kaffee", "frisch-er Milch", "kalt-em Wasser", "nett-en Leuten"],
        ["Genitive", "kalt-en Kaffees", "frisch-er Milch", "kalt-en Wassers", "nett-er Leute"],
      ],
    },
    notes: [
      "Common no-article contexts: food/drinks (kaltes Wasser, guter Wein, frische Milch), materials, abstract concepts (frische Luft, schönes Wetter), after numbers (zwei alte Freunde).",
      "Strong endings = mostly the same as definite article endings but without the 'd'. Compare: der→-er, dem→-em, die→-e, den→-en, des→-en.",
      "After numbers (zwei, drei...) and after viel, wenig, einige, mehrere → adjective also takes strong endings.",
    ],
    examples: [
      { de: "Kaltes Wasser ist gesund.", en: "Cold water is healthy." },
      { de: "Ich trinke gern guten Wein.", en: "I like to drink good wine." },
      { de: "Mit frischer Milch, bitte.", en: "With fresh milk, please." },
      { de: "Nette Leute sind überall.", en: "Nice people are everywhere." },
      { de: "Er kam mit einem guten Freund. (einige)", en: "He came with a good friend." },
    ],
    mistakes: [
      "Don't leave the adjective uninflected: ❌ Ich trinke kalt Kaffee. ✓ Ich trinke kalten Kaffee.",
      "Don't use -en in nominative masculine: ❌ kalten Kaffee ist lecker (nom.) ✓ kalter Kaffee ist lecker.",
      "Remember dative uses -em (masc./neut.) and -er (fem.) — mirror the definite article endings.",
    ],
    exercises: [
      { prompt: "Fill in: ___ Wasser ist gesund. (kalt, nominative neuter)", answer: "Kaltes" },
      { prompt: "Fill in: Ich trinke gern ___ Wein. (gut, accusative masculine)", answer: "guten" },
      { prompt: "Fill in: Mit ___ Milch, bitte. (frisch, dative feminine)", answer: "frischer" },
      { prompt: "Translate: Fresh air is important.", answer: "Frische Luft ist wichtig." },
      { prompt: "Fill in: ___ Leute kommen heute. (viele)", answer: "Viele" },
    ],
    speakingPrompts: [
      "Order food/drinks using no-article adjectives: Ich möchte heißen Tee / kaltes Wasser…",
      "Describe the weather using strong adjective endings: Schönes Wetter! Kalter Wind!",
      "Talk about what you like: Ich mag guten Kaffee / frisches Brot…",
    ],
    summary:
      "No article → strong adjective endings (mirror definite article). Masc.nom.→-er, neut.→-es, fem.→-e, dat.masc./neut.→-em, dat.fem.→-er, plural nom./akk.→-e.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 14: Adjective Declension without Articles (Nullartikel — starke Deklination).

When there is NO article, the adjective must carry all case/gender info — uses 'strong' endings that mirror the definite article.

Strong endings:
- Nominative: -er (m), -e (f), -es (n), -e (pl)
- Accusative: -en (m), -e (f), -es (n), -e (pl)
- Dative: -em (m), -er (f), -em (n), -en (pl)
- Genitive: -en (m), -er (f), -en (n), -er (pl)

Common contexts: food, drinks, materials, abstract nouns, after numbers/viel/wenig

Please drill me with:
1. Fill in strong adjective endings
2. Form no-article noun phrases in various cases
3. Translate everyday phrases (ordering, describing)
4. Spot and fix errors

Start with: "Strong declension drill! ___ Wasser ist kalt. (kalt, nominative neuter) → ?"`,
  },

  {
    id: "a2ch15",
    number: 15,
    title: "Indefinite Pronouns",
    subtitle: "Indefinitpronomen",
    explanation:
      "Indefinite pronouns refer to unspecified people or things. The most important ones are: jemand (someone), niemand (no one), etwas (something), nichts (nothing), man (one/you/people in general), alle (everyone/all). They have different case forms and affect verb agreement.",
    rule:
      "jemand/niemand → can add case endings (-en for Akk., -em for Dat.) | man → always singular | etwas/nichts → invariable | alle → plural",
    table: {
      headers: ["Pronoun", "Nominative", "Accusative", "Dative"],
      rows: [
        ["someone", "jemand", "jemanden", "jemandem"],
        ["no one", "niemand", "niemanden", "niemandem"],
        ["something", "etwas", "etwas", "etwas"],
        ["nothing", "nichts", "nichts", "nichts"],
        ["one/you (general)", "man", "einen", "einem"],
        ["all/everyone", "alle", "alle", "allen"],
      ],
    },
    notes: [
      "man refers to people in general — always takes a singular verb. Man darf hier nicht rauchen. (One may not smoke here.)",
      "jemand and niemand are interchangeable in terms of structure but opposite in meaning.",
      "etwas and nichts are invariable (don't change form). They often appear with adjectives: etwas Gutes, nichts Wichtiges.",
      "After etwas/nichts + adjective: adjective takes strong neuter ending -es. nichts Interessantes.",
      "alle can be followed by an adjective: Alle sind müde. / Alle Studenten… (alle + noun requires agreement).",
    ],
    examples: [
      { de: "Jemand ist da.", en: "Someone is here." },
      { de: "Ich sehe jemanden.", en: "I see someone. (Accusative)" },
      { de: "Niemand ist hier.", en: "No one is here." },
      { de: "Man darf hier nicht rauchen.", en: "One may not smoke here." },
      { de: "Etwas Schönes passiert.", en: "Something beautiful is happening." },
      { de: "Das interessiert mich nicht — nichts Neues!", en: "That doesn't interest me — nothing new!" },
    ],
    mistakes: [
      "Don't use jemand as accusative: ❌ Ich sehe jemand. ✓ Ich sehe jemanden.",
      "Don't conjugate the verb plural with man: ❌ Man sind müde. ✓ Man ist müde.",
      "Don't use nichts kein- together: ❌ Ich sehe nichts keinen. ✓ Ich sehe nichts / Ich sehe keinen.",
    ],
    exercises: [
      { prompt: "Fill in: ___ ist zu Hause. (someone)", answer: "Jemand" },
      { prompt: "Fill in accusative: Ich rufe ___ an. (someone)", answer: "jemanden" },
      { prompt: "Fill in: ___ darf hier parken. (general you)", answer: "Man" },
      { prompt: "Translate: No one understands this.", answer: "Niemand versteht das." },
      { prompt: "Translate: She knows something interesting.", answer: "Sie weiß etwas Interessantes." },
    ],
    speakingPrompts: [
      "Say 3 general rules using man: Man soll/darf/muss…",
      "Express what you need or don't need: Ich brauche etwas / nichts.",
      "Talk about people in general: Alle wollen… / Niemand mag…",
    ],
    summary:
      "jemand/niemand: + -en (Akk.), + -em (Dat.). man = general 'one' (singular verb). etwas/nichts: invariable. etwas/nichts + adjective: strong -es ending. alle: plural.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 15: Indefinite Pronouns (Indefinitpronomen).

Key pronouns and their cases:
- jemand (someone): Nom.→jemand | Akk.→jemanden | Dat.→jemandem
- niemand (no one): same pattern
- etwas (something): invariable — etwas Schönes (+ strong adj. -es)
- nichts (nothing): invariable — nichts Neues
- man (one/people): always singular verb — Man darf...
- alle (everyone/all): plural — Alle sind...

Please drill me with:
1. Fill in the correct form of indefinite pronouns
2. Use man in general statements
3. Form phrases with etwas/nichts + adjective
4. Translate sentences

Correct mistakes and explain. Start with: "Indefinite pronoun drill! Ich sehe ___ (someone, accusative). jemand or jemanden?"`,
  },

  {
    id: "a2ch16",
    number: 16,
    title: "The Genitive Case",
    subtitle: "Genitiv — Possession",
    explanation:
      "The Genitive case expresses possession and belonging — answering the question 'Wessen?' (Whose?). Masculine and neuter nouns add -s or -es to the noun. Feminine and plural nouns don't change. The articles change: des (masc./neut.), der (fem./plural), eines, keiner, meines, etc.",
    rule:
      "Masculine/Neuter: des/eines + noun + -s/-es | Feminine/Plural: der/einer + noun (unchanged)",
    table: {
      headers: ["Gender", "Article", "Noun change", "Example"],
      rows: [
        ["Masculine", "des", "+ -s (short words: -es)", "das Auto des Vaters"],
        ["Neuter", "des", "+ -s/-es", "das Spielzeug des Kindes"],
        ["Feminine", "der", "unchanged", "die Tasche der Mutter"],
        ["Plural", "der", "unchanged", "das Haus meiner Eltern"],
        ["Masc. (ein)", "eines", "+ -s/-es", "der Freund eines Mannes"],
        ["Fem. (mein)", "meiner", "unchanged", "das Auto meiner Schwester"],
      ],
    },
    notes: [
      "In spoken German, the Genitive is often replaced by von + Dativ: das Auto von meinem Vater (instead of des Vaters).",
      "Names: simply add -s without apostrophe: Annas Buch (Anna's book). Exception: name ends in s/z → use apostrophe or von: Hans' Buch / das Buch von Hans.",
      "Short nouns (one syllable) often add -es: des Mannes, des Kindes. Longer nouns usually just add -s.",
      "Wessen? = Whose? — the question form for genitive.",
    ],
    examples: [
      { de: "Das ist das Auto des Vaters.", en: "That is the father's car." },
      { de: "Das Spielzeug des Kindes ist neu.", en: "The child's toy is new." },
      { de: "Die Tasche meiner Mutter ist rot.", en: "My mother's bag is red." },
      { de: "Das Haus meiner Eltern ist groß.", en: "My parents' house is big." },
      { de: "Der Name des Lehrers ist Schmidt.", en: "The teacher's name is Schmidt." },
    ],
    mistakes: [
      "Don't forget the noun -s ending for masc./neut.: ❌ das Auto des Vater ✓ das Auto des Vaters",
      "Don't change feminine nouns: ❌ der Mutterin ✓ der Mutter",
      "In spoken German, von + Dativ is acceptable and often preferred.",
    ],
    exercises: [
      { prompt: "Genitive: das Buch / der Lehrer → das Buch ___", answer: "des Lehrers" },
      { prompt: "Genitive: die Tasche / meine Mutter → die Tasche ___", answer: "meiner Mutter" },
      { prompt: "Genitive: das Haus / mein Bruder → das Haus ___", answer: "meines Bruders" },
      { prompt: "Translate: The child's book is here.", answer: "Das Buch des Kindes ist hier." },
      { prompt: "Translate (spoken form): The name of the teacher (von)", answer: "Der Name von dem Lehrer / vom Lehrer" },
    ],
    speakingPrompts: [
      "Say whose things they are: Das ist das Buch des… / die Tasche meiner…",
      "Practice names in genitive: Annas Buch / Toms Auto / das Auto von Hans",
      "Answer: Wessen Buch ist das? → Das ist das Buch…",
    ],
    summary:
      "Genitive = possession (Wessen?). Masc./Neut.: des/eines + noun-s/-es. Fem./Plural: der/einer (unchanged). In spoken German: von + Dativ is common.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 16: The Genitive Case (Genitiv — Possession).

Rules:
- Question: Wessen? (Whose?)
- Masculine/Neuter: des/eines + noun + -s/-es → das Buch des Lehrers
- Feminine/Plural: der/einer + noun (unchanged) → die Tasche der Mutter
- Possessive articles: meines (m/n), meiner (f/pl)
- Names: just add -s → Annas Buch (no apostrophe)
- Spoken alternative: von + Dativ → das Buch von meiner Mutter

Please drill me with:
1. Form genitive phrases (whose? → which article + noun ending)
2. Identify genitive in sentences
3. Translate possessive phrases
4. Convert between genitive and von-phrases

Correct all mistakes. Start with: "Genitive drill! Das ist das Auto ___ (der Vater). Fill in the genitive!"`,
  },

  {
    id: "a2ch17",
    number: 17,
    title: "Relative Clauses",
    subtitle: "Relativsätze",
    explanation:
      "Relative clauses describe or identify a noun using a relative pronoun. In German, the relative pronoun matches the gender and number of the noun it refers to, but its case depends on its ROLE in the relative clause. The verb goes to the END of the relative clause. Relative clauses are always set off by commas.",
    rule:
      "Relative pronoun = gender/number of noun + case from role in clause. Verb goes to END.",
    table: {
      headers: ["Case", "Masculine", "Feminine", "Neuter", "Plural"],
      rows: [
        ["Nominative", "der", "die", "das", "die"],
        ["Accusative", "den", "die", "das", "die"],
        ["Dative", "dem", "der", "dem", "denen"],
        ["Genitive", "dessen", "deren", "dessen", "deren"],
      ],
    },
    notes: [
      "Only masculine changes visibly between nominative (der) and accusative (den) in relative clauses.",
      "The relative pronoun must agree in GENDER AND NUMBER with the noun it refers to, but its CASE is determined by the clause.",
      "Dative plural is special: denen (not den).",
      "Genitive: dessen/deren — equivalent to 'whose'. Der Mann, dessen Auto rot ist, kommt. (The man whose car is red is coming.)",
      "Comma is ALWAYS required before the relative clause.",
    ],
    examples: [
      { de: "Der Mann, der dort steht, ist mein Lehrer.", en: "The man who is standing there is my teacher. (Nom. masc.)" },
      { de: "Der Kuchen, den ich esse, ist lecker.", en: "The cake that I am eating is delicious. (Akk. masc.)" },
      { de: "Das Auto, das ich kaufe, ist teuer.", en: "The car that I am buying is expensive. (Nom./Akk. neut.)" },
      { de: "Die Frau, der ich helfe, ist nett.", en: "The woman whom I am helping is nice. (Dat. fem.)" },
      { de: "Die Kinder, denen ich helfe, sind klein.", en: "The children whom I am helping are small. (Dat. plural)" },
    ],
    mistakes: [
      "Don't forget verb-final: ❌ Der Mann, der ist nett, … ✓ Der Mann, der nett ist, …",
      "Don't forget the comma: ❌ Der Mann der kommt ✓ Der Mann, der kommt",
      "Don't use the wrong case: the role in the relative clause determines case, not the main clause.",
    ],
    exercises: [
      { prompt: "Fill in: Der Mann, ___ dort steht, ist mein Chef. (Nom. masc.)", answer: "der" },
      { prompt: "Fill in: Das Buch, ___ ich lese, ist spannend. (Akk. neut.)", answer: "das" },
      { prompt: "Fill in: Die Frau, ___ ich helfe, ist krank. (Dat. fem.)", answer: "der" },
      { prompt: "Combine: Das ist ein Film. Ich liebe diesen Film.", answer: "Das ist ein Film, den ich liebe." },
      { prompt: "Translate: The woman who speaks German is my teacher.", answer: "Die Frau, die Deutsch spricht, ist meine Lehrerin." },
    ],
    speakingPrompts: [
      "Describe a person you know: Das ist mein Freund, der … / Das ist meine Kollegin, die…",
      "Describe objects: Das ist das Buch, das ich gerade lese.",
      "Practice dative relative clauses: Das ist der Mensch, dem ich… helfe / danke / vertraue.",
    ],
    summary:
      "Relative pronoun = gender/number of antecedent + case from clause role. Verb to END. Comma always required. Nom/Akk same for fem/neut. Dat.plural = denen. Genitive = dessen/deren.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 17: Relative Clauses (Relativsätze).

Relative pronoun table:
- Nom: der / die / das / die
- Akk: den / die / das / die
- Dat: dem / der / dem / denen
- Gen: dessen / deren / dessen / deren

Rules:
- Gender/number: match the noun being described
- Case: determined by the role in the relative clause
- Verb goes to END of relative clause
- Comma always before relative clause
- Only masculine changes nom(der)→akk(den)

Please drill me with:
1. Fill in the correct relative pronoun
2. Combine two sentences into one with a relative clause
3. Identify the case of the relative pronoun
4. Translate sentences with relative clauses

Correct all mistakes. Start with: "Relative clause drill! Der Mann, ___ dort steht, ist mein Freund. Which relative pronoun and why?"`,
  },

  {
    id: "a2ch18",
    number: 18,
    title: "Modal Verbs in Präteritum",
    subtitle: "Modalverben im Präteritum",
    explanation:
      "Modal verbs (müssen, können, dürfen, wollen, sollen, mögen) are almost always used in Präteritum (simple past) in spoken German — NOT in Perfekt. The Präteritum forms are regular-looking (no umlaut), with consistent -te- suffixes. The infinitive of the main verb stays at the END of the sentence.",
    rule:
      "Modal Präteritum: remove umlaut + add -te + personal ending. Infinitive at end.",
    table: {
      headers: ["Modal", "Präteritum stem", "Example", "Translation"],
      rows: [
        ["müssen", "musste", "Ich musste arbeiten.", "I had to work."],
        ["können", "konnte", "Er konnte nicht kommen.", "He couldn't come."],
        ["dürfen", "durfte", "Sie durfte gehen.", "She was allowed to go."],
        ["wollen", "wollte", "Wir wollten essen.", "We wanted to eat."],
        ["sollen", "sollte", "Du solltest helfen.", "You were supposed to help."],
        ["mögen", "mochte", "Er mochte das nicht.", "He didn't like that."],
      ],
    },
    notes: [
      "All modal Präteritum forms: umlaut disappears, -te is added, then personal endings (same as weak verbs: -te, -test, -te, -ten, -tet, -ten).",
      "This is the most commonly used past form for modals in both spoken and written German.",
      "The dependent infinitive stays at the END: Ich musste früh aufstehen.",
      "Perfekt of modals exists but sounds unnatural in speech: Ich habe arbeiten müssen — very formal/written.",
    ],
    examples: [
      { de: "Ich musste gestern arbeiten.", en: "I had to work yesterday." },
      { de: "Wir konnten dich nicht finden.", en: "We couldn't find you." },
      { de: "Sie wollte nach Berlin fahren.", en: "She wanted to go to Berlin." },
      { de: "Er durfte nicht rauchen.", en: "He wasn't allowed to smoke." },
      { de: "Du solltest pünktlich sein.", en: "You were supposed to be on time." },
    ],
    mistakes: [
      "Don't keep the umlaut in Präteritum: ❌ müsste (that's Konjunktiv!) ✓ musste",
      "Don't put the infinitive in second position: ❌ Ich musste nicht kommen arbeiten. ✓ Ich musste nicht arbeiten kommen.",
      "Don't use Perfekt for modals in speech: Ich musste is natural, Ich habe müssen is very formal.",
    ],
    exercises: [
      { prompt: "Präteritum of müssen (ich): Ich ___ arbeiten.", answer: "musste" },
      { prompt: "Präteritum of können (er): Er ___ nicht schlafen.", answer: "konnte" },
      { prompt: "Präteritum of wollen (wir): Wir ___ ins Kino gehen.", answer: "wollten" },
      { prompt: "Translate: She had to leave early.", answer: "Sie musste früh gehen." },
      { prompt: "Translate: We couldn't find the hotel.", answer: "Wir konnten das Hotel nicht finden." },
    ],
    speakingPrompts: [
      "Talk about something you had to do last week: Ich musste…",
      "Say something you could or couldn't do: Ich konnte… / Ich konnte nicht…",
      "Talk about something you wanted to do: Ich wollte…",
    ],
    summary:
      "Modal Präteritum: remove umlaut, add -te + endings. musste, konnte, durfte, wollte, sollte, mochte. Infinitive at end. Used in speech (not Perfekt).",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 18: Modal Verbs in Präteritum.

Präteritum forms (umlaut removed + -te-):
- müssen → musste (ich musste, du musstest, er musste, wir mussten, ihr musstet, sie mussten)
- können → konnte | dürfen → durfte | wollen → wollte | sollen → sollte | mögen → mochte

Key rules:
- Umlaut DISAPPEARS in Präteritum (müssen→musste, NOT müsste which is Konjunktiv)
- Infinitive stays at END: Ich musste früh aufstehen.
- These forms are standard in spoken German for modal past

Please drill me with:
1. Conjugate modal verbs in Präteritum (all persons)
2. Build past sentences with modals
3. Translate modal past sentences
4. Spot and correct errors

Correct all mistakes. Start with: "Modal Präteritum drill! Ich ___ gestern viel arbeiten. (müssen) → ?"`,
  },

  {
    id: "a2ch19",
    number: 19,
    title: "Passive Voice",
    subtitle: "Passiv Präsens — Vorgangspassiv",
    explanation:
      "The passive voice shifts focus from the doer (actor) to the action being done or the object being affected. In German, the Präsens passive uses werden + Partizip II. The actor (if mentioned) appears with von + Dativ. The subject of the passive sentence is what receives the action. werden is conjugated according to the new grammatical subject.",
    rule:
      "Passive Präsens: werden (conjugated) + Partizip II (at end). Actor: von + Dativ.",
    table: {
      headers: ["Subject", "werden", "Example"],
      rows: [
        ["ich", "werde", "Ich werde gefragt."],
        ["du", "wirst", "Du wirst gerufen."],
        ["er/sie/es", "wird", "Das Auto wird repariert."],
        ["wir", "werden", "Wir werden eingeladen."],
        ["ihr", "werdet", "Ihr werdet informiert."],
        ["sie/Sie", "werden", "Die Häuser werden gebaut."],
      ],
    },
    notes: [
      "The Partizip II always goes to the END in a main clause, just like in Perfekt.",
      "Actor with von + Dativ: Das Auto wird von dem Mechaniker repariert. (The car is being repaired by the mechanic.)",
      "The passive focuses on the ACTION, not who does it. The actor is often omitted.",
      "werden in passive ≠ werden as a future auxiliary. Context distinguishes them.",
      "The subject of the passive = the thing receiving the action (former Akkusativ object of the active).",
    ],
    examples: [
      { de: "Das Auto wird repariert.", en: "The car is being repaired." },
      { de: "Die Pizza wird gegessen.", en: "The pizza is being eaten." },
      { de: "Das Haus wird gebaut.", en: "The house is being built." },
      { de: "Die Fenster werden von dem Hausmeister geputzt.", en: "The windows are being cleaned by the janitor." },
      { de: "Die Aufgabe wird erklärt.", en: "The task is being explained." },
    ],
    mistakes: [
      "Don't confuse the subject of passive with the actor: In 'Das Auto wird repariert', das Auto is the subject, not the doer.",
      "Don't put Partizip II in second position: ❌ Das Auto wird repariert von… (Partizip II always at end in main clause) ✓ Das Auto wird von… repariert.",
      "Don't forget von + Dativ for the actor: ❌ Das wird von der Lehrerin erklärt. ✓ (correct — von + Dativ)",
    ],
    exercises: [
      { prompt: "Form passive: Das Auto / reparieren", answer: "Das Auto wird repariert." },
      { prompt: "Form passive: Die Briefe / schreiben", answer: "Die Briefe werden geschrieben." },
      { prompt: "Convert active to passive: Der Koch kocht das Essen.", answer: "Das Essen wird von dem Koch gekocht." },
      { prompt: "Translate: The letter is being written.", answer: "Der Brief wird geschrieben." },
      { prompt: "Translate: The windows are being cleaned by the cleaner.", answer: "Die Fenster werden von der Reinigungskraft geputzt." },
    ],
    speakingPrompts: [
      "Describe what happens in your workplace/school: Hier wird… / Die Aufgaben werden…",
      "Talk about processes: Brot wird gebacken. / Kaffee wird gekocht.",
      "Convert active sentences to passive: Jemand baut das Haus. → Das Haus wird gebaut.",
    ],
    summary:
      "Passive Präsens: werden (conjugated) + Partizip II (end). Actor: von + Dativ (optional). Subject = thing being acted upon. Focus on action, not actor.",
    aiPrompt: `You are my German A2 tutor. We are practicing Chapter 19: Passive Voice — Passiv Präsens (Vorgangspassiv).

Structure: werden (conjugated) + Partizip II (at end)
- Das Auto wird repariert. (The car is being repaired.)
- Die Fenster werden geputzt. (The windows are being cleaned.)
- Actor with von + Dativ: Das Auto wird von dem Mechaniker repariert.

werden conjugation: ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden

Rules:
- Partizip II always at END of main clause
- Actor (von + Dativ) is optional — often omitted
- Subject = thing receiving the action

Please drill me with:
1. Form passive sentences from active ones
2. Convert active to passive (and back)
3. Add/remove the actor (von + Dativ)
4. Translate passive sentences

Correct all mistakes and explain. Start with: "Passive drill! Make passive: Der Koch kocht die Pizza. → Die Pizza wird ___?"`,
  },
];

// ─── B1 Grammar Chapters ─────────────────────────────────────────────────────

export const B1_GRAMMAR_CHAPTERS: GrammarChapter[] = [
  {
    id: "b1ch01",
    number: 1,
    title: "Simple Past",
    subtitle: "Präteritum",
    icon: "📜",
    difficulty: "medium",
    estimatedMinutes: 30,
    tags: ["tense", "past", "writing"],
    theory: [
      {
        heading: "What is the Präteritum?",
        body: "The simple past (Präteritum) is primarily used in written German — stories, books, newspapers, reports. In speech, Germans mostly use Perfekt instead, except for sein, haben, and modal verbs.",
      },
      {
        heading: "Regular Verbs — Formation",
        body: "Add -te to the verb stem, then personal endings:\nstem + te + ending\n\nConjugation of 'machen':\n• ich machte\n• du machtest\n• er/sie/es machte\n• wir machten\n• ihr machtet\n• sie/Sie machten\n\nNote: ich and er/sie/es forms are IDENTICAL — no extra ending!",
      },
      {
        heading: "Irregular Verbs — Stem Changes",
        body: "Strong verbs change their stem vowel. You must memorize these:\n• gehen → ging\n• kommen → kam\n• finden → fand\n• schreiben → schrieb\n• sehen → sah\n• fahren → fuhr\n• essen → aß\n• trinken → trank\n• sprechen → sprach\n• geben → gab\n\nConjugation of 'gehen':\n• ich ging\n• du gingst\n• er/sie/es ging\n• wir gingen\n• ihr gingt\n• sie/Sie gingen",
      },
      {
        heading: "Präteritum vs Perfekt",
        body: "Both express the past, but:\n• Präteritum → written German, narratives, news\n• Perfekt → spoken German, conversation\n\nExceptions always Präteritum (even in speech):\n• sein → war\n• haben → hatte\n• Modal verbs: musste, konnte, durfte, sollte, wollte, mochte",
      },
    ],
    examples: [
      { de: "Er machte die Tür zu.", en: "He closed the door." },
      { de: "Sie schrieb einen Brief.", en: "She wrote a letter." },
      { de: "Wir fuhren nach Berlin.", en: "We drove to Berlin." },
      { de: "Ich war müde.", en: "I was tired." },
      { de: "Er hatte keine Zeit.", en: "He had no time." },
      { de: "Sie konnte nicht kommen.", en: "She couldn't come." },
    ],
    mistakes: [
      "Don't add an extra ending to ich/er with regular verbs: ❌ ich machtet ✓ ich machte",
      "Don't use Präteritum for most verbs in casual speech — sounds unnatural: ❌ Gestern kaufte ich Brot. (spoken) ✓ Gestern habe ich Brot gekauft.",
      "Always use Präteritum for 'war' and 'hatte' even in speech: ✓ Ich war dort. ✓ Sie hatte Hunger.",
    ],
    exercises: [
      { prompt: "Conjugate 'spielen' in Präteritum: ich ___", answer: "ich spielte" },
      { prompt: "Conjugate 'kommen' in Präteritum: wir ___", answer: "wir kamen" },
      { prompt: "Convert to Präteritum: Ich gehe ins Kino.", answer: "Ich ging ins Kino." },
      { prompt: "Convert to Präteritum: Sie schreibt einen Brief.", answer: "Sie schrieb einen Brief." },
      { prompt: "Translate: He was very tired yesterday.", answer: "Er war gestern sehr müde." },
    ],
    speakingPrompts: [
      "Tell a story about your childhood using Präteritum: Als ich jung war...",
      "Retell a fairy tale: Es war einmal...",
      "Describe a news event: Gestern ereignete sich...",
    ],
    summary:
      "Präteritum = written past tense. Regular verbs: stem + te. Irregular verbs: stem vowel changes. ich = er/sie/es (no extra ending). Always use for war, hatte, and modals.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 1: Simple Past — Präteritum.

Regular verbs: stem + te (machte, spielte, kaufte)
Irregular verbs: stem vowel change (ging, kam, fand, schrieb, sah, fuhr)
Special: war (sein), hatte (haben), konnte/musste/durfte/sollte/wollte (modals)
ich and er/sie/es forms are IDENTICAL for all Präteritum verbs.

Usage: written German, narratives, news, books. In speech: only sein/haben/modals.

Please drill me with:
1. Conjugation exercises (regular and irregular)
2. Convert present to Präteritum
3. Convert Perfekt to Präteritum
4. Short storytelling in Präteritum
5. Identify: Präteritum or Perfekt more natural?

Correct all mistakes and explain. Start with: "Präteritum drill! Convert to Präteritum: Ich gehe ins Kino. → Ich ___?"`,
  },
  {
    id: "b1ch02",
    number: 2,
    title: "Past Perfect",
    subtitle: "Plusquamperfekt",
    icon: "⏮️",
    difficulty: "medium",
    estimatedMinutes: 25,
    tags: ["tense", "past", "sequence"],
    theory: [
      {
        heading: "What is the Plusquamperfekt?",
        body: "The past perfect expresses an action that happened BEFORE another past action. Think of it as the 'past of the past'.\n\nTimeline: Plusquamperfekt → Präteritum/Perfekt → Present",
      },
      {
        heading: "Formation",
        body: "hatte + Partizip II  (for most verbs)\nwar + Partizip II    (for movement/change verbs)\n\nExamples:\n• Ich hatte gegessen. (I had eaten.)\n• Er war gegangen. (He had gone.)\n• Wir hatten geschlafen. (We had slept.)\n• Sie war angekommen. (She had arrived.)",
      },
      {
        heading: "When to use war vs hatte",
        body: "Use 'war' (sein) with:\n• Movement verbs: gehen, fahren, laufen, kommen, reisen\n• Change of state: aufwachen, einschlafen, sterben, werden\n• bleiben, sein\n\nUse 'hatte' (haben) with all other verbs.",
      },
      {
        heading: "Plusquamperfekt in Sentences",
        body: "Nachdem clause uses Plusquamperfekt + main clause uses Präteritum:\n• Nachdem ich gegessen hatte, ging ich schlafen.\n• Nachdem sie angekommen war, rief sie an.\n\nThis tense shift is REQUIRED with 'nachdem'.",
      },
    ],
    examples: [
      { de: "Nachdem ich gegessen hatte, ging ich schlafen.", en: "After I had eaten, I went to sleep." },
      { de: "Er war schon gegangen, als ich ankam.", en: "He had already left when I arrived." },
      { de: "Sie hatte den Film schon gesehen.", en: "She had already seen the film." },
      { de: "Wir hatten das Haus verlassen, bevor es regnete.", en: "We had left the house before it rained." },
      { de: "Er war noch nie in Berlin gewesen.", en: "He had never been to Berlin." },
    ],
    mistakes: [
      "Don't use Plusquamperfekt without a reference past action — it needs context.",
      "Don't forget 'war' for movement verbs: ❌ ich hatte gegangen ✓ ich war gegangen",
      "With 'nachdem': the nachdem clause MUST use Plusquamperfekt, main clause uses Präteritum.",
    ],
    exercises: [
      { prompt: "Form Plusquamperfekt: essen (ich)", answer: "ich hatte gegessen" },
      { prompt: "Form Plusquamperfekt: gehen (er)", answer: "er war gegangen" },
      { prompt: "Complete: Nachdem sie ___ (ankommen), rief sie ihre Mutter an.", answer: "angekommen war" },
      { prompt: "Translate: He had already eaten when she arrived.", answer: "Er hatte schon gegessen, als sie ankam." },
    ],
    speakingPrompts: [
      "Describe a sequence: Nachdem ich... hatte, ...",
      "Tell what had happened before an event: Bevor der Film anfing...",
      "Retell a story using Plusquamperfekt for background events.",
    ],
    summary:
      "Plusquamperfekt = past before the past. Formation: hatte/war + Partizip II. Required with 'nachdem'. Use war for movement/change verbs, hatte for the rest.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 2: Past Perfect — Plusquamperfekt.

Formation: hatte + Partizip II OR war + Partizip II
War (sein) with: movement (gehen, kommen, fahren), change of state (aufwachen, werden, sterben), bleiben
Hatte (haben) with everything else.

Key pattern with nachdem: Nachdem + Plusquamperfekt → main clause Präteritum
• Nachdem ich gegessen hatte, ging ich schlafen.

Please drill me with:
1. Form Plusquamperfekt (haben or sein?)
2. Complete nachdem sentences
3. Sequence two past events correctly
4. Translate complex past sequences
5. Short story with Plusquamperfekt background

Correct all mistakes carefully. Start with: "Plusquamperfekt drill! haben or sein? gehen (ich) → Ich ___ ___?"`,
  },
  {
    id: "b1ch03",
    number: 3,
    title: "Temporal Conjunctions",
    subtitle: "Nachdem, Bevor, Seitdem",
    icon: "⏱️",
    difficulty: "medium",
    estimatedMinutes: 25,
    tags: ["conjunctions", "word-order", "time"],
    theory: [
      {
        heading: "Subordinating Conjunctions — Verb to End",
        body: "All temporal conjunctions are SUBORDINATING — verb goes to the END of the clause.\n\n• Nachdem ich gegessen HATTE, ...\n• Bevor ich gehe, ...\n• Seitdem ich hier WOHNE, ...",
      },
      {
        heading: "NACHDEM — After",
        body: "Requires a tense shift — the main clause is one tense 'newer':\n\n• Nachdem + Plusquamperfekt → main clause Präteritum\n  Nachdem er gegessen hatte, ging er schlafen.\n\n• Nachdem + Perfekt → main clause Präsens or Futur\n  Nachdem sie angekommen ist, ruft sie an.",
      },
      {
        heading: "BEVOR — Before",
        body: "Usually same tense in both clauses. No tense shift required.\n\n• Bevor ich gehe, esse ich. (Before I leave, I eat.)\n• Bevor sie schläft, liest sie. (Before she sleeps, she reads.)\n• Bevor wir reisen, planen wir. (Before we travel, we plan.)",
      },
      {
        heading: "SEITDEM — Since (then)",
        body: "Action began in the past and CONTINUES now. Usually present tense in main clause.\n\n• Seitdem ich hier wohne, fühle ich mich wohl. (Since I've lived here, I feel at home.)\n• Seitdem er krank war, geht er früh schlafen. (Since he was sick, he goes to bed early.)",
      },
    ],
    examples: [
      { de: "Nachdem er gegessen hatte, ging er schlafen.", en: "After he had eaten, he went to sleep." },
      { de: "Bevor ich gehe, esse ich etwas.", en: "Before I leave, I eat something." },
      { de: "Seitdem ich Deutsch lerne, reise ich mehr.", en: "Since I've been learning German, I travel more." },
      { de: "Nachdem sie die Prüfung bestanden hatte, feierte sie.", en: "After she had passed the exam, she celebrated." },
      { de: "Bevor er anruft, schreibt er eine Nachricht.", en: "Before he calls, he writes a message." },
    ],
    mistakes: [
      "Don't forget verb-final in the subordinate clause: ❌ Bevor ich gehe nach Hause ✓ Bevor ich nach Hause gehe",
      "With nachdem, don't use same tense: ❌ Nachdem er isst, geht er. ✓ Nachdem er gegessen hat, geht er.",
      "Seitdem ≠ seit — seitdem is a conjunction (+ clause), seit is a preposition (+ noun).",
    ],
    exercises: [
      { prompt: "Complete: Nachdem sie ___ (ankommen), rief sie an.", answer: "angekommen war" },
      { prompt: "Add verb-final: Bevor ich ___ (gehen), trinke ich Kaffee.", answer: "gehe" },
      { prompt: "Translate: Since she moved here, she is happier.", answer: "Seitdem sie hier wohnt, ist sie glücklicher." },
      { prompt: "Combine: Er isst. Dann schläft er. → Nachdem...", answer: "Nachdem er gegessen hatte, schlief er." },
    ],
    speakingPrompts: [
      "Describe your morning routine: Bevor ich zur Arbeit gehe...",
      "Talk about changes: Seitdem ich Sport mache, fühle ich mich...",
      "Tell a sequence: Nachdem ich...",
    ],
    summary:
      "Temporal conjunctions send verb to end. Nachdem requires tense shift (Plusquamperfekt → Präteritum). Bevor = same tense. Seitdem = ongoing since past.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 3: Temporal Conjunctions — nachdem, bevor, seitdem.

All are subordinating conjunctions → VERB TO END.

nachdem: tense shift required
• nachdem + Plusquamperfekt → main clause Präteritum
• nachdem + Perfekt → main clause Präsens

bevor: same tense, verb to end
• Bevor ich gehe, esse ich.

seitdem: ongoing action since past, verb to end
• Seitdem ich hier wohne, ...

Please drill me with:
1. Complete nachdem sentences (correct tense)
2. Build bevor sentences
3. Build seitdem sentences
4. Combine two sentences using nachdem/bevor
5. Correct word order errors

Start with: "Temporal conjunction drill! Complete: Nachdem er ___ (essen), ging er schlafen."`,
  },
  {
    id: "b1ch04",
    number: 4,
    title: "Futur I",
    subtitle: "Future Tense",
    icon: "🔮",
    difficulty: "easy",
    estimatedMinutes: 20,
    tags: ["tense", "future", "prediction"],
    theory: [
      {
        heading: "Formation",
        body: "werden (conjugated) + infinitive (at end)\n\n• ich werde kommen\n• du wirst kommen\n• er/sie/es wird kommen\n• wir werden kommen\n• ihr werdet kommen\n• sie/Sie werden kommen",
      },
      {
        heading: "Uses of Futur I",
        body: "1. Predictions: Es wird morgen regnen.\n2. Promises: Ich werde es machen.\n3. Assumptions about now: Er wird schlafen. (He's probably sleeping.)\n4. Intentions: Wir werden nach Berlin fahren.\n5. Warnings: Das wird schwierig werden.",
      },
      {
        heading: "Futur I vs Present Tense",
        body: "Germans often prefer PRESENT tense for future plans (especially with a time word):\n✓ Ich komme morgen. (preferred in speech)\n✓ Ich werde morgen kommen. (more emphatic/formal)\n\nFutur I sounds more emphatic, formal, or expresses assumption.",
      },
    ],
    examples: [
      { de: "Ich werde morgen kommen.", en: "I will come tomorrow." },
      { de: "Es wird regnen.", en: "It will rain." },
      { de: "Er wird wohl schlafen.", en: "He's probably sleeping." },
      { de: "Wir werden die Prüfung bestehen.", en: "We will pass the exam." },
      { de: "Das wird nicht einfach sein.", en: "That won't be easy." },
    ],
    mistakes: [
      "Don't put infinitive in second position: ❌ Ich werde kommen morgen. ✓ Ich werde morgen kommen.",
      "Don't conjugate the infinitive: ❌ Ich werde komme. ✓ Ich werde kommen.",
      "Word order with werden: werden is verb-2, infinitive goes to END.",
    ],
    exercises: [
      { prompt: "Form Futur I: ich / lernen", answer: "Ich werde lernen." },
      { prompt: "Form Futur I: sie (pl.) / nach Hause fahren", answer: "Sie werden nach Hause fahren." },
      { prompt: "Translate: It will snow tomorrow.", answer: "Es wird morgen schneien." },
      { prompt: "Translate (assumption): She's probably at home.", answer: "Sie wird zu Hause sein." },
    ],
    speakingPrompts: [
      "Make predictions about next year: Im nächsten Jahr werde ich...",
      "Make promises: Ich verspreche, ich werde...",
      "Make assumptions: Er antwortet nicht — er wird wohl...",
    ],
    summary:
      "Futur I: werden + infinitive (at end). Used for predictions, promises, assumptions, intentions. Present tense is often preferred in spoken German for future plans.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 4: Futur I.

Formation: werden (conjugated) + infinitive (at end of clause)
Conjugation: ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden

Uses:
• Predictions: Es wird regnen.
• Promises: Ich werde es tun.
• Assumptions (with wohl): Er wird wohl schlafen.
• Intentions: Wir werden reisen.

vs Present tense: Ich komme morgen. (more natural in speech)
Futur I: more emphatic, formal, or for assumptions.

Please drill me with:
1. Form Futur I sentences
2. Distinguish: Futur I or present tense better here?
3. Assumptions with "wohl"
4. Promises and predictions
5. Word order correction

Start with: "Futur I drill! Form: ich / morgen / nach Berlin fahren → ?"`,
  },
  {
    id: "b1ch05",
    number: 5,
    title: "Genitive Prepositions",
    subtitle: "Wegen, Trotz, Während, Statt",
    icon: "📌",
    difficulty: "medium",
    estimatedMinutes: 25,
    tags: ["prepositions", "genitive", "cases"],
    theory: [
      {
        heading: "Genitive Prepositions",
        body: "These prepositions require the GENITIVE case:\n• wegen — because of\n• trotz — despite, in spite of\n• während — during\n• statt/anstatt — instead of\n• aufgrund — due to\n• innerhalb — inside of / within\n• außerhalb — outside of\n• wegen, trotz, während, statt are the most common B1 ones.",
      },
      {
        heading: "Genitive Articles",
        body: "Masculine/Neuter: des + noun +(e)s\n• wegen des Wetters (because of the weather)\n• trotz des Regens (despite the rain)\n\nFeminine/Plural: der\n• wegen der Kälte (because of the cold)\n• während der Ferien (during the holidays)",
      },
      {
        heading: "Spoken German — Dative Drift",
        body: "In casual spoken German, these prepositions are increasingly used with DATIVE:\n• wegen dem Wetter (spoken, informal)\n• trotz dem Regen (spoken)\n\nBut in writing and formal German, use GENITIVE. Both are understood, but genitive is correct.",
      },
    ],
    examples: [
      { de: "Wegen des Wetters blieben wir zu Hause.", en: "Because of the weather, we stayed home." },
      { de: "Trotz des Regens gingen wir spazieren.", en: "Despite the rain, we went for a walk." },
      { de: "Während der Prüfung war es still.", en: "During the exam, it was quiet." },
      { de: "Statt des Kaffees trank sie Tee.", en: "Instead of coffee, she drank tea." },
      { de: "Aufgrund der Situation mussten wir warten.", en: "Due to the situation, we had to wait." },
    ],
    mistakes: [
      "Don't use accusative: ❌ wegen das Wetter ✓ wegen des Wetters",
      "Don't forget -(e)s on masculine/neuter nouns in genitive: ❌ wegen des Wetter ✓ wegen des Wetters",
      "Don't confuse 'während' (during/genitive) with 'während' as a conjunction (while/subord.).",
    ],
    exercises: [
      { prompt: "Use genitive: wegen / das Wetter", answer: "wegen des Wetters" },
      { prompt: "Use genitive: trotz / der Regen", answer: "trotz des Regens" },
      { prompt: "Use genitive: während / die Ferien (pl.)", answer: "während der Ferien" },
      { prompt: "Translate: She came despite the cold.", answer: "Sie kam trotz der Kälte." },
      { prompt: "Translate: Because of the traffic, he was late.", answer: "Wegen des Staus kam er zu spät." },
    ],
    speakingPrompts: [
      "Give reasons: Wegen... konnte ich nicht...",
      "Express contrast: Trotz... machte ich...",
      "Describe timing: Während der Arbeit...",
    ],
    summary:
      "Genitive prepositions: wegen, trotz, während, statt/anstatt. Masculine/Neuter: des + -(e)s. Feminine/Plural: der. In formal writing, always use genitive.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 5: Genitive Prepositions — wegen, trotz, während, statt.

These require GENITIVE case:
• wegen (because of), trotz (despite), während (during), statt/anstatt (instead of)

Genitive articles:
• Masculine/Neuter: des + noun+(e)s → wegen des Wetters, trotz des Regens
• Feminine/Plural: der → wegen der Kälte, während der Ferien

In formal/written German: always genitive. Spoken: sometimes dative used informally.

Please drill me with:
1. Fill in correct genitive form
2. Build sentences with wegen/trotz/während/statt
3. Translate sentences using genitive prepositions
4. Correct case errors
5. Formal vs informal comparison

Start with: "Genitive prepositions drill! Fill in: wegen ___ Wetters (das Wetter → genitive)"`,
  },
  {
    id: "b1ch06",
    number: 6,
    title: "N-Declension",
    subtitle: "Weak Masculine Nouns",
    icon: "🔡",
    difficulty: "hard",
    estimatedMinutes: 30,
    tags: ["nouns", "cases", "declension"],
    theory: [
      {
        heading: "What is N-Declension?",
        body: "Some masculine nouns add -n or -en in ALL cases EXCEPT nominative singular. These are called 'weak nouns'.\n\nDeclension of 'der Student':\n• Nom: der Student\n• Acc: den Studenten\n• Dat: dem Studenten\n• Gen: des Studenten",
      },
      {
        heading: "Which Nouns?",
        body: "Category 1 — Masculine nouns ending in -e:\n• der Junge (boy), der Name, der Kollege, der Kunde, der Zeuge\n\nCategory 2 — Masculine nouns for people/animals (often foreign):\n• der Student, der Polizist, der Tourist, der Pilot, der Held\n\nCategory 3 — Some other masculines:\n• der Herr (Herrn!), der Nachbar, der Bauer",
      },
      {
        heading: "How to Identify",
        body: "Weak nouns often:\n• end in -e (der Löwe, der Affe)\n• come from Latin/Greek with -ent, -ant, -ist, -ot, -at endings\n  (der Student, der Journalist, der Kandidat, der Pilot)\n• refer to male people or animals",
      },
    ],
    examples: [
      { de: "Ich sehe den Studenten.", en: "I see the student." },
      { de: "Ich helfe dem Studenten.", en: "I help the student." },
      { de: "Das ist das Buch des Studenten.", en: "That is the student's book." },
      { de: "Der Junge spielt.", en: "The boy is playing." },
      { de: "Ich kenne den Jungen.", en: "I know the boy." },
      { de: "Mein Kollege arbeitet hier. / Ich kenne meinen Kollegen.", en: "My colleague works here. / I know my colleague." },
    ],
    mistakes: [
      "Don't forget -en in accusative: ❌ Ich sehe den Student. ✓ Ich sehe den Studenten.",
      "Don't apply n-declension to all masculines — only specific categories.",
      "Herr is irregular: der Herr → den Herrn (not Herrnen).",
    ],
    exercises: [
      { prompt: "Decline in accusative: der Polizist", answer: "den Polizisten" },
      { prompt: "Decline in dative: der Kollege", answer: "dem Kollegen" },
      { prompt: "Decline in genitive: der Tourist", answer: "des Touristen" },
      { prompt: "Fill in: Ich spreche mit ___ (der Journalist).", answer: "dem Journalisten" },
      { prompt: "Translate: I see the pilot.", answer: "Ich sehe den Piloten." },
    ],
    speakingPrompts: [
      "Talk about people using weak nouns: Ich kenne einen Studenten...",
      "Describe your workplace: Mein Kollege / Mein Kunde...",
      "Practice in sentences: Der Polizist / Den Polizisten / Dem Polizisten",
    ],
    summary:
      "N-declension: weak masculine nouns add -n/-en in all cases except nominative singular. Key groups: nouns ending in -e, Latin/Greek professional nouns (-ent, -ist, -ant). Must memorize which nouns belong.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 6: N-Declension — Weak Masculine Nouns.

Weak masculine nouns add -n or -en in ALL cases except nominative singular.

Declension of 'der Student':
• Nominative: der Student
• Accusative: den Studenten
• Dative: dem Studenten
• Genitive: des Studenten

Common weak nouns: Student, Polizist, Tourist, Pilot, Journalist, Kollege, Junge, Name, Held, Kunde

Rules for identifying: ends in -e, Latin/Greek -ent/-ist/-ant/-ot/-at, male people

Please drill me with:
1. Decline weak nouns in all cases
2. Fill in correct form in sentences
3. Identify: weak noun or not?
4. Correct errors in weak noun usage
5. Build sentences with weak nouns in different cases

Start with: "N-declension drill! Accusative of 'der Student' → Ich sehe ___?"`,
  },
  {
    id: "b1ch07",
    number: 7,
    title: "Damit vs Um...zu",
    subtitle: "Purpose Clauses",
    icon: "🎯",
    difficulty: "medium",
    estimatedMinutes: 25,
    tags: ["conjunctions", "purpose", "word-order"],
    theory: [
      {
        heading: "Expressing Purpose",
        body: "Both express purpose (in order to / so that), but the choice depends on whether both clauses have the SAME or DIFFERENT subjects.",
      },
      {
        heading: "UM...ZU — Same Subject",
        body: "Use um...zu when BOTH clauses have the same subject.\n\nStructure: ..., um [infinitive] zu [position]\n\n• Ich lerne, um die Prüfung zu bestehen.\n  (I study in order to pass the exam.)\n• Er arbeitet, um Geld zu verdienen.\n  (He works to earn money.)\n• Sie fährt früh, um pünktlich anzukommen.\n  (She leaves early to arrive on time.)\n\nNote: zu goes BEFORE the infinitive. With separable verbs: anzukommen (not zu ankommen).",
      },
      {
        heading: "DAMIT — Different Subjects",
        body: "Use damit when the two clauses have DIFFERENT subjects.\n\nStructure: damit + verb to END (subordinate clause)\n\n• Ich lerne, damit du stolz bist.\n  (I study so that YOU are proud.)\n• Er spricht langsam, damit ich ihn verstehe.\n  (He speaks slowly so that I understand him.)\n• Sie kocht, damit die Kinder essen können.\n  (She cooks so that the children can eat.)",
      },
    ],
    examples: [
      { de: "Ich lerne, um die Prüfung zu bestehen.", en: "I study in order to pass the exam." },
      { de: "Er lerne, damit sein Vater stolz ist.", en: "He studies so that his father is proud." },
      { de: "Sie kauft Blumen, um die Wohnung zu schmücken.", en: "She buys flowers to decorate the apartment." },
      { de: "Ich spreche laut, damit alle mich hören.", en: "I speak loudly so that everyone hears me." },
      { de: "Er übt täglich, um besser zu werden.", en: "He practices daily to get better." },
    ],
    mistakes: [
      "Don't use um...zu with different subjects: ❌ Ich lerne, um du stolz bist. ✓ Ich lerne, damit du stolz bist.",
      "Don't forget 'zu' before infinitive: ❌ Ich lerne, um bestehen. ✓ Ich lerne, um zu bestehen.",
      "With separable verbs, 'zu' goes BETWEEN prefix and stem: ✓ um anzukommen (not um zu ankommen).",
    ],
    exercises: [
      { prompt: "Same subject → um...zu: Ich spare. Ich kaufe ein Auto.", answer: "Ich spare, um ein Auto zu kaufen." },
      { prompt: "Different subjects → damit: Er spricht langsam. Ich verstehe ihn.", answer: "Er spricht langsam, damit ich ihn verstehe." },
      { prompt: "Translate: She studies to become a doctor.", answer: "Sie studiert, um Ärztin zu werden." },
      { prompt: "Translate: I cook so that the family can eat.", answer: "Ich koche, damit die Familie essen kann." },
    ],
    speakingPrompts: [
      "Give your reasons: Ich lerne Deutsch, um...",
      "Explain why you do things for others: Ich helfe ihr, damit...",
      "Talk about goals: Ich spare, um.../ Ich arbeite, damit...",
    ],
    summary:
      "Purpose clauses: um...zu (same subject, infinitive at end) vs damit (different subjects, verb to end). Um...zu = to do sth. Damit = so that sb else...",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 7: Purpose Clauses — damit vs um...zu.

SAME subject → um...zu
• Structure: ..., um + infinitive + zu (at end)
• Ich lerne, um die Prüfung zu bestehen.
• Separable verbs: um anzukommen (zu between prefix and verb)

DIFFERENT subjects → damit
• Structure: damit + [subject] + ... + verb (at end)
• Ich lerne, damit du stolz bist.
• Er spricht langsam, damit ich ihn verstehe.

Please drill me with:
1. Choose damit or um...zu (identify same/different subject)
2. Combine two sentences using damit or um...zu
3. Complete partial sentences
4. Translate purpose sentences
5. Correct errors

Start with: "Purpose clause drill! Same or different subject? Ich spare. Ich kaufe ein Auto. → damit or um...zu?"`,
  },
  {
    id: "b1ch08",
    number: 8,
    title: "Ohne...zu & Anstatt...zu",
    subtitle: "Without Doing & Instead of Doing",
    icon: "🚫",
    difficulty: "medium",
    estimatedMinutes: 20,
    tags: ["conjunctions", "infinitive", "word-order"],
    theory: [
      {
        heading: "OHNE...ZU — Without doing",
        body: "Expresses that something happens WITHOUT an action taking place.\n\nStructure: ..., ohne [infinitive] zu [position]\nRequires SAME subject in both clauses.\n\n• Er geht weg, ohne Tschüss zu sagen.\n  (He leaves without saying goodbye.)\n• Sie isst, ohne zu reden.\n  (She eats without talking.)\n• Er hat bestanden, ohne viel zu lernen.\n  (He passed without studying much.)",
      },
      {
        heading: "ANSTATT...ZU — Instead of doing",
        body: "Expresses doing one thing INSTEAD OF another.\n\nStructure: ..., anstatt [infinitive] zu [position]\nAlso: statt...zu (shorter form, same meaning)\nRequires SAME subject.\n\n• Anstatt zu lernen, spielt er.\n  (Instead of studying, he plays.)\n• Sie tanzt, anstatt zu arbeiten.\n  (She dances instead of working.)\n• Statt zu schlafen, sieht er fern.\n  (Instead of sleeping, he watches TV.)",
      },
      {
        heading: "Key Rules",
        body: "Both constructions:\n1. Require SAME subject in both clauses\n2. 'zu' goes before the infinitive\n3. With separable verbs: aufzumachen, anzurufen\n4. Negation: ohne...zu = 'without', so it already implies negation",
      },
    ],
    examples: [
      { de: "Er geht weg, ohne Tschüss zu sagen.", en: "He leaves without saying goodbye." },
      { de: "Anstatt zu lernen, spielt er.", en: "Instead of studying, he plays." },
      { de: "Sie schläft, ohne das Licht auszumachen.", en: "She sleeps without turning off the light." },
      { de: "Statt zu klagen, handelt er.", en: "Instead of complaining, he acts." },
      { de: "Er redete, ohne nachzudenken.", en: "He talked without thinking." },
    ],
    mistakes: [
      "Don't forget 'zu': ❌ ohne Tschüss sagen ✓ ohne Tschüss zu sagen",
      "Don't use different subjects with ohne...zu or anstatt...zu.",
      "Separable verbs: zu goes BETWEEN prefix and stem: ✓ ohne aufzumachen",
    ],
    exercises: [
      { prompt: "Build: Er geht weg / Er sagt Tschüss nicht → ohne...zu", answer: "Er geht weg, ohne Tschüss zu sagen." },
      { prompt: "Build: Sie arbeitet nicht / Sie spielt → anstatt...zu", answer: "Anstatt zu arbeiten, spielt sie." },
      { prompt: "Translate: He eats without talking.", answer: "Er isst, ohne zu reden." },
      { prompt: "Translate: Instead of calling, she wrote a message.", answer: "Anstatt anzurufen, schrieb sie eine Nachricht." },
    ],
    speakingPrompts: [
      "Describe habits: Ich esse, ohne...",
      "Express priorities: Anstatt zu..., mache ich...",
      "Tell about someone: Er/Sie... ohne zu... / anstatt zu...",
    ],
    summary:
      "Ohne...zu = without doing. Anstatt/statt...zu = instead of doing. Both require same subject. Structure: ohne/anstatt + infinitive + zu. Separable verbs: prefix+zu+verb.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 8: Infinitive Constructions — ohne...zu and anstatt...zu.

OHNE...ZU = without doing (same subject required)
• Er geht weg, ohne Tschüss zu sagen.
• Structure: ..., ohne [zu + infinitive at end]

ANSTATT...ZU = instead of doing (same subject required)
• Anstatt zu lernen, spielt er.
• Structure: anstatt + zu + infinitive, ...

Separable verbs: zu goes BETWEEN: ohne aufzumachen, anstatt anzurufen

Please drill me with:
1. Build ohne...zu sentences
2. Build anstatt...zu sentences
3. Combine two actions correctly
4. Handle separable verbs with zu
5. Translate and correct errors

Start with: "Infinitive construction drill! Build with ohne...zu: Er geht. Er sagt nicht Tschüss. → ?"`,
  },
  {
    id: "b1ch09",
    number: 9,
    title: "Two-Part Connectors",
    subtitle: "Entweder...oder, Weder...noch & More",
    icon: "🔗",
    difficulty: "medium",
    estimatedMinutes: 25,
    tags: ["conjunctions", "connectors", "word-order"],
    theory: [
      {
        heading: "Correlative Conjunctions",
        body: "Two-part connectors link ideas in pairs. They show relationships like alternatives, negation, addition, and emphasis.",
      },
      {
        heading: "ENTWEDER...ODER — Either...or",
        body: "Presents alternatives.\n\n• Entweder ich gehe, oder du gehst.\n  (Either I go, or you go.)\n• Wir fahren entweder mit dem Zug oder mit dem Auto.\n  (We go either by train or by car.)\n\nNote: When 'entweder' starts a sentence, inversion occurs (verb in position 2).",
      },
      {
        heading: "WEDER...NOCH — Neither...nor",
        body: "Double negation — neither one nor the other.\n\n• Er trinkt weder Kaffee noch Tee.\n  (He drinks neither coffee nor tea.)\n• Weder ich noch du hast Recht.\n  (Neither I nor you are right.)\n\nNote: No extra 'nicht' needed — weder...noch is already negative.",
      },
      {
        heading: "NICHT NUR...SONDERN AUCH — Not only...but also",
        body: "Adds and emphasizes.\n\n• Er ist nicht nur intelligent, sondern auch fleißig.\n  (He is not only intelligent, but also hard-working.)\n• Ich spreche nicht nur Deutsch, sondern auch Englisch.",
      },
      {
        heading: "SOWOHL...ALS AUCH — Both...and",
        body: "Inclusive addition — both things are true.\n\n• Sowohl Peter als auch Maria kommen.\n  (Both Peter and Maria are coming.)\n• Sie spricht sowohl Deutsch als auch Französisch.",
      },
    ],
    examples: [
      { de: "Entweder du kommst, oder ich gehe allein.", en: "Either you come, or I go alone." },
      { de: "Er spricht weder Deutsch noch Englisch.", en: "He speaks neither German nor English." },
      { de: "Sie ist nicht nur klug, sondern auch freundlich.", en: "She is not only smart, but also friendly." },
      { de: "Sowohl er als auch sie haben Recht.", en: "Both he and she are right." },
      { de: "Wir fahren entweder nach Paris oder nach Rom.", en: "We'll go to either Paris or Rome." },
    ],
    mistakes: [
      "Don't add 'nicht' with weder...noch: ❌ Er trinkt weder nicht Kaffee noch Tee. ✓ Er trinkt weder Kaffee noch Tee.",
      "With entweder at position 1: inversion follows: ✓ Entweder kommt er, oder...",
      "Nicht nur...sondern auch: 'auch' must be included: ❌ nicht nur... sondern ✓ nicht nur... sondern auch",
    ],
    exercises: [
      { prompt: "Combine with entweder...oder: Wir gehen ins Kino. Wir gehen ins Theater.", answer: "Wir gehen entweder ins Kino oder ins Theater." },
      { prompt: "Combine with weder...noch: Er isst kein Fleisch. Er isst keinen Fisch.", answer: "Er isst weder Fleisch noch Fisch." },
      { prompt: "Build: nicht nur...sondern auch: Er ist klug. Er ist freundlich.", answer: "Er ist nicht nur klug, sondern auch freundlich." },
      { prompt: "Translate: Both the teacher and the students are happy.", answer: "Sowohl die Lehrerin als auch die Schüler sind glücklich." },
    ],
    speakingPrompts: [
      "Give options: Entweder... oder...",
      "Express double negation: Ich mag weder... noch...",
      "Emphasize multiple qualities: Er ist nicht nur... sondern auch...",
    ],
    summary:
      "Correlative conjunctions: entweder...oder (alternatives), weder...noch (neither/nor), nicht nur...sondern auch (not only...but also), sowohl...als auch (both...and). Mind inversion with entweder at position 1.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 9: Two-Part Connectors.

entweder...oder = either...or (alternatives)
• Wir fahren entweder mit dem Zug oder mit dem Auto.
• Entweder at position 1 → inversion: Entweder kommt er, oder...

weder...noch = neither...nor (double negation — no extra nicht!)
• Er trinkt weder Kaffee noch Tee.

nicht nur...sondern auch = not only...but also (emphasis + addition)
• Er ist nicht nur klug, sondern auch fleißig.

sowohl...als auch = both...and (inclusive)
• Sowohl Peter als auch Maria kommen.

Please drill me with:
1. Combine sentences using the right connector
2. Choose which connector fits
3. Word order with entweder at position 1
4. Translate and build examples
5. Correct errors

Start with: "Two-part connector drill! Use weder...noch: Er isst kein Fleisch. Er isst keinen Fisch. → ?"`,
  },
  {
    id: "b1ch10",
    number: 10,
    title: "Je...desto",
    subtitle: "Proportional Comparisons",
    icon: "📈",
    difficulty: "medium",
    estimatedMinutes: 20,
    tags: ["comparisons", "word-order", "adjectives"],
    theory: [
      {
        heading: "Structure of Je...desto",
        body: "Expresses proportional relationships: the more X, the more Y.\n\nStructure:\n• je + comparative + [rest of clause] + verb at END\n• desto + comparative + verb in POSITION 2\n\n• Je mehr ich lerne, desto besser spreche ich.\n  (The more I study, the better I speak.)\n• Je älter man wird, desto weiser wird man.\n  (The older you get, the wiser you become.)",
      },
      {
        heading: "Forming Comparatives",
        body: "Adjective + -er for comparative:\n• gut → besser (good → better)\n• viel → mehr (much → more)\n• wenig → weniger (less)\n• groß → größer (bigger)\n• alt → älter (older)\n• schnell → schneller (faster)\n\nAdjectives with -er + adjective endings still apply when before noun.",
      },
      {
        heading: "Word Order Detail",
        body: "Je-clause: je + comparative adjective/adverb, then rest of sentence, VERB AT END (subordinate clause structure)\n\nDesto-clause: desto + comparative, then VERB in position 2 (like inversion)\n\n• Je mehr ich übe, desto besser werde ich.\n  (The more I practice, the better I become.)\n• Je früher du aufstehst, desto mehr Zeit hast du.",
      },
    ],
    examples: [
      { de: "Je mehr ich lerne, desto besser spreche ich.", en: "The more I learn, the better I speak." },
      { de: "Je älter man wird, desto weiser wird man.", en: "The older you get, the wiser you become." },
      { de: "Je früher du aufstehst, desto mehr Zeit hast du.", en: "The earlier you get up, the more time you have." },
      { de: "Je lauter er spricht, desto besser verstehe ich ihn.", en: "The louder he speaks, the better I understand him." },
      { de: "Je mehr sie isst, desto mehr nimmt sie zu.", en: "The more she eats, the more she gains weight." },
    ],
    mistakes: [
      "Don't forget verb-final in je-clause: ❌ Je mehr ich lerne viel, desto... ✓ Je mehr ich lerne, desto...",
      "Don't put desto at position 3+: ❌ Ich spreche desto besser. ✓ Desto besser spreche ich. (inversion)",
      "Don't use 'umso' and 'desto' interchangeably in writing — both work, but desto is more standard.",
    ],
    exercises: [
      { prompt: "Build je...desto: viel lernen / gut sprechen", answer: "Je mehr ich lerne, desto besser spreche ich." },
      { prompt: "Build je...desto: früh aufstehen / viel Zeit haben", answer: "Je früher ich aufstehe, desto mehr Zeit habe ich." },
      { prompt: "Translate: The faster he runs, the sooner he arrives.", answer: "Je schneller er läuft, desto früher kommt er an." },
      { prompt: "Translate: The more expensive the restaurant, the better the food.", answer: "Je teurer das Restaurant, desto besser das Essen." },
    ],
    speakingPrompts: [
      "Make proportional statements about learning: Je mehr ich übe...",
      "Talk about life wisdom: Je älter man wird...",
      "Compare things: Je teurer..., desto besser...",
    ],
    summary:
      "Je...desto = the more...the more. Je-clause: verb at end (subordinate). Desto-clause: inversion (verb position 2). Use comparative adjectives with both.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 10: Je...desto — Proportional Comparisons.

Structure: Je + comparative + [clause with verb at END], desto + comparative + [inversion — verb position 2]

Examples:
• Je mehr ich lerne, desto besser spreche ich.
• Je älter man wird, desto weiser wird man.
• Je früher du aufstehst, desto mehr Zeit hast du.

Key comparatives: mehr, weniger, besser, größer, schneller, früher, später, teurer, billiger

Please drill me with:
1. Build je...desto sentences
2. Fill in the correct comparative
3. Check word order (verb final in je-clause, inversion in desto-clause)
4. Translate proportional sentences
5. Create your own je...desto statements

Start with: "Je...desto drill! Build: viel lernen / gut sprechen → Je mehr ich lerne, desto ___?"`,
  },
  {
    id: "b1ch11",
    number: 11,
    title: "Participles as Adjectives",
    subtitle: "Partizip I & II",
    icon: "✍️",
    difficulty: "hard",
    estimatedMinutes: 30,
    tags: ["participles", "adjectives", "advanced"],
    theory: [
      {
        heading: "Partizip I — Active/Ongoing",
        body: "Formation: infinitive + d\n• schlafen → schlafend (sleeping)\n• lachen → lachend (laughing)\n• sprechen → sprechend (speaking)\n\nMeaning: ongoing/active action\n• das schlafende Kind (the sleeping child)\n• ein lachendes Gesicht (a laughing face)\n• der sprechende Mann (the speaking man)\n\nLike any adjective before a noun: adjective endings apply.",
      },
      {
        heading: "Partizip II — Completed/Passive",
        body: "The regular Partizip II used in adjective position.\n\nMeaning: completed action or passive state\n• das gestohlene Auto (the stolen car)\n• der reparierte Computer (the repaired computer)\n• ein gebrochenes Herz (a broken heart)\n• das geschriebene Buch (the written book)\n\nAdjective endings apply here too.",
      },
      {
        heading: "Adjective Endings Still Apply",
        body: "Both participles in adjective position must take adjective endings based on gender, case, and article type:\n\nMasculine nominative: der schlafende Mann / der gestohlene Wagen\nFeminine nominative: die weinende Frau / die gebrochene Vase\nNeuter: das weinende Kind / das gestohlene Geld\n\nThis combines participle formation + adjective declension knowledge.",
      },
    ],
    examples: [
      { de: "Das schlafende Kind ist süß.", en: "The sleeping child is cute." },
      { de: "Das gestohlene Auto wurde gefunden.", en: "The stolen car was found." },
      { de: "Ein lachender Mann steht vor der Tür.", en: "A laughing man is standing at the door." },
      { de: "Die reparierte Maschine funktioniert wieder.", en: "The repaired machine works again." },
      { de: "Das fließende Wasser klingt schön.", en: "The flowing water sounds beautiful." },
    ],
    mistakes: [
      "Don't forget adjective endings: ❌ das schlafend Kind ✓ das schlafende Kind",
      "Don't confuse Partizip I (active) with Partizip II (passive/completed): schlafend (sleeping) vs eingeschlafen (fallen asleep).",
      "Partizip I = present active meaning. Partizip II = past passive meaning.",
    ],
    exercises: [
      { prompt: "Form Partizip I adjective: das Kind / weinen", answer: "das weinende Kind" },
      { prompt: "Form Partizip II adjective: das Auto / stehlen (gestohlen)", answer: "das gestohlene Auto" },
      { prompt: "Translate: the laughing woman (nominative)", answer: "die lachende Frau" },
      { prompt: "Translate: the broken window (nominative)", answer: "das zerbrochene Fenster" },
      { prompt: "Describe: a running dog", answer: "ein laufender Hund" },
    ],
    speakingPrompts: [
      "Describe scenes using participles: Ein schlafendes Kind...",
      "Talk about things: Mein repariertes Auto / Das gestohlene Handy...",
      "Describe people: Ein lachender Mann / Eine weinende Frau...",
    ],
    summary:
      "Partizip I (infinitive+d) = active/ongoing: das schlafende Kind. Partizip II = completed/passive: das gestohlene Auto. Both take full adjective endings when before a noun.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 11: Participles as Adjectives — Partizip I and Partizip II.

PARTIZIP I = infinitive + d (active, ongoing)
• schlafen → schlafend → das schlafende Kind (the sleeping child)
• lachen → lachend → ein lachendes Gesicht

PARTIZIP II = completed/passive meaning
• stehlen → gestohlen → das gestohlene Auto (the stolen car)
• reparieren → repariert → der reparierte Computer

IMPORTANT: Adjective endings still apply! Gender + case + article type determine ending.

Please drill me with:
1. Form Partizip I adjectives (with correct endings)
2. Form Partizip II adjectives (with correct endings)
3. Choose Partizip I or II for given meaning
4. Translate participle adjective phrases
5. Build sentences with participle adjectives

Start with: "Participle drill! Partizip I of 'schlafen' before 'das Kind' → das ___ Kind?"`,
  },
  {
    id: "b1ch12",
    number: 12,
    title: "Dative Relative Clauses",
    subtitle: "Relative Pronouns in Dative",
    icon: "🔄",
    difficulty: "hard",
    estimatedMinutes: 25,
    tags: ["relative-clauses", "dative", "word-order"],
    theory: [
      {
        heading: "Relative Clauses — Recap",
        body: "Relative clauses describe a noun using a relative pronoun. The verb goes to the END of the relative clause.\n\nThe relative pronoun AGREES with the noun it refers to (gender), but its CASE is determined by its role in the relative clause.",
      },
      {
        heading: "Dative Relative Pronouns",
        body: "When the relative pronoun has a dative role in the relative clause:\n\n• Masculine: dem\n• Feminine: der\n• Neuter: dem\n• Plural: denen\n\nDative role examples:\n• ich helfe jemandem → dem/der/dem/denen\n• ich gebe jemandem → dem/der/dem/denen",
      },
      {
        heading: "Examples with Dative",
        body: "• Der Mann, dem ich helfe, ist nett.\n  (The man [whom I help — dative of helfen] is nice.)\n• Die Frau, der ich das Buch gebe, ist meine Lehrerin.\n  (The woman [to whom I give the book] is my teacher.)\n• Das Kind, dem ich geholfen habe, heißt Lukas.\n  (The child whom I helped is called Lukas.)\n• Die Freunde, denen ich schreibe, wohnen in Berlin.",
      },
    ],
    examples: [
      { de: "Der Mann, dem ich helfe, heißt Thomas.", en: "The man whom I help is called Thomas." },
      { de: "Die Frau, der ich danke, ist meine Mutter.", en: "The woman I thank is my mother." },
      { de: "Das Kind, dem ich das Buch gebe, lächelt.", en: "The child I give the book to smiles." },
      { de: "Die Studenten, denen ich erkläre, sind sehr gut.", en: "The students I explain to are very good." },
    ],
    mistakes: [
      "Don't use accusative pronoun for dative verbs: ❌ Der Mann, den ich helfe ✓ Der Mann, dem ich helfe (helfen = dative)",
      "Don't forget verb-final: ❌ Der Mann, dem ich helfe ihm ✓ Der Mann, dem ich helfe",
      "Dative plural is always 'denen': Die Kinder, denen ich helfe.",
    ],
    exercises: [
      { prompt: "Add relative clause (dative): Der Mann / ich helfe ihm", answer: "Der Mann, dem ich helfe" },
      { prompt: "Add relative clause (dative): Die Frau / ich danke ihr", answer: "Die Frau, der ich danke" },
      { prompt: "Add relative clause (dative, plural): Die Kinder / ich gebe ihnen Bonbons", answer: "Die Kinder, denen ich Bonbons gebe" },
      { prompt: "Translate: The teacher to whom I listen is very good.", answer: "Die Lehrerin, der ich zuhöre, ist sehr gut." },
    ],
    speakingPrompts: [
      "Describe people: Das ist der Mann, dem ich...",
      "Talk about relationships: Meine Freundin, der ich immer helfe...",
      "Describe a situation with dative relative clause.",
    ],
    summary:
      "Dative relative pronouns: dem (m/n), der (f), denen (pl). Case is determined by the verb in the relative clause. Verb goes to end. No extra pronoun needed.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 12: Dative Relative Clauses.

Relative pronouns in dative:
• Masculine: dem — Der Mann, dem ich helfe...
• Feminine: der — Die Frau, der ich danke...
• Neuter: dem — Das Kind, dem ich gebe...
• Plural: denen — Die Leute, denen ich schreibe...

Rules:
• Pronoun gender = antecedent noun gender
• Pronoun case = role in relative clause (dative when used with dative verbs or for indirect object)
• Verb to END of relative clause
• No extra pronoun: ❌ dem ich ihm helfe ✓ dem ich helfe

Common dative verbs: helfen, danken, geben, zeigen, erklären, schreiben, gehören

Please drill me:
1. Choose correct dative relative pronoun (dem/der/denen)
2. Build relative clauses with dative verbs
3. Complete sentences
4. Translate
5. Correct errors

Start with: "Dative relative clause drill! Der Mann / ich helfe ihm → Der Mann, ___ ich helfe, ..."`,
  },
  {
    id: "b1ch13",
    number: 13,
    title: "Genitive Relative Clauses",
    subtitle: "Dessen & Deren — Whose",
    icon: "🔑",
    difficulty: "hard",
    estimatedMinutes: 25,
    tags: ["relative-clauses", "genitive", "whose"],
    theory: [
      {
        heading: "Genitive Relative Pronouns — Meaning",
        body: "Genitive relative pronouns express POSSESSION — equivalent to 'whose' in English.\n\n• dessen = whose (masculine/neuter)\n• deren = whose (feminine/plural)\n\nThe pronoun agrees with the OWNER (not what's owned).",
      },
      {
        heading: "Structure",
        body: "The genitive relative pronoun replaces a possessive (sein/ihr):\n\n• Der Mann, dessen Auto kaputt ist, wartet.\n  (The man whose car is broken is waiting.)\n• Die Frau, deren Buch ich lese, ist Autorin.\n  (The woman whose book I'm reading is an author.)\n• Das Kind, dessen Eltern reisen, wohnt bei der Oma.\n  (The child whose parents are traveling lives with grandma.)\n• Die Schüler, deren Lehrer krank ist, haben frei.",
      },
      {
        heading: "Noun After Dessen/Deren",
        body: "After dessen/deren, the noun comes WITHOUT an article (or with an adjective+noun). The owned noun's case is determined by its role in the relative clause.\n\n• Der Mann, dessen Auto kaputt ist...\n  (dessen = genitive of 'der Mann'; Auto is nominative subject of 'kaputt ist')\n• Die Frau, deren Buch ich lese...\n  (deren = genitive of 'die Frau'; Buch is accusative object of 'lese')",
      },
    ],
    examples: [
      { de: "Der Mann, dessen Auto kaputt ist, wartet auf den Bus.", en: "The man whose car is broken is waiting for the bus." },
      { de: "Die Frau, deren Sohn Arzt ist, ist stolz.", en: "The woman whose son is a doctor is proud." },
      { de: "Das Kind, dessen Eltern arbeiten, spielt allein.", en: "The child whose parents work plays alone." },
      { de: "Die Studenten, deren Professor fehlt, sind froh.", en: "The students whose professor is absent are happy." },
    ],
    mistakes: [
      "Don't use 'der/die/das' for genitive relative — use dessen/deren.",
      "Dessen = masculine AND neuter: der Mann, dessen... + das Kind, dessen...",
      "Deren = feminine AND plural: die Frau, deren... + die Leute, deren...",
    ],
    exercises: [
      { prompt: "Add genitive relative: Der Mann / sein Auto ist kaputt", answer: "Der Mann, dessen Auto kaputt ist" },
      { prompt: "Add genitive relative: Die Frau / ihr Sohn ist Arzt", answer: "Die Frau, deren Sohn Arzt ist" },
      { prompt: "Add genitive relative (plural): Die Kinder / ihre Eltern sind krank", answer: "Die Kinder, deren Eltern krank sind" },
      { prompt: "Translate: The student whose book I borrowed is angry.", answer: "Der Student, dessen Buch ich ausgeliehen habe, ist sauer." },
    ],
    speakingPrompts: [
      "Describe people: Das ist der Mann, dessen Frau...",
      "Talk about things: Das ist das Buch, dessen Inhalt...",
      "Describe a situation using 'whose'.",
    ],
    summary:
      "Genitive relative pronouns express 'whose'. Dessen = m/n, deren = f/pl. Pronoun agrees with the OWNER. Noun after dessen/deren = no article. Verb to end.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 13: Genitive Relative Clauses — dessen and deren.

Meaning: 'whose' — expresses possession in relative clause.

dessen = masculine AND neuter (agrees with owner)
• Der Mann, dessen Auto kaputt ist... (owner = der Mann → dessen)
• Das Kind, dessen Eltern arbeiten... (owner = das Kind → dessen)

deren = feminine AND plural
• Die Frau, deren Sohn Arzt ist... (owner = die Frau → deren)
• Die Studenten, deren Professor fehlt... (owner = plural → deren)

Structure: dessen/deren + noun (no article) + rest of clause + verb at END.

Please drill me:
1. Choose dessen or deren
2. Build genitive relative clauses
3. Combine sentences using whose
4. Translate 'whose' sentences
5. Correct errors

Start with: "Genitive relative drill! Der Mann / sein Auto ist kaputt → Der Mann, ___ Auto kaputt ist, ..."`,
  },
  {
    id: "b1ch14",
    number: 14,
    title: "Advanced Relative Clauses",
    subtitle: "Prepositions, Wo, Was",
    icon: "🔍",
    difficulty: "hard",
    estimatedMinutes: 30,
    tags: ["relative-clauses", "prepositions", "advanced"],
    theory: [
      {
        heading: "Relative Clauses with Prepositions",
        body: "When the relative pronoun is preceded by a preposition, the preposition comes FIRST in the relative clause.\n\nPreposition + relative pronoun:\n• der Bus, auf den ich warte (the bus I'm waiting for)\n• die Stadt, in der ich wohne (the city I live in)\n• der Mann, mit dem ich spreche (the man I'm talking with)\n• das Haus, in dem sie wohnt (the house she lives in)",
      },
      {
        heading: "WO — Places",
        body: "For places, 'wo' can replace the relative pronoun + preposition:\n• die Stadt, wo ich wohne (= die Stadt, in der ich wohne)\n• das Land, wo er geboren wurde (= das Land, in dem...)\n• der Ort, wo wir uns trafen\n\n'Wo' is more informal; preposition + pronoun is more formal/written.",
      },
      {
        heading: "WAS — Indefinite Antecedents",
        body: "Use 'was' as relative pronoun after:\n• alles (everything): Alles, was er sagt, ist wahr.\n• etwas (something): Etwas, was mich stört...\n• nichts (nothing): Nichts, was er tut, hilft.\n• das (referring to a whole clause or neuter): Das, was du machst, ist gut.\n• Superlatives: Das Beste, was ich je gegessen habe.",
      },
    ],
    examples: [
      { de: "Der Bus, auf den ich warte, kommt um 8 Uhr.", en: "The bus I'm waiting for comes at 8 o'clock." },
      { de: "Die Stadt, in der ich wohne, ist sehr schön.", en: "The city I live in is very beautiful." },
      { de: "Alles, was er sagt, ist interessant.", en: "Everything he says is interesting." },
      { de: "Das ist die Frau, mit der ich gesprochen habe.", en: "That's the woman I spoke with." },
      { de: "Das Beste, was ich je gegessen habe, war in Italien.", en: "The best thing I ever ate was in Italy." },
    ],
    mistakes: [
      "Don't split preposition from pronoun: ❌ der Bus, den ich auf warte ✓ der Bus, auf den ich warte",
      "Don't use 'der/die/das' after alles/etwas/nichts — use 'was': ✓ alles, was er sagt",
      "Wo for places is acceptable but preposition+pronoun is more formal.",
    ],
    exercises: [
      { prompt: "Build relative clause: der Bus / ich warte auf ihn", answer: "der Bus, auf den ich warte" },
      { prompt: "Build relative clause: die Stadt / ich wohne in ihr", answer: "die Stadt, in der ich wohne" },
      { prompt: "Use was: Alles / er sagt / ist wahr", answer: "Alles, was er sagt, ist wahr." },
      { prompt: "Translate: The house I live in is old.", answer: "Das Haus, in dem ich wohne, ist alt." },
      { prompt: "Translate: Nothing he does surprises me.", answer: "Nichts, was er tut, überrascht mich." },
    ],
    speakingPrompts: [
      "Describe where you live: Die Stadt, in der ich wohne...",
      "Talk about what matters: Alles, was mir wichtig ist...",
      "Describe objects: Das Buch, über das wir sprechen...",
    ],
    summary:
      "Preposition + relative pronoun: auf den, in der, mit dem (preposition first). Wo for places (informal). Was after alles/etwas/nichts/das and superlatives.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 14: Advanced Relative Clauses — prepositions, wo, was.

PREPOSITION + RELATIVE PRONOUN (preposition comes first):
• der Bus, auf den ich warte (warten auf + accusative)
• die Stadt, in der ich wohne (wohnen in + dative)
• der Mann, mit dem ich spreche (sprechen mit + dative)

WO for places (informal = preposition+pronoun):
• die Stadt, wo ich wohne

WAS after indefinite antecedents:
• alles, was er sagt
• etwas, was mich stört
• nichts, was hilft
• das Beste, was ich je gegessen habe

Please drill me:
1. Build relative clauses with prepositions
2. Choose the correct preposition + pronoun combination
3. Use wo vs in der/in dem
4. Use was correctly
5. Translate complex relative clauses

Start with: "Advanced relative clause drill! Build: der Bus / ich warte auf ihn → der Bus, ___ ich warte?"`,
  },
  {
    id: "b1ch15",
    number: 15,
    title: "Konjunktiv II Present",
    subtitle: "Hypotheticals & Wishes",
    icon: "💭",
    difficulty: "hard",
    estimatedMinutes: 35,
    tags: ["konjunktiv", "hypothetical", "polite"],
    theory: [
      {
        heading: "What is Konjunktiv II?",
        body: "Konjunktiv II expresses:\n• Hypothetical situations: Wenn ich Zeit hätte...\n• Wishes: Ich wünschte, ich wäre dort.\n• Polite requests: Könnten Sie mir helfen?\n• Suggestions: Du solltest mehr schlafen.\n• Unreal conditions: Wenn ich reich wäre...",
      },
      {
        heading: "Standard Form: würde + Infinitive",
        body: "Most verbs: würde (conjugated) + infinitive at end\n\n• ich würde kommen\n• du würdest kommen\n• er/sie/es würde kommen\n• wir würden kommen\n• ihr würdet kommen\n• sie/Sie würden kommen\n\nExamples:\n• Ich würde das machen. (I would do that.)\n• Würdest du mitkommen? (Would you come along?)",
      },
      {
        heading: "Special Forms — Must Memorize",
        body: "These verbs have OWN Konjunktiv II forms (don't use würde with them):\n\n• sein → wäre (I were / he were)\n• haben → hätte (I had / he had)\n• können → könnte (could)\n• müssen → müsste (should/would have to)\n• dürfen → dürfte (might/would be allowed)\n• sollen → sollte (should)\n• wollen → wollte (would want)\n• wissen → wüsste (would know)\n\n• Wenn ich Zeit hätte... (If I had time...)\n• Wenn ich du wäre... (If I were you...)\n• Könnten Sie mir helfen? (Could you help me?)",
      },
    ],
    examples: [
      { de: "Wenn ich Zeit hätte, würde ich reisen.", en: "If I had time, I would travel." },
      { de: "Wenn ich du wäre, würde ich das nicht machen.", en: "If I were you, I wouldn't do that." },
      { de: "Könnten Sie mir bitte helfen?", en: "Could you please help me?" },
      { de: "Ich würde gern ein Eis essen.", en: "I would like to eat an ice cream." },
      { de: "Du solltest mehr schlafen.", en: "You should sleep more." },
      { de: "Das wäre toll!", en: "That would be great!" },
    ],
    mistakes: [
      "Don't use würde with sein/haben/modals: ❌ Wenn ich würde haben Zeit ✓ Wenn ich Zeit hätte",
      "Don't forget infinitive at end with würde: ❌ Ich würde komme ✓ Ich würde kommen",
      "Polite requests always with könnte/würde, not with können/wollen in direct form.",
    ],
    exercises: [
      { prompt: "Form Konjunktiv II: Wenn ich Zeit ___ (haben)...", answer: "hätte" },
      { prompt: "Form polite request: Können Sie mir helfen? → Konjunktiv II", answer: "Könnten Sie mir helfen?" },
      { prompt: "Build: If I were rich, I would travel the world.", answer: "Wenn ich reich wäre, würde ich um die Welt reisen." },
      { prompt: "Translate: I would like a coffee, please.", answer: "Ich hätte gern einen Kaffee, bitte." },
      { prompt: "Advice: You should drink more water.", answer: "Du solltest mehr Wasser trinken." },
    ],
    speakingPrompts: [
      "Make a wish: Wenn ich... wäre/hätte, würde ich...",
      "Make a polite request: Könnten Sie...? / Würden Sie...?",
      "Give advice: Du solltest... / An deiner Stelle würde ich...",
    ],
    summary:
      "Konjunktiv II present: würde + infinitive for most verbs. Special forms for sein→wäre, haben→hätte, modals→könnte/müsste/sollte etc. Used for hypotheticals, wishes, polite requests, advice.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 15: Konjunktiv II Present — Hypotheticals, Wishes, Polite Requests.

Standard form: würde + infinitive (at end)
• ich würde kommen, du würdest kommen, er würde kommen

Special forms (no würde!):
• sein → wäre: Wenn ich du wäre...
• haben → hätte: Wenn ich Zeit hätte...
• können → könnte: Könnten Sie mir helfen?
• müssen → müsste, dürfen → dürfte, sollen → sollte, wollen → wollte, wissen → wüsste

Uses:
• Hypotheticals: Wenn ich... wäre/hätte, würde ich...
• Wishes: Ich wünschte, ich wäre...
• Polite requests: Könnten/Würden Sie...?
• Advice: Du solltest...
• Unreal: Das wäre toll!

Please drill me:
1. Form Konjunktiv II (würde vs special form)
2. Build wenn-clauses (unreal conditions)
3. Make polite requests
4. Give advice with sollte
5. Express wishes

Start with: "Konjunktiv II drill! haben → Konjunktiv II: Wenn ich Zeit ___, ..."`,
  },
  {
    id: "b1ch16",
    number: 16,
    title: "Konjunktiv II Past",
    subtitle: "Regrets & Unreal Past",
    icon: "😔",
    difficulty: "hard",
    estimatedMinutes: 30,
    tags: ["konjunktiv", "past", "regrets"],
    theory: [
      {
        heading: "What is Konjunktiv II Past?",
        body: "Expresses:\n• Regrets: I should have done that.\n• Missed opportunities: If only I had...\n• Unreal past conditions: If I had done X, Y would have happened.\n\nIt refers to actions in the PAST that didn't happen.",
      },
      {
        heading: "Formation",
        body: "hätte + Partizip II  (most verbs)\nwäre + Partizip II   (movement/change verbs)\n\nConjugation of hätte:\n• ich hätte, du hättest, er hätte, wir hätten, ihr hättet, sie hätten\n\nConjugation of wäre:\n• ich wäre, du wärst, er wäre, wir wären, ihr wärt, sie wären\n\nExamples:\n• Ich hätte das gemacht. (I would have done that.)\n• Wir wären gefahren. (We would have gone.)\n• Er hätte kommen sollen. (He should have come.)",
      },
      {
        heading: "Unreal Past Conditions",
        body: "Wenn + Konjunktiv II past → main clause Konjunktiv II past:\n\n• Wenn ich mehr gelernt hätte, hätte ich bestanden.\n  (If I had studied more, I would have passed.)\n• Wenn er früher aufgestanden wäre, hätte er den Bus erwischt.\n  (If he had gotten up earlier, he would have caught the bus.)\n\nBoth clauses use Konjunktiv II past.",
      },
    ],
    examples: [
      { de: "Ich hätte das gemacht.", en: "I would have done that." },
      { de: "Wenn ich mehr gelernt hätte, hätte ich bestanden.", en: "If I had studied more, I would have passed." },
      { de: "Wir wären gefahren, aber es regnete.", en: "We would have gone, but it rained." },
      { de: "Du hättest anrufen sollen.", en: "You should have called." },
      { de: "Wenn sie früher gekommen wäre, hätten wir sie gesehen.", en: "If she had come earlier, we would have seen her." },
    ],
    mistakes: [
      "Don't confuse with Plusquamperfekt (indicative): hatte gegessen = he had eaten (real). hätte gegessen = he would have eaten (hypothetical).",
      "Don't forget wäre for movement verbs: ✓ Ich wäre gefahren (not hätte gefahren).",
      "Both clauses in unreal conditions use Konjunktiv II past.",
    ],
    exercises: [
      { prompt: "Form Konjunktiv II past: machen (ich)", answer: "ich hätte gemacht" },
      { prompt: "Form Konjunktiv II past: fahren (wir)", answer: "wir wären gefahren" },
      { prompt: "Build unreal past: mehr lernen → bestehen", answer: "Wenn ich mehr gelernt hätte, hätte ich bestanden." },
      { prompt: "Express regret: Ich sollte anrufen. (didn't happen)", answer: "Ich hätte anrufen sollen." },
      { prompt: "Translate: If she had been there, everything would have been better.", answer: "Wenn sie dort gewesen wäre, wäre alles besser gewesen." },
    ],
    speakingPrompts: [
      "Express regrets: Ich hätte... sollen/müssen.",
      "Build unreal past: Wenn ich... hätte, hätte ich...",
      "Describe missed opportunities from your life.",
    ],
    summary:
      "Konjunktiv II past: hätte/wäre + Partizip II. For regrets, missed chances, unreal past. Unreal conditions: both clauses use Konjunktiv II past. Wäre for movement verbs.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 16: Konjunktiv II Past — Regrets and Unreal Past.

Formation: hätte/wäre + Partizip II
• Most verbs → hätte: ich hätte gemacht, du hättest gesagt
• Movement/change → wäre: ich wäre gefahren, er wäre gegangen

Unreal past conditions:
• Wenn ich mehr gelernt hätte, hätte ich bestanden.
• Wenn sie früher gekommen wäre, hätten wir sie gesehen.
Both clauses = hätte/wäre + Partizip II.

Uses:
• Regrets: Ich hätte das machen sollen.
• Missed opportunities: Wenn ich... hätte...
• Expressing what would have happened

Please drill me:
1. Form Konjunktiv II past (hätte or wäre?)
2. Build unreal past conditions
3. Express regrets
4. Contrast with Plusquamperfekt (real vs unreal)
5. Translate

Start with: "Konjunktiv II past drill! machen (ich) → Ich ___ ___?"`,
  },
  {
    id: "b1ch17",
    number: 17,
    title: "Past Passive",
    subtitle: "Passiv Präteritum",
    icon: "🏗️",
    difficulty: "medium",
    estimatedMinutes: 25,
    tags: ["passive", "past", "tense"],
    theory: [
      {
        heading: "Past Passive — Formation",
        body: "Passiv Präteritum (past passive) describes actions that WERE done to something.\n\nFormation: wurde (conjugated) + Partizip II (at end)\n\nConjugation of werden (Präteritum):\n• ich wurde\n• du wurdest\n• er/sie/es wurde\n• wir wurden\n• ihr wurdet\n• sie/Sie wurden",
      },
      {
        heading: "Examples",
        body: "• Das Haus wurde gebaut. (The house was built.)\n• Das Auto wurde repariert. (The car was repaired.)\n• Die Briefe wurden geschrieben. (The letters were written.)\n• Das Fenster wurde zerbrochen. (The window was broken.)",
      },
      {
        heading: "With Agent (von + Dative)",
        body: "To express WHO performed the action:\nvon + Dative\n\n• Das Haus wurde von den Arbeitern gebaut.\n  (The house was built by the workers.)\n• Das Auto wurde von meinem Bruder repariert.\n  (The car was repaired by my brother.)\n\nThe agent is optional — often omitted when unknown or unimportant.",
      },
      {
        heading: "Active ↔ Passive Transformation",
        body: "Active: Die Arbeiter bauten das Haus.\nPassive: Das Haus wurde von den Arbeitern gebaut.\n\nSteps:\n1. Object of active → subject of passive\n2. Subject of active → von + Dative (optional)\n3. Verb → wurde + Partizip II",
      },
    ],
    examples: [
      { de: "Das Haus wurde 1990 gebaut.", en: "The house was built in 1990." },
      { de: "Das Auto wurde von meinem Vater repariert.", en: "The car was repaired by my father." },
      { de: "Die Tür wurde geschlossen.", en: "The door was closed." },
      { de: "Die Bücher wurden in der Bibliothek gefunden.", en: "The books were found in the library." },
      { de: "Das Essen wurde von meiner Mutter gekocht.", en: "The food was cooked by my mother." },
    ],
    mistakes: [
      "Don't use 'war' for past passive: ❌ Das Haus war gebaut. (= state passive) ✓ Das Haus wurde gebaut. (= past passive/action)",
      "Don't forget Partizip II at end: ❌ Das Haus wurde 1990 gebaut werden ✓ Das Haus wurde 1990 gebaut.",
      "Von + Dative for agent: ❌ von dem Arbeiter (correct!) — remember 'dem' is dative masculine.",
    ],
    exercises: [
      { prompt: "Form past passive: Das Auto / reparieren", answer: "Das Auto wurde repariert." },
      { prompt: "Add agent: Das Haus / bauen / die Arbeiter", answer: "Das Haus wurde von den Arbeitern gebaut." },
      { prompt: "Convert active to passive: Mein Bruder kaufte das Auto.", answer: "Das Auto wurde von meinem Bruder gekauft." },
      { prompt: "Translate: The letter was written by the secretary.", answer: "Der Brief wurde von der Sekretärin geschrieben." },
    ],
    speakingPrompts: [
      "Describe historical events: Das Schloss wurde... gebaut.",
      "Talk about things being done: Mein Auto wurde repariert.",
      "Practice active → passive transformations.",
    ],
    summary:
      "Passiv Präteritum: wurde + Partizip II. Agent: von + Dative (optional). Converts active past to passive. Don't confuse with state passive (ist + Partizip II).",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 17: Past Passive — Passiv Präteritum.

Formation: wurde (conjugated) + Partizip II (at end of clause)
• Das Haus wurde gebaut.
• Die Bücher wurden geschrieben.

Conjugation: ich wurde, du wurdest, er/sie/es wurde, wir wurden, ihr wurdet, sie wurden

With agent: von + Dative
• Das Haus wurde von den Arbeitern gebaut.

Active → Passive transformation:
• Active: Die Köchin kochte das Essen.
• Passive: Das Essen wurde von der Köchin gekocht.

Please drill me:
1. Form past passive sentences
2. Add von + Dative agent
3. Transform active Präteritum → passive
4. Translate passive sentences
5. Distinguish wurde (action passive) vs war (state)

Start with: "Past passive drill! Form: Das Auto / reparieren → Das Auto wurde ___?"`,
  },
  {
    id: "b1ch18",
    number: 18,
    title: "State Passive",
    subtitle: "Zustandspassiv",
    icon: "🔒",
    difficulty: "medium",
    estimatedMinutes: 20,
    tags: ["passive", "state", "sein"],
    theory: [
      {
        heading: "Zustandspassiv — State Passive",
        body: "The state passive describes a RESULT or STATE — not the action of doing, but the state that exists after the action.\n\nFormation: sein (conjugated) + Partizip II\n\n• Die Tür ist geschlossen. (The door is closed — it's in a closed state.)\n• Das Fenster ist geöffnet. (The window is open — it's in an open state.)\n• Das Essen ist gekocht. (The food is cooked — it's done.)",
      },
      {
        heading: "Zustandspassiv vs Vorgangspassiv",
        body: "KEY DISTINCTION:\n\nVorgangspassiv (action): werden + Partizip II\n→ describes the PROCESS/ACTION\n→ Die Tür wird geschlossen. (The door is being closed.)\n→ Die Tür wurde geschlossen. (The door was closed — the action.)\n\nZustandspassiv (state): sein + Partizip II\n→ describes the RESULTING STATE\n→ Die Tür ist geschlossen. (The door is closed — it's in a closed state.)",
      },
      {
        heading: "When to Use Which",
        body: "Ask yourself: Am I describing an ACTION or a STATE?\n\n• Das Geschäft wird geöffnet. (The store is being opened — action happening now)\n• Das Geschäft ist geöffnet. (The store is open — it's in an open state)\n\n• Das Fenster wurde zerbrochen. (The window was broken — someone broke it)\n• Das Fenster ist zerbrochen. (The window is broken — it's in a broken state)",
      },
    ],
    examples: [
      { de: "Die Tür ist geschlossen.", en: "The door is closed (state)." },
      { de: "Die Tür wird geschlossen.", en: "The door is being closed (action)." },
      { de: "Das Essen ist zubereitet.", en: "The food is prepared (state)." },
      { de: "Die Aufgabe ist erledigt.", en: "The task is done (state)." },
      { de: "Das Geschäft ist geöffnet.", en: "The store is open (state)." },
    ],
    mistakes: [
      "Don't confuse ist + Partizip II (state passive) with war + Partizip II (Konjunktiv II past): different meanings!",
      "Don't use Zustandspassiv when you mean an action: ❌ Die Tür ist jeden Tag geschlossen. (ambiguous) ✓ Die Tür wird jeden Tag geschlossen. (action)",
      "Zustandspassiv doesn't typically need a von-agent — it's about the resulting state.",
    ],
    exercises: [
      { prompt: "State passive (state): Die Tür / schließen → is currently closed", answer: "Die Tür ist geschlossen." },
      { prompt: "Action passive (action): Die Tür / schließen → is being closed now", answer: "Die Tür wird geschlossen." },
      { prompt: "State or action? Das Fenster ist geöffnet.", answer: "State passive (Zustandspassiv)" },
      { prompt: "Translate (state): The letter is written (finished).", answer: "Der Brief ist geschrieben." },
      { prompt: "Contrast: active → action passive → state passive for 'reparieren das Auto'", answer: "Der Mechaniker repariert das Auto. → Das Auto wird repariert. → Das Auto ist repariert." },
    ],
    speakingPrompts: [
      "Describe states around you: Das Fenster ist offen. Die Tür ist geschlossen.",
      "Compare action vs state: wird geöffnet vs ist geöffnet",
      "Describe completed tasks: Die Hausaufgaben sind erledigt.",
    ],
    summary:
      "Zustandspassiv: sein + Partizip II = resulting STATE. Contrast: wird/wurde + Partizip II = action/process. Key question: action happening or state existing?",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 18: State Passive — Zustandspassiv.

ZUSTANDSPASSIV: sein + Partizip II = resulting state/result
• Die Tür ist geschlossen. (The door is closed — state)
• Das Essen ist fertig. Das Geschäft ist geöffnet.

VORGANGSPASSIV: werden + Partizip II = action/process
• Die Tür wird geschlossen. (The door is being closed — action)
• Die Tür wurde geschlossen. (The door was closed — past action)

KEY QUESTION: Action or State?
• werden = process happening
• sein = result/state after process

Please drill me:
1. Choose: wird/wurde vs ist (action or state)
2. Transform: action passive → state passive
3. Describe states using Zustandspassiv
4. Translate distinguishing action vs state
5. Correct errors (mixing up sein/werden)

Start with: "State passive drill! Is this action or state? 'Die Tür ist geschlossen' → action or state?"`,
  },
  {
    id: "b1ch19",
    number: 19,
    title: "Hin & Her",
    subtitle: "Directional Prefixes",
    icon: "↔️",
    difficulty: "medium",
    estimatedMinutes: 20,
    tags: ["verbs", "prefixes", "direction"],
    theory: [
      {
        heading: "Basic Meaning",
        body: "Hin and her show direction relative to the SPEAKER:\n\n• hin = AWAY from the speaker\n  (the speaker is not there, movement toward a destination)\n\n• her = TOWARD the speaker\n  (movement toward where the speaker is)\n\nExamples:\n• Geh hin! (Go there! — away from here)\n• Komm her! (Come here! — toward me)",
      },
      {
        heading: "Combinations",
        body: "Hin and her combine with other direction words:\n\n• hinein / herein — in(to) / in(to here) [inward]\n• hinaus / heraus — out / out(here) [outward]\n• hinauf / herauf — up / up(here) [upward]\n• hinunter / herunter — down / down(here) [downward]\n• hinüber / herüber — over / over(here)\n\nKey: The hin/her tells you perspective (away vs toward), the rest tells direction.",
      },
      {
        heading: "Spoken Shortcuts",
        body: "In everyday spoken German, 'he-' is often dropped:\n• herein → rein (Come in!)\n• heraus → raus (Get out!)\n• herauf → rauf (Come up!)\n• herunter → runter (Come down!)\n\nThese shortened forms are very common in speech.\nFull forms are used in writing or for clarity.",
      },
    ],
    examples: [
      { de: "Geh hin!", en: "Go there! (away from speaker)" },
      { de: "Komm her!", en: "Come here! (toward speaker)" },
      { de: "Er geht hinein.", en: "He goes in (away from here)." },
      { de: "Sie kommt herein.", en: "She comes in (toward here)." },
      { de: "Komm rein!", en: "Come in! (spoken shortcut)" },
      { de: "Geh raus!", en: "Get out! (spoken shortcut)" },
      { de: "Er läuft hinauf.", en: "He runs up (away from speaker)." },
      { de: "Sie kommt herunter.", en: "She comes down (toward speaker)." },
    ],
    mistakes: [
      "Don't mix hin and her — always think: is the movement away from or toward the speaker?",
      "Don't use 'rein/raus' in formal writing — use herein/heraus.",
      "Combinations: the second part still gives direction: hinauf = hin (away) + auf (upward).",
    ],
    exercises: [
      { prompt: "Away or toward? Er geht ___ (away, into the house)", answer: "hinein" },
      { prompt: "Away or toward? Komm ___ (toward me, out)", answer: "heraus" },
      { prompt: "Spoken shortcut for 'herein'", answer: "rein" },
      { prompt: "Translate: She runs up toward me.", answer: "Sie läuft herauf." },
      { prompt: "Translate: He goes down (away from speaker).", answer: "Er geht hinunter." },
    ],
    speakingPrompts: [
      "Give directions: Geh hinein / Komm heraus...",
      "Describe movement: Er läuft hinauf / Sie kommt herunter...",
      "Practice spoken forms: Komm rein! / Geh raus!",
    ],
    summary:
      "Hin = away from speaker. Her = toward speaker. Combinations: hinein/herein, hinaus/heraus, hinauf/herauf, hinunter/herunter. Spoken shortcuts: rein, raus, rauf, runter.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 19: Hin & Her — Directional Prefixes.

HIN = away from the speaker (movement outward, toward a destination)
• Geh hin! / Er geht hinein. / Sie läuft hinaus.

HER = toward the speaker (movement inward, toward where I am)
• Komm her! / Sie kommt herein. / Er kommt herauf.

Combinations:
• hinein/herein = in (hin=away into, her=into here)
• hinaus/heraus = out (hin=out away, her=out toward)
• hinauf/herauf = up
• hinunter/herunter = down

Spoken shortcuts: herein→rein, heraus→raus, herauf→rauf, herunter→runter

Please drill me:
1. Choose hin or her (away or toward)
2. Build combinations (hinein/herein etc.)
3. Give commands using hin/her
4. Use spoken shortcuts appropriately
5. Translate hin/her sentences

Start with: "Hin/her drill! Away or toward? 'Er geht ___ die Treppe hinauf oder herauf?' (he's going away from you)"`,
  },
  {
    id: "b1ch20",
    number: 20,
    title: "Alternative Verb Constructions",
    subtitle: "Brauchen...zu & Sich Lassen",
    icon: "🔧",
    difficulty: "hard",
    estimatedMinutes: 25,
    tags: ["verbs", "advanced", "native-like"],
    theory: [
      {
        heading: "BRAUCHEN...ZU — Alternative to nicht müssen",
        body: "Used ONLY in NEGATIVE sentences as an alternative to 'nicht müssen' (don't have to).\n\nStructure: brauchen + nicht/kein + zu + infinitive\n\n• Du brauchst nicht zu gehen.\n  (You don't have to go.) = Du musst nicht gehen.\n• Er braucht nicht zu arbeiten.\n  (He doesn't have to work.)\n• Ich brauche das nicht zu tun.\n  (I don't have to do that.)\n\nNote: In spoken German, 'zu' is sometimes omitted: Du brauchst nicht gehen. (informal)",
      },
      {
        heading: "SICH LASSEN — Passive Alternative",
        body: "Expresses that something CAN BE DONE or IS POSSIBLE to do. More elegant/native-like than passive.\n\nStructure: sich lassen + infinitive\n\n• Das Problem lässt sich lösen.\n  (The problem can be solved.) = Das Problem kann gelöst werden.\n• Das Fenster lässt sich öffnen.\n  (The window can be opened.)\n• Das lässt sich nicht erklären.\n  (That cannot be explained.)\n\nNote: Very common in formal and written German.",
      },
      {
        heading: "When to Use These",
        body: "Both constructions make your German sound more native and fluent:\n\n• brauchen...zu: Always in negative contexts, as alternative to nicht müssen.\n  Du musst nicht kommen. ↔ Du brauchst nicht zu kommen.\n\n• sich lassen: Expresses possibility/feasibility.\n  Es kann gemacht werden. ↔ Es lässt sich machen.\n\nUsing these shows advanced German proficiency.",
      },
    ],
    examples: [
      { de: "Du brauchst nicht zu kommen.", en: "You don't have to come." },
      { de: "Er braucht das nicht zu wissen.", en: "He doesn't need to know that." },
      { de: "Das Problem lässt sich lösen.", en: "The problem can be solved." },
      { de: "Das lässt sich leicht erklären.", en: "That can easily be explained." },
      { de: "Das Fenster lässt sich nicht öffnen.", en: "The window can't be opened." },
    ],
    mistakes: [
      "Don't use brauchen...zu in positive sentences: ❌ Du brauchst zu kommen. (wrong) ✓ Only negative: Du brauchst nicht zu kommen.",
      "Don't confuse 'lässt sich' (can be done) with 'wird' (is being done): different meanings.",
      "In formal writing, include 'zu' with brauchen: Du brauchst nicht zu gehen. (not Du brauchst nicht gehen.)",
    ],
    exercises: [
      { prompt: "Replace nicht müssen with brauchen...zu: Du musst nicht kommen.", answer: "Du brauchst nicht zu kommen." },
      { prompt: "Replace passive: Das kann leicht erklärt werden.", answer: "Das lässt sich leicht erklären." },
      { prompt: "Build lässt sich: Das Problem / lösen / möglich", answer: "Das Problem lässt sich lösen." },
      { prompt: "Translate: He doesn't have to work today.", answer: "Er braucht heute nicht zu arbeiten." },
      { prompt: "Translate: That can't be done.", answer: "Das lässt sich nicht machen." },
    ],
    speakingPrompts: [
      "Express what's not necessary: Du brauchst nicht...",
      "Express feasibility: Das lässt sich...",
      "Replace passive sentences with sich lassen.",
    ],
    summary:
      "Brauchen...zu = don't have to (negative only, replaces nicht müssen). Sich lassen = can be done (replaces können + passive). Both are native-like, formal constructions.",
    aiPrompt: `You are my German B1 tutor. We are practicing Chapter 20: Alternative Verb Constructions — brauchen...zu and sich lassen.

BRAUCHEN...ZU = don't have to (NEGATIVE ONLY — alternative to nicht müssen)
• Du brauchst nicht zu kommen. = Du musst nicht kommen.
• Er braucht das nicht zu wissen.
• Structure: brauchen + nicht/kein + zu + infinitive

SICH LASSEN = can be done (alternative to können + passive)
• Das Problem lässt sich lösen. = Das Problem kann gelöst werden.
• Das lässt sich nicht erklären.
• Structure: subject + lässt sich + infinitive (at end)
• Very common in formal/written German!

Please drill me:
1. Replace nicht müssen with brauchen...zu
2. Replace passive + können with lässt sich
3. Build original sentences with both constructions
4. Translate using the right construction
5. Correct errors

Start with: "Alternative constructions drill! Replace: Du musst nicht kommen. → Du ___?"`,
  },
];


// ─── Enriched Exports & Mappings ─────────────────────────────────────────────

export const ALL_GRAMMAR_CHAPTERS: GrammarChapter[] = [
  ...A0_GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'A0', color: c.color || '#F59E0B', icon: c.icon || '🔤' })),
  ...GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'A1', color: c.color || '#A855F7', icon: c.icon || '📘' })),
  ...A2_GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'A2', color: c.color || '#1CB0F6', icon: c.icon || '📗' })),
  ...B1_GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'B1', color: c.color || '#22C55E', icon: c.icon || '📙' })),
];

export const GRAMMAR_TOPICS = ALL_GRAMMAR_CHAPTERS;

export const GRAMMAR_CHAPTERS_BY_LEVEL: Record<string, GrammarChapter[]> = {
  A0: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'A0'),
  A1: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'A1'),
  A2: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'A2'),
  B1: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'B1'),
};

export const GRAMMAR_TOPIC_MAP: Record<string, GrammarChapter> = Object.fromEntries(
  ALL_GRAMMAR_CHAPTERS.map((c) => [c.id, c])
);

// Backward-compatible aliases for legacy topic IDs
const legacyMap: Record<string, string> = {
  'g01-pronouns-present': 'ch01',
  'g02-articles-cases': 'ch02',
  'g03-nominative-accusative': 'ch10',
  'g04-dative-case': 'ch13',
  'g05-modal-verbs': 'ch17',
  'g06-separable-verbs': 'ch18',
  'g07-negation-nicht-kein': 'ch09',
  'g08-past-perfekt': 'ch22',
};

for (const [legacyId, mappedId] of Object.entries(legacyMap)) {
  if (GRAMMAR_TOPIC_MAP[mappedId]) {
    GRAMMAR_TOPIC_MAP[legacyId] = { ...GRAMMAR_TOPIC_MAP[mappedId], id: legacyId };
  }
}

export function getGrammarChapterById(id: string): GrammarChapter | undefined {
  return GRAMMAR_TOPIC_MAP[id] || ALL_GRAMMAR_CHAPTERS.find((c) => c.id === id);
}
