import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.VITE_GOOGLE_TRANSLATE_API_KEY;

const TARGET_LANGS = [
  'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh-CN', 'ja', 
  'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'
];

const SOURCE_STRINGS = {
  'app.title': 'Goal Momentum Tracker',
  'app.subtitle': 'Track your daily growth signals and build unstoppable momentum.',
  'ring.label': '7-Day Performance Index',
  'ring.nodata': 'Not enough data yet',
  'slider.drive': 'Motivation',
  'slider.drive.desc': 'How driven and motivated do you feel today?',
  'slider.energy': 'Energy Level',
  'slider.energy.desc': 'How energized and ready to go are you today?',
  'slider.focus': 'Focus Quality',
  'slider.focus.desc': 'How sharp and focused is your mind today?',
  'slider.clarity': 'Mental Clarity',
  'slider.clarity.desc': 'How clear and organized are your thoughts today?',
  'slider.impact': 'How much did this move you forward?',
  'slider.impact.desc': 'Rate the impact of your actions today.',
  'action.label': 'Did you make progress toward your goal today?',
  'action.yes': 'Yes, I did',
  'action.no': 'Not today',
  'action.note.label': 'Action Note',
  'action.note.placeholder': 'What did you do today?',
  'blocker.label': "What's slowing your progress?",
  'blocker.placeholder': 'Anything holding you back?',
  'save.save': "Log Today's Progress",
  'save.saved': 'Entry Saved ✓',
  'insights.toggle': 'Goal Insights',
  'insights.trend': '7-Day Trend',
  'insights.drive': 'Motivation',
  'insights.energy': 'Energy Level',
  'insights.focus': 'Focus Quality',
  'insights.clarity': 'Mental Clarity',
  'insights.consistency': 'Action consistency:',
  'insights.days': 'days with meaningful action taken.',
  'insights.multiplier.pre': 'Performance increases',
  'insights.multiplier.post': 'on days you take action.',
  'history.title': 'Entry History',
  'history.toggle': 'Show History',
  'history.nodata': 'No entries yet. Start tracking to build your history.',
  'history.action.yes': 'Progress made',
  'history.action.no': 'No progress',
  'history.blocker': 'Blocker',
  'goal.ask': "This Month's Goal",
  'goal.ask.sub': 'Define a goal you want to track – personal, professional, or anything that matters to you.',
  'goal.placeholder': 'e.g. Improve communication skills, Win an award...',
  'goal.add': 'Add Goal',
  'goal.recent': 'Your Goals',
  'goal.back': 'All Goals',
  'goal.delete': 'Delete Goal',
  'goal.loading': 'Loading your data...',
  'category.learning.title': 'Learning Goals',
  'category.learning.desc': 'Skill-building',
  'category.performance.title': 'Performance Goals',
  'category.performance.desc': 'Output/results',
  'category.behavioral.title': 'Behavioral Goals',
  'category.behavioral.desc': 'Habits, mindset',
  'category.select': 'Select a category',
};

async function translateText(text, targetLang) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      target: targetLang,
      format: 'text'
    })
  });
  const data = await response.json();
  if (data.error) {
    console.error(`Translation error for ${targetLang}:`, data.error);
    return text;
  }
  return data.data.translations[0].translatedText;
}

async function run() {
  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }

  // Save English source
  fs.writeFileSync(
    path.join(localesDir, 'en.json'),
    JSON.stringify(SOURCE_STRINGS, null, 2)
  );
  console.log('Saved en.json');

  for (const lang of TARGET_LANGS) {
    console.log(`Translating to ${lang}...`);
    const translated = {};
    const keys = Object.keys(SOURCE_STRINGS);
    const values = Object.values(SOURCE_STRINGS);

    // Call API in batches or one by one. Batch is better.
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        q: values,
        target: lang,
        format: 'text'
      })
    });
    
    const data = await response.json();
    if (data.error) {
      console.error(`Error translating to ${lang}:`, data.error);
      continue;
    }

    const translations = data.data.translations;
    keys.forEach((key, i) => {
      translated[key] = translations[i].translatedText;
    });

    fs.writeFileSync(
      path.join(localesDir, `${lang}.json`),
      JSON.stringify(translated, null, 2)
    );
    console.log(`Saved ${lang}.json`);
  }
  console.log('All translations complete!');
}

run().catch(console.error);
