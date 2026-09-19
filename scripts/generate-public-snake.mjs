import { mkdir, writeFile } from 'node:fs/promises';

const token = process.env.CONTRIBUTIONS_TOKEN;
if (!token) throw new Error('CONTRIBUTIONS_TOKEN is required');
const username = 'ikunkunkunkunkunkun';
const end = new Date();
end.setUTCHours(23, 59, 59, 999);
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 364);
const iso = date => date.toISOString().slice(0, 10);
const query = `query { user(login: "${username}") { contributionsCollection(from: "${start.toISOString()}", to: "${end.toISOString()}") { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;
const response = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'ikun-public-snake' }, body: JSON.stringify({ query }) });
const result = await response.json();
if (!response.ok || result.errors?.length) throw new Error(JSON.stringify(result.errors ?? result));
const calendar = result.data.user.contributionsCollection.contributionCalendar;
const days = calendar.weeks.flatMap(week => week.contributionDays).filter(day => day.date >= iso(start) && day.date <= iso(end));
const counts = new Map(days.map(day => [day.date, day.contributionCount]));
const max = Math.max(1, ...days.map(day => day.contributionCount));
const color = count => count === 0 ? '#161b22' : count / max < .2 ? '#0e4429' : count / max < .4 ? '#006d32' : count / max < .7 ? '#26a641' : '#39d353';
const step = 18, size = 14, cols = 53;
const cells = [];
for (let i = 0; i < 365; i++) {
  const date = new Date(start); date.setUTCDate(date.getUTCDate() + i);
  const day = date.getUTCDay(); const col = Math.floor((i + start.getUTCDay()) / 7);
  const dateText = iso(date); const count = counts.get(dateText) ?? 0;
  cells.push(`<rect x="${col * step}" y="${day * step}" width="${size}" height="${size}" rx="3" fill="${color(count)}"><title>${dateText} · ${count} contributions</title></rect>`);
}
const route = []; for (let y = 0; y < 7; y++) { const xs = [...Array(cols).keys()]; if (y % 2) xs.reverse(); for (const x of xs) route.push({ x, y }); }
const head = Math.floor(route.length * .18);
const coords = (offset, axis) => route.map((_, i) => { const p = route[(i - offset + route.length) % route.length]; return axis === 'x' ? p.x * step + 1 : p.y * step + 1; }).join(';');
const snake = Array.from({ length: 6 }, (_, i) => { const p = route[(head - i + route.length) % route.length]; return `<rect x="${p.x * step + 1}" y="${p.y * step + 1}" width="${size - 2}" height="${size - 2}" rx="3" fill="${i ? '#a400a6' : '#cc1bc9'}"><animate attributeName="x" dur="32s" repeatCount="indefinite" values="${coords(i, 'x')}"/><animate attributeName="y" dur="32s" repeatCount="indefinite" values="${coords(i, 'y')}"/></rect>`; }).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * step}" height="126" viewBox="0 0 ${cols * step} 126"><rect width="100%" height="100%" fill="#0d1117"/>${cells.join('')}<g aria-label="Contribution snake">${snake}</g></svg>\n`;
await mkdir('dist', { recursive: true });
await writeFile('dist/github-contribution-grid-snake-dark.svg', svg);
await writeFile('dist/github-contribution-grid-snake.svg', svg);
console.log(`Generated rolling-year snake: ${calendar.totalContributions} contributions, ${days.length} days`);
