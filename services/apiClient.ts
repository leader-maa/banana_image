
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * 客户端调用本地后端接口
 */
export const generateSvgViaApi = async (prompt: string, modelId: string): Promise<any> => {
  const controller = new AbortController();
  // 文生图任务可能耗时较长，增加超时时间至 2 分钟
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, modelId }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `请求失败 (${response.status})`);
    }

    return data; // 返回包含 content 和 type 的对象
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error("请求超时，模型处理时间过长，请尝试缩短提示词。");
    }
    throw error;
  }
};
