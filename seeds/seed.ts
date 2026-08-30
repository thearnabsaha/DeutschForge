import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { createId } from '@paralleldrive/cuid2';
import * as schema from '../src/lib/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Seeding DeutschForge database...\n');

  const userId = 'default-user';
  await db.insert(schema.users).values({
    id: userId,
    name: 'Learner',
    targetLevel: 'A1',
  }).onConflictDoNothing();
  console.log('  User created');

  const vocabDeckId = createId();
  await db.insert(schema.decks).values({
    id: vocabDeckId,
    name: 'A1 Core Vocabulary',
    description: 'Essential German words for CEFR A1',
    cefrLevel: 'A1',
    module: 'VOCABULARY',
  });

  const vocabCards = [
    { front: 'Hallo', back: 'Hello', context: 'Hallo, wie geht es Ihnen?', tags: ['greetings'] },
    { front: 'Danke', back: 'Thank you', context: 'Danke für Ihre Hilfe.', tags: ['courtesy'] },
    { front: 'Bitte', back: "Please / You're welcome", context: 'Bitte, kommen Sie herein.', tags: ['courtesy'] },
    { front: 'Entschuldigung', back: 'Excuse me / Sorry', context: 'Entschuldigung, wo ist der Bahnhof?', tags: ['courtesy'] },
    { front: 'das Wasser', back: 'water', context: 'Kann ich bitte ein Glas Wasser haben?', tags: ['food', 'nouns'] },
    { front: 'das Brot', back: 'bread', context: 'Ich esse Brot zum Frühstück.', tags: ['food', 'nouns'] },
    { front: 'die Milch', back: 'milk', context: 'Die Milch ist im Kühlschrank.', tags: ['food', 'nouns'] },
    { front: 'der Arzt', back: 'doctor', context: 'Ich muss zum Arzt gehen.', tags: ['professions', 'nouns'] },
    { front: 'die Schule', back: 'school', context: 'Meine Kinder gehen in die Schule.', tags: ['education', 'nouns'] },
    { front: 'das Haus', back: 'house', context: 'Wir wohnen in einem großen Haus.', tags: ['home', 'nouns'] },
    { front: 'die Familie', back: 'family', context: 'Meine Familie ist sehr groß.', tags: ['family', 'nouns'] },
    { front: 'der Freund', back: 'friend (male)', context: 'Das ist mein Freund Peter.', tags: ['people', 'nouns'] },
    { front: 'die Freundin', back: 'friend (female)', context: 'Meine Freundin heißt Anna.', tags: ['people', 'nouns'] },
    { front: 'arbeiten', back: 'to work', context: 'Ich arbeite in einem Büro.', tags: ['verbs', 'work'] },
    { front: 'sprechen', back: 'to speak', context: 'Sprechen Sie Deutsch?', tags: ['verbs', 'communication'] },
    { front: 'verstehen', back: 'to understand', context: 'Ich verstehe das nicht.', tags: ['verbs', 'communication'] },
    { front: 'kaufen', back: 'to buy', context: 'Ich möchte Brot kaufen.', tags: ['verbs', 'shopping'] },
    { front: 'groß', back: 'big / tall', context: 'Berlin ist eine große Stadt.', tags: ['adjectives'] },
    { front: 'klein', back: 'small / short', context: 'Das Kind ist noch klein.', tags: ['adjectives'] },
    { front: 'gut', back: 'good', context: 'Das Essen ist sehr gut.', tags: ['adjectives'] },
    { front: 'schlecht', back: 'bad', context: 'Das Wetter ist heute schlecht.', tags: ['adjectives'] },
    { front: 'die Straße', back: 'street', context: 'Die Straße ist sehr lang.', tags: ['places', 'nouns'] },
    { front: 'der Bahnhof', back: 'train station', context: 'Der Bahnhof ist in der Nähe.', tags: ['transport', 'nouns'] },
    { front: 'heute', back: 'today', context: 'Heute ist Montag.', tags: ['time'] },
    { front: 'morgen', back: 'tomorrow', context: 'Morgen fahre ich nach Berlin.', tags: ['time'] },
  ];

  for (const c of vocabCards) {
    await db.insert(schema.cards).values({
      deckId: vocabDeckId,
      front: c.front,
      back: c.back,
      contextSentence: c.context,
      cefrLevel: 'A1',
      module: 'VOCABULARY',
      tags: c.tags,
    });
  }
  console.log(`  ${vocabCards.length} vocabulary cards`);

  const grammarDeckId = createId();
  await db.insert(schema.decks).values({
    id: grammarDeckId,
    name: 'A1 Grammar Foundations',
    description: 'Core German grammar structures for A1',
    cefrLevel: 'A1',
    module: 'GRAMMAR',
  });

  const grammarCards = [
    { front: 'ich ___ (sein)', back: 'bin', context: 'Ich bin Student.', explanation: 'The verb "sein" (to be) is irregular. First person singular: ich bin.', tags: ['sein', 'present-tense'] },
    { front: 'du ___ (haben)', back: 'hast', context: 'Du hast eine Katze.', explanation: '"Haben" (to have): du hast.', tags: ['haben', 'present-tense'] },
    { front: 'er/sie/es ___ (gehen)', back: 'geht', context: 'Er geht zur Schule.', explanation: 'Regular verbs 3rd person add -t: geh + t = geht.', tags: ['regular-verbs', 'present-tense'] },
    { front: 'Nominativ: ___ Mann ist groß. (der/die/das)', back: 'Der', context: 'Der Mann ist groß und freundlich.', explanation: 'Nominative masculine = "der".', tags: ['articles', 'nominative'] },
    { front: 'Akkusativ: Ich sehe ___ Frau. (der/die/das)', back: 'die', context: 'Ich sehe die Frau am Fenster.', explanation: 'Accusative feminine stays "die".', tags: ['articles', 'accusative'] },
    { front: 'Akkusativ: Ich kaufe ___ Tisch. (den/die/das)', back: 'den', context: 'Ich kaufe den Tisch.', explanation: 'Accusative masculine: "der" becomes "den".', tags: ['articles', 'accusative'] },
    { front: 'Negation: Ich trinke ___ Kaffee. (nicht/kein)', back: 'keinen', context: 'Ich trinke keinen Kaffee, nur Tee.', explanation: '"Kein" negates nouns. Masculine accusative: keinen.', tags: ['negation', 'kein'] },
    { front: 'Wortstellung: Morgen ___ ich nach Berlin.', back: 'fahre', context: 'Morgen fahre ich nach Berlin.', explanation: 'V2 rule: verb in second position. Time adverb leads = inversion.', tags: ['word-order', 'V2'] },
    { front: 'Plural: das Kind → die ___', back: 'Kinder', context: 'Die Kinder spielen im Garten.', explanation: 'Plural of Kind = Kinder. All plurals use "die".', tags: ['plurals', 'nouns'] },
    { front: 'Modalverb: Ich ___ Deutsch lernen. (möchten)', back: 'möchte', context: 'Ich möchte Deutsch lernen.', explanation: '"Möchten": ich möchte. Main verb goes to end.', tags: ['modal-verbs', 'möchten'] },
  ];

  for (const c of grammarCards) {
    await db.insert(schema.cards).values({
      deckId: grammarDeckId,
      front: c.front,
      back: c.back,
      contextSentence: c.context,
      explanation: c.explanation,
      cefrLevel: 'A1',
      module: 'GRAMMAR',
      tags: c.tags,
    });
  }
  console.log(`  ${grammarCards.length} grammar cards`);

  const readingDeckId = createId();
  await db.insert(schema.decks).values({
    id: readingDeckId,
    name: 'A1 Reading Snippets',
    description: 'Short reading passages for daily practice',
    cefrLevel: 'A1',
    module: 'READING',
  });

  const readingCards = [
    { front: 'Was ist richtig? "Die Bäckerei öffnet um 6 Uhr morgens und schließt um 18 Uhr."', back: 'Die Bäckerei ist 12 Stunden geöffnet.', context: 'Die Bäckerei am Marktplatz öffnet um 6 Uhr morgens und schließt um 18 Uhr. Am Sonntag ist sie geschlossen.', tags: ['reading', 'daily-life'] },
    { front: 'Richtig oder falsch? "Hans fährt mit dem Bus zur Arbeit." → Hans hat ein Auto.', back: 'Falsch – Hans fährt mit dem Bus.', context: 'Hans wohnt in der Stadtmitte. Er fährt jeden Tag mit dem Bus zur Arbeit.', tags: ['reading', 'transport'] },
    { front: 'Was macht Frau Müller am Samstag?', back: 'Sie geht auf den Markt und kauft Obst und Gemüse.', context: 'Frau Müller geht jeden Samstag auf den Markt. Sie kauft frisches Obst und Gemüse.', tags: ['reading', 'shopping'] },
  ];

  for (const c of readingCards) {
    await db.insert(schema.cards).values({
      deckId: readingDeckId,
      front: c.front,
      back: c.back,
      contextSentence: c.context,
      cefrLevel: 'A1',
      module: 'READING',
      tags: c.tags,
    });
  }
  console.log(`  ${readingCards.length} reading cards`);

  const templateId = createId();
  await db.insert(schema.examTemplates).values({
    id: templateId,
    title: 'Goethe-Zertifikat A1: Start Deutsch 1 – Mock Exam 1',
    cefrLevel: 'A1',
  });

  await db.insert(schema.examTemplateSections).values({
    templateId,
    section: 'LESEN',
    timeMinutes: 25,
    instructions: 'Read the following texts carefully and answer the questions. Choose the correct answer for each question.',
    maxScore: 25,
    sortOrder: 1,
    content: {
      passages: [
        {
          title: 'Nachricht von Maria',
          text: 'Liebe Anna,\n\nich bin jetzt in Berlin. Die Stadt ist sehr schön! Ich wohne bei meiner Freundin Petra. Sie hat eine große Wohnung in der Nähe vom Alexanderplatz. Morgen gehen wir zusammen ins Museum. Am Samstag fahre ich nach Potsdam.\n\nViele Grüße,\nMaria',
          questions: [
            { id: 'l1q1', text: 'Wo ist Maria jetzt?', options: ['In München', 'In Berlin', 'In Hamburg', 'In Potsdam'], type: 'multiple_choice', correctAnswer: 'In Berlin' },
            { id: 'l1q2', text: 'Bei wem wohnt Maria?', options: ['Bei Anna', 'Bei ihrer Mutter', 'Bei Petra', 'Im Hotel'], type: 'multiple_choice', correctAnswer: 'Bei Petra' },
            { id: 'l1q3', text: 'Was machen Maria und Petra morgen?', options: ['Sie fahren nach Potsdam', 'Sie gehen ins Museum', 'Sie gehen einkaufen', 'Sie kochen zusammen'], type: 'multiple_choice', correctAnswer: 'Sie gehen ins Museum' },
          ],
        },
        {
          title: 'Anzeige im Supermarkt',
          text: 'SONDERANGEBOT!\nDiese Woche im Supermarkt "Frisch & Gut":\n\n• Äpfel (1 kg) – 1,50 €\n• Milch (1 Liter) – 0,89 €\n• Brot (Vollkorn) – 2,30 €\n• Käse (200g) – 1,99 €\n\nÖffnungszeiten: Montag bis Samstag, 7:00–20:00 Uhr\nAdresse: Berliner Straße 42',
          questions: [
            { id: 'l2q1', text: 'Was kostet ein Kilo Äpfel?', options: ['0,89 €', '1,50 €', '1,99 €', '2,30 €'], type: 'multiple_choice', correctAnswer: '1,50 €' },
            { id: 'l2q2', text: 'Wann öffnet der Supermarkt?', options: ['Um 6:00 Uhr', 'Um 7:00 Uhr', 'Um 8:00 Uhr', 'Um 9:00 Uhr'], type: 'multiple_choice', correctAnswer: 'Um 7:00 Uhr' },
            { id: 'l2q3', text: 'Ist der Supermarkt am Sonntag geöffnet?', options: ['Ja', 'Nein'], type: 'true_false', correctAnswer: 'Nein' },
          ],
        },
      ],
    },
  });
  console.log('  Lesen section');

  await db.insert(schema.examTemplateSections).values({
    templateId,
    section: 'HOEREN',
    timeMinutes: 20,
    instructions: 'Listen to each audio clip carefully. You can replay each clip a limited number of times. Then answer the questions.',
    maxScore: 25,
    sortOrder: 2,
    content: {
      tasks: [
        {
          title: 'Ansage am Bahnhof',
          transcript: 'Achtung bitte! Der ICE dreihundertzweiundfünfzig nach München Hauptbahnhof, planmäßige Abfahrt vierzehn Uhr dreißig, hat heute circa fünfzehn Minuten Verspätung. Wir bitten um Entschuldigung. Der Zug fährt ab Gleis sieben.',
          maxReplays: 2,
          questions: [
            { id: 'h1q1', text: 'Wohin fährt der Zug?', options: ['Nach Berlin', 'Nach München', 'Nach Hamburg', 'Nach Frankfurt'], correctAnswer: 'Nach München' },
            { id: 'h1q2', text: 'Wie viel Verspätung hat der Zug?', options: ['5 Minuten', '10 Minuten', '15 Minuten', '30 Minuten'], correctAnswer: '15 Minuten' },
            { id: 'h1q3', text: 'Von welchem Gleis fährt der Zug ab?', options: ['Gleis 3', 'Gleis 5', 'Gleis 7', 'Gleis 9'], correctAnswer: 'Gleis 7' },
          ],
        },
        {
          title: 'Telefongespräch: Arzttermin',
          transcript: 'Guten Tag, hier ist die Praxis Doktor Weber. Guten Tag, mein Name ist Schmidt. Ich möchte bitte einen Termin machen. Natürlich, Herr Schmidt. Passt Ihnen Donnerstag um zehn Uhr? Donnerstag ist leider schlecht. Geht auch Freitag? Ja, Freitag um elf Uhr dreißig ist frei. Das passt gut. Vielen Dank! Gerne, bis Freitag!',
          maxReplays: 2,
          questions: [
            { id: 'h2q1', text: 'Wann bekommt Herr Schmidt einen Termin?', options: ['Donnerstag um 10:00', 'Freitag um 11:30', 'Mittwoch um 14:00', 'Montag um 9:00'], correctAnswer: 'Freitag um 11:30' },
            { id: 'h2q2', text: 'Warum nicht Donnerstag?', options: ['Der Arzt hat frei', 'Donnerstag passt Herrn Schmidt nicht', 'Die Praxis ist geschlossen', 'Es ist zu spät'], correctAnswer: 'Donnerstag passt Herrn Schmidt nicht' },
          ],
        },
      ],
    },
  });
  console.log('  Hören section');

  await db.insert(schema.examTemplateSections).values({
    templateId,
    section: 'SCHREIBEN',
    timeMinutes: 30,
    instructions: 'Write an email or short message based on the prompt below. Write at least 30 words. Include all the required points.',
    maxScore: 25,
    sortOrder: 3,
    content: {
      prompt: 'You have just moved to a new city (Berlin). Write an email to your friend Thomas. Tell him about your new apartment and your neighborhood.',
      hints: ['Describe your new apartment (rooms, size)', 'Tell about the neighborhood', 'Suggest a time when Thomas can visit you'],
      minWords: 30,
    },
  });
  console.log('  Schreiben section');

  await db.insert(schema.examTemplateSections).values({
    templateId,
    section: 'SPRECHEN',
    timeMinutes: 15,
    instructions: 'Have a conversation with the AI examiner. Respond in German.',
    maxScore: 25,
    sortOrder: 4,
    content: {
      task: 'Stellen Sie sich vor. Sagen Sie: Ihren Namen, wo Sie wohnen, was Sie arbeiten, und was Ihre Hobbys sind.',
      starterPrompt: 'Guten Tag! Willkommen zur mündlichen Prüfung. Bitte stellen Sie sich vor. Wie heißen Sie und wo kommen Sie her?',
    },
  });
  console.log('  Sprechen section');

  const total = vocabCards.length + grammarCards.length + readingCards.length;
  console.log(`\nSeeding complete! ${total} cards + 1 Goethe A1 mock exam\n`);
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
