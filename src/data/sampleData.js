// File: src/data/sampleData.js
export const players = Array.from({ length: 100 }, (_, i) => {
  const names = ['LeBron', 'Curry', 'Durant', 'Embiid', 'Doncic', 'Tatum', 'Butler', 'Morant', 'Mitchell', 'Booker'];
  const teams = ['Lakers', 'Warriors', 'Suns', '76ers', 'Mavericks', 'Celtics', 'Heat', 'Grizzlies', 'Cavs', 'Suns'];
  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
  const name = `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}`;

  const points = Math.random() * 20 - 10;
  const rebounds = Math.random() * 15 - 7.5;
  const assists = Math.random() * 12 - 6;
  const fgPct = Math.random() * 10 - 5;
  const threePct = Math.random() * 10 - 5;
  const efgPct = Math.random() * 10 - 5;
  const tsPct = Math.random() * 10 - 5;
  const contractValue = Math.floor(Math.random() * 50000000 + 10000000);

  // Weighted combined metric
  const combined = (
    0.25 * points +
    0.15 * rebounds +
    0.15 * assists +
    0.15 * fgPct +
    0.1 * threePct +
    0.1 * efgPct +
    0.1 * tsPct
  );

  return {
    name,
    team: teams[i % teams.length],
    pos: positions[i % positions.length],
    points: parseFloat(points.toFixed(2)),
    rebounds: parseFloat(rebounds.toFixed(2)),
    assists: parseFloat(assists.toFixed(2)),
    fgPct: parseFloat(fgPct.toFixed(2)),
    threePct: parseFloat(threePct.toFixed(2)),
    efgPct: parseFloat(efgPct.toFixed(2)),
    tsPct: parseFloat(tsPct.toFixed(2)),
    contractValue,
    combined: parseFloat(combined.toFixed(2))
  };
});