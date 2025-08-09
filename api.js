// ========================
// API通信レイヤー
// ========================

/**
 * テンプレート生成API呼び出し（失敗時統一処理）
 * @param {Object} payload - APIに送信するデータ
 * @returns {Promise<Object>} APIレスポンス
 */
async function generate(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_CONSTANTS.API.TIMEOUT_MS);
    
    const response = await fetch(CATEGORY_CONFIG.apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // ステータスコード別エラーハンドリング
    if (response.status === 429) {
      throw new ApiError(APP_CONSTANTS.ERRORS.RATE_LIMIT_ERROR, 429, true);
    }
    
    if (response.status >= 500) {
      throw new ApiError(APP_CONSTANTS.ERRORS.API_ERROR, response.status, true);
    }
    
    if (!response.ok) {
      throw new ApiError(`HTTP Error: ${response.status}`, response.status, false);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new ApiError(data.error || 'Unknown API error', 400, false);
    }
    
    return data;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError(APP_CONSTANTS.ERRORS.TIMEOUT_ERROR, 408, true);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // ネットワークエラー等
    throw new ApiError(APP_CONSTANTS.ERRORS.NETWORK_ERROR, 0, true);
  }
}

/**
 * カスタムAPIエラークラス
 */
class ApiError extends Error {
  constructor(message, status, retryable) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.retryable = retryable;
  }
}

/**
 * ローディング状態の制御（スピナー付き）
 * @param {HTMLElement} button - 生成ボタン要素
 * @param {HTMLElement} output - 出力テキストエリア要素
 * @param {boolean} isLoading - ローディング状態
 */
function setLoadingState(button, output, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      ${APP_CONSTANTS.UI.LOADING_TEXT}
    `;
    output.value = "AIがテンプレートを生成しています...";
  } else {
    button.disabled = false;
    button.innerHTML = APP_CONSTANTS.UI.DEFAULT_BUTTON_TEXT;
  }
}

/**
 * 出力結果の表示
 * @param {HTMLElement} output - 出力テキストエリア要素
 * @param {string} template - 生成されたテンプレート
 */
function displayResult(output, template) {
  output.value = template;
}

/**
 * 統一エラー表示（再試行ボタン付き）
 * @param {HTMLElement} output - 出力テキストエリア要素
 * @param {Error} error - エラーオブジェクト
 * @param {Function} retryCallback - 再試行時のコールバック関数
 */
function showError(output, error, retryCallback) {
  const isRetryable = error instanceof ApiError && error.retryable;
  
  output.value = `${error.message}${isRetryable ? '\n\n再試行ボタンで再度お試しください。' : ''}`;
  
  // 再試行ボタンの表示制御
  if (isRetryable && retryCallback) {
    showRetryButton(retryCallback);
  } else {
    hideRetryButton();
  }
}

/**
 * 再試行ボタンを表示
 * @param {Function} retryCallback - 再試行時のコールバック関数
 */
function showRetryButton(retryCallback) {
  let retryBtn = document.getElementById('retry-button');
  
  if (!retryBtn) {
    retryBtn = document.createElement('button');
    retryBtn.id = 'retry-button';
    retryBtn.className = 'mt-2 w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700';
    retryBtn.textContent = '🔄 再試行する';
    
    const generateBtn = document.querySelector('button[onclick="generateTemplate()"]');
    generateBtn.parentNode.insertBefore(retryBtn, generateBtn.nextSibling);
  }
  
  retryBtn.style.display = 'block';
  retryBtn.onclick = () => {
    hideRetryButton();
    retryCallback();
  };
}

/**
 * 再試行ボタンを非表示
 */
function hideRetryButton() {
  const retryBtn = document.getElementById('retry-button');
  if (retryBtn) {
    retryBtn.style.display = 'none';
  }
}

/**
 * 非モーダルToast通知（2秒で自動消去）
 * @param {string} message - 表示するメッセージ
 * @param {string} type - 通知タイプ ('success', 'error', 'info')
 */
function showToast(message, type = 'success') {
  // 既存のtoastを削除
  const existingToast = document.getElementById('toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.className = `
    fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-0 transition-all duration-300
    ${type === 'success' ? 'bg-green-600 text-white' : 
      type === 'error' ? 'bg-red-600 text-white' : 
      'bg-blue-600 text-white'}
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // 2秒後に自動消去
  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}