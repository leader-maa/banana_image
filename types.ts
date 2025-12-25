
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ModelProvider = 'gemini' | 'custom';

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  provider: ModelProvider;
  icon: string;
}

export interface GeneratedSvg {
  id: string;
  content: string;
  prompt: string;
  timestamp: number;
  modelId: string;
}

export interface ApiError {
  message: string;
  details?: string;
}
