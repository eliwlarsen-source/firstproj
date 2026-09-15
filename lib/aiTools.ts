export interface AiTool {
  name: string;
  url: string;
  category: string;
  description: string;
  bestFor: string;
  // Words/phrases that boost this tool's match score when they appear
  // in the user's input. Keep these lowercase.
  keywords: string[];
}

// Hand-curated list of current, well-known AI tools grouped by what
// they're actually good at. This isn't exhaustive — it's meant to cover
// the most common "what should I use for X" situations. Update this file
// as new tools become the obvious pick for a category.
//
// Last reviewed: 2026-09-15
export const aiTools: AiTool[] = [
  {
    name: "Claude",
    url: "https://claude.ai",
    category: "General assistant & writing",
    description:
      "Anthropic's general-purpose assistant. Strong at careful writing, analysis, long documents, and following nuanced instructions.",
    bestFor: "Writing, editing, research synthesis, careful reasoning, long documents",
    keywords: [
      "write", "writing", "essay", "email", "draft", "edit", "editing", "proofread",
      "summarize", "summary", "analyze", "analysis", "research", "reasoning",
      "long document", "report", "rewrite", "tone", "letter",
    ],
  },
  {
    name: "ChatGPT",
    url: "https://chatgpt.com",
    category: "General assistant",
    description:
      "OpenAI's general-purpose assistant with a huge plugin/GPT ecosystem, voice mode, and built-in image generation.",
    bestFor: "General Q&A, brainstorming, everyday tasks, quick image generation",
    keywords: [
      "brainstorm", "idea", "ideas", "general question", "explain", "learn",
      "homework", "study", "quick answer",
    ],
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    category: "General assistant",
    description:
      "Google's assistant, tightly integrated with Gmail, Docs, Sheets, and Search — good when your work already lives in Google's ecosystem.",
    bestFor: "Working inside Google Docs/Sheets/Gmail, integrating with Google Workspace",
    keywords: [
      "google docs", "gmail", "google sheets", "google workspace", "google slides",
      "workspace",
    ],
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "Search & research",
    description:
      "An AI answer engine built around live web search with cited sources — better than a chatbot when you need to know what's true right now.",
    bestFor: "Fact-checking, current events, research with citations, comparison shopping",
    keywords: [
      "search", "research", "sources", "citation", "citations", "fact check",
      "current events", "news", "compare", "comparison", "what is the latest",
      "look up",
    ],
  },
  {
    name: "Claude Code",
    url: "https://claude.com/claude-code",
    category: "Coding — agentic",
    description:
      "A terminal/IDE agent that reads your codebase, plans, edits files, runs commands, and can drive a task end-to-end rather than just answering questions.",
    bestFor: "Building or modifying a real codebase, multi-file changes, autonomous coding tasks",
    keywords: [
      "code", "coding", "build an app", "build a website", "programming",
      "software", "debug", "refactor", "codebase", "terminal", "agent",
      "automate coding", "fix a bug",
    ],
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    category: "Coding — in-editor",
    description:
      "Inline code completion and chat built into your existing editor (VS Code, JetBrains, etc.) — lightweight, low-friction autocomplete-style help.",
    bestFor: "Autocomplete-style coding help inside an editor you already use",
    keywords: ["autocomplete", "vs code", "ide", "editor", "inline suggestions"],
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    category: "Coding — AI-native editor",
    description:
      "A code editor built around AI from the ground up, with strong multi-file editing and chat-driven refactors.",
    bestFor: "An AI-first coding environment as your daily editor",
    keywords: ["cursor", "ai editor", "pair programming"],
  },
  {
    name: "v0",
    url: "https://v0.app",
    category: "Coding — UI generation",
    description:
      "Generates React/Next.js UI components and full pages from a text description or screenshot.",
    bestFor: "Quickly generating a web UI or landing page from a description",
    keywords: [
      "ui", "landing page", "website design", "react component", "frontend",
      "mockup to code", "screenshot to code",
    ],
  },
  {
    name: "Midjourney",
    url: "https://www.midjourney.com",
    category: "Image generation",
    description:
      "Produces highly stylized, artistic images — often the top pick for illustration, concept art, and striking visuals.",
    bestFor: "Artistic or stylized image generation, concept art, illustrations",
    keywords: [
      "image", "picture", "illustration", "art", "artwork", "concept art",
      "poster", "logo", "generate an image", "draw",
    ],
  },
  {
    name: "Adobe Firefly",
    url: "https://firefly.adobe.com",
    category: "Image generation — commercial-safe",
    description:
      "Adobe's generative image tool, trained on licensed content, integrated with Photoshop/Illustrator — the safer pick for commercial work.",
    bestFor: "Commercial image work, editing inside Photoshop/Illustrator, brand-safe generation",
    keywords: [
      "commercial use", "photoshop", "illustrator", "brand safe", "stock image",
      "product photo",
    ],
  },
  {
    name: "Ideogram",
    url: "https://ideogram.ai",
    category: "Image generation — text in images",
    description:
      "Image generator that's noticeably better than most at rendering legible text inside the image (posters, logos, signage).",
    bestFor: "Images that need readable text, logos, posters with words",
    keywords: [
      "text in image", "typography", "logo with text", "sign", "poster with text",
      "text in it", "with text", "has text", "readable text", "legible text",
    ],
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    category: "Video generation & editing",
    description:
      "Text-to-video and video editing tools aimed at filmmakers and creators, with fine-grained camera and motion control.",
    bestFor: "AI video generation with creative/editing control",
    keywords: [
      "video", "text to video", "film", "filmmaking", "animation", "motion",
      "video editing",
    ],
  },
  {
    name: "Luma Dream Machine",
    url: "https://lumalabs.ai/dream-machine",
    category: "Video generation",
    description: "Fast, easy text-to-video generation aimed at quick, shareable clips.",
    bestFor: "Quick, casual AI video clips",
    keywords: ["short video", "quick video clip", "social video"],
  },
  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    category: "Voice & audio",
    description:
      "The standard for realistic AI voice generation, voice cloning, and text-to-speech.",
    bestFor: "Voiceovers, narration, voice cloning, text-to-speech",
    keywords: [
      "voice", "voiceover", "narration", "text to speech", "tts", "podcast audio",
      "clone my voice", "dubbing",
    ],
  },
  {
    name: "Suno",
    url: "https://suno.com",
    category: "Music generation",
    description: "Generates full songs — vocals, instrumentation, and lyrics — from a text prompt.",
    bestFor: "Generating original music or songs from a description",
    keywords: ["music", "song", "lyrics", "compose", "soundtrack", "jingle"],
  },
  {
    name: "NotebookLM",
    url: "https://notebooklm.google.com",
    category: "Research & study tool",
    description:
      "Upload your own documents/sources and it answers questions and generates summaries or audio overviews grounded strictly in them.",
    bestFor: "Studying or querying a specific set of documents/sources you provide",
    keywords: [
      "study", "notes", "source material", "textbook", "lecture notes",
      "study guide", "podcast from documents", "grounded in my documents",
    ],
  },
  {
    name: "Gamma",
    url: "https://gamma.app",
    category: "Presentations & docs",
    description:
      "Turns a text prompt or outline into a designed slide deck, document, or webpage in minutes.",
    bestFor: "Quickly generating a presentation, pitch deck, or one-pager",
    keywords: [
      "presentation", "slides", "slide deck", "pitch deck", "powerpoint",
      "deck", "one-pager",
    ],
  },
  {
    name: "Otter.ai",
    url: "https://otter.ai",
    category: "Meetings & transcription",
    description: "Joins calls to transcribe, summarize, and pull out action items automatically.",
    bestFor: "Meeting notes, transcription, action items from calls",
    keywords: [
      "meeting notes", "transcribe", "transcription", "call notes", "action items",
      "zoom", "minutes of meeting",
    ],
  },
  {
    name: "Zapier AI / Zapier Agents",
    url: "https://zapier.com/agents",
    category: "Automation & agents",
    description:
      "Connects thousands of apps and lets you build AI-driven automations without writing code.",
    bestFor: "Automating repetitive tasks across apps you already use, no-code",
    keywords: [
      "automate", "automation", "workflow", "integrate apps", "no code",
      "connect apps", "zapier",
    ],
  },
  {
    name: "GitHub Copilot Workspace",
    url: "https://githubnext.com/projects/copilot-workspace",
    category: "Coding — planning & agents",
    description:
      "Task-first coding agent that plans a change across a repo before writing any code, inside GitHub's own workflow.",
    bestFor: "Planning and executing a scoped coding task tied to a GitHub issue",
    keywords: ["github issue", "plan a code change", "pull request"],
  },
];
