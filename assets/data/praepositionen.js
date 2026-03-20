export const praepositionen = [
  // --- WECHSELPRAEPOSITIONEN ---
  {
    prep: "in",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Städte, Kontinente", ex: "Ich wohne <b>in München</b>." },
          { rule: "Länder mit Artikel", ex: "Er lebt <b>in der Türkei</b>." },
          { rule: "Natur, Umgebung", ex: "Wir spazieren <b>im Wald</b>." },
          { rule: "Geschlossene Räume", ex: "Wir sitzen <b>im Kino</b>." }
        ],
        time: [
          { rule: "Monate, Jahreszeiten", ex: "<b>Im Sommer</b> ist es heiß." },
          { rule: "Jahrhunderte", ex: "Das war <b>im 20. Jahrhundert</b>." },
          { rule: "Zukunft (Zeitraum)", ex: "Ich komme <b>in einer Woche</b>." }
        ],
        verbFixed: [
          "Das Flugzeug <b>kommt in Berlin an</b>."
        ],
        adjFixed: [
          "Er ist <b>in der Politik erfahren</b>."
        ]
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung in ein Gebäude", ex: "Wir gehen <b>ins Kino</b>." },
          { rule: "Bewegung in die Natur", ex: "Sie geht <b>in den Park</b>." },
          { rule: "Bewegung in ein Land", ex: "Wir fliegen <b>in die Schweiz</b>." }
        ],
        time: [], 
        verbFixed: [
          "Sie hat <b>sich in ihn verliebt</b>.",
          "Er <b>steigt in den Bus ein</b>."
        ],
        adjFixed: [
          "Ich bin <b>in dich verliebt</b>."
        ]
      }
    ]
  },
  {
    prep: "an",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Gewässer (Wasser)", ex: "Wir liegen <b>am Strand</b>." },
          { rule: "Vertikale Flächen", ex: "Das Bild hängt <b>an der Wand</b>." },
          { rule: "Plätze / Orte", ex: "Wir warten <b>am Bahnhof</b>." }
        ],
        time: [
          { rule: "Tage, Tageszeiten", ex: "<b>Am Montag</b> habe ich frei." },
          { rule: "Datum", ex: "<b>Am 15. Mai</b> ist mein Geburtstag." }
        ],
        verbFixed: [
          "Wir <b>nehmen am Kurs teil</b>."
        ],
        adjFixed: [
          "Er ist <b>an Musik interessiert</b>."
        ]
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung an ein Gewässer", ex: "Wir fahren <b>ans Meer</b>." },
          { rule: "Bewegung an eine Fläche", ex: "Er hängt das Bild <b>an die Wand</b>." }
        ],
        time: [],
        verbFixed: [
          "Ich <b>denke an dich</b>.",
          "Ich <b>erinnere mich an den Urlaub</b>."
        ],
        adjFixed: [
          "Ich bin <b>an das Klima gewöhnt</b>."
        ]
      }
    ]
  },
  {
    prep: "auf",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Horizontale Flächen", ex: "Das Buch liegt <b>auf dem Tisch</b>." },
          { rule: "Öffentliche Gebäude", ex: "Ich bin <b>auf der Post</b>." }
        ],
        time: [],
        verbFixed: [
          "Die Entscheidung <b>basiert auf Fakten</b>."
        ],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung auf eine Fläche", ex: "Leg das Buch <b>auf den Tisch</b>." }
        ],
        time: [
          { rule: "Zeitdauer (Zukunft)", ex: "Er geht <b>auf eine Woche</b> weg." }
        ],
        verbFixed: [
          "Wir <b>warten auf den Bus</b>.",
          "Ich <b>freue mich auf den Urlaub</b>."
        ],
        adjFixed: [
          "Sie ist <b>stolz auf ihren Sohn</b>.",
          "Er ist <b>neidisch auf deinen Erfolg</b>."
        ]
      }
    ]
  },

  // --- STANDARD ---
  {
    prep: "mit",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [], 
        time: [
          { rule: "Alter / Zeitpunkt", ex: "<b>Mit 18 Jahren</b> darf man wählen." }
        ],
        verbFixed: [
          "Ich <b>spreche mit meinem Chef</b>.",
          "Wir <b>fangen mit dem Essen an</b>."
        ],
        adjFixed: [
          "Ich bin <b>mit dem Ergebnis zufrieden</b>.",
          "Sind Sie <b>damit einverstanden</b>?"
        ]
      }
    ]
  },
  {
    prep: "für",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [],
        time: [
          { rule: "Zeitspanne", ex: "Er bleibt <b>für drei Tage</b>." }
        ],
        verbFixed: [
          "Ich <b>interessiere mich für Kunst</b>.",
          "Ich <b>danke dir für die Hilfe</b>."
        ],
        adjFixed: [
          "Das ist <b>wichtig für mich</b>.",
          "Er ist <b>für den Schaden verantwortlich</b>."
        ]
      }
    ]
  }
];
