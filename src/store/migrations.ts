import type {ProgressState} from '../types/state.js';
import {normalizeProgress} from './schema.js';
export function migrateProgress(raw:any):ProgressState { return normalizeProgress(raw) }
