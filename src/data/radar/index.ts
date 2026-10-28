import type { RadarTable } from '../types';
import order from './index.json';

const modules = import.meta.glob<{ default: RadarTable }>('./*.json', { eager: true });

const byAuthor: Record<string, RadarTable> = {};
for (const [path, mod] of Object.entries(modules)) {
  const name = path.replace('./', '').replace('.json', '');
  if (name === 'index') continue;
  byAuthor[name] = mod.default;
}

export const radarTables: RadarTable[] = (order as string[]).map((a) => byAuthor[a]).filter(Boolean);
