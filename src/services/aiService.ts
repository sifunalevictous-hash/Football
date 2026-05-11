import { GoogleGenAI } from "@google/genai";
import { Fixture, TeamStats, HeadToHead } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEnhancedAIInsights(fixture: Fixture, homeStats?: TeamStats | null, awayStats?: TeamStats | null, h2h?: HeadToHead | null) {
  const homePlayers = fixture.homeTeam.players?.map(p => `${p.name} (${p.position}, ${p.goals} goals)`).join(', ');
  const awayPlayers = fixture.awayTeam.players?.map(p => `${p.name} (${p.position}, ${p.goals} goals)`).join(', ');
  
  const h2hContext = h2h ? `Historical H2H: Home Wins: ${h2h.homeWins}, Away Wins: ${h2h.awayWins}, Draws: ${h2h.draws}. Last matches: ${h2h.lastMatches.map(m => `${m.date} ${m.score}`).join('; ')}.` : '';
  
  const statsContext = (homeStats && awayStats) ? 
    `Season Stats - ${fixture.homeTeam.name}: P${homeStats.played} W${homeStats.won} GF${homeStats.goalsFor} GA${homeStats.goalsAgainst} Form:${homeStats.form.join('')}. 
     ${fixture.awayTeam.name}: P${awayStats.played} W${awayStats.won} GF${awayStats.goalsFor} GA${awayStats.goalsAgainst} Form:${awayStats.form.join('')}.` : '';

  const prompt = `Advanced Football Tactical Analysis & Player Predictions:
  Match: ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} (${fixture.league})
  
  ${statsContext}
  ${h2hContext}
  
  Key Home Players: ${homePlayers || 'N/A'}
  Key Away Players: ${awayPlayers || 'N/A'}
  
  Incorporate real-time information and news for these teams. 
  
  Required Output (JSON):
  1. winner: Winner/Draw Prediction
  2. score: Exact score line
  3. confidence: Confidence % (number)
  4. tacticalBreakdown: Detailed 3-point tactical breakdown (string[])
  5. playerPredictions: Predictive performance for 2 key players (one from each team). Each should be an object with: { name: string, team: string, insight: string, stats: { form: string[], goals: number, assists: number, rating: number } }
  6. btts: BTTS probability (number)
  
  Ensure search grounding is used for injuries, transfers, and recent form.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Insight Error:", error);
    throw error;
  }
}
