/* Goethe-Zertifikat style exam structure definitions and pre-built static sets */

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: string;
}

export interface LesenPassage {
  title: string;
  text: string;
  questions: ExamQuestion[];
}

export interface HoerenDialogue {
  title: string;
  script: string;
  questions: ExamQuestion[];
}

export interface SchreibenPrompt {
  id: string;
  type: string;
  situation: string;
  task: string;
  points: string[];
  wordLimit: number;
}

export interface SprechenTask {
  id: string;
  type: string;
  topic: string;
  instructions: string;
  talkingPoints?: string[];
}

export interface ExamSetData {
  cefrLevel: string;
  setNumber: number;
  lesen: { passages: LesenPassage[] };
  hoeren: { dialogues: HoerenDialogue[] };
  schreiben: { prompts: SchreibenPrompt[] };
  sprechen: { tasks: SprechenTask[] };
  timeLimit: number;
  totalMarks: number;
}

export const EXAM_STRUCTURE: Record<string, {
  lesenTime: number; hoerenTime: number; schreibenTime: number; sprechenTime: number;
  lesenMarks: number; hoerenMarks: number; schreibenMarks: number; sprechenMarks: number;
  totalMarks: number; totalTime: number;
}> = {
  A1: { lesenTime: 25, hoerenTime: 20, schreibenTime: 20, sprechenTime: 15, lesenMarks: 25, hoerenMarks: 25, schreibenMarks: 25, sprechenMarks: 25, totalMarks: 100, totalTime: 80 },
  A2: { lesenTime: 30, hoerenTime: 20, schreibenTime: 30, sprechenTime: 15, lesenMarks: 25, hoerenMarks: 25, schreibenMarks: 25, sprechenMarks: 25, totalMarks: 100, totalTime: 95 },
  B1: { lesenTime: 65, hoerenTime: 40, schreibenTime: 60, sprechenTime: 15, lesenMarks: 25, hoerenMarks: 25, schreibenMarks: 25, sprechenMarks: 25, totalMarks: 100, totalTime: 180 },
  B2: { lesenTime: 80, hoerenTime: 45, schreibenTime: 75, sprechenTime: 15, lesenMarks: 25, hoerenMarks: 25, schreibenMarks: 25, sprechenMarks: 25, totalMarks: 100, totalTime: 215 },
};

let qCounter = 0;
function qid() { return `q_${++qCounter}_${Date.now().toString(36)}`; }

// ── A1 STATIC SETS ──────────────────────────────────────────────

const A1_SET_1: ExamSetData = {
  cefrLevel: 'A1', setNumber: 1, timeLimit: 80, totalMarks: 100,
  lesen: { passages: [
    {
      title: 'Anzeigen lesen – Kleinanzeigen',
      text: 'Anzeige 1: Schöne 2-Zimmer-Wohnung in Berlin-Mitte, 55 m², 650 € warm. Kontakt: 030-123456.\nAnzeige 2: Deutschkurs für Anfänger, Mo + Mi 18–20 Uhr, Volkshochschule Hamburg, 120 € pro Semester.\nAnzeige 3: Fahrrad zu verkaufen, rot, guter Zustand, 80 €. Tel: 0176-9876543.\nAnzeige 4: Babysitter gesucht, 2x pro Woche, Di + Do nachmittags. Anruf: 089-654321.\nAnzeige 5: Restaurant „Zum Löwen" sucht Kellner/in, Teilzeit, ab sofort. Bewerbung an info@zumloewen.de.',
      questions: [
        { id: qid(), text: 'Sie suchen eine Wohnung. Welche Anzeige ist richtig?', options: ['Anzeige 1', 'Anzeige 2', 'Anzeige 3', 'Anzeige 4'], correctAnswer: 'Anzeige 1', explanation: 'Anzeige 1 bietet eine Wohnung in Berlin-Mitte an.', type: 'multiple_choice' },
        { id: qid(), text: 'Sie möchten Deutsch lernen. Welche Anzeige passt?', options: ['Anzeige 1', 'Anzeige 2', 'Anzeige 3', 'Anzeige 5'], correctAnswer: 'Anzeige 2', explanation: 'Anzeige 2 bietet einen Deutschkurs für Anfänger an.', type: 'multiple_choice' },
        { id: qid(), text: 'Was kostet das Fahrrad?', options: ['55 €', '80 €', '120 €', '650 €'], correctAnswer: '80 €', explanation: 'Das Fahrrad in Anzeige 3 kostet 80 €.', type: 'multiple_choice' },
        { id: qid(), text: 'Wann braucht man den Babysitter?', options: ['Montag und Mittwoch', 'Dienstag und Donnerstag', 'Jeden Tag', 'Am Wochenende'], correctAnswer: 'Dienstag und Donnerstag', explanation: 'Der Babysitter wird Di + Do nachmittags gesucht.', type: 'multiple_choice' },
        { id: qid(), text: 'Das Restaurant sucht ...', options: ['einen Koch', 'einen Kellner', 'einen Babysitter', 'einen Lehrer'], correctAnswer: 'einen Kellner', explanation: 'Restaurant „Zum Löwen" sucht Kellner/in.', type: 'multiple_choice' },
      ],
    },
    {
      title: 'E-Mail lesen',
      text: 'Liebe Maria,\n\nwie geht es dir? Ich bin jetzt in München. Die Stadt ist sehr schön! Ich wohne bei meiner Tante. Sie hat eine große Wohnung. Morgen gehe ich in den Englischen Garten. Am Samstag besuche ich das Deutsche Museum. Kommst du mich besuchen? Das wäre toll!\n\nViele Grüße\nAnna',
      questions: [
        { id: qid(), text: 'Wo ist Anna jetzt?', options: ['Berlin', 'Hamburg', 'München', 'Köln'], correctAnswer: 'München', explanation: 'Anna schreibt: "Ich bin jetzt in München."', type: 'multiple_choice' },
        { id: qid(), text: 'Bei wem wohnt Anna?', options: ['Bei Maria', 'Bei ihrer Tante', 'Im Hotel', 'Bei Freunden'], correctAnswer: 'Bei ihrer Tante', explanation: '"Ich wohne bei meiner Tante."', type: 'multiple_choice' },
        { id: qid(), text: 'Was macht Anna morgen?', options: ['Sie besucht das Museum.', 'Sie geht in den Englischen Garten.', 'Sie fährt nach Berlin.', 'Sie geht einkaufen.'], correctAnswer: 'Sie geht in den Englischen Garten.', explanation: '"Morgen gehe ich in den Englischen Garten."', type: 'multiple_choice' },
        { id: qid(), text: 'Richtig oder Falsch: Anna findet München schön.', options: ['Richtig', 'Falsch'], correctAnswer: 'Richtig', explanation: '"Die Stadt ist sehr schön!"', type: 'true_false' },
        { id: qid(), text: 'Was möchte Anna am Samstag machen?', options: ['Schwimmen gehen', 'Das Deutsche Museum besuchen', 'Nach Hause fahren', 'Einen Deutschkurs besuchen'], correctAnswer: 'Das Deutsche Museum besuchen', explanation: '"Am Samstag besuche ich das Deutsche Museum."', type: 'multiple_choice' },
      ],
    },
  ]},
  hoeren: { dialogues: [
    {
      title: 'Im Café – Bestellung',
      script: 'Kellner: Guten Tag! Was möchten Sie bestellen?\nKunde: Ich hätte gern einen Kaffee und ein Stück Kuchen, bitte.\nKellner: Welchen Kuchen möchten Sie? Wir haben Apfelkuchen und Schokoladenkuchen.\nKunde: Apfelkuchen, bitte.\nKellner: Möchten Sie Sahne dazu?\nKunde: Ja, bitte. Was kostet das zusammen?\nKellner: Der Kaffee kostet 3,50 € und der Kuchen 4 €. Das sind 7,50 €.\nKunde: Hier bitte, 10 €.\nKellner: Danke, 2,50 € zurück. Guten Appetit!',
      questions: [
        { id: qid(), text: 'Was bestellt der Kunde?', options: ['Tee und Kuchen', 'Kaffee und Kuchen', 'Kaffee und Brötchen', 'Wasser und Kuchen'], correctAnswer: 'Kaffee und Kuchen', explanation: 'Der Kunde bestellt einen Kaffee und ein Stück Kuchen.', type: 'multiple_choice' },
        { id: qid(), text: 'Welchen Kuchen wählt der Kunde?', options: ['Schokoladenkuchen', 'Apfelkuchen', 'Käsekuchen', 'Erdbeerkuchen'], correctAnswer: 'Apfelkuchen', explanation: 'Der Kunde wählt Apfelkuchen.', type: 'multiple_choice' },
        { id: qid(), text: 'Wie viel kostet alles zusammen?', options: ['3,50 €', '4,00 €', '7,50 €', '10,00 €'], correctAnswer: '7,50 €', explanation: 'Kaffee 3,50 € + Kuchen 4 € = 7,50 €.', type: 'multiple_choice' },
        { id: qid(), text: 'Der Kunde möchte Sahne zum Kuchen.', options: ['Richtig', 'Falsch'], correctAnswer: 'Richtig', explanation: 'Der Kunde sagt "Ja, bitte" zur Sahne.', type: 'true_false' },
      ],
    },
    {
      title: 'Am Bahnhof – Fahrkarte kaufen',
      script: 'Reisender: Entschuldigung, wann fährt der nächste Zug nach Hamburg?\nMitarbeiter: Der nächste Zug nach Hamburg fährt um 14:30 Uhr von Gleis 7.\nReisender: Und wie lange dauert die Fahrt?\nMitarbeiter: Ungefähr drei Stunden. Sie sind um 17:30 Uhr in Hamburg.\nReisender: Gut. Eine Fahrkarte bitte, zweite Klasse, einfach.\nMitarbeiter: Das kostet 45 Euro. Möchten Sie einen Sitzplatz reservieren?\nReisender: Nein, danke.',
      questions: [
        { id: qid(), text: 'Wohin fährt der Reisende?', options: ['Nach Berlin', 'Nach München', 'Nach Hamburg', 'Nach Köln'], correctAnswer: 'Nach Hamburg', explanation: 'Der Reisende fragt nach dem Zug nach Hamburg.', type: 'multiple_choice' },
        { id: qid(), text: 'Von welchem Gleis fährt der Zug?', options: ['Gleis 3', 'Gleis 5', 'Gleis 7', 'Gleis 9'], correctAnswer: 'Gleis 7', explanation: 'Der Zug fährt von Gleis 7.', type: 'multiple_choice' },
        { id: qid(), text: 'Wie lange dauert die Fahrt?', options: ['Eine Stunde', 'Zwei Stunden', 'Drei Stunden', 'Vier Stunden'], correctAnswer: 'Drei Stunden', explanation: 'Die Fahrt dauert ungefähr drei Stunden.', type: 'multiple_choice' },
      ],
    },
  ]},
  schreiben: { prompts: [
    { id: qid(), type: 'informal_message', situation: 'Ihr Freund Thomas hat Geburtstag. Sie können leider nicht zur Party kommen.', task: 'Schreiben Sie eine Nachricht an Thomas.', points: ['Gratulieren Sie zum Geburtstag.', 'Sagen Sie, warum Sie nicht kommen können.', 'Machen Sie einen Vorschlag für ein anderes Treffen.'], wordLimit: 40 },
    { id: qid(), type: 'form', situation: 'Sie möchten sich für einen Deutschkurs anmelden.', task: 'Füllen Sie das Formular aus.', points: ['Name', 'Adresse', 'Geburtsdatum', 'Muttersprache', 'Warum lernen Sie Deutsch?'], wordLimit: 30 },
  ]},
  sprechen: { tasks: [
    { id: qid(), type: 'self_introduction', topic: 'Sich vorstellen', instructions: 'Stellen Sie sich vor. Sprechen Sie über sich selbst.', talkingPoints: ['Name', 'Alter', 'Land / Herkunft', 'Sprachen', 'Beruf / Studium', 'Hobby'] },
    { id: qid(), type: 'request', topic: 'Um etwas bitten / auf etwas reagieren', instructions: 'Sie sind in einer Sprachschule. Bitten Sie Ihren Partner um Information.', talkingPoints: ['Wann beginnt der Kurs?', 'Wie viel kostet er?', 'Wie viele Teilnehmer gibt es?'] },
    { id: qid(), type: 'picture_description', topic: 'Bildbeschreibung – Alltag', instructions: 'Beschreiben Sie das Thema "Ein typischer Tag". Erzählen Sie, was Sie normalerweise machen.', talkingPoints: ['Morgens', 'Mittags', 'Abends'] },
  ]},
};

const A1_SET_2: ExamSetData = {
  cefrLevel: 'A1', setNumber: 2, timeLimit: 80, totalMarks: 100,
  lesen: { passages: [
    {
      title: 'Öffnungszeiten und Informationen',
      text: 'Stadtbibliothek Köln\nÖffnungszeiten: Mo–Fr 9:00–18:00, Sa 10:00–14:00, So geschlossen\nAdresse: Hauptstraße 15, 50667 Köln\nInternet: kostenlos\nKinderbücher: 2. Stock\nDeutschkurse: jeden Mittwoch 16–18 Uhr (kostenlos)',
      questions: [
        { id: qid(), text: 'Wann ist die Bibliothek am Samstag geöffnet?', options: ['9:00–18:00', '10:00–14:00', '10:00–18:00', 'Geschlossen'], correctAnswer: '10:00–14:00', explanation: 'Samstag: 10:00–14:00 Uhr.', type: 'multiple_choice' },
        { id: qid(), text: 'Ist die Bibliothek am Sonntag geöffnet?', options: ['Ja', 'Nein'], correctAnswer: 'Nein', explanation: 'Sonntag: geschlossen.', type: 'true_false' },
        { id: qid(), text: 'Wo findet man Kinderbücher?', options: ['Im 1. Stock', 'Im 2. Stock', 'Im 3. Stock', 'Im Erdgeschoss'], correctAnswer: 'Im 2. Stock', explanation: 'Kinderbücher: 2. Stock.', type: 'multiple_choice' },
        { id: qid(), text: 'Wann ist der kostenlose Deutschkurs?', options: ['Montag', 'Dienstag', 'Mittwoch', 'Freitag'], correctAnswer: 'Mittwoch', explanation: 'Deutschkurse: jeden Mittwoch.', type: 'multiple_choice' },
        { id: qid(), text: 'Kostet das Internet in der Bibliothek etwas?', options: ['Ja, 2 €', 'Ja, 5 €', 'Nein, kostenlos', 'Es gibt kein Internet'], correctAnswer: 'Nein, kostenlos', explanation: 'Internet: kostenlos.', type: 'multiple_choice' },
      ],
    },
    {
      title: 'Kurze Nachricht',
      text: 'Hallo Sabine,\nich bin heute krank und kann nicht zum Unterricht kommen. Kannst du mir bitte die Hausaufgaben schicken? Meine E-Mail ist peter@mail.de. Am Montag bin ich wieder da.\nDanke und viele Grüße,\nPeter',
      questions: [
        { id: qid(), text: 'Warum schreibt Peter?', options: ['Er ist krank.', 'Er hat Geburtstag.', 'Er ist im Urlaub.', 'Er sucht eine Wohnung.'], correctAnswer: 'Er ist krank.', explanation: 'Peter schreibt: "ich bin heute krank".', type: 'multiple_choice' },
        { id: qid(), text: 'Was möchte Peter von Sabine?', options: ['Ein Geschenk', 'Die Hausaufgaben', 'Eine Telefonnummer', 'Ein Buch'], correctAnswer: 'Die Hausaufgaben', explanation: '"Kannst du mir bitte die Hausaufgaben schicken?"', type: 'multiple_choice' },
        { id: qid(), text: 'Wann kommt Peter zurück?', options: ['Heute', 'Morgen', 'Am Montag', 'Nächste Woche'], correctAnswer: 'Am Montag', explanation: '"Am Montag bin ich wieder da."', type: 'multiple_choice' },
        { id: qid(), text: 'Peter geht heute in den Unterricht.', options: ['Richtig', 'Falsch'], correctAnswer: 'Falsch', explanation: 'Peter kann nicht zum Unterricht kommen.', type: 'true_false' },
      ],
    },
  ]},
  hoeren: { dialogues: [
    {
      title: 'Beim Arzt – Termin machen',
      script: 'Empfang: Praxis Dr. Müller, guten Tag.\nPatientin: Guten Tag. Ich möchte bitte einen Termin machen.\nEmpfang: Was haben Sie für Beschwerden?\nPatientin: Ich habe seit drei Tagen Halsschmerzen und Husten.\nEmpfang: Können Sie morgen um 10 Uhr kommen?\nPatientin: 10 Uhr ist gut. Danke!\nEmpfang: Bitte bringen Sie Ihre Versichertenkarte mit. Auf Wiederhören.',
      questions: [
        { id: qid(), text: 'Was möchte die Patientin?', options: ['Ein Rezept abholen', 'Einen Termin machen', 'Ein Medikament kaufen', 'Den Arzt sprechen'], correctAnswer: 'Einen Termin machen', explanation: 'Sie möchte einen Termin machen.', type: 'multiple_choice' },
        { id: qid(), text: 'Was hat die Patientin?', options: ['Kopfschmerzen', 'Halsschmerzen und Husten', 'Bauchschmerzen', 'Fieber'], correctAnswer: 'Halsschmerzen und Husten', explanation: 'Sie hat Halsschmerzen und Husten.', type: 'multiple_choice' },
        { id: qid(), text: 'Wann ist der Termin?', options: ['Heute um 10', 'Morgen um 10', 'Morgen um 14', 'Übermorgen'], correctAnswer: 'Morgen um 10', explanation: 'Der Termin ist morgen um 10 Uhr.', type: 'multiple_choice' },
        { id: qid(), text: 'Was soll die Patientin mitbringen?', options: ['Ihr Handy', 'Ihre Versichertenkarte', 'Ihren Ausweis', 'Geld'], correctAnswer: 'Ihre Versichertenkarte', explanation: 'Sie soll die Versichertenkarte mitbringen.', type: 'multiple_choice' },
      ],
    },
    {
      title: 'Im Supermarkt',
      script: 'Kundin: Entschuldigung, wo finde ich die Milch?\nMitarbeiter: Die Milch ist in Gang 3, direkt neben dem Käse.\nKundin: Und haben Sie frisches Brot?\nMitarbeiter: Ja, die Bäckerei ist gleich links am Eingang. Wir haben heute Vollkornbrot im Angebot.\nKundin: Super, danke!',
      questions: [
        { id: qid(), text: 'Wo ist die Milch?', options: ['Gang 1', 'Gang 2', 'Gang 3', 'Gang 4'], correctAnswer: 'Gang 3', explanation: 'Die Milch ist in Gang 3.', type: 'multiple_choice' },
        { id: qid(), text: 'Neben welchem Produkt steht die Milch?', options: ['Neben dem Brot', 'Neben dem Käse', 'Neben dem Saft', 'Neben dem Joghurt'], correctAnswer: 'Neben dem Käse', explanation: 'Die Milch ist neben dem Käse.', type: 'multiple_choice' },
        { id: qid(), text: 'Was ist heute im Angebot?', options: ['Weißbrot', 'Vollkornbrot', 'Kuchen', 'Brötchen'], correctAnswer: 'Vollkornbrot', explanation: 'Vollkornbrot ist heute im Angebot.', type: 'multiple_choice' },
      ],
    },
  ]},
  schreiben: { prompts: [
    { id: qid(), type: 'informal_message', situation: 'Sie ziehen in eine neue Wohnung um. Schreiben Sie eine Nachricht an Ihren Freund / Ihre Freundin.', task: 'Schreiben Sie eine kurze Nachricht.', points: ['Informieren Sie über den Umzug.', 'Sagen Sie, wann Sie umziehen.', 'Bitten Sie um Hilfe.'], wordLimit: 40 },
    { id: qid(), type: 'form', situation: 'Sie möchten im Fitnessstudio Mitglied werden.', task: 'Füllen Sie das Anmeldeformular aus.', points: ['Name', 'Geburtsdatum', 'Telefonnummer', 'Welchen Sport möchten Sie machen?'], wordLimit: 30 },
  ]},
  sprechen: { tasks: [
    { id: qid(), type: 'self_introduction', topic: 'Über sich selbst sprechen', instructions: 'Stellen Sie sich vor.', talkingPoints: ['Name', 'Herkunft', 'Wohnort', 'Familie', 'Beruf', 'Hobbys'] },
    { id: qid(), type: 'request', topic: 'Im Restaurant', instructions: 'Sie sind im Restaurant. Bestellen Sie etwas und fragen Sie nach der Rechnung.', talkingPoints: ['Was möchten Sie essen?', 'Was möchten Sie trinken?', 'Fragen Sie nach dem Preis.'] },
    { id: qid(), type: 'picture_description', topic: 'Einkaufen', instructions: 'Erzählen Sie: Wo kaufen Sie ein? Was kaufen Sie? Wann gehen Sie einkaufen?', talkingPoints: ['Supermarkt / Markt', 'Lebensmittel', 'Häufigkeit'] },
  ]},
};

const A2_SET_1: ExamSetData = {
  cefrLevel: 'A2', setNumber: 1, timeLimit: 95, totalMarks: 100,
  lesen: { passages: [
    {
      title: 'Zeitungsartikel – Stadtfest',
      text: 'Das Heidelberger Stadtfest findet dieses Jahr vom 15. bis 17. Juni statt. Auf dem Marktplatz gibt es Live-Musik, Essen aus verschiedenen Ländern und ein Programm für Kinder. Am Samstagabend findet ein großes Feuerwerk statt. Der Eintritt ist frei. Die Straßenbahn fährt bis 2 Uhr nachts. Die Organisatoren erwarten mehr als 50.000 Besucher.',
      questions: [
        { id: qid(), text: 'Wann findet das Stadtfest statt?', options: ['10.–12. Juni', '15.–17. Juni', '20.–22. Juni', '1.–3. Juli'], correctAnswer: '15.–17. Juni', explanation: 'Das Stadtfest findet vom 15. bis 17. Juni statt.', type: 'multiple_choice' },
        { id: qid(), text: 'Was gibt es auf dem Marktplatz?', options: ['Nur Musik', 'Musik und internationales Essen', 'Nur ein Kinderprogramm', 'Einen Flohmarkt'], correctAnswer: 'Musik und internationales Essen', explanation: 'Es gibt Live-Musik und Essen aus verschiedenen Ländern.', type: 'multiple_choice' },
        { id: qid(), text: 'Wann ist das Feuerwerk?', options: ['Freitagabend', 'Samstagabend', 'Sonntagabend', 'Jeden Abend'], correctAnswer: 'Samstagabend', explanation: 'Am Samstagabend findet das Feuerwerk statt.', type: 'multiple_choice' },
        { id: qid(), text: 'Kostet das Fest Eintritt?', options: ['Ja, 5 €', 'Ja, 10 €', 'Nein, es ist frei', 'Nur für Kinder frei'], correctAnswer: 'Nein, es ist frei', explanation: 'Der Eintritt ist frei.', type: 'multiple_choice' },
        { id: qid(), text: 'Wie viele Besucher erwartet man?', options: ['5.000', '20.000', '50.000', '100.000'], correctAnswer: '50.000', explanation: 'Die Organisatoren erwarten mehr als 50.000 Besucher.', type: 'multiple_choice' },
      ],
    },
    {
      title: 'Wohnungsanzeige verstehen',
      text: 'Sehr geehrte Frau Klein,\n\nvielen Dank für Ihr Interesse an der 3-Zimmer-Wohnung in der Goethestraße 12. Die Wohnung ist 75 m² groß und hat einen Balkon. Die Miete beträgt 800 € warm, inklusive Nebenkosten. Haustiere sind leider nicht erlaubt. Die Wohnung ist ab dem 1. August frei. Bitte rufen Sie mich an für einen Besichtigungstermin: 0221-987654.\n\nMit freundlichen Grüßen\nHerr Wagner',
      questions: [
        { id: qid(), text: 'Wie groß ist die Wohnung?', options: ['55 m²', '65 m²', '75 m²', '85 m²'], correctAnswer: '75 m²', explanation: 'Die Wohnung ist 75 m² groß.', type: 'multiple_choice' },
        { id: qid(), text: 'Was kostet die Wohnung?', options: ['600 €', '700 €', '800 €', '900 €'], correctAnswer: '800 €', explanation: 'Die Miete beträgt 800 € warm.', type: 'multiple_choice' },
        { id: qid(), text: 'Darf man Haustiere haben?', options: ['Ja', 'Nein'], correctAnswer: 'Nein', explanation: 'Haustiere sind leider nicht erlaubt.', type: 'true_false' },
        { id: qid(), text: 'Ab wann ist die Wohnung frei?', options: ['Sofort', 'Ab 1. Juli', 'Ab 1. August', 'Ab 1. September'], correctAnswer: 'Ab 1. August', explanation: 'Die Wohnung ist ab dem 1. August frei.', type: 'multiple_choice' },
      ],
    },
  ]},
  hoeren: { dialogues: [
    {
      title: 'Telefonat – Arzttermin',
      script: 'Praxis: Praxis Dr. Schmidt, guten Tag.\nPatient: Guten Tag, hier ist Herr Becker. Ich muss leider meinen Termin am Donnerstag absagen. Ich bin geschäftlich in Frankfurt.\nPraxis: Kein Problem. Möchten Sie einen neuen Termin? Wie wäre es nächste Woche Montag um 9:30?\nPatient: Montag passt leider nicht. Geht Dienstag?\nPraxis: Ja, Dienstag um 11 Uhr ist noch frei.\nPatient: Perfekt, Dienstag um 11. Vielen Dank!\nPraxis: Gern geschehen. Auf Wiederhören.',
      questions: [
        { id: qid(), text: 'Warum ruft Herr Becker an?', options: ['Er möchte einen neuen Termin.', 'Er muss seinen Termin absagen.', 'Er hat Schmerzen.', 'Er braucht ein Rezept.'], correctAnswer: 'Er muss seinen Termin absagen.', explanation: 'Er muss seinen Termin am Donnerstag absagen.', type: 'multiple_choice' },
        { id: qid(), text: 'Warum kann Herr Becker am Donnerstag nicht kommen?', options: ['Er ist krank.', 'Er ist in Frankfurt.', 'Er arbeitet.', 'Er hat Urlaub.'], correctAnswer: 'Er ist in Frankfurt.', explanation: 'Er ist geschäftlich in Frankfurt.', type: 'multiple_choice' },
        { id: qid(), text: 'Wann ist der neue Termin?', options: ['Montag 9:30', 'Dienstag 11:00', 'Mittwoch 14:00', 'Donnerstag 10:00'], correctAnswer: 'Dienstag 11:00', explanation: 'Der neue Termin ist Dienstag um 11 Uhr.', type: 'multiple_choice' },
      ],
    },
    {
      title: 'Durchsage am Bahnhof',
      script: 'Achtung auf Gleis 4! Der ICE 578 nach Berlin Hauptbahnhof hat 20 Minuten Verspätung. Voraussichtliche Abfahrt: 15:40 Uhr. Wir bitten um Ihr Verständnis. Reisende nach Hannover können alternativ den RE 30 um 15:25 auf Gleis 2 nehmen.',
      questions: [
        { id: qid(), text: 'Wie viel Verspätung hat der ICE?', options: ['10 Minuten', '15 Minuten', '20 Minuten', '30 Minuten'], correctAnswer: '20 Minuten', explanation: 'Der ICE hat 20 Minuten Verspätung.', type: 'multiple_choice' },
        { id: qid(), text: 'Wohin fährt der ICE 578?', options: ['Hamburg', 'München', 'Berlin', 'Hannover'], correctAnswer: 'Berlin', explanation: 'Der ICE fährt nach Berlin Hauptbahnhof.', type: 'multiple_choice' },
        { id: qid(), text: 'Auf welchem Gleis ist der alternative Zug nach Hannover?', options: ['Gleis 2', 'Gleis 4', 'Gleis 6', 'Gleis 8'], correctAnswer: 'Gleis 2', explanation: 'Der RE 30 fährt auf Gleis 2.', type: 'multiple_choice' },
        { id: qid(), text: 'Der ICE fährt pünktlich.', options: ['Richtig', 'Falsch'], correctAnswer: 'Falsch', explanation: 'Der ICE hat 20 Minuten Verspätung.', type: 'true_false' },
      ],
    },
  ]},
  schreiben: { prompts: [
    { id: qid(), type: 'informal_email', situation: 'Sie waren am Wochenende auf einer Hochzeit. Schreiben Sie eine E-Mail an Ihren Freund / Ihre Freundin.', task: 'Schreiben Sie über die Hochzeit.', points: ['Wo war die Hochzeit?', 'Wie war das Essen?', 'Was haben Sie gemacht?', 'Was hat Ihnen besonders gefallen?'], wordLimit: 60 },
  ]},
  sprechen: { tasks: [
    { id: qid(), type: 'self_introduction', topic: 'Über die Familie sprechen', instructions: 'Erzählen Sie über Ihre Familie.', talkingPoints: ['Wie groß ist Ihre Familie?', 'Was machen Ihre Eltern?', 'Haben Sie Geschwister?', 'Was machen Sie gern zusammen?'] },
    { id: qid(), type: 'discussion', topic: 'Freizeit planen', instructions: 'Sie und Ihr Partner möchten am Wochenende etwas zusammen machen. Planen Sie gemeinsam.', talkingPoints: ['Was möchten Sie machen?', 'Wann treffen Sie sich?', 'Wo treffen Sie sich?'] },
  ]},
};

const B1_SET_1: ExamSetData = {
  cefrLevel: 'B1', setNumber: 1, timeLimit: 180, totalMarks: 100,
  lesen: { passages: [
    {
      title: 'Meinungsbeitrag – Homeoffice',
      text: 'Seit der Pandemie arbeiten viele Menschen von zu Hause aus. Für manche ist das ideal: Man spart Zeit, weil man nicht pendeln muss, und kann sich die Arbeitszeit flexibler einteilen. Andere vermissen den Kontakt mit Kollegen und haben Schwierigkeiten, Arbeit und Privatleben zu trennen. Studien zeigen, dass die Produktivität im Homeoffice oft steigt, aber auch die Gefahr der Isolation zunimmt. Experten empfehlen ein hybrides Modell: drei Tage im Büro und zwei Tage zu Hause. So profitieren Mitarbeiter von beiden Vorteilen.',
      questions: [
        { id: qid(), text: 'Was ist ein Vorteil des Homeoffice laut dem Text?', options: ['Man verdient mehr Geld.', 'Man spart Pendelzeit.', 'Man hat mehr Kollegen.', 'Man arbeitet weniger.'], correctAnswer: 'Man spart Pendelzeit.', explanation: '"Man spart Zeit, weil man nicht pendeln muss."', type: 'multiple_choice' },
        { id: qid(), text: 'Was zeigen Studien über die Produktivität im Homeoffice?', options: ['Sie sinkt immer.', 'Sie bleibt gleich.', 'Sie steigt oft.', 'Sie ist nicht messbar.'], correctAnswer: 'Sie steigt oft.', explanation: '"die Produktivität im Homeoffice oft steigt"', type: 'multiple_choice' },
        { id: qid(), text: 'Was empfehlen Experten?', options: ['Nur Homeoffice', 'Nur Büro', 'Ein hybrides Modell', 'Gar keine Empfehlung'], correctAnswer: 'Ein hybrides Modell', explanation: 'Experten empfehlen drei Tage Büro, zwei Tage Homeoffice.', type: 'multiple_choice' },
        { id: qid(), text: 'Im Homeoffice gibt es keine Nachteile.', options: ['Richtig', 'Falsch'], correctAnswer: 'Falsch', explanation: 'Der Text nennt Isolation und Schwierigkeiten bei der Trennung.', type: 'true_false' },
        { id: qid(), text: 'Ein Problem im Homeoffice ist laut Text ...', options: ['Die Miete', 'Die Isolation', 'Das Gehalt', 'Das Wetter'], correctAnswer: 'Die Isolation', explanation: '"die Gefahr der Isolation zunimmt"', type: 'multiple_choice' },
      ],
    },
    {
      title: 'Beschwerdebrief verstehen',
      text: 'Sehr geehrte Damen und Herren,\n\nam 5. März habe ich bei Ihnen online eine Kaffeemaschine bestellt (Bestellnummer: KM-2024-789). Die Lieferung kam am 12. März, aber leider ist das Gerät defekt. Es schaltet sich nach zwei Minuten automatisch aus. Ich habe bereits den Kundendienst angerufen, aber niemand konnte mir helfen. Ich bitte um einen kostenlosen Umtausch oder eine Rückerstattung des Kaufpreises (89,99 €). Bitte antworten Sie innerhalb von 14 Tagen.\n\nMit freundlichen Grüßen\nStefan Braun',
      questions: [
        { id: qid(), text: 'Was hat Herr Braun bestellt?', options: ['Einen Wasserkocher', 'Eine Kaffeemaschine', 'Einen Toaster', 'Eine Waschmaschine'], correctAnswer: 'Eine Kaffeemaschine', explanation: 'Er hat eine Kaffeemaschine bestellt.', type: 'multiple_choice' },
        { id: qid(), text: 'Was ist das Problem mit dem Gerät?', options: ['Es ist zu laut.', 'Es schaltet sich automatisch aus.', 'Es macht keinen Kaffee.', 'Es ist die falsche Farbe.'], correctAnswer: 'Es schaltet sich automatisch aus.', explanation: 'Das Gerät schaltet sich nach zwei Minuten aus.', type: 'multiple_choice' },
        { id: qid(), text: 'Was möchte Herr Braun?', options: ['Eine Reparatur', 'Umtausch oder Rückerstattung', 'Einen Gutschein', 'Ein neues Kabel'], correctAnswer: 'Umtausch oder Rückerstattung', explanation: 'Er bittet um Umtausch oder Rückerstattung.', type: 'multiple_choice' },
        { id: qid(), text: 'Wie viel hat die Kaffeemaschine gekostet?', options: ['69,99 €', '79,99 €', '89,99 €', '99,99 €'], correctAnswer: '89,99 €', explanation: 'Der Kaufpreis beträgt 89,99 €.', type: 'multiple_choice' },
      ],
    },
  ]},
  hoeren: { dialogues: [
    {
      title: 'Radiointerview – Studium in Deutschland',
      script: 'Moderator: Willkommen bei Radio Campus! Heute sprechen wir mit Maria aus Spanien. Maria, Sie studieren seit zwei Jahren in Freiburg. Wie war der Anfang?\nMaria: Am Anfang war es schwierig. Mein Deutsch war nicht so gut, und das Unisystem ist ganz anders als in Spanien. Aber meine Kommilitonen waren sehr nett und haben mir geholfen.\nModerator: Was gefällt Ihnen am besten am Studium hier?\nMaria: Die Seminare sind sehr interaktiv. In Spanien haben wir meistens nur Vorlesungen. Hier diskutiert man viel, und die Professoren kennen die Studenten persönlich.\nModerator: Und was vermissen Sie?\nMaria: Das Essen und meine Familie natürlich! Und das Wetter. In Freiburg regnet es doch ziemlich viel.',
      questions: [
        { id: qid(), text: 'Wie lange studiert Maria in Deutschland?', options: ['Ein Jahr', 'Zwei Jahre', 'Drei Jahre', 'Sechs Monate'], correctAnswer: 'Zwei Jahre', explanation: 'Maria studiert seit zwei Jahren in Freiburg.', type: 'multiple_choice' },
        { id: qid(), text: 'Was war am Anfang schwierig für Maria?', options: ['Die Miete', 'Ihr Deutsch und das Unisystem', 'Das Essen', 'Die Bibliothek'], correctAnswer: 'Ihr Deutsch und das Unisystem', explanation: 'Ihr Deutsch war nicht gut und das System anders.', type: 'multiple_choice' },
        { id: qid(), text: 'Was gefällt Maria an den Seminaren?', options: ['Sie sind kurz.', 'Sie sind interaktiv.', 'Sie sind auf Spanisch.', 'Es gibt keine Prüfungen.'], correctAnswer: 'Sie sind interaktiv.', explanation: 'Die Seminare sind sehr interaktiv.', type: 'multiple_choice' },
        { id: qid(), text: 'Was vermisst Maria?', options: ['Die Universität', 'Das Essen und ihre Familie', 'Die deutsche Sprache', 'Ihre Wohnung'], correctAnswer: 'Das Essen und ihre Familie', explanation: 'Sie vermisst das Essen und ihre Familie.', type: 'multiple_choice' },
        { id: qid(), text: 'In Freiburg regnet es viel.', options: ['Richtig', 'Falsch'], correctAnswer: 'Richtig', explanation: 'Maria sagt: "In Freiburg regnet es doch ziemlich viel."', type: 'true_false' },
      ],
    },
  ]},
  schreiben: { prompts: [
    { id: qid(), type: 'formal_email', situation: 'Sie haben einen Sprachkurs besucht und sind mit dem Lehrer nicht zufrieden. Schreiben Sie eine formelle Beschwerde an die Sprachschule.', task: 'Schreiben Sie eine formelle E-Mail.', points: ['Welchen Kurs haben Sie besucht?', 'Was war das Problem?', 'Was erwarten Sie als Lösung?'], wordLimit: 120 },
  ]},
  sprechen: { tasks: [
    { id: qid(), type: 'opinion', topic: 'Soziale Medien – Vor- und Nachteile', instructions: 'Äußern Sie Ihre Meinung zum Thema "Soziale Medien". Sprechen Sie über Vor- und Nachteile.', talkingPoints: ['Was sind Vorteile sozialer Medien?', 'Welche Probleme gibt es?', 'Wie nutzen Sie soziale Medien?', 'Sollten Kinder soziale Medien nutzen?'] },
    { id: qid(), type: 'discussion', topic: 'Einen Ausflug planen', instructions: 'Sie planen mit Ihrem Partner einen Wochenendausflug. Diskutieren Sie und finden Sie eine gemeinsame Lösung.', talkingPoints: ['Wohin möchten Sie fahren?', 'Was möchten Sie dort machen?', 'Wie kommen Sie dorthin?', 'Was nehmen Sie mit?'] },
  ]},
};

const B2_SET_1: ExamSetData = {
  cefrLevel: 'B2', setNumber: 1, timeLimit: 215, totalMarks: 100,
  lesen: { passages: [
    {
      title: 'Kommentar – Künstliche Intelligenz in der Bildung',
      text: 'Die Debatte um den Einsatz künstlicher Intelligenz in Schulen und Universitäten hat sich intensiviert. Befürworter argumentieren, dass KI-gestützte Lernplattformen individualisiertes Lernen ermöglichen und Lehrkräfte von repetitiven Aufgaben wie der Korrektur von Standardtests entlasten können. Kritiker hingegen warnen vor einer zunehmenden Abhängigkeit von Technologie und befürchten, dass fundamentale Fähigkeiten wie kritisches Denken und kreatives Schreiben verkümmern könnten. Besonders kontrovers wird die Nutzung von KI bei Prüfungen diskutiert: Wie lässt sich sicherstellen, dass Studierende eigenständig arbeiten? Die Bildungsministerin hat angekündigt, bis Ende des Jahres Richtlinien für den verantwortungsvollen Einsatz von KI an Schulen zu entwickeln.',
      questions: [
        { id: qid(), text: 'Was können KI-Lernplattformen laut Befürwortern ermöglichen?', options: ['Standardisiertes Lernen', 'Individualisiertes Lernen', 'Kostenloses Studium', 'Mehr Hausaufgaben'], correctAnswer: 'Individualisiertes Lernen', explanation: 'KI ermöglicht individualisiertes Lernen.', type: 'multiple_choice' },
        { id: qid(), text: 'Wovor warnen Kritiker?', options: ['Vor höheren Kosten', 'Vor Abhängigkeit von Technologie', 'Vor mehr Lehrkräften', 'Vor weniger Schulen'], correctAnswer: 'Vor Abhängigkeit von Technologie', explanation: 'Kritiker warnen vor zunehmender Abhängigkeit von Technologie.', type: 'multiple_choice' },
        { id: qid(), text: 'Welche Fähigkeiten könnten laut Kritikern leiden?', options: ['Sportliche Fähigkeiten', 'Mathematische Fähigkeiten', 'Kritisches Denken und kreatives Schreiben', 'Soziale Kompetenzen'], correctAnswer: 'Kritisches Denken und kreatives Schreiben', explanation: 'Kritisches Denken und kreatives Schreiben könnten verkümmern.', type: 'multiple_choice' },
        { id: qid(), text: 'Was hat die Bildungsministerin angekündigt?', options: ['KI zu verbieten', 'Richtlinien zu entwickeln', 'Mehr Geld für Schulen', 'Neue Prüfungsformate'], correctAnswer: 'Richtlinien zu entwickeln', explanation: 'Sie will Richtlinien für verantwortungsvollen KI-Einsatz entwickeln.', type: 'multiple_choice' },
        { id: qid(), text: 'Der Text befasst sich hauptsächlich mit KI im Arbeitsmarkt.', options: ['Richtig', 'Falsch'], correctAnswer: 'Falsch', explanation: 'Der Text befasst sich mit KI in der Bildung.', type: 'true_false' },
      ],
    },
    {
      title: 'Sachtext – Urbanisierung',
      text: 'Weltweit zieht es immer mehr Menschen in die Städte. Laut den Vereinten Nationen leben bereits 56 Prozent der Weltbevölkerung in urbanen Gebieten – Tendenz steigend. Bis 2050 könnte dieser Anteil auf 68 Prozent anwachsen. Diese Entwicklung stellt Städte vor enorme Herausforderungen: Wohnraum wird knapp und teuer, die Verkehrsinfrastruktur ist überlastet, und die Umweltbelastung nimmt zu. Gleichzeitig bieten Städte bessere Bildungs- und Berufschancen sowie kulturelle Vielfalt. Innovative Stadtplanungskonzepte wie "Smart Cities" versuchen, Technologie zu nutzen, um das städtische Leben effizienter und nachhaltiger zu gestalten.',
      questions: [
        { id: qid(), text: 'Wie viel Prozent der Weltbevölkerung leben derzeit in Städten?', options: ['36 %', '46 %', '56 %', '68 %'], correctAnswer: '56 %', explanation: '56 Prozent der Weltbevölkerung leben in urbanen Gebieten.', type: 'multiple_choice' },
        { id: qid(), text: 'Was ist KEIN im Text genanntes Problem der Urbanisierung?', options: ['Knappe Wohnungen', 'Überlasteter Verkehr', 'Sinkende Geburtenraten', 'Umweltbelastung'], correctAnswer: 'Sinkende Geburtenraten', explanation: 'Geburtenraten werden im Text nicht erwähnt.', type: 'multiple_choice' },
        { id: qid(), text: 'Was versuchen "Smart Cities" Konzepte?', options: ['Städte kleiner zu machen', 'Technologie für effizienteres Leben zu nutzen', 'Alle Menschen aufs Land zu bringen', 'Autos zu verbieten'], correctAnswer: 'Technologie für effizienteres Leben zu nutzen', explanation: '"Technologie zu nutzen, um das städtische Leben effizienter zu gestalten"', type: 'multiple_choice' },
      ],
    },
  ]},
  hoeren: { dialogues: [
    {
      title: 'Podiumsdiskussion – Klimawandel und Wirtschaft',
      script: 'Moderator: Die Frage lautet: Können Klimaschutz und wirtschaftliches Wachstum koexistieren?\nDr. Fischer: Absolut. Die Transformation hin zu erneuerbaren Energien schafft neue Arbeitsplätze. Deutschland hat bereits über 300.000 Jobs im Bereich erneuerbare Energien geschaffen. Wir müssen die Wirtschaft nicht schrumpfen lassen, sondern umbauen.\nFrau Lehmann: Das klingt theoretisch gut, aber die Realität sieht anders aus. Viele Unternehmen, besonders im Mittelstand, können sich die Umstellung nicht leisten. Die Energiekosten sind bereits zu hoch.\nDr. Fischer: Deshalb brauchen wir staatliche Förderprogramme und Anreize. Die Kosten für Solarenergie sind in den letzten zehn Jahren um 90 Prozent gefallen.\nModerator: Und die Verbraucher? Sind die bereit, mehr zu zahlen?\nFrau Lehmann: Umfragen zeigen: Ja, aber nur begrenzt. Die Akzeptanz sinkt, wenn es den eigenen Geldbeutel stark belastet.',
      questions: [
        { id: qid(), text: 'Was ist Dr. Fischers Position?', options: ['Klimaschutz und Wirtschaft sind unvereinbar.', 'Die Wirtschaft muss schrumpfen.', 'Die Transformation schafft neue Jobs.', 'Erneuerbare Energien sind zu teuer.'], correctAnswer: 'Die Transformation schafft neue Jobs.', explanation: 'Dr. Fischer sagt, die Transformation schafft neue Arbeitsplätze.', type: 'multiple_choice' },
        { id: qid(), text: 'Was kritisiert Frau Lehmann?', options: ['Dass es zu viele Jobs gibt.', 'Dass die Umstellung zu teuer für viele Unternehmen ist.', 'Dass der Staat zu viel hilft.', 'Dass Solarenergie zu billig ist.'], correctAnswer: 'Dass die Umstellung zu teuer für viele Unternehmen ist.', explanation: 'Viele Unternehmen können sich die Umstellung nicht leisten.', type: 'multiple_choice' },
        { id: qid(), text: 'Um wie viel Prozent sind die Kosten für Solarenergie gefallen?', options: ['50 %', '70 %', '80 %', '90 %'], correctAnswer: '90 %', explanation: 'Die Kosten sind um 90 Prozent gefallen.', type: 'multiple_choice' },
        { id: qid(), text: 'Verbraucher sind bereit, unbegrenzt mehr zu zahlen.', options: ['Richtig', 'Falsch'], correctAnswer: 'Falsch', explanation: 'Die Akzeptanz sinkt, wenn es den Geldbeutel stark belastet.', type: 'true_false' },
      ],
    },
  ]},
  schreiben: { prompts: [
    { id: qid(), type: 'argumentation', situation: 'In Ihrer Stadt wird diskutiert, ob Autos aus der Innenstadt verbannt werden sollten.', task: 'Schreiben Sie einen Diskussionsbeitrag für das Stadtmagazin.', points: ['Nehmen Sie Stellung zu dem Vorschlag.', 'Nennen Sie Argumente für und gegen ein Autoverbot.', 'Geben Sie ein Beispiel aus Ihrer Erfahrung.', 'Formulieren Sie Ihren eigenen Vorschlag.'], wordLimit: 200 },
  ]},
  sprechen: { tasks: [
    { id: qid(), type: 'presentation', topic: 'Digitalisierung des Alltags', instructions: 'Halten Sie einen kurzen Vortrag zum Thema. Gehen Sie auf die folgenden Punkte ein.', talkingPoints: ['Wie hat die Digitalisierung Ihren Alltag verändert?', 'Welche Vorteile und Risiken sehen Sie?', 'Wie ist die Situation in Ihrem Heimatland?', 'Wie sieht Ihre persönliche Meinung aus?'] },
    { id: qid(), type: 'discussion', topic: 'Ehrenamtliche Arbeit', instructions: 'Diskutieren Sie mit Ihrem Partner über ehrenamtliche Arbeit. Tauschen Sie Ihre Meinungen aus und versuchen Sie, einen Kompromiss zu finden.', talkingPoints: ['Sollte ehrenamtliche Arbeit Pflicht sein?', 'Welche Vorteile hat ehrenamtliches Engagement?', 'Was könnte man in der eigenen Stadt verbessern?'] },
  ]},
};

export const STATIC_SETS: ExamSetData[] = [
  A1_SET_1, A1_SET_2,
  A2_SET_1,
  B1_SET_1,
  B2_SET_1,
];

export function getStaticSet(level: string, setNumber: number): ExamSetData | undefined {
  return STATIC_SETS.find(s => s.cefrLevel === level && s.setNumber === setNumber);
}
