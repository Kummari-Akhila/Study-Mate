import { parseAndValidateAIResponse } from '../utils/parser';

// Use environment variable or default to local proxy port 3001
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Sends notes text to the backend proxy, handles timeout, and returns parsed study structures.
 * Supports AbortSignal for request cancellation or timeouts.
 */
export async function generateStudyAssistantContent(notes, signal = null) {
  const endpoint = `${API_URL}/api/generate`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes }),
      signal
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Pass raw JSON response through our robust validator
    return parseAndValidateAIResponse(data);

  } catch (error) {
    console.error('❌ [aiService Error]:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'The request took too long to respond. Please try again with shorter text or a different model.',
        data: null
      };
    }

    return {
      success: false,
      error: error.message || 'An unexpected network error occurred. Is the proxy server running?',
      data: null
    };
  }
}
