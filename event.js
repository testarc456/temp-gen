// ========================
// イベントハンドラー
// ========================
function handleToggleChange(toggleKey) {
  const toggle = document.getElementById(toggleKey);
  const toggleText = document.getElementById(toggleKey + '_text');
  const dependentFields = document.querySelectorAll(`[data-depends-on="${toggleKey}"]`);
  
  if (toggle.checked) {
    // トグル別ONテキスト設定
    if (toggleKey === 'priceNegotiationToggle') {
      toggleText.textContent = '🟢 値下げ交渉を受け付ける';
    } else if (toggleKey === 'shippingToggle') {
      toggleText.textContent = '🟢 発送方法を記載する';
    } else {
      toggleText.textContent = '🟢 設定を有効にする';
    }
    toggleText.className = 'text-green-600';
    dependentFields.forEach(field => {
      field.style.display = 'block';
    });
  } else {
    // トグル別OFFテキスト設定
    if (toggleKey === 'priceNegotiationToggle') {
      toggleText.textContent = '⚪ 値下げ交渉の設定はしない';
    } else if (toggleKey === 'shippingToggle') {
      toggleText.textContent = '⚪ 発送方法の記載はしない';
    } else {
      toggleText.textContent = '⚪ 設定を無効にする';
    }
    toggleText.className = 'text-gray-600';
    dependentFields.forEach(field => {
      field.style.display = 'none';
      const radios = field.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => radio.checked = false);
    });
  }
}

function handleShippingMethodChange(selectedValue) {
  // "その他"選択時の自由入力フィールド表示制御
  const customShippingFields = document.querySelectorAll('[data-show-when]');
  
  customShippingFields.forEach(field => {
    const showWhen = field.getAttribute('data-show-when');
    if (showWhen === selectedValue) {
      field.style.display = 'block';
    } else {
      field.style.display = 'none';
      // 非表示になるフィールドをクリア
      const input = field.querySelector('input[type="text"]');
      if (input) input.value = '';
    }
  });
}

function handleUsageEnvironmentChange() {
  // "その他"選択時の自由入力フィールド表示制御
  const customEnvironmentFields = document.querySelectorAll('[data-show-when="その他"]');
  const otherCheckbox = document.querySelector('input[name="usageEnvironment"][value="その他"]');
  
  customEnvironmentFields.forEach(field => {
    if (field.getAttribute('data-depends-on') === 'usageEnvironment') {
      if (otherCheckbox && otherCheckbox.checked) {
        field.style.display = 'block';
      } else {
        field.style.display = 'none';
        // 非表示になるフィールドをクリア
        const input = field.querySelector('input[type="text"]');
        if (input) input.value = '';
      }
    }
  });
}

function handleCategoryToggle(labelElement, value, event) {
  event.preventDefault();
  const input = labelElement.querySelector('input[type="radio"]');
  const productNameInput = document.getElementById('productName');
  
  if (input.checked) {
    input.checked = false;
    productNameInput.placeholder = '例：商品名を入力してください';
    renderDynamicForm(null);
  } else {
    document.querySelectorAll('input[name="category"]').forEach(radio => {
      radio.checked = false;
    });
    
    input.checked = true;
    productNameInput.placeholder = CATEGORY_CONFIG.categoryPlaceholders[value] || '例：商品名を入力してください';
    renderDynamicForm(value);
  }
}

// ========================
// テンプレート生成処理
// ========================
async function handleTemplateGeneration() {
  const button = document.querySelector('button[onclick="generateTemplate()"]');
  const output = document.getElementById("output");

  if (!button || !output) {
    console.error("Required elements not found for template generation");
    return;
  }

  // バリデーション実行
  const errors = validateFormData();
  if (errors.length > 0) {
    alert("入力エラーがあります:\n\n" + errors.join("\n"));
    return;
  }

  const productNameEl = document.getElementById("productName");
  const productName = productNameEl ? productNameEl.value.trim() : "";

  const categoryEl = document.querySelector('input[name="category"]:checked');
  const category = categoryEl ? categoryEl.value : "";
  
  // データ収集（エラーハンドリング付き）
  let categoryData = {};
  let commonData = {};
  
  try {
    categoryData = collectCategoryData(category) || {};
    commonData = collectCommonData() || {};
  } catch (error) {
    console.error('Error collecting form data:', error);
    alert("フォームデータの取得でエラーが発生しました");
    return;
  }
  
  const payload = buildApiPayload(categoryData, commonData, productName, category);

  setLoadingState(button, output, true);

  try {
    const data = await generate(payload);
    displayResult(output, data.template);
    hideRetryButton(); // 成功時は再試行ボタンを隠す
  } catch (error) {
    console.error('API Error:', error);
    showError(output, error, () => handleTemplateGeneration()); // 再試行用コールバック
  } finally {
    setLoadingState(button, output, false);
  }
}

// ========================
// ユーティリティ関数
// ========================
function handleCopyToClipboard() {
  const text = document.getElementById("output").value;
  navigator.clipboard.writeText(text).then(() => {
    showToast(APP_CONSTANTS.UI.COPY_SUCCESS_MESSAGE, 'success');
  }).catch(() => {
    showToast("コピーに失敗しました", 'error');
  });
}

// ========================
// 初期化処理
// ========================
function initializeApp() {
  renderDynamicForm(null);
}

// ========================
// グローバル関数公開
// ========================
function exposeGlobalFunctions() {
  window.toggleCategory = handleCategoryToggle;
  window.generateTemplate = handleTemplateGeneration;
  window.copyToClipboard = handleCopyToClipboard;
}

// ========================
// メイン初期化
// ========================
document.addEventListener('DOMContentLoaded', function() {
  exposeGlobalFunctions();
  initializeApp();
});