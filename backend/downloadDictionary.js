const https = require('https');
const fs = require('fs');

// SCOWL 2020 80k word list (public domain)
const WORDLIST_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words.txt';
const OUTPUT_FILE = 'backend/englishDictionary.txt';

console.log('Downloading word list...');

https.get(WORDLIST_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download word list:', res.statusCode);
    res.resume();
    return;
  }
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const words = data.split(/\r?\n/)
      .map(w => w.trim().toUpperCase())
      .filter(Boolean);
    fs.writeFileSync(OUTPUT_FILE, words.join('\n'));
    console.log(`Dictionary saved to ${OUTPUT_FILE} with ${words.length} words.`);
  });
}).on('error', (e) => {
  console.error('Error downloading word list:', e);
}); 