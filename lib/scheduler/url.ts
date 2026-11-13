import { controlRanges } from './presets';
import { DEFAULT_CONFIG, validateConfig, type SimConfig } from './simulate';

const numericKeys: (keyof SimConfig)[] = ['seed', 'jobCount', 'arrivalRate', 'medianServiceMs', 'workers', 'failureRate', 'maxAttempts', 'backoffBaseMs', 'backoffCapMs'];

/**
 * Reads a configuration from a query string, ignoring anything invalid. Each value must also sit
 * inside its slider's range, so a shared link can't put a control in a state it can't display
 * or ask the browser for an outsized simulation.
 */
export function configFromSearch(search: string): SimConfig {
  const params = new URLSearchParams(search);
  const config: SimConfig = { ...DEFAULT_CONFIG };
  for (const key of numericKeys) {
    const raw = params.get(key);
    if (raw === null || raw.trim() === '' || !Number.isFinite(Number(raw))) continue;
    const value = Number(raw);
    if (key === 'seed') {
      if (Number.isInteger(value) && value >= 0 && value <= 0xffffffff) config.seed = value;
      continue;
    }
    const range = controlRanges[key as keyof typeof controlRanges];
    if (range && (value < range.min || value > range.max)) continue;
    (config[key] as number) = value;
  }
  const strategy = params.get('strategy');
  if (strategy === 'fifo' || strategy === 'sjf' || strategy === 'priority') config.strategy = strategy;
  const jitter = params.get('jitter');
  if (jitter === 'none' || jitter === 'full' || jitter === 'equal') config.jitter = jitter;
  return validateConfig(config).length ? { ...DEFAULT_CONFIG } : config;
}

export function configToSearch(config: SimConfig): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(config)) if (value !== DEFAULT_CONFIG[key as keyof SimConfig]) params.set(key, String(value));
  const text = params.toString();
  return text ? `?${text}` : '';
}

