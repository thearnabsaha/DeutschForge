import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

type GrammarTopicInsert = typeof schema.grammarTopics.$inferInsert;

const topics: GrammarTopicInsert[] = [
  // A1
  {
    cefrLevel: 'A1',
    title: 'Definite & Indefinite Articles',
    slug: 'articles',
    description: 'Learn der/die/das and ein/eine for German nouns.',
    theory: `In German, every noun has a **gender**: masculine (der), feminine (die), or neuter (das). Unlike English, you must learn the gender with each noun, as it affects articles and adjective endings throughout the sentence.

The **definite articles** (the) are: der (masculine), die (feminine), das (neuter), and die (plural). The **indefinite articles** (a/an) are: ein (masculine/neuter), eine (feminine). There is no indefinite article for plural.

When you use definite articles, you are referring to something specific. Indefinite articles introduce something new or unspecific. For example: "Der Mann" (the man – we know which one) vs. "Ein Mann" (a man – any man).`,
    examples: [
      { german: 'Der Mann ist groß.', english: 'The man is tall.', note: 'Masculine noun uses "der"' },
      { german: 'Die Frau arbeitet.', english: 'The woman works.', note: 'Feminine noun uses "die"' },
      { german: 'Das Kind spielt.', english: 'The child plays.', note: 'Neuter noun uses "das"' },
      { german: 'Ich habe einen Bruder.', english: "I have a brother.", note: 'Ein becomes einen in accusative' },
      { german: 'Eine Katze schläft.', english: 'A cat is sleeping.', note: 'Feminine indefinite article' },
    ],
    exercises: [
      { id: 'a1-articles-1', type: 'fill_blank', question: '___ Mann liest. (the)', options: undefined, correctAnswer: 'Der', explanation: 'Mann is masculine, so the definite article is "der".' },
      { id: 'a1-articles-2', type: 'fill_blank', question: '___ Frau singt. (the)', options: undefined, correctAnswer: 'Die', explanation: 'Frau is feminine, so the definite article is "die".' },
      { id: 'a1-articles-3', type: 'fill_blank', question: '___ Buch ist neu. (the)', options: undefined, correctAnswer: 'Das', explanation: 'Buch is neuter, so the definite article is "das".' },
      { id: 'a1-articles-4', type: 'fill_blank', question: 'Ich habe ___ Hund. (a)', options: undefined, correctAnswer: 'einen', explanation: 'Hund is masculine. In accusative after "haben", ein becomes "einen".' },
      { id: 'a1-articles-5', type: 'multiple_choice', question: 'Which article for "Tisch" (table, masculine)?', options: ['der', 'die', 'das', 'den'], correctAnswer: 'der', explanation: 'Tisch is masculine. In nominative, the article is "der".' },
    ],
    sortOrder: 0,
  },
  {
    cefrLevel: 'A1',
    title: 'Present Tense Regular Verbs',
    slug: 'present-tense',
    description: 'Master verb conjugation with -en endings for ich/du/er/wir/ihr/sie.',
    theory: `German regular verbs in the present tense follow a predictable pattern. The infinitive ends in **-en** (e.g., lernen, spielen, machen). To conjugate, you remove the -en and add the appropriate ending: -e (ich), -st (du), -t (er/sie/es), -en (wir), -t (ihr), -en (sie/Sie).

The verb stem stays the same; only the ending changes. For example, with **lernen** (to learn): ich lerne, du lernst, er/sie/es lernt, wir lernen, ihr lernt, sie/Sie lernen. Notice that wir, sie, and Sie all use the same form as the infinitive.

In a main clause, the conjugated verb is always in **position 2**. The subject can be in position 1 or 3, depending on word order. For example: "Ich lerne Deutsch" or "Deutsch lerne ich" (emphasis on what you learn).`,
    examples: [
      { german: 'Ich spiele Tennis.', english: 'I play tennis.' },
      { german: 'Du arbeitest im Büro.', english: 'You work in the office.' },
      { german: 'Er wohnt in Berlin.', english: 'He lives in Berlin.' },
      { german: 'Wir machen Hausaufgaben.', english: 'We do homework.' },
      { german: 'Sie lernen Deutsch.', english: 'They learn German.' },
    ],
    exercises: [
      { id: 'a1-present-tense-1', type: 'fill_blank', question: 'Ich ___ (lernen) Deutsch.', options: undefined, correctAnswer: 'lerne', explanation: 'First person singular adds -e to the stem.' },
      { id: 'a1-present-tense-2', type: 'fill_blank', question: 'Du ___ (spielen) gut.', options: undefined, correctAnswer: 'spielst', explanation: 'Second person singular adds -st. Note: stem gets a connecting -e- for pronunciation.' },
      { id: 'a1-present-tense-3', type: 'fill_blank', question: 'Er ___ (machen) das.', options: undefined, correctAnswer: 'macht', explanation: 'Third person singular adds -t.' },
      { id: 'a1-present-tense-4', type: 'fill_blank', question: 'Wir ___ (wohnen) hier.', options: undefined, correctAnswer: 'wohnen', explanation: 'First person plural uses the infinitive form.' },
      { id: 'a1-present-tense-5', type: 'multiple_choice', question: 'Correct form for "du" + "arbeiten"?', options: ['arbeitest', 'arbeitet', 'arbeit', 'arbeite'], correctAnswer: 'arbeitest', explanation: 'Du takes -st. Arbeit + -est = arbeitest.' },
    ],
    sortOrder: 1,
  },
  {
    cefrLevel: 'A1',
    title: 'W-Questions',
    slug: 'w-questions',
    description: 'Form questions with Wer, Was, Wo, Wann, Warum, Wie.',
    theory: `**W-questions** (Fragewörter) are question words that start with W in German. The main ones are: **Wer** (who), **Was** (what), **Wo** (where), **Wann** (when), **Warum** (why), and **Wie** (how). These words always come first in the question, followed by the verb in second position, then the subject (if different).

The structure is: W-word + Verb + Subject + rest. For example: "Wo wohnst du?" (Where do you live?) – the verb "wohnst" is in position 2. For "Wo" + place, you often need a preposition: "Woher kommst du?" (Where do you come from?), "Wohin gehst du?" (Where are you going?).`,
    examples: [
      { german: 'Wer ist das?', english: 'Who is that?' },
      { german: 'Was machst du?', english: 'What are you doing?' },
      { german: 'Wo wohnst du?', english: 'Where do you live?' },
      { german: 'Wann beginnt der Film?', english: 'When does the film start?' },
      { german: 'Warum lernst du Deutsch?', english: 'Why are you learning German?' },
      { german: 'Wie geht es dir?', english: 'How are you?' },
    ],
    exercises: [
      { id: 'a1-w-questions-1', type: 'multiple_choice', question: '___ ist das? – Das ist mein Freund.', options: ['Was', 'Wer', 'Wo', 'Wie'], correctAnswer: 'Wer', explanation: 'We are asking about a person, so "Wer" (who).' },
      { id: 'a1-w-questions-2', type: 'multiple_choice', question: '___ machst du? – Ich lese.', options: ['Wer', 'Was', 'Wo', 'Wann'], correctAnswer: 'Was', explanation: 'We are asking about an action/thing: "Was" (what).' },
      { id: 'a1-w-questions-3', type: 'fill_blank', question: '___ wohnst du?', options: undefined, correctAnswer: 'Wo', explanation: 'We are asking about a place: "Wo" (where).' },
      { id: 'a1-w-questions-4', type: 'fill_blank', question: '___ geht es dir?', options: undefined, correctAnswer: 'Wie', explanation: 'We are asking about manner/state: "Wie" (how).' },
      { id: 'a1-w-questions-5', type: 'multiple_choice', question: '___ beginnt die Schule?', options: ['Wo', 'Warum', 'Wann', 'Was'], correctAnswer: 'Wann', explanation: 'We are asking about time: "Wann" (when).' },
    ],
    sortOrder: 2,
  },
  // A2
  {
    cefrLevel: 'A2',
    title: 'Modal Verbs',
    slug: 'modal-verbs',
    description: 'Master können, müssen, wollen, sollen, dürfen, mögen.',
    theory: `**Modal verbs** (Modalverben) express necessity, possibility, permission, or desire. The six main modals are: **können** (can/to be able to), **müssen** (must/to have to), **wollen** (to want to), **sollen** (should/ought to), **dürfen** (may/to be allowed to), and **mögen** (to like). They are irregular but follow a pattern: in singular (ich, du, er/sie/es) they often have a vowel change and no -t in 3rd person.

When a modal is used with another verb, the **main verb goes to the end** in its infinitive form. For example: "Ich muss Deutsch lernen" (I must learn German) – "muss" is conjugated, "lernen" stays infinitive at the end. The modal is conjugated for the subject; the main verb is always at the end.`,
    examples: [
      { german: 'Ich kann schwimmen.', english: "I can swim.", note: 'können + infinitive' },
      { german: 'Du musst lernen.', english: 'You must study.', note: 'müssen – obligation' },
      { german: 'Er will kommen.', english: 'He wants to come.', note: 'wollen – desire' },
      { german: 'Wir sollen nicht lärmen.', english: "We shouldn't make noise.", note: 'sollen – recommendation' },
      { german: 'Sie darf nicht rauchen.', english: "She is not allowed to smoke.", note: 'dürfen – permission' },
    ],
    exercises: [
      { id: 'a2-modal-verbs-1', type: 'fill_blank', question: 'Ich ___ (können) Deutsch sprechen.', options: undefined, correctAnswer: 'kann', explanation: 'Ich + können = ich kann (vowel change ö→a).' },
      { id: 'a2-modal-verbs-2', type: 'fill_blank', question: 'Du ___ (müssen) früh aufstehen.', options: undefined, correctAnswer: 'musst', explanation: 'Du + müssen = du musst.' },
      { id: 'a2-modal-verbs-3', type: 'multiple_choice', question: 'Er ___ nach Hause gehen. (wollen)', options: ['will', 'wollt', 'wolle', 'wollen'], correctAnswer: 'will', explanation: 'Er/sie/es + wollen = er will (irregular).' },
      { id: 'a2-modal-verbs-4', type: 'fill_blank', question: 'Wir ___ (sollen) pünktlich sein.', options: undefined, correctAnswer: 'sollen', explanation: 'Wir + sollen = wir sollen (infinitive form).' },
      { id: 'a2-modal-verbs-5', type: 'multiple_choice', question: 'Sie ___ hier nicht parken. (dürfen)', options: ['darf', 'dürft', 'dürfen', 'dürfe'], correctAnswer: 'darf', explanation: 'Sie (singular) + dürfen = sie darf.' },
    ],
    sortOrder: 3,
  },
  {
    cefrLevel: 'A2',
    title: 'Accusative Case',
    slug: 'accusative-case',
    description: 'Learn direct objects and article changes in the accusative.',
    theory: `The **accusative case** (Akkusativ) marks the **direct object** of a verb—the person or thing that receives the action. In German, articles and pronouns change in the accusative. Only masculine articles change: **der** → **den**, **ein** → **einen**. Feminine (die/eine) and neuter (das/ein) stay the same in the accusative.

For example: "Ich sehe den Mann" (I see the man) – Mann is masculine, so "der" becomes "den". "Ich habe eine Katze" (I have a cat) – Katze is feminine, "eine" stays "eine". Prepositions like **für, ohne, durch, gegen, um** always take the accusative.`,
    examples: [
      { german: 'Ich kaufe den Apfel.', english: 'I buy the apple.', note: 'Apfel is masculine; der→den' },
      { german: 'Sie liest die Zeitung.', english: 'She reads the newspaper.', note: 'die stays die (feminine)' },
      { german: 'Er hat einen Bruder.', english: "He has a brother.", note: 'ein→einen for masculine accusative' },
      { german: 'Das ist für dich.', english: "That's for you.", note: 'für + accusative' },
    ],
    exercises: [
      { id: 'a2-accusative-1', type: 'fill_blank', question: 'Ich sehe ___ Mann. (the)', options: undefined, correctAnswer: 'den', explanation: 'Mann is masculine; accusative of der is den.' },
      { id: 'a2-accusative-2', type: 'fill_blank', question: 'Er kauft ___ Buch. (a)', options: undefined, correctAnswer: 'ein', explanation: 'Buch is neuter; ein stays ein in accusative.' },
      { id: 'a2-accusative-3', type: 'fill_blank', question: 'Wir haben ___ Hund. (a)', options: undefined, correctAnswer: 'einen', explanation: 'Hund is masculine; accusative of ein is einen.' },
      { id: 'a2-accusative-4', type: 'multiple_choice', question: 'Ich trinke ___ Wasser. (the)', options: ['der', 'die', 'das', 'den'], correctAnswer: 'das', explanation: 'Wasser is neuter; das stays das in accusative.' },
      { id: 'a2-accusative-5', type: 'fill_blank', question: 'Sie liebt ___ Kind. (the)', options: undefined, correctAnswer: 'das', explanation: 'Kind is neuter; das stays das in accusative.' },
    ],
    sortOrder: 4,
  },
  {
    cefrLevel: 'A2',
    title: 'Separable Verbs',
    slug: 'separable-verbs',
    description: 'Understand aufstehen, anfangen, and other separable prefixes.',
    theory: `**Separable verbs** (trennbare Verben) have a prefix that separates from the verb stem in the main clause. The prefix goes to the **end of the clause**. For example: **aufstehen** (to get up) → "Ich stehe um 7 Uhr auf." The prefix "auf" moves to the end. In the infinitive and in subordinate clauses, the prefix stays attached: "Es ist Zeit aufzustehen."

Common separable prefixes include: ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, zu-. The infinitive is written as one word (aufstehen), but when conjugated the prefix is separated. In **perfect tense**, the ge- goes between prefix and stem: "Ich bin aufgestanden" (I got up).`,
    examples: [
      { german: 'Ich stehe um 7 Uhr auf.', english: 'I get up at 7 o\'clock.' },
      { german: 'Der Film fängt um 8 an.', english: 'The film starts at 8.' },
      { german: 'Er kommt morgen mit.', english: 'He is coming along tomorrow.' },
      { german: 'Wir machen die Tür zu.', english: 'We close the door.' },
    ],
    exercises: [
      { id: 'a2-separable-1', type: 'fill_blank', question: 'Ich ___ um 6 Uhr auf. (aufstehen - conjugated part)', options: undefined, correctAnswer: 'stehe', explanation: 'The prefix "auf" goes to the end. The stem "steh" + -e = stehe.' },
      { id: 'a2-separable-2', type: 'fill_blank', question: 'Wann ___ der Unterricht an? (anfangen - conjugated part)', options: undefined, correctAnswer: 'fängt', explanation: 'anfangen: fängt is the conjugated form; "an" goes to the end.' },
      { id: 'a2-separable-3', type: 'multiple_choice', question: 'Correct sentence with "mitkommen"?', options: ['Er kommt mit uns mit.', 'Er mitkommt mit uns.', 'Er mit kommt uns.'], correctAnswer: 'Er kommt mit uns mit.', explanation: 'The prefix "mit" goes to the end of the clause.' },
      { id: 'a2-separable-4', type: 'fill_blank', question: 'Sie macht das Fenster ___. (zumachen - prefix)', options: undefined, correctAnswer: 'zu', explanation: 'zumachen: prefix "zu" goes to the end.' },
      { id: 'a2-separable-5', type: 'multiple_choice', question: 'Wir ___ heute früh aus. (ausgehen)', options: ['gehen', 'geht', 'gehst', 'gehe'], correctAnswer: 'gehen', explanation: 'ausgehen: wir + gehen. Prefix "aus" at end.' },
    ],
    sortOrder: 5,
  },
  // B1
  {
    cefrLevel: 'B1',
    title: 'Dative Case',
    slug: 'dative-case',
    description: 'Master indirect objects and dative prepositions.',
    theory: `The **dative case** (Dativ) marks the **indirect object**—the person or thing that benefits from or is affected by the action. Articles change: **der** → **dem**, **die** → **der**, **das** → **dem**, **die** (pl) → **den**. Masculine and neuter add -m; feminine changes to "der"; plural adds -n to the noun.

Certain verbs always take a dative object: **helfen** (to help), **danken** (to thank), **gehören** (to belong to), **gefallen** (to please). For example: "Das Buch gehört dem Kind" (The book belongs to the child). **Dative prepositions** (always dative): aus, bei, mit, nach, seit, von, zu, gegenüber. Example: "Ich fahre mit dem Bus" (I travel by bus).`,
    examples: [
      { german: 'Ich helfe dem Kind.', english: 'I help the child.', note: 'helfen + dative' },
      { german: 'Das Buch gehört der Frau.', english: 'The book belongs to the woman.' },
      { german: 'Ich wohne bei meinen Eltern.', english: 'I live with my parents.', note: 'bei + dative' },
      { german: 'Er fährt mit dem Zug.', english: 'He travels by train.', note: 'mit + dative' },
    ],
    exercises: [
      { id: 'b1-dative-1', type: 'fill_blank', question: 'Ich helfe ___ Mann. (the)', options: undefined, correctAnswer: 'dem', explanation: 'Mann is masculine; dative of der is dem.' },
      { id: 'b1-dative-2', type: 'fill_blank', question: 'Das gehört ___ Frau. (the)', options: undefined, correctAnswer: 'der', explanation: 'Frau is feminine; dative of die is der.' },
      { id: 'b1-dative-3', type: 'fill_blank', question: 'Er kommt ___ dem Bahnhof. (from)', options: undefined, correctAnswer: 'von', explanation: 'von is a dative preposition meaning "from".' },
      { id: 'b1-dative-4', type: 'multiple_choice', question: 'Ich fahre ___ dem Bus. (with/by)', options: ['mit', 'von', 'bei', 'zu'], correctAnswer: 'mit', explanation: 'mit + dative = with/by.' },
      { id: 'b1-dative-5', type: 'fill_blank', question: 'Sie wohnt ___ ihren Eltern. (with)', options: undefined, correctAnswer: 'bei', explanation: 'bei + dative = at/with (someone\'s place).' },
    ],
    sortOrder: 6,
  },
  {
    cefrLevel: 'B1',
    title: 'Adjective Endings',
    slug: 'adjective-endings',
    description: 'Learn adjective declension with definite and indefinite articles.',
    theory: `**Adjective endings** in German depend on the article (definite, indefinite, or none), the **gender** of the noun, and the **case** (nominative, accusative, dative, genitive). With the definite article (der/die/das), adjectives take **-e** in nominative singular (all genders) and **-en** in most other forms.

With the indefinite article (ein/eine), the adjective takes the ending that the article would have had if it were definite—so the adjective "carries" the case information. For example: "ein großer Mann" (a big man) – "großer" has the -er ending because "ein" doesn't show the case; the adjective does. The pattern is complex but follows rules: after "der"-words, use -e/-en; after "ein"-words or no article, use strong endings (-er, -e, -es, -en, etc.).`,
    examples: [
      { german: 'Der große Mann kommt.', english: 'The tall man is coming.', note: 'After der: -e' },
      { german: 'Eine kleine Frau singt.', english: 'A small woman sings.', note: 'After eine: -e (feminine nom.)' },
      { german: 'Ich habe einen neuen Computer.', english: 'I have a new computer.', note: 'Masculine acc. after einen: -en' },
      { german: 'Das ist guter Kaffee.', english: 'That is good coffee.', note: 'No article: strong -er' },
    ],
    exercises: [
      { id: 'b1-adj-1', type: 'fill_blank', question: 'Der ___ Mann. (alt)', options: undefined, correctAnswer: 'alte', explanation: 'After der: adjective gets -e.' },
      { id: 'b1-adj-2', type: 'fill_blank', question: 'Eine ___ Stadt. (schön)', options: undefined, correctAnswer: 'schöne', explanation: 'After eine (feminine): -e.' },
      { id: 'b1-adj-3', type: 'fill_blank', question: 'Ich habe einen ___ Hund. (neu)', options: undefined, correctAnswer: 'neuen', explanation: 'Masculine accusative after einen: -en.' },
      { id: 'b1-adj-4', type: 'multiple_choice', question: 'Das ist ein ___ Buch. (gut)', options: ['gute', 'gutes', 'guter', 'gut'], correctAnswer: 'gutes', explanation: 'Neuter nominative after ein: -es.' },
      { id: 'b1-adj-5', type: 'fill_blank', question: 'Er trinkt ___ Kaffee. (kalt)', options: undefined, correctAnswer: 'kalten', explanation: 'Masculine accusative with no article: strong -en.' },
    ],
    sortOrder: 7,
  },
  {
    cefrLevel: 'B1',
    title: 'Subordinate Clauses',
    slug: 'subordinate-clauses',
    description: 'Use weil, dass, obwohl in dependent clauses.',
    theory: `**Subordinate clauses** (Nebensätze) are introduced by conjunctions like **weil** (because), **dass** (that), **obwohl** (although), **wenn** (when/if), **als** (when, past). The key rule: **the conjugated verb goes to the end** of the subordinate clause. The main clause can come first or second. If the main clause comes second, the verb goes to position 1 (inversion).

For example: "Ich bleibe zu Hause, weil ich krank bin" (I'm staying home because I'm sick). "Weil" introduces the subordinate clause; "bin" (conjugated verb) is at the end. With "dass": "Ich weiß, dass er kommt" (I know that he is coming). The verb "kommt" is at the end.`,
    examples: [
      { german: 'Ich komme, weil ich Zeit habe.', english: "I'm coming because I have time." },
      { german: 'Sie sagt, dass es regnet.', english: "She says that it's raining." },
      { german: 'Obwohl er müde ist, arbeitet er.', english: "Although he is tired, he's working." },
      { german: 'Wenn es regnet, bleibe ich zu Hause.', english: "When it rains, I stay at home." },
    ],
    exercises: [
      { id: 'b1-sub-1', type: 'fill_blank', question: 'Ich bleibe, ___ ich krank bin.', options: undefined, correctAnswer: 'weil', explanation: 'weil = because; introduces reason.' },
      { id: 'b1-sub-2', type: 'fill_blank', question: 'Er weiß, ___ sie kommt.', options: undefined, correctAnswer: 'dass', explanation: 'dass = that; introduces statement.' },
      { id: 'b1-sub-3', type: 'multiple_choice', question: '___ es kalt ist, geht er ohne Jacke. (although)', options: ['weil', 'dass', 'obwohl', 'wenn'], correctAnswer: 'obwohl', explanation: 'obwohl = although; introduces contrast.' },
      { id: 'b1-sub-4', type: 'fill_blank', question: 'Ich denke, ___ das richtig ist.', options: undefined, correctAnswer: 'dass', explanation: 'dass introduces the content of thinking.' },
      { id: 'b1-sub-5', type: 'multiple_choice', question: 'Where does the verb go in a weil-clause?', options: ['Second position', 'At the end', 'First position'], correctAnswer: 'At the end', explanation: 'In subordinate clauses, the conjugated verb goes to the end.' },
    ],
    sortOrder: 8,
  },
  // B2
  {
    cefrLevel: 'B2',
    title: 'Passive Voice',
    slug: 'passive-voice',
    description: 'Form passive with werden + Partizip II.',
    theory: `The **passive voice** (Passiv) emphasizes the action rather than who does it. It is formed with **werden** + **Partizip II** (past participle). The object of the active sentence becomes the subject of the passive. For example: Active: "Der Mechaniker repariert das Auto" (The mechanic repairs the car). Passive: "Das Auto wird repariert" (The car is being repaired).

**Werden** is conjugated: wird (3rd sing.), werden (plural), etc. The past participle stays at the end. If you want to mention the agent (who does it), use **von** + dative: "Das Auto wird vom Mechaniker repariert." The **process passive** (Vorgangspassiv) with "werden" describes an ongoing or general process. The **stat passive** (Zustandspassiv) uses "sein" + Partizip II for a completed state: "Das Fenster ist geöffnet" (The window is open).`,
    examples: [
      { german: 'Das Buch wird gelesen.', english: 'The book is being read.' },
      { german: 'Die Tür wurde geöffnet.', english: 'The door was opened.' },
      { german: 'Der Brief wurde vom Chef geschrieben.', english: 'The letter was written by the boss.', note: 'von + dative for agent' },
    ],
    exercises: [
      { id: 'b2-passive-1', type: 'fill_blank', question: 'Das Haus ___ gebaut. (present passive)', options: undefined, correctAnswer: 'wird', explanation: 'Passive = werden + Partizip II. Present: wird gebaut.' },
      { id: 'b2-passive-2', type: 'fill_blank', question: 'Der Brief ___ geschrieben. (past passive)', options: undefined, correctAnswer: 'wurde', explanation: 'Past passive: wurde + Partizip II.' },
      { id: 'b2-passive-3', type: 'multiple_choice', question: 'Active: Er repariert das Auto. Passive?', options: ['Das Auto wird repariert.', 'Das Auto ist repariert.', 'Das Auto repariert.'], correctAnswer: 'Das Auto wird repariert.', explanation: 'werden + Partizip II = process passive.' },
      { id: 'b2-passive-4', type: 'fill_blank', question: 'Die Aufgabe ___ von mir gemacht.', options: undefined, correctAnswer: 'wird', explanation: 'Present passive with agent: wird + gemacht.' },
      { id: 'b2-passive-5', type: 'multiple_choice', question: 'Das Fenster ___ geöffnet. (state: it is open)', options: ['wird', 'wurde', 'ist', 'war'], correctAnswer: 'ist', explanation: 'Zustandspassiv: sein + Partizip II for completed state.' },
    ],
    sortOrder: 9,
  },
  {
    cefrLevel: 'B2',
    title: 'Subjunctive II (Konjunktiv II)',
    slug: 'konjunktiv-ii',
    description: 'Express hypotheticals with würde, hätte, wäre.',
    theory: `**Konjunktiv II** expresses unreal conditions, wishes, or polite requests. It is often formed with **würde** + infinitive instead of the irregular forms, but the common irregulars are important: **hätte** (would have, from haben), **wäre** (would be, from sein), **könnte** (could), **müsste** (would have to), **wüsste** (would know).

For example: "Wenn ich Zeit hätte, würde ich kommen" (If I had time, I would come). "Ich hätte gern einen Kaffee" (I would like a coffee – polite). The pattern: **wenn** + subject + Konjunktiv II verb (at end) + main clause with würde/hätte/wäre. Many verbs use the "würde" construction: "Ich würde gehen" (I would go) instead of "Ich ginge" (less common).`,
    examples: [
      { german: 'Wenn ich reich wäre, würde ich reisen.', english: "If I were rich, I would travel." },
      { german: 'Ich hätte gern einen Tee.', english: "I would like a tea.", note: 'Polite request' },
      { german: 'Er könnte kommen, wenn er Zeit hätte.', english: "He could come if he had time." },
    ],
    exercises: [
      { id: 'b2-k2-1', type: 'fill_blank', question: 'Wenn ich Zeit ___, würde ich kommen.', options: undefined, correctAnswer: 'hätte', explanation: 'Konjunktiv II of haben: hätte.' },
      { id: 'b2-k2-2', type: 'fill_blank', question: 'Ich ___ gern einen Kaffee. (would like)', options: undefined, correctAnswer: 'hätte', explanation: 'Ich hätte gern = I would like (polite).' },
      { id: 'b2-k2-3', type: 'fill_blank', question: 'Wenn er hier ___, wäre es besser.', options: undefined, correctAnswer: 'wäre', explanation: 'Konjunktiv II of sein: wäre.' },
      { id: 'b2-k2-4', type: 'multiple_choice', question: 'Ich ___ das tun. (would do)', options: ['würde', 'werde', 'würdet', 'wird'], correctAnswer: 'würde', explanation: 'würde + infinitive for conditional.' },
      { id: 'b2-k2-5', type: 'fill_blank', question: 'Sie ___ helfen, wenn sie könnte.', options: undefined, correctAnswer: 'könnte', explanation: 'Konjunktiv II of können: könnte.' },
    ],
    sortOrder: 10,
  },
  {
    cefrLevel: 'B2',
    title: 'Relative Clauses',
    slug: 'relative-clauses',
    description: 'Use der/die/das as relative pronouns.',
    theory: `**Relative clauses** (Relativsätze) give extra information about a noun. They are introduced by **relative pronouns** that agree in gender and number with the noun they refer to, and show the case required in the relative clause. The forms are: der/die/das (m/f/n, nominative), den/die/das (accusative), dem/der/dem/den (dative), dessen/deren/dessen/deren (genitive).

As in all subordinate clauses, the **conjugated verb goes to the end**. Example: "Der Mann, der dort steht, ist mein Lehrer" (The man who is standing there is my teacher). "der" refers to "der Mann" (masculine, subject of the relative clause). "Die Frau, die ich gesehen habe" (The woman whom I saw) – "die" is accusative because "ich" is the subject and "die Frau" is the object.`,
    examples: [
      { german: 'Der Mann, der dort steht, ist mein Bruder.', english: 'The man who is standing there is my brother.' },
      { german: 'Das Buch, das ich lese, ist interessant.', english: 'The book that I am reading is interesting.' },
      { german: 'Die Frau, der ich geholfen habe, dankt mir.', english: "The woman whom I helped thanks me.", note: 'der = dative' },
    ],
    exercises: [
      { id: 'b2-relative-1', type: 'fill_blank', question: 'Der Mann, ___ dort steht, ist mein Freund.', options: undefined, correctAnswer: 'der', explanation: 'Refers to masculine noun, subject of clause: der.' },
      { id: 'b2-relative-2', type: 'fill_blank', question: 'Das Kind, ___ ich sehe, spielt.', options: undefined, correctAnswer: 'das', explanation: 'Refers to neuter noun, object: das (accusative = nominative for neuter).' },
      { id: 'b2-relative-3', type: 'multiple_choice', question: 'Die Frau, ___ ich helfe, ... (dative)', options: ['die', 'der', 'dem', 'den'], correctAnswer: 'der', explanation: 'Feminine dative relative pronoun: der.' },
      { id: 'b2-relative-4', type: 'fill_blank', question: 'Die Bücher, ___ ich lese, sind neu.', options: undefined, correctAnswer: 'die', explanation: 'Plural, accusative: die.' },
      { id: 'b2-relative-5', type: 'multiple_choice', question: 'Where does the verb go in a relative clause?', options: ['Second position', 'At the end', 'Right after the pronoun'], correctAnswer: 'At the end', explanation: 'Relative clauses are subordinate; verb goes to the end.' },
    ],
    sortOrder: 11,
  },
];

async function seedGrammar() {
  console.log('Seeding grammar topics...\n');

  await db
    .insert(schema.users)
    .values({ id: 'default-user', name: 'Learner', targetLevel: 'A1' })
    .onConflictDoNothing({ target: schema.users.id });
  console.log('  Default user ensured\n');

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i] as GrammarTopicInsert;
    await db
      .insert(schema.grammarTopics)
      .values(topic)
      .onConflictDoNothing({ target: [schema.grammarTopics.cefrLevel, schema.grammarTopics.slug] });
    console.log(`  [${i + 1}/${topics.length}] ${topic.title} (${topic.cefrLevel})`);
  }
  console.log('\nGrammar topics seeded successfully.');
}

seedGrammar()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  });
