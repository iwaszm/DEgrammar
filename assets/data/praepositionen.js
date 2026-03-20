const HL_DAT = "text-green-700 font-bold";
const HL_AKK = "text-blue-700 font-bold";
const HL_GEN = "text-yellow-700 font-bold";

export const praepositionen = [
  // --- A ---
  {
    prep: "an",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Gewässer (Wasser)", ex: `Wir liegen <span class="${HL_DAT}">am Strand</span>.` },
          { rule: "Vertikale Flächen", ex: `Das Bild hängt <span class="${HL_DAT}">an der Wand</span>.` },
          { rule: "Plätze / Orte", ex: `Wir warten <span class="${HL_DAT}">am Bahnhof</span>.` },
          { rule: "Grenzlinien", ex: `Die Stadt liegt <span class="${HL_DAT}">an der Grenze</span>.` }
        ],
        time: [
          { rule: "Tage, Tageszeiten", ex: `<span class="${HL_DAT}">Am Montag</span> habe ich frei.` },
          { rule: "Datum", ex: `<span class="${HL_DAT}">Am 15. Mai</span> ist mein Geburtstag.` },
          { rule: "Feiertage", ex: `<span class="${HL_DAT}">An Weihnachten</span> besuchen wir Oma.` }
        ],
        verbFixed: [
          `Wir <span class="${HL_DAT}">nehmen am Kurs teil</span>.`,
          `Es <span class="${HL_DAT}">mangelt an Geld</span>.`
        ],
        adjFixed: [
          `Er ist <span class="${HL_DAT}">an Musik interessiert</span>.`,
          `Die Stadt ist <span class="${HL_DAT}">reich an Kultur</span>.`
        ]
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung an ein Gewässer", ex: `Wir fahren <span class="${HL_AKK}">ans Meer</span>.` },
          { rule: "Bewegung an eine Fläche", ex: `Er hängt das Bild <span class="${HL_AKK}">an die Wand</span>.` }
        ],
        time: [],
        verbFixed: [
          `Ich <span class="${HL_AKK}">denke oft an dich</span>.`,
          `Ich <span class="${HL_AKK}">erinnere mich an den Urlaub</span>.`,
          `Ich <span class="${HL_AKK}">glaube an dich</span>.`
        ],
        adjFixed: [
          `Ich bin <span class="${HL_AKK}">an das Klima gewöhnt</span>.`
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
          { rule: "Horizontale Flächen", ex: `Das Buch liegt <span class="${HL_DAT}">auf dem Tisch</span>.` },
          { rule: "Öffentliche Gebäude", ex: `Ich bin <span class="${HL_DAT}">auf der Post</span>.` },
          { rule: "Veranstaltungen", ex: `Wir sind <span class="${HL_DAT}">auf einer Party</span>.` },
          { rule: "Inseln", ex: `Wir machen Urlaub <span class="${HL_DAT}">auf Sylt</span>.` }
        ],
        time: [],
        verbFixed: [
          `Die Entscheidung <span class="${HL_DAT}">basiert auf Fakten</span>.`
        ],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung auf eine Fläche", ex: `Leg das Buch <span class="${HL_AKK}">auf den Tisch</span>.` },
          { rule: "Bewegung auf eine Insel", ex: `Wir fahren <span class="${HL_AKK}">auf eine Insel</span>.` }
        ],
        time: [
          { rule: "Zeitdauer (Zukunft)", ex: `Er geht <span class="${HL_AKK}">auf eine Woche</span> weg.` }
        ],
        verbFixed: [
          `Wir <span class="${HL_AKK}">warten auf den Bus</span>.`,
          `Ich <span class="${HL_AKK}">freue mich auf den Urlaub</span>.`,
          `Wir <span class="${HL_AKK}">hoffen auf besseres Wetter</span>.`,
          `Bitte <span class="${HL_AKK}">achten Sie auf die Stufe</span>.`
        ],
        adjFixed: [
          `Sie ist <span class="${HL_AKK}">stolz auf ihren Sohn</span>.`,
          `Er ist <span class="${HL_AKK}">neidisch auf deinen Erfolg</span>.`,
          `Ich bin <span class="${HL_AKK}">gespannt auf das Ergebnis</span>.`
        ]
      }
    ]
  },
  {
    prep: "aus",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Herkunft (Land/Stadt)", ex: `Ich komme <span class="${HL_DAT}">aus Spanien</span>.` },
          { rule: "Herausbewegung (geschl. Raum)", ex: `Er kommt <span class="${HL_DAT}">aus dem Haus</span>.` }
        ],
        time: [],
        verbFixed: [
          `Der Tisch <span class="${HL_DAT}">besteht aus Holz</span>.`
        ],
        adjFixed: []
      }
    ]
  },
  {
    prep: "außer",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [], 
        time: [],
        verbFixed: [
          `Das Gerät ist <span class="${HL_DAT}">außer Betrieb</span>.`
        ],
        adjFixed: []
      }
    ]
  },
  {
    prep: "außerhalb",
    isWechsel: false,
    modes: [
      {
        case: "GEN",
        space: [{ rule: "Draußen / Jenseits von", ex: `Wir wohnen <span class="${HL_GEN}">außerhalb der Stadt</span>.` }],
        time: [{ rule: "Außerhalb eines Zeitraums", ex: `Bitte nicht <span class="${HL_GEN}">außerhalb der Öffnungszeiten</span> anrufen.` }],
        verbFixed: [], adjFixed: []
      }
    ]
  },

  // --- B ---
  {
    prep: "bei",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Personen / Firmen", ex: `Ich bin <span class="${HL_DAT}">beim Arzt</span>.` },
          { rule: "Nähe (in der Nähe von)", ex: `Potsdam liegt <span class="${HL_DAT}">bei Berlin</span>.` }
        ],
        time: [
          { rule: "Gleichzeitigkeit", ex: `<span class="${HL_DAT}">Beim Essen</span> sprechen wir nicht.` }
        ],
        verbFixed: [
          `Ich <span class="${HL_DAT}">entschuldige mich bei dir</span>.`,
          `Er <span class="${HL_DAT}">beklagt sich bei dem Chef</span>.`
        ],
        adjFixed: [
          `Er ist <span class="${HL_DAT}">beliebt bei seinen Kollegen</span>.`
        ]
      }
    ]
  },
  {
    prep: "bis",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [
          { rule: "Endpunkt", ex: `Wir fahren <span class="${HL_AKK}">bis Hamburg</span>.` }
        ],
        time: [
          { rule: "Endzeitpunkt", ex: `Ich arbeite <span class="${HL_AKK}">bis 17 Uhr</span>.` }
        ],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },
  {
    prep: "bis an",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [{ rule: "Endpunkt (Grenze)", ex: `Das Wasser steht <span class="${HL_AKK}">bis an den Hals</span>.` }],
        time: [],
        verbFixed: [], adjFixed: []
      }
    ]
  },
  {
    prep: "bis auf",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [],
        time: [],
        verbFixed: [],
        adjFixed: [],
        space: [{ rule: "Ausnahme (Except)", ex: `Alle <span class="${HL_AKK}">bis auf dich</span>.` }]
      }
    ]
  },
  {
    prep: "bis zu",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [{ rule: "Endpunkt (mit Artikel)", ex: `Wir fahren <span class="${HL_DAT}">bis zum Bahnhof</span>.` }],
        time: [{ rule: "Endzeitpunkt", ex: `<span class="${HL_DAT}">Bis zum Ende</span>.` }],
        verbFixed: [], adjFixed: []
      }
    ]
  },

  // --- D ---
  {
    prep: "durch",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [
          { rule: "Durchquerung", ex: `Wir gehen <span class="${HL_AKK}">durch den Wald</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },

  // --- E ---
  {
    prep: "entlang",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [
          { rule: "Parallelbewegung (nachgestellt)", ex: `Wir gehen <span class="${HL_AKK}">den Fluss entlang</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },

  // --- F ---
  {
    prep: "für",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [],
        time: [
          { rule: "Zeitspanne / Dauer", ex: `Er bleibt <span class="${HL_AKK}">für drei Tage</span>.` }
        ],
        verbFixed: [
          `Ich <span class="${HL_AKK}">interessiere mich für Kunst</span>.`,
          `Ich <span class="${HL_AKK}">danke dir für die Hilfe</span>.`,
          `Er <span class="${HL_AKK}">entscheidet sich für das Auto</span>.`
        ],
        adjFixed: [
          `Das ist <span class="${HL_AKK}">wichtig für mich</span>.`,
          `Er ist <span class="${HL_AKK}">für den Schaden verantwortlich</span>.`,
          `Das ist <span class="${HL_AKK}">typisch für ihn</span>.`
        ]
      }
    ]
  },

  // --- G ---
  {
    prep: "gegen",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [
          { rule: "Bewegung/Aufprall", ex: `Er fährt <span class="${HL_AKK}">gegen den Baum</span>.` }
        ],
        time: [
          { rule: "Ungefähre Zeit", ex: `Wir kommen <span class="${HL_AKK}">gegen 8 Uhr</span>.` }
        ],
        verbFixed: [
          `Wir <span class="${HL_AKK}">protestieren gegen das Gesetz</span>.`
        ],
        adjFixed: [
          `Ich bin <span class="${HL_AKK}">allergisch gegen Nüsse</span>.`
        ]
      }
    ]
  },
  {
    prep: "gegenüber",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Gegenüberliegend (nachgestellt)", ex: `Die Post ist <span class="${HL_DAT}">dem Bahnhof gegenüber</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: [
          `Er ist <span class="${HL_DAT}">gegenüber Fremden offen</span>.`
        ]
      }
    ]
  },

  // --- H ---
  {
    prep: "hinter",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Position (Wo?)", ex: `Das Auto steht <span class="${HL_DAT}">hinter dem Haus</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung (Wohin?)", ex: `Er läuft <span class="${HL_AKK}">hinter das Haus</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },

  // --- I ---
  {
    prep: "in",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Städte, Kontinente", ex: `Ich wohne <span class="${HL_DAT}">in München</span>.` },
          { rule: "Länder mit Artikel", ex: `Er lebt <span class="${HL_DAT}">in der Türkei</span>.` },
          { rule: "Natur, Umgebung", ex: `Wir spazieren <span class="${HL_DAT}">im Wald</span>.` },
          { rule: "Geschlossene Räume", ex: `Wir sitzen <span class="${HL_DAT}">im Kino</span>.` },
          { rule: "Straßen", ex: `Ich wohne <span class="${HL_DAT}">in der Parkstraße</span>.` }
        ],
        time: [
          { rule: "Monate, Jahreszeiten", ex: `<span class="${HL_DAT}">Im Sommer</span> ist es heiß.` },
          { rule: "Jahrhunderte", ex: `Das war <span class="${HL_DAT}">im 20. Jahrhundert</span>.` },
          { rule: "Zukunft (Zeitraum)", ex: `Ich komme <span class="${HL_DAT}">in einer Woche</span>.` }
        ],
        verbFixed: [
          `Das Flugzeug <span class="${HL_DAT}">kommt in Berlin an</span>.`
        ],
        adjFixed: [
          `Er ist <span class="${HL_DAT}">in der Politik erfahren</span>.`
        ]
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung in ein Gebäude", ex: `Wir gehen <span class="${HL_AKK}">ins Kino</span>.` },
          { rule: "Bewegung in die Natur", ex: `Sie geht <span class="${HL_AKK}">in den Park</span>.` },
          { rule: "Bewegung in ein Land", ex: `Wir fliegen <span class="${HL_AKK}">in die Schweiz</span>.` }
        ],
        time: [], 
        verbFixed: [
          `Sie hat <span class="${HL_AKK}">sich in ihn verliebt</span>.`,
          `Er <span class="${HL_AKK}">steigt in den Bus ein</span>.`,
          `Wir <span class="${HL_AKK}">geraten in Panik</span>.`
        ],
        adjFixed: [
          `Ich bin <span class="${HL_AKK}">in dich verliebt</span>.`
        ]
      }
    ]
  },
  {
    prep: "innerhalb",
    isWechsel: false,
    modes: [
      {
        case: "GEN",
        space: [{ rule: "Drinnen / Im Bereich von", ex: `Bleiben Sie <span class="${HL_GEN}">innerhalb des Gebäudes</span>.` }],
        time: [{ rule: "Innerhalb einer Frist", ex: `Zahlen Sie <span class="${HL_GEN}">innerhalb eines Monats</span>.` }],
        verbFixed: [], adjFixed: []
      }
    ]
  },

  // --- M ---
  {
    prep: "mit",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [], 
        time: [
          { rule: "Alter / Zeitpunkt", ex: `<span class="${HL_DAT}">Mit 18 Jahren</span> darf man wählen.` }
        ],
        verbFixed: [
          `Ich <span class="${HL_DAT}">spreche mit meinem Chef</span>.`,
          `Wir <span class="${HL_DAT}">fangen mit dem Essen an</span>.`,
          `Ich <span class="${HL_DAT}">telefoniere mit meiner Mutter</span>.`,
          `Wir <span class="${HL_DAT}">rechnen mit dem Schlimmsten</span>.`
        ],
        adjFixed: [
          `Ich bin <span class="${HL_DAT}">mit dem Ergebnis zufrieden</span>.`,
          `Sind Sie <span class="${HL_DAT}">damit einverstanden</span>?`,
          `Er ist <span class="${HL_DAT}">mit ihr verwandt</span>.`,
          `Ich bin <span class="${HL_DAT}">mit der Arbeit fertig</span>.`
        ]
      }
    ]
  },

  // --- N ---
  {
    prep: "nach",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Städte/Länder (ohne Artikel)", ex: `Wir fliegen <span class="${HL_DAT}">nach Berlin</span>.` },
          { rule: "Richtung (Hause/Links/Rechts)", ex: `Ich gehe <span class="${HL_DAT}">nach Hause</span>.` }
        ],
        time: [
          { rule: "Zeitpunkt (danach)", ex: `<span class="${HL_DAT}">Nach dem Essen</span> gehen wir spazieren.` }
        ],
        verbFixed: [
          `Das <span class="${HL_DAT}">schmeckt nach Erdbeere</span>.`,
          `Ich <span class="${HL_DAT}">frage nach dem Weg</span>.`
        ],
        adjFixed: [
          `Er ist <span class="${HL_DAT}">verrückt nach dir</span>.`
        ]
      }
    ]
  },
  {
    prep: "neben",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Position (Wo?)", ex: `Er sitzt <span class="${HL_DAT}">neben mir</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung (Wohin?)", ex: `Er setzt sich <span class="${HL_AKK}">neben mich</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },

  // --- O ---
  {
    prep: "ohne",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },
  {
    prep: "(ohne Präp.)",
    isWechsel: true,
    modes: [
      {
        case: "AKK",
        space: [],
        time: [
          { rule: "Zeitdauer", ex: `Er blieb <span class="${HL_AKK}">einen Monat</span>.` },
          { rule: "Bestimmter Zeitpunkt", ex: `Wir treffen uns <span class="${HL_AKK}">nächsten Montag</span>.` },
          { rule: "Frequenz", ex: `Ich lerne <span class="${HL_AKK}">jeden Tag</span>.` }
        ],
        verbFixed: [], adjFixed: []
      },
      {
        case: "GEN",
        space: [],
        time: [
          { rule: "Unbestimmter Zeitpunkt", ex: `<span class="${HL_GEN}">Eines Tages</span> wird es passieren.` }
        ],
        verbFixed: [], adjFixed: []
      }
    ]
  },

  // --- S ---
  {
    prep: "seit",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [],
        time: [
          { rule: "Vergangenheit bis Jetzt", ex: `Ich lerne <span class="${HL_DAT}">seit einem Jahr</span> Deutsch.` }
        ],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },
  {
    prep: "statt",
    isWechsel: false,
    modes: [
      {
        case: "GEN",
        space: [],
        time: [],
        verbFixed: [
          `Ich nehme das Auto <span class="${HL_GEN}">statt des Busses</span>.`
        ],
        adjFixed: []
      }
    ]
  },

  // --- T ---
  {
    prep: "trotz",
    isWechsel: false,
    modes: [
      {
        case: "GEN",
        space: [],
        time: [],
        verbFixed: [
          `Wir gehen <span class="${HL_GEN}">trotz des Regens</span> spazieren.`
        ],
        adjFixed: []
      }
    ]
  },

  // --- U ---
  {
    prep: "über",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Position (oberhalb, kein Kontakt)", ex: `Die Lampe hängt <span class="${HL_DAT}">über dem Tisch</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung (über etwas hinweg)", ex: `Wir gehen <span class="${HL_AKK}">über die Straße</span>.` }
        ],
        time: [
          { rule: "Zeitraum (>)", ex: `Er bleibt <span class="${HL_AKK}">über eine Woche</span>.` }
        ],
        verbFixed: [
          `Wir <span class="${HL_AKK}">sprechen über das Wetter</span>.`,
          `Er <span class="${HL_AKK}">lacht über den Witz</span>.`,
          `Ich <span class="${HL_AKK}">ärgere mich über den Fehler</span>.`
        ],
        adjFixed: [
          `Ich bin <span class="${HL_AKK}">froh über die Nachricht</span>.`,
          `Er ist <span class="${HL_AKK}">traurig über den Verlust</span>.`
        ]
      }
    ]
  },
  {
    prep: "um",
    isWechsel: false,
    modes: [
      {
        case: "AKK",
        space: [
          { rule: "Rundherum", ex: `Wir laufen <span class="${HL_AKK}">um das Haus</span>.` }
        ],
        time: [
          { rule: "Uhrzeit", ex: `Der Film beginnt <span class="${HL_AKK}">um 20 Uhr</span>.` }
        ],
        verbFixed: [
          `Ich <span class="${HL_AKK}">bitte dich um Hilfe</span>.`,
          `Es <span class="${HL_AKK}">geht um deine Zukunft</span>.`,
          `Er <span class="${HL_AKK}">bewirbt sich um den Job</span>.`
        ],
        adjFixed: []
      }
    ]
  },
  {
    prep: "unter",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Position (Wo?)", ex: `Die Katze ist <span class="${HL_DAT}">unter dem Tisch</span>.` }
        ],
        time: [
          { rule: "Zeitraum (unter der Woche)", ex: `<span class="${HL_DAT}">Unter der Woche</span> arbeite ich.` }
        ],
        verbFixed: [
          `Er <span class="${HL_DAT}">leidet unter Stress</span>.`
        ],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung (Wohin?)", ex: `Die Katze läuft <span class="${HL_AKK}">unter den Tisch</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },

  // --- V ---
  {
    prep: "von",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Herkunft (lokal)", ex: `Ich komme gerade <span class="${HL_DAT}">vom Zahnarzt</span>.` }
        ],
        time: [
          { rule: "Startpunkt", ex: `Wir arbeiten <span class="${HL_DAT}">von 8 bis 17 Uhr</span>.` }
        ],
        verbFixed: [
          `Das <span class="${HL_DAT}">hängt vom Wetter ab</span>.`,
          `Ich <span class="${HL_DAT}">träume von einem Urlaub</span>.`
        ],
        adjFixed: [
          `Ich bin <span class="${HL_DAT}">davon überzeugt</span>.`,
          `Der Tisch ist <span class="${HL_DAT}">voll von Büchern</span>.`
        ]
      }
    ]
  },
  {
    prep: "vor",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Position (Wo?)", ex: `Das Auto steht <span class="${HL_DAT}">vor dem Haus</span>.` }
        ],
        time: [
          { rule: "Zeitpunkt (Vergangenheit)", ex: `Das war <span class="${HL_DAT}">vor einem Jahr</span>.` }
        ],
        verbFixed: [
          `Ich <span class="${HL_DAT}">habe Angst vor Spinnen</span>.`,
          `Er <span class="${HL_DAT}">schützt mich vor der Gefahr</span>.`
        ],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung (Wohin?)", ex: `Er läuft <span class="${HL_AKK}">vor das Haus</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },

  // --- W ---
  {
    prep: "während",
    isWechsel: false,
    modes: [
      {
        case: "GEN",
        space: [],
        time: [
          { rule: "Zeitdauer", ex: `<span class="${HL_GEN}">Während der Ferien</span> reisen wir.` }
        ],
        verbFixed: [],
        adjFixed: []
      }
    ]
  },
  {
    prep: "wegen",
    isWechsel: false,
    modes: [
      {
        case: "GEN",
        space: [],
        time: [],
        verbFixed: [
          `Ich rufe <span class="${HL_GEN}">wegen der Anzeige</span> an.`
        ],
        adjFixed: []
      }
    ]
  },

  // --- Z ---
  {
    prep: "zu",
    isWechsel: false,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Bewegung zu Person/Institution", ex: `Ich gehe <span class="${HL_DAT}">zum Arzt</span>.` },
          { rule: "Bewegung zu Plätzen", ex: `Wir fahren <span class="${HL_DAT}">zum Bahnhof</span>.` }
        ],
        time: [
          { rule: "Feiertage", ex: `<span class="${HL_DAT}">Zu Weihnachten</span> gibt es Geschenke.` }
        ],
        verbFixed: [
          `Das <span class="${HL_DAT}">gehört zu mir</span>.`,
          `Ich <span class="${HL_DAT}">lade dich zum Essen ein</span>.`,
          `Er <span class="${HL_DAT}">gratuliert dir zum Geburtstag</span>.`
        ],
        adjFixed: [
          `Er ist <span class="${HL_DAT}">nett zu mir</span>.`
        ]
      }
    ]
  },
  {
    prep: "zwischen",
    isWechsel: true,
    modes: [
      {
        case: "DAT",
        space: [
          { rule: "Position (Wo?)", ex: `Der Stuhl steht <span class="${HL_DAT}">zwischen den Tischen</span>.` }
        ],
        time: [
          { rule: "Zeitraum", ex: `<span class="${HL_DAT}">Zwischen 12 und 13 Uhr</span> ist Pause.` }
        ],
        verbFixed: [],
        adjFixed: []
      },
      {
        case: "AKK",
        space: [
          { rule: "Bewegung (Wohin?)", ex: `Stell den Stuhl <span class="${HL_AKK}">zwischen die Tische</span>.` }
        ],
        time: [],
        verbFixed: [],
        adjFixed: []
      }
    ]
  }
];
