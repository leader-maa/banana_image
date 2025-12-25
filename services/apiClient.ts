
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * 客户端调用本地后端接口
 */
export const generateSvgViaApi = async (prompt: string, modelId: string): Promise<string> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, modelId }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || `请求失败: ${response.status}`);
  }

  const data = await response.json();
  return data.svg;
};
