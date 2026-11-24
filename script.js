const FALLBACK_QUOTES = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { content: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { content: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese Proverb" },
  { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { content: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" }
];

function randomFallbackQuote() {
  return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
}

async function fetchQuote() {
  try {
    // Quotable (api.quotable.io) shut down, so quotes now come from ZenQuotes.
    // ZenQuotes returns [{ q, a, h }] — the quote text is in `q`, the author in `a`.
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    const quote = Array.isArray(data) ? data[0] : data;
    if (!quote || !quote.q) {
      throw new Error('Unexpected quote response');
    }
    return { content: quote.q, author: quote.a };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function updateQuote() {
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('author');

  fetchQuote()
    .then((data) => {
      quoteElement.textContent = data.content;
      authorElement.textContent = `— ${data.author}`;
    })
    .catch((error) => {
      console.error('Error:', error);
      // If the API is unreachable, show a built-in quote so the page never goes blank again.
      const fallback = randomFallbackQuote();
      quoteElement.textContent = fallback.content;
      authorElement.textContent = `— ${fallback.author}`;
    });
}

(function() {
  try {
    function updateTheme() {
      const d = document.documentElement;
      const c = d.classList;
      c.remove('light-theme', 'dark-theme');
      const e = localStorage.getItem('theme');
      if (e === 'system' || (!e && true)) {
        const t = '(prefers-color-scheme: dark)',
          m = window.matchMedia(t);
        if (m.matches) {
          d.style.colorScheme = 'dark';
          c.add('dark-theme');
        } else {
          d.style.colorScheme = 'light';
          c.add('light-theme');
        }
      } else if (e) {
        c.add(e + '-theme' || '');
      }
      if (e === 'light' || e === 'dark') d.style.colorScheme = e;
    }

    updateTheme();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', updateTheme);
    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', updateTheme);
  } catch (e) { }
})();

updateQuote();
