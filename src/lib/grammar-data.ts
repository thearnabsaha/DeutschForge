/**
 * DeutschForge A1 Grammar Topics
 * 8 topics unlocked progressively through the syllabus.
 * Each topic teaches the FULL concept — no splitting across topics.
 */

export interface GrammarExample {
  de: string;
  en: string;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface GrammarSection {
  heading: string;
  explanation: string;
  table?: GrammarTable;
  examples: GrammarExample[];
  notes: string[];
}

export interface GrammarExercise {
  id: string;
  type: "fill_blank" | "multiple_choice" | "reorder" | "translate";
  question: string;
  options?: string[];
  answer: string;
  hint?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  subtitle: string;
  unlockedAtUnit: string; // unitId e.g. "u04"
  icon: string;
  color: string;
  sections: GrammarSection[];
  exercises: GrammarExercise[];
  completionRequirement: number; // number of exercises to pass
  cefrLevel?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// G01 — Personal Pronouns & Present Tense (sein/haben + regular verbs)
// ─────────────────────────────────────────────────────────────────────────────

const G01: GrammarTopic = {
  id: "g01-pronouns-present",
  title: "Pronouns & Present Tense",
  subtitle: "ich, du, er/sie/es… and how verbs conjugate",
  unlockedAtUnit: "u04",
  icon: "👤",
  color: "#1CB0F6",
  sections: [
    {
      heading: "Personal Pronouns",
      explanation:
        "German has 9 personal pronouns. Unlike English, German distinguishes formal 'you' (Sie) from informal 'you' (du/ihr).",
      table: {
        headers: ["Pronoun", "Meaning", "Usage"],
        rows: [
          ["ich", "I", "1st person singular"],
          ["du", "you", "informal singular"],
          ["er", "he", "masculine singular"],
          ["sie", "she", "feminine singular"],
          ["es", "it", "neuter singular"],
          ["wir", "we", "1st person plural"],
          ["ihr", "you all", "informal plural"],
          ["sie", "they", "3rd person plural"],
          ["Sie", "you (formal)", "formal singular & plural"],
        ],
      },
      examples: [
        { de: "Ich bin Student.", en: "I am a student." },
        { de: "Du bist nett.", en: "You are nice." },
        { de: "Er kommt aus Deutschland.", en: "He comes from Germany." },
        { de: "Sie sind Lehrerin.", en: "She is a teacher." },
        { de: "Wir lernen Deutsch.", en: "We are learning German." },
        { de: "Sie sprechen Englisch.", en: "They speak English." },
        { de: "Sie sprechen sehr gut.", en: "You (formal) speak very well." },
      ],
      notes: [
        "'sie' (lowercase) = she or they — context tells you which.",
        "'Sie' (capital S) = formal you — always written with capital S mid-sentence.",
      ],
    },
    {
      heading: "Verb: sein (to be)",
      explanation:
        "'sein' is irregular and one of the most important verbs. Memorize all 6 forms.",
      table: {
        headers: ["Pronoun", "sein", "Example"],
        rows: [
          ["ich", "bin", "Ich bin müde."],
          ["du", "bist", "Du bist hungrig."],
          ["er/sie/es", "ist", "Er ist Arzt."],
          ["wir", "sind", "Wir sind Freunde."],
          ["ihr", "seid", "Ihr seid laut."],
          ["sie/Sie", "sind", "Sie sind hier."],
        ],
      },
      examples: [
        { de: "Ich bin 25 Jahre alt.", en: "I am 25 years old." },
        { de: "Das ist mein Haus.", en: "That is my house." },
        { de: "Wir sind aus Österreich.", en: "We are from Austria." },
      ],
      notes: [
        "Note: 'wir sind', 'sie sind', and 'Sie sind' all use the same form.",
      ],
    },
    {
      heading: "Verb: haben (to have)",
      explanation:
        "'haben' is also irregular but follows a cleaner pattern. Used both as a main verb and as a helper for past tense.",
      table: {
        headers: ["Pronoun", "haben", "Example"],
        rows: [
          ["ich", "habe", "Ich habe ein Auto."],
          ["du", "hast", "Du hast Hunger."],
          ["er/sie/es", "hat", "Er hat keine Zeit."],
          ["wir", "haben", "Wir haben Kinder."],
          ["ihr", "habt", "Ihr habt Glück."],
          ["sie/Sie", "haben", "Sie haben Fragen."],
        ],
      },
      examples: [
        { de: "Ich habe einen Bruder.", en: "I have a brother." },
        { de: "Sie hat keine Schwester.", en: "She has no sister." },
        { de: "Haben Sie Zeit?", en: "Do you have time? (formal)" },
      ],
      notes: ["'hast' and 'hat' lose the 'b' from haben — remember this!"],
    },
    {
      heading: "Regular Verb Conjugation",
      explanation:
        "Most German verbs follow a regular pattern. Take the stem (remove -en) and add the correct ending.",
      table: {
        headers: ["Pronoun", "Ending", "lernen (to learn)", "wohnen (to live)"],
        rows: [
          ["ich", "-e", "lerne", "wohne"],
          ["du", "-st", "lernst", "wohnst"],
          ["er/sie/es", "-t", "lernt", "wohnt"],
          ["wir", "-en", "lernen", "wohnen"],
          ["ihr", "-t", "lernt", "wohnt"],
          ["sie/Sie", "-en", "lernen", "wohnen"],
        ],
      },
      examples: [
        { de: "Ich lerne jeden Tag Deutsch.", en: "I learn German every day." },
        { de: "Er wohnt in Berlin.", en: "He lives in Berlin." },
        { de: "Wir spielen Fußball.", en: "We play football." },
        { de: "Ihr trinkt Kaffee.", en: "You all drink coffee." },
      ],
      notes: [
        "If the stem ends in -t or -d (arbeiten, reden), add -e before -st/-t: du arbeitest, er arbeitet.",
        "wir and sie/Sie always have the same form as the infinitive.",
      ],
    },
  ],
  exercises: [
    {
      id: "g01-e01",
      type: "fill_blank",
      question: "Ich ___ Student. (sein)",
      answer: "bin",
      hint: "1st person singular of sein",
    },
    {
      id: "g01-e02",
      type: "fill_blank",
      question: "Du ___ ein Buch. (haben)",
      answer: "hast",
      hint: "2nd person singular of haben",
    },
    {
      id: "g01-e03",
      type: "multiple_choice",
      question: "Which is correct for 'he is'?",
      options: ["er bin", "er bist", "er ist", "er sind"],
      answer: "er ist",
    },
    {
      id: "g01-e04",
      type: "fill_blank",
      question: "Wir ___ Deutsch. (lernen)",
      answer: "lernen",
      hint: "wir takes the -en ending",
    },
    {
      id: "g01-e05",
      type: "multiple_choice",
      question: "What does 'Sie' (capital S) mean?",
      options: ["she", "they", "formal you", "we"],
      answer: "formal you",
    },
    {
      id: "g01-e06",
      type: "translate",
      question: "Translate: They have a car.",
      answer: "Sie haben ein Auto.",
      hint: "they = sie, have = haben",
    },
    {
      id: "g01-e07",
      type: "fill_blank",
      question: "Er ___ in München. (wohnen)",
      answer: "wohnt",
      hint: "3rd person singular of wohnen",
    },
    {
      id: "g01-e08",
      type: "multiple_choice",
      question: "Ihr ___ Hunger.",
      options: ["haben", "habt", "hast", "hat"],
      answer: "habt",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// G02 — Sentence Structure & Questions (V2 word order, W-questions, yes/no)
// ─────────────────────────────────────────────────────────────────────────────

const G02: GrammarTopic = {
  id: "g02-sentence-questions",
  title: "Sentence Structure & Questions",
  subtitle: "Word order rules and forming questions",
  unlockedAtUnit: "u07",
  icon: "❓",
  color: "#FF9600",
  sections: [
    {
      heading: "V2 Word Order (Verb-Second Rule)",
      explanation:
        "In German statements, the verb ALWAYS comes second — no matter what comes first. This is the most important rule in German syntax.",
      table: {
        headers: ["Position 1", "Position 2 (VERB)", "Rest"],
        rows: [
          ["Ich", "lerne", "jeden Tag Deutsch."],
          ["Jeden Tag", "lerne", "ich Deutsch."],
          ["Deutsch", "lerne", "ich jeden Tag."],
          ["Morgen", "fahre", "ich nach Berlin."],
        ],
      },
      examples: [
        { de: "Ich gehe heute ins Kino.", en: "I go to the cinema today." },
        { de: "Heute gehe ich ins Kino.", en: "Today I go to the cinema." },
        {
          de: "Ins Kino gehe ich heute.",
          en: "To the cinema I go today.",
        },
      ],
      notes: [
        "Whatever starts the sentence, the verb must be in position 2.",
        "The subject moves — but the verb stays fixed in second place.",
        "This is called 'subject-verb inversion' when a non-subject starts the sentence.",
      ],
    },
    {
      heading: "Yes/No Questions",
      explanation:
        "To form a yes/no question, move the verb to position 1 (invert subject and verb).",
      table: {
        headers: ["Statement", "Yes/No Question"],
        rows: [
          ["Du bist Student.", "Bist du Student?"],
          ["Er kommt heute.", "Kommt er heute?"],
          ["Sie haben Zeit.", "Haben Sie Zeit?"],
          ["Ihr lernt Deutsch.", "Lernt ihr Deutsch?"],
        ],
      },
      examples: [
        { de: "Sprichst du Deutsch?", en: "Do you speak German?" },
        { de: "Ist das dein Auto?", en: "Is that your car?" },
        { de: "Haben Sie einen Termin?", en: "Do you have an appointment?" },
      ],
      notes: [
        "No extra word like 'do/does' — just move the verb to front.",
        "Answer: Ja (yes) or Nein (no).",
      ],
    },
    {
      heading: "W-Questions (Question Words)",
      explanation:
        "German question words all start with W. After the question word, the verb comes second.",
      table: {
        headers: ["Question Word", "Meaning", "Example"],
        rows: [
          ["Wer?", "Who?", "Wer ist das?"],
          ["Was?", "What?", "Was machst du?"],
          ["Wo?", "Where? (location)", "Wo wohnst du?"],
          ["Woher?", "Where from?", "Woher kommst du?"],
          ["Wohin?", "Where to?", "Wohin gehst du?"],
          ["Wann?", "When?", "Wann fährst du ab?"],
          ["Wie?", "How?", "Wie heißt du?"],
          ["Wie viel?", "How much?", "Wie viel kostet das?"],
          ["Warum?", "Why?", "Warum lernst du Deutsch?"],
          ["Welche(r/s)?", "Which?", "Welches Buch liest du?"],
        ],
      },
      examples: [
        { de: "Wo ist die Toilette?", en: "Where is the toilet?" },
        { de: "Was kostet das?", en: "What does that cost?" },
        {
          de: "Wie heißen Sie?",
          en: "What is your name? (formal)",
        },
        { de: "Warum lernst du Deutsch?", en: "Why are you learning German?" },
      ],
      notes: [
        "W-question → verb in position 2 (right after the question word).",
        "'Wo' = location. 'Wohin' = direction to. 'Woher' = direction from.",
      ],
    },
  ],
  exercises: [
    {
      id: "g02-e01",
      type: "reorder",
      question: "Reorder: [Deutsch / ich / lerne / jeden Tag]",
      answer: "Ich lerne jeden Tag Deutsch.",
      hint: "Subject first, then verb",
    },
    {
      id: "g02-e02",
      type: "reorder",
      question: "Reorder: [lerne / jeden Tag / Deutsch / ich] — start with 'Jeden Tag'",
      answer: "Jeden Tag lerne ich Deutsch.",
      hint: "V2 rule: verb comes second even when time expression starts",
    },
    {
      id: "g02-e03",
      type: "multiple_choice",
      question: "Which is the correct yes/no question from 'Du sprichst Deutsch.'?",
      options: [
        "Du sprichst Deutsch?",
        "Sprichst du Deutsch?",
        "Deutsch sprichst du?",
        "Sprichst Deutsch du?",
      ],
      answer: "Sprichst du Deutsch?",
    },
    {
      id: "g02-e04",
      type: "fill_blank",
      question: "___ heißt du? (What is your name?)",
      answer: "Wie",
      hint: "Which question word means 'how'?",
    },
    {
      id: "g02-e05",
      type: "fill_blank",
      question: "___ kommst du? (Where are you from?)",
      answer: "Woher",
      hint: "origin = woher",
    },
    {
      id: "g02-e06",
      type: "multiple_choice",
      question: "What does 'Wohin' ask?",
      options: ["Where from?", "Where (location)?", "Where to?", "When?"],
      answer: "Where to?",
    },
    {
      id: "g02-e07",
      type: "translate",
      question: "Translate: Do you have a dog?",
      answer: "Hast du einen Hund?",
      hint: "Yes/no question — verb first",
    },
    {
      id: "g02-e08",
      type: "translate",
      question: "Translate: Why are you learning German?",
      answer: "Warum lernst du Deutsch?",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// G03 — Articles in Nominative (der/die/das/die + ein/eine/ein)
// ─────────────────────────────────────────────────────────────────────────────

const G03: GrammarTopic = {
  id: "g03-articles-nominative",
  title: "Articles in Nominative",
  subtitle: "der, die, das, ein, eine — the basics of noun gender",
  unlockedAtUnit: "u10",
  icon: "📌",
  color: "#58CC02",
  sections: [
    {
      heading: "Noun Gender in German",
      explanation:
        "Every German noun has a grammatical gender: masculine (der), feminine (die), or neuter (das). The gender must be memorized with each noun — it doesn't always follow logic.",
      table: {
        headers: ["Gender", "Definite Article", "Example"],
        rows: [
          ["Masculine (m)", "der", "der Mann (the man)"],
          ["Feminine (f)", "die", "die Frau (the woman)"],
          ["Neuter (n)", "das", "das Kind (the child)"],
          ["Plural (all)", "die", "die Männer (the men)"],
        ],
      },
      examples: [
        { de: "Der Hund ist groß.", en: "The dog is big." },
        { de: "Die Katze ist klein.", en: "The cat is small." },
        { de: "Das Buch ist interessant.", en: "The book is interesting." },
      ],
      notes: [
        "Plural always uses 'die' — regardless of the singular gender.",
        "Always learn nouns with their article: 'der Hund', not just 'Hund'.",
        "Some patterns help: nouns ending in -ung, -heit, -keit, -schaft are always die (feminine).",
      ],
    },
    {
      heading: "Definite Articles (the) — Nominative",
      explanation:
        "The nominative case is used for the SUBJECT of a sentence (who/what is doing the action). These are the base forms of the definite article.",
      table: {
        headers: ["Gender", "Nominative", "Example"],
        rows: [
          ["Masculine", "der", "Der Lehrer unterrichtet."],
          ["Feminine", "die", "Die Lehrerin unterrichtet."],
          ["Neuter", "das", "Das Kind schläft."],
          ["Plural", "die", "Die Kinder spielen."],
        ],
      },
      examples: [
        { de: "Der Zug fährt ab.", en: "The train departs." },
        { de: "Die Schule beginnt um 8.", en: "School starts at 8." },
        { de: "Das Wetter ist schön.", en: "The weather is nice." },
      ],
      notes: [
        "In nominative, the articles are der/die/das — their 'dictionary form'.",
      ],
    },
    {
      heading: "Indefinite Articles (a/an) — Nominative",
      explanation:
        "'Ein' corresponds to 'a/an' in English. It changes form based on gender.",
      table: {
        headers: ["Gender", "Indefinite Article", "Example"],
        rows: [
          ["Masculine", "ein", "Ein Mann steht dort."],
          ["Feminine", "eine", "Eine Frau kommt."],
          ["Neuter", "ein", "Ein Kind lacht."],
          ["Plural", "(none)", "Kinder spielen. (no article)"],
        ],
      },
      examples: [
        { de: "Ich bin ein Student.", en: "I am a student. (m)" },
        { de: "Das ist eine Katze.", en: "That is a cat. (f)" },
        { de: "Das ist ein Auto.", en: "That is a car. (n)" },
      ],
      notes: [
        "Masculine and neuter both use 'ein' — only feminine uses 'eine'.",
        "There's no plural indefinite article in German (like English 'some').",
      ],
    },
    {
      heading: "Gender Tips & Patterns",
      explanation:
        "While gender must be memorized, these patterns cover many common nouns.",
      table: {
        headers: ["Pattern", "Gender", "Examples"],
        rows: [
          ["Ending -er (agent/doer)", "der (m)", "der Lehrer, der Fahrer"],
          ["Ending -ung", "die (f)", "die Zeitung, die Wohnung"],
          ["Ending -heit / -keit", "die (f)", "die Freiheit, die Möglichkeit"],
          ["Ending -schaft", "die (f)", "die Freundschaft, die Mannschaft"],
          ["Ending -chen / -lein (diminutive)", "das (n)", "das Mädchen, das Büchlein"],
          ["Ending -ment", "das (n)", "das Instrument, das Experiment"],
          ["Infinitive used as noun", "das (n)", "das Essen, das Lernen"],
        ],
      },
      examples: [
        { de: "Das Mädchen heißt Anna.", en: "The girl is named Anna." },
        {
          de: "Die Zeitung kostet 1 Euro.",
          en: "The newspaper costs 1 euro.",
        },
      ],
      notes: [
        "Despite patterns, always verify gender — exceptions exist.",
        "'das Mädchen' (girl) is neuter despite being female — grammar gender ≠ biological sex.",
      ],
    },
  ],
  exercises: [
    {
      id: "g03-e01",
      type: "multiple_choice",
      question: "What is the article for 'Mann' (man)?",
      options: ["die", "das", "der", "ein"],
      answer: "der",
    },
    {
      id: "g03-e02",
      type: "fill_blank",
      question: "___ Frau kommt aus Berlin. (definite article)",
      answer: "Die",
    },
    {
      id: "g03-e03",
      type: "multiple_choice",
      question: "A dog (indefinite) = ?",
      options: ["der Hund", "eine Hund", "ein Hund", "das Hund"],
      answer: "ein Hund",
    },
    {
      id: "g03-e04",
      type: "fill_blank",
      question: "Das ist ___ Katze. (a cat — feminine)",
      answer: "eine",
    },
    {
      id: "g03-e05",
      type: "multiple_choice",
      question: "Which gender/article applies to 'die Zeitung' (newspaper)?",
      options: ["masculine", "feminine", "neuter", "plural"],
      answer: "feminine",
    },
    {
      id: "g03-e06",
      type: "translate",
      question: "Translate: The child is small.",
      answer: "Das Kind ist klein.",
    },
    {
      id: "g03-e07",
      type: "multiple_choice",
      question: "Nouns ending in -chen are always…",
      options: ["masculine", "feminine", "neuter", "plural"],
      answer: "neuter",
    },
    {
      id: "g03-e08",
      type: "translate",
      question: "Translate: A woman is coming.",
      answer: "Eine Frau kommt.",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// G04 — Negation (kein/keine, nicht)
// ─────────────────────────────────────────────────────────────────────────────

const G04: GrammarTopic = {
  id: "g04-negation",
  title: "Negation",
  subtitle: "nicht and kein — two ways to say no",
  unlockedAtUnit: "u13",
  icon: "🚫",
  color: "#FF4B4B",
  sections: [
    {
      heading: "nicht — negating verbs & adjectives",
      explanation:
        "'nicht' negates verbs, adjectives, adverbs, and specific nouns with definite articles. Position: usually at the END of the sentence, or directly before what it negates.",
      table: {
        headers: ["What it negates", "Position of nicht", "Example"],
        rows: [
          ["Verb (whole statement)", "end of sentence", "Ich verstehe nicht."],
          ["Adjective", "before the adjective", "Das ist nicht gut."],
          ["Specific noun (with der/die/das)", "before the noun phrase", "Ich mag nicht den Film."],
          ["Adverb", "before the adverb", "Er kommt nicht heute."],
        ],
      },
      examples: [
        { de: "Ich komme nicht.", en: "I am not coming." },
        { de: "Das ist nicht richtig.", en: "That is not correct." },
        { de: "Er schläft nicht gut.", en: "He doesn't sleep well." },
        { de: "Das Wetter ist heute nicht schön.", en: "The weather is not nice today." },
      ],
      notes: [
        "'nicht' goes to end of sentence for whole-sentence negation.",
        "If the verb is separable or has a prefix, nicht goes before the prefix: 'Ich rufe nicht an.'",
      ],
    },
    {
      heading: "kein/keine — negating nouns (a/an/any)",
      explanation:
        "'kein' negates nouns that use 'ein' (indefinite articles) or nouns with NO article. Think of kein as the negative of ein.",
      table: {
        headers: ["Gender", "kein-form", "Example"],
        rows: [
          ["Masculine (Nominative)", "kein", "Ich habe kein Bruder. → kein Bruder"],
          ["Feminine (Nominative)", "keine", "Ich habe keine Schwester."],
          ["Neuter (Nominative)", "kein", "Das ist kein Auto."],
          ["Plural (Nominative)", "keine", "Ich habe keine Kinder."],
        ],
      },
      examples: [
        { de: "Ich habe kein Auto.", en: "I don't have a car." },
        { de: "Sie hat keine Zeit.", en: "She has no time." },
        { de: "Das ist kein Problem.", en: "That's not a problem." },
        { de: "Wir haben keine Fragen.", en: "We have no questions." },
      ],
      notes: [
        "kein = ein + n negation. It follows the same endings as 'ein'.",
        "Use 'kein' for nouns — use 'nicht' for verbs/adjectives.",
        "Plural: always 'keine' (since there's no plural 'ein').",
      ],
    },
    {
      heading: "nicht vs. kein — Choosing the right one",
      explanation:
        "The key question: is there a noun with ein/eine, or no article? → use kein. Is it a verb, adjective, or noun with der/die/das? → use nicht.",
      table: {
        headers: ["Sentence", "Use", "Reason"],
        rows: [
          ["Ich habe ___ Hunger.", "keinen", "Hunger is a noun without article"],
          ["Er ist ___ müde.", "nicht", "müde is an adjective"],
          ["Das ist ___ Katze.", "keine", "eine Katze → kein"],
          ["Ich gehe ___ ins Kino.", "nicht", "negates the verb/action"],
          ["Wir haben ___ Kinder.", "keine", "plural noun, no article"],
        ],
      },
      examples: [
        { de: "Ich habe keine Lust.", en: "I don't feel like it. (no desire)" },
        { de: "Das verstehe ich nicht.", en: "I don't understand that." },
        { de: "Kein Problem!", en: "No problem!" },
      ],
      notes: [
        "When in doubt: if you could replace it with 'ein/eine' in the positive, use 'kein' in the negative.",
      ],
    },
  ],
  exercises: [
    {
      id: "g04-e01",
      type: "multiple_choice",
      question: "Ich habe ___ Auto. (I don't have a car)",
      options: ["nicht", "kein", "keine", "keinen"],
      answer: "kein",
    },
    {
      id: "g04-e02",
      type: "fill_blank",
      question: "Das ist ___ richtig. (That is not correct)",
      answer: "nicht",
    },
    {
      id: "g04-e03",
      type: "multiple_choice",
      question: "Sie hat ___ Kinder.",
      options: ["kein", "nicht", "keine", "keinen"],
      answer: "keine",
    },
    {
      id: "g04-e04",
      type: "translate",
      question: "Translate: I am not coming today.",
      answer: "Ich komme heute nicht.",
    },
    {
      id: "g04-e05",
      type: "fill_blank",
      question: "Ich habe ___ Hunger. (no hunger — noun without article)",
      answer: "keinen",
      hint: "Hunger is masculine → keinen in accusative",
    },
    {
      id: "g04-e06",
      type: "multiple_choice",
      question: "Which is correct: 'He doesn't sleep well'?",
      options: [
        "Er schläft kein gut.",
        "Er schläft nicht gut.",
        "Er nicht schläft gut.",
        "Er schläft gut nicht.",
      ],
      answer: "Er schläft nicht gut.",
    },
    {
      id: "g04-e07",
      type: "translate",
      question: "Translate: No problem!",
      answer: "Kein Problem!",
    },
    {
      id: "g04-e08",
      type: "multiple_choice",
      question: "Ich gehe ___ ins Kino. (I'm not going to the cinema)",
      options: ["kein", "keine", "nicht", "keinen"],
      answer: "nicht",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// G05 — Accusative Case
// ─────────────────────────────────────────────────────────────────────────────

const G05: GrammarTopic = {
  id: "g05-accusative",
  title: "Accusative Case",
  subtitle: "Direct objects and article changes",
  unlockedAtUnit: "u16",
  icon: "🎯",
  color: "#A560E8",
  sections: [
    {
      heading: "What is the Accusative Case?",
      explanation:
        "The accusative case marks the DIRECT OBJECT — the thing being acted upon. In 'I see the dog', 'the dog' is the direct object and takes accusative.",
      table: {
        headers: ["Role", "Case", "Example"],
        rows: [
          ["Subject (actor)", "Nominative", "Der Mann kauft…"],
          ["Direct object (acted on)", "Accusative", "…den Hund."],
        ],
      },
      examples: [
        {
          de: "Ich sehe den Mann.",
          en: "I see the man. (den = accusative masculine)",
        },
        { de: "Er kauft die Zeitung.", en: "He buys the newspaper. (die stays)" },
        { de: "Sie trinkt das Wasser.", en: "She drinks the water. (das stays)" },
      ],
      notes: [
        "Only MASCULINE changes in accusative: der → den, ein → einen.",
        "Feminine, neuter, and plural stay the same as nominative.",
      ],
    },
    {
      heading: "Article Changes in Accusative",
      explanation:
        "Only the masculine articles change. This is the key accusative rule.",
      table: {
        headers: ["Gender", "Nominative (subject)", "Accusative (object)"],
        rows: [
          ["Masculine", "der / ein", "den / einen"],
          ["Feminine", "die / eine", "die / eine (no change)"],
          ["Neuter", "das / ein", "das / ein (no change)"],
          ["Plural", "die / —", "die / — (no change)"],
        ],
      },
      examples: [
        { de: "Der Hund spielt. → Ich sehe den Hund.", en: "The dog plays. → I see the dog." },
        { de: "Ich esse einen Apfel.", en: "I eat an apple. (masculine → einen)" },
        { de: "Ich lese die Zeitung.", en: "I read the newspaper. (feminine → unchanged)" },
        { de: "Er kauft das Brot.", en: "He buys the bread. (neuter → unchanged)" },
      ],
      notes: [
        "Trick: only masculine changes — remember 'den/einen' for masculine accusative.",
      ],
    },
    {
      heading: "Common Accusative Verbs",
      explanation:
        "These verbs always take a direct object → accusative. Learn them together.",
      table: {
        headers: ["Verb", "Meaning", "Example"],
        rows: [
          ["haben", "to have", "Ich habe einen Hund."],
          ["sehen", "to see", "Ich sehe den Film."],
          ["kaufen", "to buy", "Er kauft einen Kaffee."],
          ["essen", "to eat", "Sie isst einen Apfel."],
          ["trinken", "to drink", "Wir trinken den Wein."],
          ["lesen", "to read", "Du liest das Buch."],
          ["brauchen", "to need", "Ich brauche einen Stift."],
          ["suchen", "to look for", "Er sucht die Schlüssel."],
        ],
      },
      examples: [
        { de: "Ich brauche einen Arzt.", en: "I need a doctor." },
        { de: "Siehst du den Fehler?", en: "Do you see the mistake?" },
      ],
      notes: [
        "Whenever you use these verbs, check the gender of the noun and apply accusative.",
      ],
    },
  ],
  exercises: [
    {
      id: "g05-e01",
      type: "multiple_choice",
      question: "Ich sehe ___ Mann. (masculine, definite)",
      options: ["der", "die", "den", "das"],
      answer: "den",
    },
    {
      id: "g05-e02",
      type: "fill_blank",
      question: "Er kauft ___ Apfel. (an apple — masculine)",
      answer: "einen",
    },
    {
      id: "g05-e03",
      type: "multiple_choice",
      question: "Sie liest ___ Zeitung. (feminine, definite)",
      options: ["den", "die", "das", "der"],
      answer: "die",
    },
    {
      id: "g05-e04",
      type: "translate",
      question: "Translate: I need a doctor.",
      answer: "Ich brauche einen Arzt.",
    },
    {
      id: "g05-e05",
      type: "multiple_choice",
      question: "Which article changes in accusative?",
      options: ["feminine", "neuter", "masculine", "plural"],
      answer: "masculine",
    },
    {
      id: "g05-e06",
      type: "fill_blank",
      question: "Ich esse ___ Brot. (das Brot — definite)",
      answer: "das",
      hint: "Neuter doesn't change",
    },
    {
      id: "g05-e07",
      type: "translate",
      question: "Translate: Do you see the dog?",
      answer: "Siehst du den Hund?",
    },
    {
      id: "g05-e08",
      type: "multiple_choice",
      question: "Ich habe ___ Bruder. (a brother — masculine)",
      options: ["ein", "einen", "eine", "der"],
      answer: "einen",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// G06 — Dative Case
// ─────────────────────────────────────────────────────────────────────────────

const G06: GrammarTopic = {
  id: "g06-dative",
  title: "Dative Case",
  subtitle: "Indirect objects and dative prepositions",
  unlockedAtUnit: "u19",
  icon: "🤝",
  color: "#FF9600",
  sections: [
    {
      heading: "What is the Dative Case?",
      explanation:
        "The dative case marks the INDIRECT OBJECT — the recipient or beneficiary of an action. In 'I give the book to my friend', 'my friend' is the indirect object.",
      table: {
        headers: ["Role", "Case", "Example"],
        rows: [
          ["Subject", "Nominative", "Ich"],
          ["Direct object (what)", "Accusative", "das Buch"],
          ["Indirect object (to whom)", "Dative", "dem Freund"],
        ],
      },
      examples: [
        { de: "Ich gebe dem Mann das Buch.", en: "I give the man the book." },
        { de: "Er schreibt der Frau einen Brief.", en: "He writes the woman a letter." },
        { de: "Wir zeigen dem Kind das Bild.", en: "We show the child the picture." },
      ],
      notes: [
        "Indirect object answers 'to whom?' or 'for whom?'",
        "Word order tip: dative (indirect) usually comes before accusative (direct).",
      ],
    },
    {
      heading: "Article Changes in Dative",
      explanation:
        "In dative, ALL genders change — this is different from accusative where only masculine changed.",
      table: {
        headers: ["Gender", "Nominative", "Accusative", "Dative"],
        rows: [
          ["Masculine", "der / ein", "den / einen", "dem / einem"],
          ["Feminine", "die / eine", "die / eine", "der / einer"],
          ["Neuter", "das / ein", "das / ein", "dem / einem"],
          ["Plural", "die / —", "die / —", "den / — (+n to noun)"],
        ],
      },
      examples: [
        { de: "Ich helfe dem Mann.", en: "I help the man. (m → dem)" },
        { de: "Er dankt der Frau.", en: "He thanks the woman. (f → der)" },
        { de: "Sie zeigt dem Kind das Foto.", en: "She shows the child the photo. (n → dem)" },
        { de: "Ich gebe den Kindern Süßigkeiten.", en: "I give the children sweets. (pl → den + n)" },
      ],
      notes: [
        "Feminine dative is 'der' — same as masculine nominative. Context determines which it is.",
        "Plural dative: add -n to the noun if it doesn't already end in -n or -s.",
      ],
    },
    {
      heading: "Dative Prepositions (always dative)",
      explanation:
        "These prepositions ALWAYS take dative — no exceptions. Memorize this list.",
      table: {
        headers: ["Preposition", "Meaning", "Example"],
        rows: [
          ["mit", "with", "Ich fahre mit dem Bus."],
          ["nach", "to (countries/cities), after", "Ich fahre nach Berlin."],
          ["bei", "at, near, with (at someone's place)", "Ich bin bei meiner Mutter."],
          ["von", "from, of, by", "Das Buch ist von dem Autor."],
          ["zu", "to (people/places)", "Ich gehe zu dem Arzt."],
          ["aus", "from (origin), out of", "Er kommt aus Deutschland."],
          ["seit", "since, for (time)", "Ich lerne seit einem Jahr Deutsch."],
          ["gegenüber", "opposite, across from", "Das Café ist gegenüber dem Bahnhof."],
        ],
      },
      examples: [
        { de: "Ich fahre mit dem Zug.", en: "I travel by train." },
        { de: "Ich wohne bei meinen Eltern.", en: "I live with my parents." },
        { de: "Seit einem Monat lerne ich Deutsch.", en: "I've been learning German for a month." },
      ],
      notes: [
        "'von dem' contracts to 'vom', 'zu dem' contracts to 'zum', 'zu der' contracts to 'zur'.",
        "These contractions are standard — always use them in speech.",
      ],
    },
  ],
  exercises: [
    {
      id: "g06-e01",
      type: "multiple_choice",
      question: "Ich gebe ___ Mann das Buch. (dative, masculine definite)",
      options: ["der", "den", "dem", "die"],
      answer: "dem",
    },
    {
      id: "g06-e02",
      type: "fill_blank",
      question: "Er hilft ___ Frau. (dative, feminine definite)",
      answer: "der",
    },
    {
      id: "g06-e03",
      type: "multiple_choice",
      question: "Which preposition always takes dative?",
      options: ["durch", "für", "mit", "ohne"],
      answer: "mit",
    },
    {
      id: "g06-e04",
      type: "translate",
      question: "Translate: I travel by train.",
      answer: "Ich fahre mit dem Zug.",
    },
    {
      id: "g06-e05",
      type: "fill_blank",
      question: "Sie wohnt bei ___ Eltern. (her parents — plural dative)",
      answer: "ihren",
      hint: "plural dative possessive",
    },
    {
      id: "g06-e06",
      type: "multiple_choice",
      question: "Ich komme aus ___ Deutschland. (no article needed — country name)",
      options: ["dem", "den", "der", "(no article)"],
      answer: "(no article)",
    },
    {
      id: "g06-e07",
      type: "translate",
      question: "Translate: I've been learning German for two years.",
      answer: "Ich lerne seit zwei Jahren Deutsch.",
    },
    {
      id: "g06-e08",
      type: "multiple_choice",
      question: "'zu dem' contracts to…",
      options: ["zum", "zur", "vom", "beim"],
      answer: "zum",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// G07 — Modal Verbs & Separable Verbs
// ─────────────────────────────────────────────────────────────────────────────

const G07: GrammarTopic = {
  id: "g07-modals-separable",
  title: "Modal Verbs & Separable Verbs",
  subtitle: "können, müssen, wollen + verbs that split apart",
  unlockedAtUnit: "u22",
  icon: "⚡",
  color: "#58CC02",
  sections: [
    {
      heading: "Modal Verbs Overview",
      explanation:
        "German has 6 modal verbs. They express ability, permission, obligation, and desire. The modal conjugates, and the main verb goes to the END of the sentence in its infinitive form.",
      table: {
        headers: ["Modal", "Meaning", "Key usage"],
        rows: [
          ["können", "can, to be able to", "ability, possibility"],
          ["müssen", "must, have to", "necessity, obligation"],
          ["wollen", "to want to", "desire, intention"],
          ["sollen", "should, supposed to", "obligation from others"],
          ["dürfen", "may, allowed to", "permission"],
          ["möchten", "would like to", "polite desire"],
        ],
      },
      examples: [
        { de: "Ich kann Deutsch sprechen.", en: "I can speak German." },
        { de: "Du musst jetzt schlafen.", en: "You must sleep now." },
        { de: "Er will Arzt werden.", en: "He wants to become a doctor." },
        { de: "Darf ich rauchen?", en: "May I smoke?" },
        { de: "Ich möchte einen Kaffee.", en: "I would like a coffee." },
      ],
      notes: [
        "Structure: [Subject] + [Modal (conjugated)] + … + [Infinitive (end)]",
        "'möchten' is technically the Konjunktiv II of 'mögen' but functions as a separate modal.",
      ],
    },
    {
      heading: "Modal Verb Conjugation",
      explanation:
        "Modal verbs are irregular — note that ich and er/sie/es have the SAME form (no ending), unlike regular verbs.",
      table: {
        headers: ["Pronoun", "können", "müssen", "wollen", "dürfen", "sollen", "möchten"],
        rows: [
          ["ich", "kann", "muss", "will", "darf", "soll", "möchte"],
          ["du", "kannst", "musst", "willst", "darfst", "sollst", "möchtest"],
          ["er/sie/es", "kann", "muss", "will", "darf", "soll", "möchte"],
          ["wir", "können", "müssen", "wollen", "dürfen", "sollen", "möchten"],
          ["ihr", "könnt", "müsst", "wollt", "dürft", "sollt", "möchtet"],
          ["sie/Sie", "können", "müssen", "wollen", "dürfen", "sollen", "möchten"],
        ],
      },
      examples: [
        { de: "Kannst du mir helfen?", en: "Can you help me?" },
        { de: "Wir müssen jetzt gehen.", en: "We have to go now." },
        { de: "Möchten Sie etwas trinken?", en: "Would you like something to drink?" },
      ],
      notes: [
        "ich and er/sie/es are identical for all modal verbs — no -t or -e ending.",
        "'wollen' looks like English 'will' but means 'want to', NOT future tense.",
      ],
    },
    {
      heading: "Separable Verbs",
      explanation:
        "Some German verbs have a separable prefix that splits off and moves to the END of the sentence in main clauses.",
      table: {
        headers: ["Verb", "Prefix", "Stem", "Example"],
        rows: [
          ["anrufen", "an-", "rufen", "Ich rufe dich an."],
          ["aufmachen", "auf-", "machen", "Er macht die Tür auf."],
          ["ankommen", "an-", "kommen", "Wann kommst du an?"],
          ["aufstehen", "auf-", "stehen", "Ich stehe um 7 auf."],
          ["einladen", "ein-", "laden", "Ich lade dich ein."],
          ["abfahren", "ab-", "fahren", "Der Zug fährt ab."],
          ["zumachen", "zu-", "machen", "Mach die Tür zu!"],
        ],
      },
      examples: [
        { de: "Ich rufe dich morgen an.", en: "I'll call you tomorrow." },
        { de: "Der Kurs fängt um 9 an.", en: "The course starts at 9." },
        { de: "Ich stehe jeden Morgen um 6 auf.", en: "I get up at 6 every morning." },
      ],
      notes: [
        "The prefix goes to the END of the main clause.",
        "In a YES/NO question: 'Rufst du mich an?' — prefix still at end.",
        "With modals: infinitive keeps the prefix attached — 'Ich muss dich anrufen.'",
      ],
    },
  ],
  exercises: [
    {
      id: "g07-e01",
      type: "fill_blank",
      question: "Ich ___ Deutsch sprechen. (can)",
      answer: "kann",
    },
    {
      id: "g07-e02",
      type: "multiple_choice",
      question: "Which modal expresses 'would like to'?",
      options: ["wollen", "müssen", "möchten", "dürfen"],
      answer: "möchten",
    },
    {
      id: "g07-e03",
      type: "fill_blank",
      question: "Ich rufe dich ___. (anrufen — present, separable)",
      answer: "an",
      hint: "prefix goes to end",
    },
    {
      id: "g07-e04",
      type: "translate",
      question: "Translate: She has to go now.",
      answer: "Sie muss jetzt gehen.",
    },
    {
      id: "g07-e05",
      type: "multiple_choice",
      question: "Er ___ kommen. (He is supposed to come)",
      options: ["soll", "will", "muss", "kann"],
      answer: "soll",
    },
    {
      id: "g07-e06",
      type: "translate",
      question: "Translate: I get up at 7.",
      answer: "Ich stehe um 7 auf.",
    },
    {
      id: "g07-e07",
      type: "multiple_choice",
      question: "What does 'wollen' mean?",
      options: ["will (future)", "want to", "must", "should"],
      answer: "want to",
    },
    {
      id: "g07-e08",
      type: "fill_blank",
      question: "Darf ich hier ___? (rauchen — may I smoke?)",
      answer: "rauchen",
      hint: "infinitive at end with modal",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// G08 — Perfekt (spoken past tense)
// ─────────────────────────────────────────────────────────────────────────────

const G08: GrammarTopic = {
  id: "g08-perfekt",
  title: "Perfekt (Past Tense)",
  subtitle: "How to talk about the past in German",
  unlockedAtUnit: "u24",
  icon: "⏮️",
  color: "#FF9600",
  sections: [
    {
      heading: "Why Perfekt?",
      explanation:
        "German has two main past tenses. Perfekt is used in SPOKEN German for virtually all past events. Präteritum is used in written narratives. At A1, you only need Perfekt.",
      table: {
        headers: ["Tense", "Usage", "Example"],
        rows: [
          ["Perfekt", "Spoken/everyday past", "Ich habe gegessen."],
          ["Präteritum", "Written/narrative", "Ich aß."],
        ],
      },
      examples: [
        { de: "Ich habe gestern gearbeitet.", en: "I worked yesterday." },
        { de: "Wir sind nach Berlin gefahren.", en: "We drove to Berlin." },
      ],
      notes: [
        "Always use Perfekt when speaking — Präteritum sounds unnatural in conversation.",
        "Exception: sein (war) and haben (hatte) use Präteritum even in speech.",
      ],
    },
    {
      heading: "Perfekt Structure",
      explanation:
        "Perfekt uses a helper verb (haben or sein) + past participle. The helper conjugates, participle goes to end.",
      table: {
        headers: ["Position 1", "Helper (pos 2)", "Middle", "Past Participle (end)"],
        rows: [
          ["Ich", "habe", "gestern", "gearbeitet."],
          ["Er", "hat", "das Buch", "gelesen."],
          ["Wir", "sind", "nach Hause", "gegangen."],
          ["Du", "bist", "früh", "aufgestanden."],
        ],
      },
      examples: [
        { de: "Ich habe Kaffee getrunken.", en: "I drank coffee." },
        { de: "Sie hat einen Film gesehen.", en: "She watched a film." },
        { de: "Wir sind ins Kino gegangen.", en: "We went to the cinema." },
      ],
      notes: [
        "Structure: haben/sein (conjugated) + … + Partizip II (end of sentence)",
      ],
    },
    {
      heading: "Partizip II (Past Participle) — Regular Verbs",
      explanation:
        "Regular (weak) verbs form the past participle with: ge- + stem + -(e)t",
      table: {
        headers: ["Infinitive", "Stem", "Partizip II"],
        rows: [
          ["machen", "mach", "gemacht"],
          ["lernen", "lern", "gelernt"],
          ["kaufen", "kauf", "gekauft"],
          ["spielen", "spiel", "gespielt"],
          ["arbeiten", "arbeit", "gearbeitet"],
          ["wohnen", "wohn", "gewohnt"],
        ],
      },
      examples: [
        { de: "Ich habe Deutsch gelernt.", en: "I learned German." },
        { de: "Er hat ein Auto gekauft.", en: "He bought a car." },
        { de: "Wir haben Fußball gespielt.", en: "We played football." },
      ],
      notes: [
        "If stem ends in -t or -d, add -et: gearbeitet, geredet.",
        "Verbs starting with be-, ver-, er-, ge- do NOT add ge-: besucht, verkauft, erklärt.",
      ],
    },
    {
      heading: "Partizip II — Common Irregular Verbs",
      explanation:
        "Strong (irregular) verbs change their stem vowel and end in -en. These must be memorized.",
      table: {
        headers: ["Infinitive", "Partizip II", "Meaning"],
        rows: [
          ["gehen", "gegangen", "gone"],
          ["fahren", "gefahren", "driven/traveled"],
          ["kommen", "gekommen", "come"],
          ["essen", "gegessen", "eaten"],
          ["trinken", "getrunken", "drunk"],
          ["schlafen", "geschlafen", "slept"],
          ["lesen", "gelesen", "read"],
          ["schreiben", "geschrieben", "written"],
          ["sehen", "gesehen", "seen"],
          ["sprechen", "gesprochen", "spoken"],
          ["nehmen", "genommen", "taken"],
          ["stehen", "gestanden", "stood"],
        ],
      },
      examples: [
        { de: "Ich bin nach Hause gegangen.", en: "I went home." },
        { de: "Er hat zu viel gegessen.", en: "He ate too much." },
        { de: "Hast du gut geschlafen?", en: "Did you sleep well?" },
      ],
      notes: [
        "Irregular verbs ending in -en in the past participle are called 'strong verbs'.",
        "Most movement/change-of-state verbs use 'sein' as helper.",
      ],
    },
    {
      heading: "haben vs. sein as Helper",
      explanation:
        "Most verbs use 'haben'. But movement/travel verbs and change-of-state verbs use 'sein'.",
      table: {
        headers: ["Use 'haben'", "Use 'sein'"],
        rows: [
          ["most verbs", "movement verbs: gehen, fahren, fliegen, laufen"],
          ["transitive verbs (have an object)", "change of state: aufstehen, einschlafen, sterben"],
          ["reflexive verbs", "bleiben (to stay), sein (to be), werden (to become)"],
        ],
      },
      examples: [
        { de: "Ich habe das Buch gelesen.", en: "I read the book. (haben — transitive)" },
        { de: "Ich bin nach Berlin gefahren.", en: "I drove to Berlin. (sein — movement)" },
        { de: "Er ist aufgestanden.", en: "He got up. (sein — change of state)" },
        { de: "Bist du zu Hause geblieben?", en: "Did you stay at home? (sein — bleiben)" },
      ],
      notes: [
        "When unsure: does the verb show movement from A to B, or a change in state? → sein.",
        "Otherwise → haben.",
      ],
    },
  ],
  exercises: [
    {
      id: "g08-e01",
      type: "multiple_choice",
      question: "Ich ___ Deutsch gelernt. (Perfekt of lernen)",
      options: ["bin", "habe", "hat", "ist"],
      answer: "habe",
    },
    {
      id: "g08-e02",
      type: "fill_blank",
      question: "Partizip II of 'kaufen' is ___.",
      answer: "gekauft",
    },
    {
      id: "g08-e03",
      type: "multiple_choice",
      question: "Wir ___ nach Berlin gefahren.",
      options: ["haben", "habe", "sind", "ist"],
      answer: "sind",
    },
    {
      id: "g08-e04",
      type: "multiple_choice",
      question: "Partizip II of 'gehen' is…",
      options: ["gegehen", "gegangen", "gegeht", "ging"],
      answer: "gegangen",
    },
    {
      id: "g08-e05",
      type: "translate",
      question: "Translate: She watched a film.",
      answer: "Sie hat einen Film gesehen.",
    },
    {
      id: "g08-e06",
      type: "multiple_choice",
      question: "'aufstehen' (to get up) uses which helper in Perfekt?",
      options: ["haben", "sein", "werden", "bleiben"],
      answer: "sein",
    },
    {
      id: "g08-e07",
      type: "fill_blank",
      question: "Er hat zu viel ___. (essen)",
      answer: "gegessen",
    },
    {
      id: "g08-e08",
      type: "translate",
      question: "Translate: Did you sleep well?",
      answer: "Hast du gut geschlafen?",
    },
  ],
  completionRequirement: 6,
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  G01,
  G02,
  G03,
  G04,
  G05,
  G06,
  G07,
  G08,
].map(t => ({ ...t, cefrLevel: "A1" }));

export const GRAMMAR_TOPIC_MAP: Record<string, GrammarTopic> = Object.fromEntries(
  GRAMMAR_TOPICS.map((t) => [t.id, t])
);
