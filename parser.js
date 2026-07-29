/**
 * Parses raw LLM response text and validates it against the expected Student Assistant schema.
 * Handles malformed JSON, missing fields, or incorrect types gracefully.
 */
export function parseAndValidateAIResponse(rawText) {
  if (!rawText) {
    return {
      success: false,
      error: 'Empty response received from server.',
      data: getFallbackData()
    };
  }

  let parsed = null;

  // Try parsing directly if it's already an object (some fetch/axios setups do this)
  if (typeof rawText === 'object') {
    parsed = rawText;
  } else {
    try {
      // Pre-process text to remove common markdown JSON block envelopes
      let cleanText = rawText.trim();
      if (cleanText.startsWith('```')) {
        // Strip out ```json ... ``` or ``` ... ```
        cleanText = cleanText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '');
      }
      parsed = JSON.parse(cleanText.trim());
    } catch (e) {
      console.warn('⚠️ [Parser] Failed to parse response text as JSON:', e.message);
      return {
        success: false,
        error: 'The AI returned invalid JSON formatting. Please try generating again.',
        data: getFallbackData('Failed to parse AI output')
      };
    }
  }

  // Validate and sanitize structural fields
  const sanitized = {
    title: typeof parsed.title === 'string' ? parsed.title.trim() : 'Study Assistant Session',
    flashcards: [],
    quiz: []
  };

  // 1. Validate Flashcards
  if (Array.isArray(parsed.flashcards)) {
    parsed.flashcards.forEach((card, idx) => {
      if (card && typeof card === 'object') {
        const question = typeof card.question === 'string' ? card.question.trim() : `Key Concept ${idx + 1}`;
        const answer = typeof card.answer === 'string' ? card.answer.trim() : 'Definition not provided.';
        sanitized.flashcards.push({ question, answer });
      }
    });
  }

  // 2. Validate Quiz Questions
  if (Array.isArray(parsed.quiz)) {
    parsed.quiz.forEach((qItem, idx) => {
      if (qItem && typeof qItem === 'object') {
        const question = typeof qItem.question === 'string' ? qItem.question.trim() : `Question ${idx + 1}`;
        
        let options = [];
        if (Array.isArray(qItem.options)) {
          options = qItem.options.map(opt => (typeof opt === 'string' || typeof opt === 'number') ? String(opt).trim() : '');
        }
        
        // Ensure we have 4 options
        while (options.length < 4) {
          options.push(`Option ${options.length + 1}`);
        }
        options = options.slice(0, 4);

        let correctAnswerIndex = Number(qItem.correctAnswerIndex);
        if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex > 3) {
          correctAnswerIndex = 0; // Fallback
        }

        const explanation = typeof qItem.explanation === 'string' ? qItem.explanation.trim() : 'No explanation provided.';

        sanitized.quiz.push({
          question,
          options,
          correctAnswerIndex,
          explanation
        });
      }
    });
  }

  // If both flashcards and quiz came out completely empty, flag it as validation failure
  if (sanitized.flashcards.length === 0 && sanitized.quiz.length === 0) {
    return {
      success: false,
      error: 'No valid flashcards or quiz items could be extracted from the notes.',
      data: getFallbackData('Empty study set')
    };
  }

  return {
    success: true,
    error: null,
    data: sanitized
  };
}

/**
 * Returns a safe placeholder dataset in case of complete parsing failure.
 */
function getFallbackData(reason = 'Placeholder') {
  return {
    title: `Study Session (${reason})`,
    flashcards: [
      {
        question: 'What is a Binary Search Tree (BST)?',
        answer: 'A binary tree where the left child is less than the parent, and the right child is greater than the parent.'
      },
      {
        question: 'What is a Thread in operating systems?',
        answer: 'The smallest unit of execution within a process, sharing the process memory space.'
      }
    ],
    quiz: [
      {
        question: 'Which of the following describes a Deadlock?',
        options: [
          'A situation where two or more processes are blocked forever, waiting for each other.',
          'A process that finishes execution but still has an entry in the process table.',
          'The allocation of memory in non-contiguous blocks.',
          'An algorithm for finding the shortest path.'
        ],
        correctAnswerIndex: 0,
        explanation: 'Deadlock happens when processes hold resources and wait for others to release resources in a circular cycle.'
      }
    ]
  };
}
