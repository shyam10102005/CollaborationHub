const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/ai/generate - AI Content Generation
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { prompt, type, platform, tone } = req.body;

    // Try Ollama first, fallback to mock
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: buildPrompt(prompt, type, platform, tone),
          stream: false
        })
      });

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json();
        return res.json({ content: data.response, source: 'ollama' });
      }
    } catch (e) {
      // Ollama not available, use mock
    }

    // Mock AI response
    const mockResponse = generateMockResponse(prompt, type, platform, tone);
    res.json({ content: mockResponse, source: 'mock' });
  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// POST /api/ai/hashtags - Generate hashtags
router.post('/hashtags', authenticateToken, async (req, res) => {
  try {
    const { topic, platform, count } = req.body;
    const hashtags = generateHashtags(topic, platform, count || 15);
    res.json({ hashtags });
  } catch (err) {
    console.error('Hashtag generation error:', err);
    res.status(500).json({ error: 'Hashtag generation failed' });
  }
});

// POST /api/ai/collab-suggestions - AI Collaboration Suggestions
router.post('/collab-suggestions', authenticateToken, async (req, res) => {
  try {
    const { niche, audience_size, location } = req.body;
    const suggestions = [
      {
        idea: 'Joint Live Stream: Q&A with Both Communities',
        description: 'Host a collaborative live stream where both creators answer questions from each other\'s audiences, maximizing cross-pollination.',
        platforms: ['Instagram', 'YouTube'],
        estimated_reach: '150K-300K combined'
      },
      {
        idea: 'Content Swap Challenge',
        description: 'Each creator takes over the other\'s account for a day, creating content in their unique style for the partner\'s audience.',
        platforms: ['Instagram', 'TikTok'],
        estimated_reach: '200K-400K combined'
      },
      {
        idea: 'Co-Created Tutorial Series',
        description: 'Develop a 3-part educational series combining both creators\' expertise, published across both channels.',
        platforms: ['YouTube'],
        estimated_reach: '100K-250K per episode'
      }
    ];
    res.json({ suggestions });
  } catch (err) {
    console.error('Collab suggestion error:', err);
    res.status(500).json({ error: 'Suggestion generation failed' });
  }
});

// POST /api/ai/growth-insights - AI Growth Analysis
router.post('/growth-insights', authenticateToken, async (req, res) => {
  try {
    const insights = [
      {
        type: 'optimal_posting',
        title: 'Best Posting Times',
        insight: 'Your audience is most active between 6-8 PM EST on weekdays and 10 AM-12 PM on weekends.',
        action: 'Schedule your next 5 posts during these peak engagement windows.',
        impact: 'high'
      },
      {
        type: 'content_format',
        title: 'Carousel Posts Outperform',
        insight: 'Your carousel posts receive 3.2x more saves and 1.8x more shares compared to single image posts.',
        action: 'Increase carousel content to 40% of your posting schedule.',
        impact: 'high'
      },
      {
        type: 'hook_optimization',
        title: 'Improve Reel Hooks',
        insight: 'Your Reels have a 45% skip rate in the first 3 seconds. Top performers in your niche average 28%.',
        action: 'Start with a bold visual or provocative question in the first frame.',
        impact: 'medium'
      },
      {
        type: 'audience_growth',
        title: 'Untapped Audience Segment',
        insight: 'Your content resonates strongly with 25-34 demographics but you\'re missing the 18-24 segment.',
        action: 'Create trending audio-driven short-form content to attract younger audiences.',
        impact: 'medium'
      }
    ];
    res.json({ insights });
  } catch (err) {
    console.error('Growth insights error:', err);
    res.status(500).json({ error: 'Insights generation failed' });
  }
});

function buildPrompt(prompt, type, platform, tone) {
  const platformGuides = {
    instagram: 'Keep it concise, use emojis, and include a call-to-action. Optimal length: 125-150 characters for feed posts.',
    youtube: 'Make it informative and SEO-friendly. Include keywords naturally. Optimal title length: 60-70 characters.',
    tiktok: 'Be casual, trendy, and attention-grabbing. Use current slang and references.',
    twitter: 'Be punchy and concise. Max 280 characters. Use threads for longer content.',
  };

  return `You are an expert social media content strategist. 
${type === 'caption' ? 'Generate an engaging caption' : type === 'idea' ? 'Suggest creative content ideas' : 'Create content'} for ${platform || 'social media'}.
Tone: ${tone || 'professional yet friendly'}.
${platformGuides[platform] || ''}
User's request: ${prompt}
Provide your response directly without any preamble.`;
}

function generateMockResponse(prompt, type, platform, tone) {
  const captions = {
    instagram: `✨ ${prompt || 'Creating something extraordinary'}\n\nEvery great journey starts with a single step. Today, we're taking ours together. 🚀\n\nDouble tap if you're ready to level up! 💫\n\n#ContentCreator #CreatorEconomy #DigitalCreator #Inspiration #Growth`,
    youtube: `🎬 ${prompt || 'The Ultimate Guide You\'ve Been Waiting For'}\n\nIn this video, I break down everything you need to know. From beginner tips to advanced strategies, this is your complete roadmap.\n\n⏱️ Timestamps:\n0:00 - Introduction\n2:30 - Key Concepts\n5:00 - Deep Dive\n8:00 - Pro Tips\n10:00 - Final Thoughts\n\n👉 Don't forget to SUBSCRIBE and hit the bell!`,
    tiktok: `POV: when you finally figure out the secret 😱🔥\n\n${prompt || 'This changes everything fr fr'}\n\nFollow for more game-changing tips! 💯`,
    twitter: `💡 ${prompt || 'Here\'s what most people get wrong'}:\n\nIt's not about working harder. It's about working smarter.\n\nThe top 1% know this. Now you do too. 🧵👇`,
  };

  const ideas = [
    `📌 Content Idea: "Day in My Life" vlog with a twist — show the behind-the-scenes chaos that goes into creating polished content.`,
    `📌 Content Idea: React video to trending topics in your niche. These consistently drive high engagement.`,
    `📌 Content Idea: Tutorial series breaking down your creative process step-by-step.`,
  ];

  if (type === 'idea') return ideas.join('\n\n');
  return captions[platform] || captions.instagram;
}

function generateHashtags(topic, platform, count) {
  const base = (topic || 'content').toLowerCase().replace(/\s+/g, '');
  const hashtags = [
    `#${base}`, `#${base}creator`, `#${base}tips`,
    '#contentcreator', '#creatoreconomy', '#digitalcreator',
    '#socialmediatips', '#growthhacking', '#influencer',
    '#brandcollabs', '#creatortips', '#socialmedia',
    '#trending', '#viral', '#fyp',
    `#${base}community`, `#${base}life`, '#motivation',
    '#entrepreneurlife', '#personalbranding'
  ];
  return hashtags.slice(0, count);
}

module.exports = router;
