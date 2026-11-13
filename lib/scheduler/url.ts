import { DEFAULT_CONFIG, validateConfig, type SimConfig } from './simulate';

const numericKeys: (keyof SimConfig)[] = ['seed', 'jobCount', 'arrivalRate', 'medianServiceMs', 'workers', 'failureRate', 'maxAttempts', 'backoffBaseMs', 'backoffCapMs'];

/** Reads a configuration from a query string, ignoring anything invalid. */
export function configFromSearch(search: string): SimConfig {
  const params = new URLSearchParams(search);
  const config: SimConfig = { ...DEFAULT_CONFIG };
  for (const key of numericKeys) {
    const raw = params.get(key);
    if (raw !== null && raw.trim() !== '' && Number.isFinite(Number(raw))) (config[key] as number) = Number(raw);
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

