// ============================================
// CERVEAU CIBLE — Anthropic API Service
// Direct client-side calls to Claude API
// ============================================

import storage from './storage.js';

const API_URL = 'https://api.anthropic.com/v1/messages';

export async function callClaude({ systemPrompt, messages, useWebSearch = false, onStream = null }) {
  const apiKey = await storage.getApiKey();
  if (!apiKey) {
    throw new Error('Clé API non configurée. Allez dans Settings pour la configurer.');
  }

  const model = await storage.getModel();

  const body = {
    model,
    max_tokens: 8000,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  };

  // Add web_search tool only for the Researcher
  if (useWebSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Erreur API: ${response.status}`);
  }

  const data = await response.json();

  // Extract text from response content blocks
  let text = '';
  if (data.content) {
    for (const block of data.content) {
      if (block.type === 'text') {
        text += block.text;
      }
    }
  }

  return {
    text,
    raw: data,
    stopReason: data.stop_reason,
    usage: data.usage
  };
}

export function buildContext(profile) {
  let context = '';

  if (profile.brief) {
    context += '\n## BRIEF\n';
    if (typeof profile.brief === 'object') {
      context += Object.entries(profile.brief)
        .filter(([_, v]) => v)
        .map(([k, v]) => `**${k}**: ${v}`)
        .join('\n');
    } else {
      context += profile.brief;
    }
  }

  if (profile.research) {
    context += '\n\n## RECHERCHE MARCHÉ\n' + profile.research;
  }

  if (profile.neuroProfile) {
    context += '\n\n## NEURO-PROFIL\n' + profile.neuroProfile;
  }

  if (profile.corrections) {
    context += '\n\n## CORRECTIONS TERRAIN\n' + profile.corrections;
  }

  if (profile.ua) {
    context += '\n\n## UNFAIR ADVANTAGE\n' + profile.ua;
  }

  return context;
}
