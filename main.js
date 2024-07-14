const AVATAR_SIZE = 100;
const LARGE_PRIME = 257;

const app = document.getElementById('app');

const [
  namesStr,
  offsetStr = '0',
] = document.location.hash.slice(1).split(';', 2);
const names = namesStr.split(',');
const offset = Math.floor(parseInt(offsetStr, 10) / LARGE_PRIME) % names.length;

const taggedNames = names.map((name, index) => {
  return { name, isFinalist: offset === index, originalIndex: index };
});

app.style.setProperty('--count', names.length);
app.style.setProperty('--avatar-size', `${AVATAR_SIZE}px`);

// Shuffle tagged names
for (let i = taggedNames.length - 1; i >= 1; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const t = taggedNames[i];
  taggedNames[i] = taggedNames[j];
  taggedNames[j] = t;
}

const images = new Array();
let finalIndex = 0;
for (const [i, { name, isFinalist, originalIndex }] of taggedNames.entries()) {
  // Twice the declared size because the finalist zooms in.
  const avatarUrl = `https://github.com/${name}.png?size=${2 * AVATAR_SIZE}`;
  const avatar2xUrl = `https://github.com/${name}.png?size=${4 *AVATAR_SIZE}`;

  const img = document.createElement('img');
  img.srcset = `${avatar2xUrl} 2x, ${avatarUrl}`;
  img.width = AVATAR_SIZE;
  img.height = AVATAR_SIZE;
  img.className = 'avatar';

  img.style.setProperty('--index', i);

  if (isFinalist) {
    img.classList.add('finalist');

    // Not that it matters
    img.style.setProperty('--final-index', names.length - 1);
  } else {
    img.style.setProperty('--final-index', finalIndex++);
  }

  img.addEventListener('click', e => {
    e.preventDefault();

    const newOffset =
      (
        Math.floor(Math.random() * 1000) * names.length +
          originalIndex
      ) * LARGE_PRIME + Math.floor(Math.random() * LARGE_PRIME);
    document.location.hash = `#${names.join(',')};${newOffset}`;
    document.location.reload();
  });

  images.push(img);
}

await Promise.all(images.map(img => new Promise(resolve => {
  img.onload = resolve;
})));

for (const img of images) {
  app.appendChild(img);
}

const finalistName = names[offset];

const text = document.createElement('div');
text.className = 'text';
text.textContent = `Next on-call: ${finalistName}!`;
app.appendChild(text);

// Start animation
app.style.setProperty('--t', 1);
