/**
 * Maggy - English Learning PWA
 * Lesson Content & Curriculum Definition
 */

// Pedagogical order - each lesson unlocks sequentially
export const CURRICULUM = [
  {
    id: 'to-be-intro',
    title: 'Verb TO BE',
    subtitle: 'Introduction',
    description: 'Learn when to use am, is, and are',
    icon: '🎯',
    order: 1,
    unlocked: true,
    concepts: ['am', 'is', 'are'],
    objectives: [
      'Understand when to use am/is/are',
      'Form affirmative sentences',
      'Introduce yourself in English'
    ],
    theory: {
      explanation: "The verb TO BE is the most important verb in English. It connects the subject with information about them. Use 'am' with I, 'is' with he/she/it, and 'are' with you/we/they.",
      keyPoints: [
        "I → am (I am happy)",
        "He/She/It → is (She is a teacher)",
        "You/We/They → are (They are friends)"
      ]
    },
    examples: [
      { english: "I am a student.", spanish: "Soy estudiante.", audio: true },
      { english: "She is my friend.", spanish: "Ella es mi amiga.", audio: true },
      { english: "We are from Mexico.", spanish: "Somos de México.", audio: true },
      { english: "It is a beautiful day.", spanish: "Es un día hermoso.", audio: true },
      { english: "They are at home.", spanish: "Ellos están en casa.", audio: true },
      { english: "You are very kind.", spanish: "Eres muy amable.", audio: true }
    ],
    quiz: [
      {
        id: 'tobe-1',
        type: 'fill-blank',
        question: "I ___ happy today.",
        options: ['am', 'is', 'are'],
        correct: 'am',
        explanation: "With 'I', always use 'am'."
      },
      {
        id: 'tobe-2',
        type: 'fill-blank',
        question: "She ___ a doctor.",
        options: ['am', 'is', 'are'],
        correct: 'is',
        explanation: "With 'she', use 'is'."
      },
      {
        id: 'tobe-3',
        type: 'fill-blank',
        question: "They ___ my friends.",
        options: ['am', 'is', 'are'],
        correct: 'are',
        explanation: "With 'they', use 'are'."
      },
      {
        id: 'tobe-4',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ['am', 'I', 'student', 'a'],
        correct: 'I am a student.',
        explanation: "Subject + verb TO BE + complement."
      },
      {
        id: 'tobe-5',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ['is', 'She', 'teacher', 'my'],
        correct: 'She is my teacher.',
        explanation: "She + is + complement."
      },
      {
        id: 'tobe-6',
        type: 'fill-blank',
        question: "The cat ___ on the table.",
        options: ['am', 'is', 'are'],
        correct: 'is',
        explanation: "With 'it' (the cat), use 'is'."
      },
      {
        id: 'tobe-7',
        type: 'fill-blank',
        question: "We ___ from Mexico.",
        options: ['am', 'is', 'are'],
        correct: 'are',
        explanation: "With 'we', use 'are'."
      },
      {
        id: 'tobe-8',
        type: 'fill-blank',
        question: "He ___ my brother.",
        options: ['am', 'is', 'are'],
        correct: 'is',
        explanation: "With 'he', use 'is'."
      },
      {
        id: 'tobe-9',
        type: 'multiple-choice',
        question: "Which sentence is correct?",
        options: ['They is happy.', 'They am happy.', 'They are happy.'],
        correct: 'They are happy.',
        explanation: "They + are is the correct combination."
      },
      {
        id: 'tobe-10',
        type: 'multiple-choice',
        question: "Which sentence is correct?",
        options: ['I is tired.', 'I am tired.', 'I are tired.'],
        correct: 'I am tired.',
        explanation: "I + am is the correct combination."
      }
    ],
    conversationStarters: [
      "Tell me about yourself using 'I am...'",
      "Describe your family using is/are",
      "Where are you from?"
    ]
  },
  {
    id: 'to-be-negative',
    title: 'Verb TO BE',
    subtitle: 'Negatives',
    description: "Learn to say what you're NOT",
    icon: '🚫',
    order: 2,
    unlocked: false,
    concepts: ["am not", "isn't", "aren't"],
    prerequisites: ['to-be-intro'],
    theory: {
      explanation: "To make TO BE negative, add 'not' after the verb. In spoken English, we usually use contractions: isn't (is not), aren't (are not). With 'I am', we say 'I'm not'.",
      keyPoints: [
        "I am not → I'm not (I'm not tired)",
        "He/She/It is not → isn't (She isn't here)",
        "You/We/They are not → aren't (We aren't ready)"
      ]
    },
    examples: [
      { english: "I'm not hungry.", spanish: "No tengo hambre.", audio: true },
      { english: "She isn't my sister.", spanish: "Ella no es mi hermana.", audio: true },
      { english: "We aren't late.", spanish: "No llegamos tarde.", audio: true },
      { english: "It isn't easy.", spanish: "No es fácil.", audio: true },
      { english: "They aren't at work.", spanish: "No están en el trabajo.", audio: true }
    ],
    quiz: [
      {
        id: 'tobe-neg-1',
        type: 'fill-blank',
        question: "I ___ not ready yet.",
        options: ["'m", 'is', 'are'],
        correct: "'m",
        explanation: "With 'I', use 'I'm not' (I am not)."
      },
      {
        id: 'tobe-neg-2',
        type: 'fill-blank',
        question: "He ___ my brother.",
        options: ["isn't", "aren't", "am not"],
        correct: "isn't",
        explanation: "With 'he', use 'isn't'."
      },
      {
        id: 'tobe-neg-3',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["isn't", "She", "here", "today"],
        correct: "She isn't here today.",
        explanation: "Subject + isn't + complement."
      },
      {
        id: 'tobe-neg-4',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["aren't", "We", "ready", "yet"],
        correct: "We aren't ready yet.",
        explanation: "We + aren't + complement."
      },
      {
        id: 'tobe-neg-5',
        type: 'fill-blank',
        question: "They ___ at home right now.",
        options: ["isn't", "aren't", "am not"],
        correct: "aren't",
        explanation: "With 'they', use 'aren't'."
      },
      {
        id: 'tobe-neg-6',
        type: 'fill-blank',
        question: "I ___ hungry.",
        options: ["'m not", "isn't", "aren't"],
        correct: "'m not",
        explanation: "I'm not = I am not."
      },
      {
        id: 'tobe-neg-7',
        type: 'fill-blank',
        question: "It ___ cold today.",
        options: ["isn't", "aren't", "'m not"],
        correct: "isn't",
        explanation: "With 'it', use 'isn't'."
      },
      {
        id: 'tobe-neg-8',
        type: 'fill-blank',
        question: "You ___ late.",
        options: ["isn't", "aren't", "'m not"],
        correct: "aren't",
        explanation: "With 'you', use 'aren't'."
      },
      {
        id: 'tobe-neg-9',
        type: 'transform',
        question: "Make negative: 'She is happy.'",
        options: ["She isn't happy.", "She aren't happy.", "She am not happy."],
        correct: "She isn't happy.",
        explanation: "She + isn't for negatives."
      },
      {
        id: 'tobe-neg-10',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["I amn't tired.", "I'm not tired.", "I not am tired."],
        correct: "I'm not tired.",
        explanation: "There's no 'amn't' in English. Use 'I'm not'."
      }
    ],
    conversationStarters: [
      "Tell me 3 things you are NOT",
      "Describe what your job is NOT",
      "What aren't you good at?"
    ]
  },
  {
    id: 'to-be-questions',
    title: 'Verb TO BE',
    subtitle: 'Questions',
    description: 'Ask questions with am, is, are',
    icon: '❓',
    order: 3,
    unlocked: false,
    concepts: ['Am I?', 'Is he?', 'Are they?'],
    prerequisites: ['to-be-negative'],
    theory: {
      explanation: "To make questions with TO BE, put the verb BEFORE the subject. Statement: 'She is happy.' → Question: 'Is she happy?' For answers, use short forms: 'Yes, she is.' or 'No, she isn't.'",
      keyPoints: [
        "Am I...? → Yes, you are. / No, you aren't.",
        "Is he/she/it...? → Yes, he is. / No, he isn't.",
        "Are you/we/they...? → Yes, we are. / No, we aren't."
      ]
    },
    examples: [
      { english: "Are you ready?", spanish: "¿Estás listo?", audio: true },
      { english: "Is she your teacher?", spanish: "¿Es ella tu maestra?", audio: true },
      { english: "Am I late?", spanish: "¿Llego tarde?", audio: true },
      { english: "Are they coming?", spanish: "¿Vienen ellos?", audio: true },
      { english: "Is it cold outside?", spanish: "¿Hace frío afuera?", audio: true }
    ],
    quiz: [
      {
        id: 'tobe-q-1',
        type: 'reorder',
        question: "Ordena para formar pregunta:",
        words: ["you", "Are", "hungry", "?"],
        correct: "Are you hungry?",
        explanation: "Verb before subject for questions."
      },
      {
        id: 'tobe-q-2',
        type: 'fill-blank',
        question: "___ she a doctor?",
        options: ['Am', 'Is', 'Are'],
        correct: 'Is',
        explanation: "With 'she', use 'Is'."
      },
      {
        id: 'tobe-q-3',
        type: 'reorder',
        question: "Ordena para formar pregunta:",
        words: ["Is", "he", "teacher", "your", "?"],
        correct: "Is he your teacher?",
        explanation: "Is + subject + complement + ?"
      },
      {
        id: 'tobe-q-4',
        type: 'fill-blank',
        question: "___ you from Mexico?",
        options: ['Am', 'Is', 'Are'],
        correct: 'Are',
        explanation: "With 'you', use 'Are'."
      },
      {
        id: 'tobe-q-5',
        type: 'fill-blank',
        question: "___ she your sister?",
        options: ['Am', 'Is', 'Are'],
        correct: 'Is',
        explanation: "With 'she', use 'Is'."
      },
      {
        id: 'tobe-q-6',
        type: 'fill-blank',
        question: "___ I late?",
        options: ['Am', 'Is', 'Are'],
        correct: 'Am',
        explanation: "With 'I', use 'Am'."
      },
      {
        id: 'tobe-q-7',
        type: 'fill-blank',
        question: "___ the students ready?",
        options: ['Am', 'Is', 'Are'],
        correct: 'Are',
        explanation: "With plural 'students', use 'Are'."
      },
      {
        id: 'tobe-q-8',
        type: 'multiple-choice',
        question: "Answer: 'Is he your friend?' - 'Yes, ___'",
        options: ["he is.", "he's.", "is he."],
        correct: "he is.",
        explanation: "Short answer: Yes, he is."
      },
      {
        id: 'tobe-q-9',
        type: 'fill-blank',
        question: "___ they at the party?",
        options: ['Am', 'Is', 'Are'],
        correct: 'Are',
        explanation: "With 'they', use 'Are'."
      },
      {
        id: 'tobe-q-10',
        type: 'transform',
        question: "Make a question: 'They are students.'",
        options: ["Are they students?", "They are students?", "Is they students?"],
        correct: "Are they students?",
        explanation: "Move 'are' before 'they'."
      }
    ],
    conversationStarters: [
      "Ask me 3 questions about myself",
      "Ask yes/no questions about my hobbies",
      "Practice interview questions"
    ]
  },
  {
    id: 'simple-present-intro',
    title: 'Simple Present',
    subtitle: 'Introduction',
    description: 'Talk about habits and facts',
    icon: '🔄',
    order: 4,
    unlocked: false,
    concepts: ['I work', 'You eat', 'We go'],
    prerequisites: ['to-be-questions'],
    theory: {
      explanation: "Use Simple Present for habits, routines, and general facts. Most verbs stay the same, but with he/she/it, add -s or -es. Example: I work → She works.",
      keyPoints: [
        "I/You/We/They + verb (I work every day)",
        "He/She/It + verb + s (She works at a bank)",
        "Verbs ending in -s, -sh, -ch, -x, -o → add -es (go → goes, watch → watches)"
      ]
    },
    examples: [
      { english: "I work from home.", spanish: "Trabajo desde casa.", audio: true },
      { english: "She speaks three languages.", spanish: "Ella habla tres idiomas.", audio: true },
      { english: "We eat breakfast at 8.", spanish: "Desayunamos a las 8.", audio: true },
      { english: "He watches TV every night.", spanish: "Él ve TV todas las noches.", audio: true },
      { english: "They live in the city.", spanish: "Viven en la ciudad.", audio: true },
      { english: "It rains a lot here.", spanish: "Llueve mucho aquí.", audio: true }
    ],
    quiz: [
      {
        id: 'sp-1',
        type: 'fill-blank',
        question: "She ___ coffee every morning.",
        options: ['drink', 'drinks', 'drinking'],
        correct: 'drinks',
        explanation: "With 'she', add -s to the verb."
      },
      {
        id: 'sp-2',
        type: 'fill-blank',
        question: "They ___ to music.",
        options: ['listen', 'listens', 'listening'],
        correct: 'listen',
        explanation: "With 'they', verb stays the same."
      },
      {
        id: 'sp-3',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["works", "She", "a", "at", "bank"],
        correct: "She works at a bank.",
        explanation: "Subject + verb+s + complement."
      },
      {
        id: 'sp-4',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["eat", "We", "at", "breakfast", "8"],
        correct: "We eat breakfast at 8.",
        explanation: "Subject + verb + object + time."
      },
      {
        id: 'sp-5',
        type: 'fill-blank',
        question: "He ___ to the gym every day.",
        options: ['go', 'goes', 'going'],
        correct: 'goes',
        explanation: "'Go' becomes 'goes' with he/she/it."
      },
      {
        id: 'sp-6',
        type: 'fill-blank',
        question: "I ___ from home.",
        options: ['work', 'works', 'working'],
        correct: 'work',
        explanation: "With 'I', verb stays the same."
      },
      {
        id: 'sp-7',
        type: 'fill-blank',
        question: "She ___ in Mexico City.",
        options: ['live', 'lives', 'living'],
        correct: 'lives',
        explanation: "'Live' becomes 'lives' with she."
      },
      {
        id: 'sp-8',
        type: 'fill-blank',
        question: "We ___ breakfast at 7 AM.",
        options: ['have', 'has', 'having'],
        correct: 'have',
        explanation: "With 'we', verb stays the same."
      },
      {
        id: 'sp-9',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["She watchs TV.", "She watches TV.", "She watch TV."],
        correct: "She watches TV.",
        explanation: "Verbs ending in -ch add -es."
      },
      {
        id: 'sp-10',
        type: 'fill-blank',
        question: "I ___ English every day.",
        options: ['study', 'studies', 'studying'],
        correct: 'study',
        explanation: "With 'I', verb stays the same."
      }
    ],
    conversationStarters: [
      "Tell me about your daily routine",
      "What do you usually do on weekends?",
      "Describe your typical workday"
    ]
  },
  {
    id: 'do-does-auxiliary',
    title: 'DO/DOES',
    subtitle: 'As Auxiliary',
    description: 'Form questions and negatives',
    icon: '🔧',
    order: 5,
    unlocked: false,
    concepts: ['Do you...?', 'Does he...?', "I don't..."],
    prerequisites: ['simple-present-intro'],
    theory: {
      explanation: "DO and DOES are helper verbs for questions and negatives in Simple Present. Use 'do' with I/you/we/they and 'does' with he/she/it. When using does/doesn't, the main verb returns to base form!",
      keyPoints: [
        "Questions: Do/Does + subject + base verb? (Does she work?)",
        "Negatives: don't/doesn't + base verb (She doesn't work)",
        "Important: She works → Does she work? (NOT 'Does she works?')"
      ]
    },
    examples: [
      { english: "Do you speak English?", spanish: "¿Hablas inglés?", audio: true },
      { english: "Does she live here?", spanish: "¿Vive ella aquí?", audio: true },
      { english: "I don't like coffee.", spanish: "No me gusta el café.", audio: true },
      { english: "He doesn't work on Sundays.", spanish: "Él no trabaja los domingos.", audio: true },
      { english: "Do they know about it?", spanish: "¿Ellos saben de eso?", audio: true },
      { english: "We don't have time.", spanish: "No tenemos tiempo.", audio: true }
    ],
    quiz: [
      {
        id: 'do-1',
        type: 'fill-blank',
        question: "___ you like pizza?",
        options: ['Do', 'Does', 'Is'],
        correct: 'Do',
        explanation: "With 'you', use 'Do'."
      },
      {
        id: 'do-2',
        type: 'fill-blank',
        question: "___ she speak Spanish?",
        options: ['Do', 'Does', 'Is'],
        correct: 'Does',
        explanation: "With 'she', use 'Does'."
      },
      {
        id: 'do-3',
        type: 'reorder',
        question: "Ordena para formar pregunta:",
        words: ["Do", "you", "English", "speak", "?"],
        correct: "Do you speak English?",
        explanation: "Do + subject + base verb + ?"
      },
      {
        id: 'do-4',
        type: 'reorder',
        question: "Ordena para formar negativo:",
        words: ["doesn't", "He", "meat", "eat"],
        correct: "He doesn't eat meat.",
        explanation: "Subject + doesn't + base verb."
      },
      {
        id: 'do-5',
        type: 'fill-blank',
        question: "___ she live here?",
        options: ['Do', 'Does', 'Did'],
        correct: 'Does',
        explanation: "With 'she', use 'Does'."
      },
      {
        id: 'do-6',
        type: 'fill-blank',
        question: "I ___ like coffee.",
        options: ["don't", "doesn't", "not"],
        correct: "don't",
        explanation: "With 'I', use 'don't'."
      },
      {
        id: 'do-7',
        type: 'fill-blank',
        question: "She ___ work on Sundays.",
        options: ["don't", "doesn't", "not"],
        correct: "doesn't",
        explanation: "With 'she', use 'doesn't'."
      },
      {
        id: 'do-8',
        type: 'fill-blank',
        question: "___ you speak English?",
        options: ['Do', 'Does', 'Did'],
        correct: 'Do',
        explanation: "With 'you', use 'Do'."
      },
      {
        id: 'do-9',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["Does she works here?", "Does she work here?", "Do she work here?"],
        correct: "Does she work here?",
        explanation: "After 'does', use base form (work, not works)."
      },
      {
        id: 'do-10',
        type: 'transform',
        question: "Make negative: 'They like coffee.'",
        options: ["They don't like coffee.", "They doesn't like coffee.", "They not like coffee."],
        correct: "They don't like coffee.",
        explanation: "With 'they', use 'don't'."
      }
    ],
    conversationStarters: [
      "Ask me questions about my habits using 'Do you...?'",
      "Tell me things you don't do",
      "Ask what your colleagues do at work"
    ]
  },
  {
    id: 'pronunciation-basics',
    title: 'Pronunciation',
    subtitle: 'Essential Sounds',
    description: 'Master tricky English sounds',
    icon: '🗣️',
    order: 6,
    unlocked: false,
    concepts: ['th sound', 'contractions', 'word stress'],
    prerequisites: ['do-does-auxiliary'],
    theory: {
      explanation: "English has sounds that don't exist in Spanish. The 'th' sound, contractions (I'm, don't), and word stress are essential for sounding natural. Practice these to improve your speaking.",
      keyPoints: [
        "TH sound: tongue between teeth (the, this, that, think)",
        "Contractions: spoken English uses them A LOT (I'm, you're, doesn't)",
        "Stress: emphasize the right syllable (inFORmation, not inforMAtion)"
      ]
    },
    examples: [
      { english: "Think about this.", spanish: "Piensa en esto.", audio: true, focus: 'th' },
      { english: "They're not there.", spanish: "Ellos no están ahí.", audio: true, focus: 'th' },
      { english: "I don't think so.", spanish: "No creo.", audio: true, focus: 'contraction' },
      { english: "She's working.", spanish: "Ella está trabajando.", audio: true, focus: 'contraction' },
      { english: "It's important.", spanish: "Es importante.", audio: true, focus: 'stress' }
    ],
    quiz: [
      {
        id: 'pron-1',
        type: 'audio-match',
        question: "Listen and repeat: 'Think about this.'",
        focus: 'th',
        target: "Think about this."
      },
      {
        id: 'pron-2',
        type: 'audio-match',
        question: "Say the contraction: 'I do not' → ?",
        focus: 'contraction',
        options: ["I don't", "I do'nt", "I dont"],
        correct: "I don't"
      },
      {
        id: 'pron-3',
        type: 'multiple-choice',
        question: "Which word has the 'th' sound?",
        options: ['day', 'the', 'say'],
        correct: 'the',
        explanation: "The word 'the' has the 'th' sound."
      },
      {
        id: 'pron-4',
        type: 'multiple-choice',
        question: "Which word has the 'th' sound?",
        options: ['weather', 'water', 'winter'],
        correct: 'weather',
        explanation: "Weather has the 'th' sound."
      },
      {
        id: 'pron-5',
        type: 'reorder',
        question: "Ordena para formar la contracción:",
        words: ["She", "doesn't", "it", "like"],
        correct: "She doesn't like it.",
        explanation: "Subject + doesn't + verb + object."
      },
      {
        id: 'pron-6',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["think", "I", "so", "don't"],
        correct: "I don't think so.",
        explanation: "Common phrase with contraction."
      },
      {
        id: 'pron-7',
        type: 'fill-blank',
        question: "I ___ think so.",
        options: ["don't", "doesn't", "not"],
        correct: "don't",
        explanation: "I don't = contraction of 'I do not'."
      },
      {
        id: 'pron-8',
        type: 'fill-blank',
        question: "She ___ like coffee.",
        options: ["don't", "doesn't", "not"],
        correct: "doesn't",
        explanation: "She doesn't = contraction of 'she does not'."
      },
      {
        id: 'pron-9',
        type: 'stress',
        question: "Where is the stress? INFORMATION",
        options: ["in-FOR-ma-tion", "in-for-MA-tion", "IN-for-ma-tion"],
        correct: "in-for-MA-tion"
      },
      {
        id: 'pron-10',
        type: 'audio-match',
        question: "Say naturally: 'She does not like it.'",
        focus: 'contraction',
        target: "She doesn't like it."
      }
    ],
    conversationStarters: [
      "Practice sentences with 'th' sound",
      "Have a conversation using only contractions",
      "Describe your day using natural pronunciation"
    ]
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    subtitle: 'Actions in Progress',
    description: 'Talk about what is happening now',
    icon: '⏳',
    order: 7,
    unlocked: false,
    concepts: ['am/is/are + -ing', 'right now', 'at the moment'],
    prerequisites: ['pronunciation-basics'],
    theory: {
      explanation: "Use Present Continuous for actions happening RIGHT NOW or around this time. Form: Subject + am/is/are + verb-ing. Example: I am working. She is eating.",
      keyPoints: [
        "I am + verb-ing (I am eating)",
        "He/She/It is + verb-ing (She is working)",
        "You/We/They are + verb-ing (They are playing)",
        "Spelling: drop 'e' before -ing (make → making), double consonant after short vowel (run → running)"
      ]
    },
    examples: [
      { english: "I am studying English.", spanish: "Estoy estudiando inglés.", audio: true },
      { english: "She is cooking dinner.", spanish: "Ella está cocinando la cena.", audio: true },
      { english: "They are watching a movie.", spanish: "Están viendo una película.", audio: true },
      { english: "He is running in the park.", spanish: "Él está corriendo en el parque.", audio: true },
      { english: "We are having lunch.", spanish: "Estamos almorzando.", audio: true },
      { english: "The baby is sleeping.", spanish: "El bebé está durmiendo.", audio: true }
    ],
    quiz: [
      {
        id: 'pc-1',
        type: 'fill-blank',
        question: "I ___ working from home today.",
        options: ['am', 'is', 'are'],
        correct: 'am',
        explanation: "With 'I', use 'am'."
      },
      {
        id: 'pc-2',
        type: 'fill-blank',
        question: "She ___ reading a book right now.",
        options: ['am', 'is', 'are'],
        correct: 'is',
        explanation: "With 'she', use 'is'."
      },
      {
        id: 'pc-3',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["am", "I", "English", "studying"],
        correct: "I am studying English.",
        explanation: "Subject + am/is/are + verb-ing."
      },
      {
        id: 'pc-4',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["is", "She", "dinner", "cooking"],
        correct: "She is cooking dinner.",
        explanation: "She + is + verb-ing + object."
      },
      {
        id: 'pc-5',
        type: 'fill-blank',
        question: "They ___ watching a movie now.",
        options: ['am', 'is', 'are'],
        correct: 'are',
        explanation: "With 'they', use 'are'."
      },
      {
        id: 'pc-6',
        type: 'fill-blank',
        question: "The baby ___ sleeping.",
        options: ['am', 'is', 'are'],
        correct: 'is',
        explanation: "With 'baby' (singular), use 'is'."
      },
      {
        id: 'pc-7',
        type: 'fill-blank',
        question: "He is ___ in the park.",
        options: ['run', 'running', 'runs'],
        correct: 'running',
        explanation: "Present Continuous: is + verb-ing."
      },
      {
        id: 'pc-8',
        type: 'fill-blank',
        question: "She is ___ a cake.",
        options: ['make', 'making', 'makes'],
        correct: 'making',
        explanation: "Present Continuous: is + verb-ing (make → making)."
      },
      {
        id: 'pc-9',
        type: 'fill-blank',
        question: "Look! It ___ raining outside.",
        options: ['am', 'is', 'are'],
        correct: 'is',
        explanation: "With 'it', use 'is'."
      },
      {
        id: 'pc-10',
        type: 'multiple-choice',
        question: "What are you doing? - I ___ TV.",
        options: ["am watch", "am watching", "watching"],
        correct: "am watching",
        explanation: "Present Continuous: I am + verb-ing."
      }
    ],
    conversationStarters: [
      "Tell me what you are doing right now",
      "Describe what people around you are doing",
      "What is happening in your city today?"
    ]
  },
  {
    id: 'verb-will',
    title: 'Future with WILL',
    subtitle: 'Predictions & Decisions',
    description: 'Talk about the future',
    icon: '🔮',
    order: 8,
    unlocked: false,
    concepts: ['will + verb', "won't", 'predictions'],
    prerequisites: ['present-continuous'],
    theory: {
      explanation: "Use WILL for future predictions, promises, and instant decisions. Form: Subject + will + base verb. Negative: won't (will not). Will is the same for ALL subjects!",
      keyPoints: [
        "Affirmative: I/You/He/She/It/We/They + will + verb (I will help you)",
        "Negative: will not = won't (She won't come)",
        "Question: Will + subject + verb? (Will you call me?)",
        "Use for: predictions, promises, offers, instant decisions"
      ]
    },
    examples: [
      { english: "I will call you tomorrow.", spanish: "Te llamaré mañana.", audio: true },
      { english: "She won't be late.", spanish: "Ella no llegará tarde.", audio: true },
      { english: "Will you help me?", spanish: "¿Me ayudarás?", audio: true },
      { english: "It will rain later.", spanish: "Lloverá más tarde.", audio: true },
      { english: "They will arrive at 8.", spanish: "Llegarán a las 8.", audio: true },
      { english: "I'll have the chicken, please.", spanish: "Tomaré el pollo, por favor.", audio: true }
    ],
    quiz: [
      {
        id: 'will-1',
        type: 'fill-blank',
        question: "I ___ help you with that.",
        options: ['will', 'am will', 'willing'],
        correct: 'will',
        explanation: "Will + base verb (no 'am' needed)."
      },
      {
        id: 'will-2',
        type: 'fill-blank',
        question: "She ___ come to the party.",
        options: ['willn\'t', 'won\'t', 'will don\'t'],
        correct: "won't",
        explanation: "Negative of 'will' is 'won't'."
      },
      {
        id: 'will-3',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["will", "I", "you", "call", "tomorrow"],
        correct: "I will call you tomorrow.",
        explanation: "Subject + will + verb + object + time."
      },
      {
        id: 'will-4',
        type: 'reorder',
        question: "Ordena para formar pregunta:",
        words: ["Will", "you", "me", "help", "?"],
        correct: "Will you help me?",
        explanation: "Will + subject + verb + object + ?"
      },
      {
        id: 'will-5',
        type: 'fill-blank',
        question: "It ___ rain later.",
        options: ['will', 'won\'t', 'is'],
        correct: 'will',
        explanation: "Use 'will' for predictions."
      },
      {
        id: 'will-6',
        type: 'fill-blank',
        question: "She ___ be late.",
        options: ['will', 'won\'t', 'is'],
        correct: 'won\'t',
        explanation: "Won't = will not (negative)."
      },
      {
        id: 'will-7',
        type: 'fill-blank',
        question: "___ you help me tomorrow?",
        options: ['Will', 'Do', 'Are'],
        correct: 'Will',
        explanation: "Use 'Will' for future questions."
      },
      {
        id: 'will-8',
        type: 'fill-blank',
        question: "I will call you ___.",
        options: ['tomorrow', 'yesterday', 'ago'],
        correct: 'tomorrow',
        explanation: "Will + future time expressions."
      },
      {
        id: 'will-9',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["I will to go.", "I will going.", "I will go."],
        correct: "I will go.",
        explanation: "Will + base verb (no 'to' or '-ing')."
      },
      {
        id: 'will-10',
        type: 'fill-blank',
        question: "He ___ probably call you later.",
        options: ['will', 'is', 'does'],
        correct: 'will',
        explanation: "Predictions use 'will' (will probably...)."
      }
    ],
    conversationStarters: [
      "What will you do this weekend?",
      "Make predictions about the future",
      "What do you think will happen tomorrow?"
    ]
  },
  {
    id: 'countable-uncountable',
    title: 'Countable & Uncountable',
    subtitle: 'Nouns that Count',
    description: 'Learn when to use a, some, many, much',
    icon: '🔢',
    order: 9,
    unlocked: false,
    concepts: ['a/an', 'some/any', 'many/much'],
    prerequisites: ['verb-will'],
    theory: {
      explanation: "Countable nouns can be counted (one apple, two apples). Uncountable nouns cannot be counted (water, rice, money). This affects which words you use with them!",
      keyPoints: [
        "Countable: a/an, many, few, a lot of (an apple, many books)",
        "Uncountable: some, much, a little, a lot of (some water, much time)",
        "Common uncountable: water, rice, bread, money, information, advice, music, furniture",
        "Some uncountable nouns seem countable but aren't: news, homework, luggage"
      ]
    },
    examples: [
      { english: "I have an apple.", spanish: "Tengo una manzana.", audio: true },
      { english: "There is some water.", spanish: "Hay algo de agua.", audio: true },
      { english: "How many books do you have?", spanish: "¿Cuántos libros tienes?", audio: true },
      { english: "How much money do you need?", spanish: "¿Cuánto dinero necesitas?", audio: true },
      { english: "I don't have much time.", spanish: "No tengo mucho tiempo.", audio: true },
      { english: "She gave me some advice.", spanish: "Me dio un consejo.", audio: true }
    ],
    quiz: [
      {
        id: 'cu-1',
        type: 'fill-blank',
        question: "I need ___ milk for the recipe.",
        options: ['a', 'an', 'some'],
        correct: 'some',
        explanation: "Milk is uncountable, so use 'some'."
      },
      {
        id: 'cu-2',
        type: 'fill-blank',
        question: "Can I have ___ apple?",
        options: ['a', 'an', 'some'],
        correct: 'an',
        explanation: "'Apple' starts with a vowel, so use 'an'."
      },
      {
        id: 'cu-3',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["much", "How", "do", "water", "you", "need", "?"],
        correct: "How much water do you need?",
        explanation: "How much + uncountable noun + question."
      },
      {
        id: 'cu-4',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["many", "How", "do", "books", "you", "have", "?"],
        correct: "How many books do you have?",
        explanation: "How many + countable noun + question."
      },
      {
        id: 'cu-5',
        type: 'fill-blank',
        question: "I don't have ___ time.",
        options: ['many', 'much', 'a lot'],
        correct: 'much',
        explanation: "Time is uncountable, use 'much'."
      },
      {
        id: 'cu-6',
        type: 'fill-blank',
        question: "There is ___ water in the bottle.",
        options: ['many', 'some', 'a few'],
        correct: 'some',
        explanation: "Water is uncountable, use 'some'."
      },
      {
        id: 'cu-7',
        type: 'fill-blank',
        question: "How ___ money do you have?",
        options: ['many', 'much', 'some'],
        correct: 'much',
        explanation: "Money is uncountable, use 'much'."
      },
      {
        id: 'cu-8',
        type: 'fill-blank',
        question: "I need some ___ for breakfast.",
        options: ['breads', 'bread', 'a bread'],
        correct: 'bread',
        explanation: "Bread is uncountable (no plural)."
      },
      {
        id: 'cu-9',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["I need an advice.", "I need some advice.", "I need advices."],
        correct: "I need some advice.",
        explanation: "Advice is uncountable (no plural, no 'an')."
      },
      {
        id: 'cu-10',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["Two breads", "Two slices of bread", "A bread"],
        correct: "Two slices of bread",
        explanation: "Bread is uncountable. Use 'slices of' to count it."
      }
    ],
    conversationStarters: [
      "Tell me what food you have at home",
      "Describe what you need to buy at the supermarket",
      "Ask me about quantities using 'how much' and 'how many'"
    ]
  },
  {
    id: 'there-is-are',
    title: 'There is / There are',
    subtitle: 'Existence & Location',
    description: 'Say what exists and where things are',
    icon: '📍',
    order: 10,
    unlocked: false,
    concepts: ['there is', 'there are', 'Is there...?'],
    prerequisites: ['countable-uncountable'],
    theory: {
      explanation: "Use 'There is' for singular and uncountable nouns. Use 'There are' for plural nouns. These expressions tell us that something exists or is in a place.",
      keyPoints: [
        "There is + singular/uncountable (There is a book. There is some water.)",
        "There are + plural (There are three books.)",
        "Negative: There isn't / There aren't",
        "Questions: Is there...? / Are there...?"
      ]
    },
    examples: [
      { english: "There is a cat on the roof.", spanish: "Hay un gato en el techo.", audio: true },
      { english: "There are many people here.", spanish: "Hay muchas personas aquí.", audio: true },
      { english: "Is there a bank nearby?", spanish: "¿Hay un banco cerca?", audio: true },
      { english: "There isn't any milk.", spanish: "No hay leche.", audio: true },
      { english: "Are there any questions?", spanish: "¿Hay preguntas?", audio: true },
      { english: "There are some cookies in the jar.", spanish: "Hay algunas galletas en el frasco.", audio: true }
    ],
    quiz: [
      {
        id: 'tia-1',
        type: 'fill-blank',
        question: "There ___ a book on the table.",
        options: ['is', 'are', 'be'],
        correct: 'is',
        explanation: "'A book' is singular, so use 'There is'."
      },
      {
        id: 'tia-2',
        type: 'fill-blank',
        question: "There ___ many students in the class.",
        options: ['is', 'are', 'be'],
        correct: 'are',
        explanation: "'Many students' is plural, so use 'There are'."
      },
      {
        id: 'tia-3',
        type: 'reorder',
        question: "Ordena las palabras:",
        words: ["is", "There", "cat", "a", "the", "on", "roof"],
        correct: "There is a cat on the roof.",
        explanation: "There is + singular noun + location."
      },
      {
        id: 'tia-4',
        type: 'reorder',
        question: "Ordena para formar pregunta:",
        words: ["there", "Is", "bank", "a", "nearby", "?"],
        correct: "Is there a bank nearby?",
        explanation: "Is there + singular noun + location + ?"
      },
      {
        id: 'tia-5',
        type: 'fill-blank',
        question: "There ___ many people here.",
        options: ['is', 'are', 'be'],
        correct: 'are',
        explanation: "'Many people' is plural, use 'There are'."
      },
      {
        id: 'tia-6',
        type: 'fill-blank',
        question: "There ___ any milk in the fridge.",
        options: ["isn't", "aren't", "not"],
        correct: "isn't",
        explanation: "Milk is uncountable, use 'isn't'."
      },
      {
        id: 'tia-7',
        type: 'fill-blank',
        question: "___ there a pharmacy nearby?",
        options: ['Is', 'Are', 'Do'],
        correct: 'Is',
        explanation: "'A pharmacy' is singular, use 'Is there'."
      },
      {
        id: 'tia-8',
        type: 'fill-blank',
        question: "___ there any problems?",
        options: ['Is', 'Are', 'Do'],
        correct: 'Are',
        explanation: "'Problems' is plural, use 'Are there'."
      },
      {
        id: 'tia-9',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["There is three cats.", "There are three cats.", "There be three cats."],
        correct: "There are three cats.",
        explanation: "'Three cats' is plural, so use 'There are'."
      },
      {
        id: 'tia-10',
        type: 'multiple-choice',
        question: "How many chairs ___ in the room?",
        options: ["is there", "are there", "there are"],
        correct: "are there",
        explanation: "Questions: 'How many' + 'are there' for plural."
      }
    ],
    conversationStarters: [
      "Describe your room using 'there is' and 'there are'",
      "What is there in your neighborhood?",
      "Ask me what there is in my city"
    ]
  }
];

// Get lesson by ID
export function getLessonById(lessonId) {
  return CURRICULUM.find(lesson => lesson.id === lessonId);
}

// Get next lesson
export function getNextLesson(currentLessonId) {
  const currentIndex = CURRICULUM.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex >= CURRICULUM.length - 1) {
    return null;
  }
  return CURRICULUM[currentIndex + 1];
}

// Check if lesson is available based on progress
export function isLessonAvailable(lessonId, completedLessons) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  if (lesson.unlocked) return true;

  if (!lesson.prerequisites) return true;
  return lesson.prerequisites.every(prereqId =>
    completedLessons.some(cl => cl.lessonId === prereqId && cl.masteryPercent >= 70)
  );
}

// Get curriculum with availability status
export function getCurriculumWithStatus(progress) {
  const completedLessons = progress?.lessons || [];

  return CURRICULUM.map(lesson => {
    const lessonProgress = completedLessons.find(l => l.lessonId === lesson.id);

    return {
      ...lesson,
      available: isLessonAvailable(lesson.id, completedLessons),
      status: lessonProgress?.status || 'locked',
      masteryPercent: lessonProgress?.masteryPercent || 0
    };
  });
}
