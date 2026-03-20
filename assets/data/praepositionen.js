export const praepositionen = [
  // --- WECHSELPRAEPOSITIONEN (Top 3) ---
  {
    prep: "in",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          "Städte, Kontinente (in München, in Asien)",
          "Länder mit Artikel (in der Türkei, in den USA)",
          "Natur, Umgebung (im Wald, in den Bergen)",
          "Geschlossene Räume, Gebäude (in der Schule, im Haus)",
          "Straßen (in der Parkstraße)"
        ],
        time: [
          "Monate (im Januar)",
          "Jahreszeiten (im Sommer)",
          "Jahrhunderte (im 20. Jahrhundert)",
          "Zeitraum (in der Nacht, in den Ferien)",
          "Zukunft (in einer Woche, in 5 Minuten)"
        ]
      },
      {
        case: "AKK",
        space: [
          "Bewegung in ein Gebäude (ins Kino gehen)",
          "Bewegung in die Natur (in den Park gehen)",
          "Bewegung in ein Land (in die Schweiz fliegen)"
        ],
        time: [] // Usually DAT for time with 'in' (future is Dat: in einer Woche)
      }
    ],
    verbFixed: ["sich verlieben", "geraten", "einsteigen"],
    adjFixed: ["verliebt", "erfahren"]
  },
  {
    prep: "an",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          "Gewässer (am Meer, am Fluss)",
          "Vertikale Flächen (an der Wand)",
          "Grenzlinien, Rand (an der Grenze)",
          "Bestimmte Plätze (am Bahnhof, am Flughafen)"
        ],
        time: [
          "Tage (am Montag)",
          "Tageszeiten (am Abend)",
          "Datum (am 15. Mai)",
          "Feiertage (an Weihnachten)"
        ]
      },
      {
        case: "AKK",
        space: [
          "Bewegung an ein Gewässer (ans Meer fahren)",
          "Bewegung an eine Fläche (das Bild an die Wand hängen)"
        ],
        time: []
      }
    ],
    verbFixed: ["denken", "sich erinnern", "teilnehmen", "glauben"],
    adjFixed: ["interessiert", "gewöhnt", "reich"]
  },
  {
    prep: "auf",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          "Horizontale Flächen (auf dem Tisch, auf dem Boden)",
          "Öffentliche Gebäude (auf der Post, auf der Bank)",
          "Veranstaltungen (auf der Party, auf der Hochzeit)",
          "Inseln (auf Sylt)"
        ],
        time: [] // 'auf' time is rare/fixed
      },
      {
        case: "AKK",
        space: [
          "Bewegung auf eine Fläche (auf den Berg steigen)",
          "Bewegung auf eine Insel (auf eine Insel fahren)"
        ],
        time: [
          "Dauer (auf eine Woche)",
          "Zeitpunkt (auf den Abend verschieben)"
        ]
      }
    ],
    verbFixed: ["warten", "sich freuen (Zukunft)", "hoffen", "achten"],
    adjFixed: ["stolz", "neidisch", "eifersüchtig", "gespannt"]
  },

  // --- STANDARD (Top 2) ---
  {
    prep: "mit",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [], // 'mit' rarely strictly local in basic sense
        time: [
          "Beginn/Alter (mit 18 Jahren)",
          "Gleichzeitigkeit (mit der Zeit)"
        ]
      }
    ],
    verbFixed: ["sprechen", "telefonieren", "anfangen", "rechnen"],
    adjFixed: ["zufrieden", "verwandt", "fertig", "einverstanden"]
  },
  {
    prep: "für",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [],
        time: [
          "Zeitspanne (für drei Tage)",
          "Zukunft (für immer)"
        ]
      }
    ],
    verbFixed: ["sich interessieren", "danken", "sich entscheiden", "sorgen"],
    adjFixed: ["zuständig", "bekannt", "wichtig", "geeignet"]
  }
];
