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
        type: 'fill-blank',
        question: "The cat ___ on the table.",
        options: ['am', 'is', 'are'],
        correct: 'is',
        explanation: "With 'it' (the cat), use 'is'."
      },
      {
        id: 'tobe-5',
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
        type: 'fill-blank',
        question: "We ___ from Spain.",
        options: ["isn't", "aren't", "am not"],
        correct: "aren't",
        explanation: "With 'we', use 'aren't'."
      },
      {
        id: 'tobe-neg-4',
        type: 'transform',
        question: "Make negative: 'She is happy.'",
        options: ["She isn't happy.", "She aren't happy.", "She am not happy."],
        correct: "She isn't happy.",
        explanation: "She + isn't for negatives."
      },
      {
        id: 'tobe-neg-5',
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
        question: "Make a question: you / are / hungry / ?",
        options: ["Are you hungry?", "You are hungry?", "Hungry are you?"],
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
        type: 'fill-blank',
        question: "___ they at the party?",
        options: ['Am', 'Is', 'Are'],
        correct: 'Are',
        explanation: "With 'they', use 'Are'."
      },
      {
        id: 'tobe-q-4',
        type: 'multiple-choice',
        question: "Answer: 'Is he your friend?' - 'Yes, ___'",
        options: ["he is.", "he's.", "is he."],
        correct: "he is.",
        explanation: "Short answer: Yes, he is."
      },
      {
        id: 'tobe-q-5',
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
        type: 'fill-blank',
        question: "He ___ to the gym.",
        options: ['go', 'goes', 'going'],
        correct: 'goes',
        explanation: "'Go' becomes 'goes' with he/she/it."
      },
      {
        id: 'sp-4',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["She watchs TV.", "She watches TV.", "She watch TV."],
        correct: "She watches TV.",
        explanation: "Verbs ending in -ch add -es."
      },
      {
        id: 'sp-5',
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
        type: 'fill-blank',
        question: "He ___ eat meat.",
        options: ["don't", "doesn't", "isn't"],
        correct: "doesn't",
        explanation: "With 'he', use 'doesn't'."
      },
      {
        id: 'do-4',
        type: 'multiple-choice',
        question: "Which is correct?",
        options: ["Does she works here?", "Does she work here?", "Do she work here?"],
        correct: "Does she work here?",
        explanation: "After 'does', use base form (work, not works)."
      },
      {
        id: 'do-5',
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
        type: 'audio-match',
        question: "Listen and repeat: 'The weather is nice.'",
        focus: 'th',
        target: "The weather is nice."
      },
      {
        id: 'pron-4',
        type: 'stress',
        question: "Where is the stress? INFORMATION",
        options: ["in-FOR-ma-tion", "in-for-MA-tion", "IN-for-ma-tion"],
        correct: "in-for-MA-tion"
      },
      {
        id: 'pron-5',
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
