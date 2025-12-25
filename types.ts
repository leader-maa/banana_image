
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

export type AssetType = 'svg' | 'image';

export interface GeneratedAsset {
  id: string;
  type: AssetType;
  content: string; // 对于 SVG 是代码，对于 Image 是 URL 或 Base64
  prompt: string;
  timestamp: number;
  modelId: string;
}

export interface ApiError {
  message: string;
  details?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  type: AssetType;
  icon: string;
}
