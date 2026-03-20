export const praepositionen = [
  {
    prep: "in",
    cases: ["DAT", "AKK"],
    space: {
      rule: "DAT = location (Wo?), AKK = direction/movement (Wohin?)",
      examples: ["Ich bin in der Stadt.", "Ich gehe in die Stadt."]
    },
    time: {
      rule: "DAT for time period / within; AKK for point-in-time/duration (context-dependent)",
      examples: ["im Sommer", "in zwei Tagen"]
    },
    verbFixed: ["sich befinden in + DAT", "einsteigen in + AKK"],
    adjFixed: ["interessiert an + DAT (note: an)"]
  },
  {
    prep: "auf",
    cases: ["DAT", "AKK"],
    space: {
      rule: "DAT = on (static), AKK = onto (movement)",
      examples: ["Das Buch liegt auf dem Tisch.", "Ich lege das Buch auf den Tisch."]
    },
    time: {
      rule: "Used in fixed time phrases",
      examples: ["auf einmal", "auf die Minute"]
    },
    verbFixed: ["warten auf + AKK", "sich verlassen auf + AKK"],
    adjFixed: ["stolz auf + AKK", "neidisch auf + AKK"]
  },
  {
    prep: "an",
    cases: ["DAT", "AKK"],
    space: {
      rule: "DAT = at/against (static), AKK = to/towards (movement)",
      examples: ["Ich bin am Fenster.", "Ich gehe ans Fenster."]
    },
    time: {
      rule: "DAT for days/dates",
      examples: ["am Montag", "am 3. April"]
    },
    verbFixed: ["denken an + AKK", "teilnehmen an + DAT"],
    adjFixed: ["interessiert an + DAT", "beteiligt an + DAT"]
  },
  {
    prep: "mit",
    cases: ["DAT"],
    space: {
      rule: "With / using (instrument or accompaniment)",
      examples: ["Ich fahre mit dem Bus.", "Ich schreibe mit einem Stift."]
    },
    time: {
      rule: "Used in fixed phrases",
      examples: ["mit der Zeit"]
    },
    verbFixed: ["sprechen mit + DAT", "sich treffen mit + DAT"],
    adjFixed: ["zufrieden mit + DAT", "einverstanden mit + DAT"]
  },
  {
    prep: "für",
    cases: ["AKK"],
    space: {
      rule: "For (purpose/benefit)",
      examples: ["Das ist für dich."]
    },
    time: {
      rule: "Duration / period",
      examples: ["für eine Woche", "für zwei Stunden"]
    },
    verbFixed: ["sich interessieren für + AKK", "sich entscheiden für + AKK"],
    adjFixed: ["bereit für + AKK", "verantwortlich für + AKK"]
  }
];
