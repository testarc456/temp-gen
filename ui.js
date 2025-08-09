
// ========================
// バリデーション関数
// ========================
function validateFormData() {
  const errors = [];
  
  // 商品名バリデーション
  const productNameEl = document.getElementById("productName");
  if (productNameEl) {
    const productName = productNameEl.value.trim();
    if (!productName) {
      errors.push("商品名を入力してください");
    } else if (productName.length > 50) {
      errors.push("商品名は50文字以内で入力してください");
    }
  }
  
  // カテゴリ別必須フィールドのバリデーション
  const categoryEl = document.querySelector('input[name="category"]:checked');
  if (categoryEl) {
    const category = categoryEl.value;
    const categoryFields = CATEGORY_CONFIG.uiConfig[category] || [];
    
    categoryFields.forEach(field => {
      if (field.required) {
        const value = getFieldValue(field.key, field.type);
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors.push(`${field.label}は必須項目です`);
        }
      }
    });
  }
  
  // テキストフィールドの文字数制限チェック
  const textInputs = document.querySelectorAll('input[type="text"], textarea');
  textInputs.forEach(input => {
    if (input.hasAttribute('maxlength')) {
      const maxLen = parseInt(input.getAttribute('maxlength'));
      if (input.value.length > maxLen) {
        const label = input.closest('div').querySelector('label')?.textContent || 'フィールド';
        errors.push(`${label}は${maxLen}文字以内で入力してください`);
      }
    }
  });
  
  return errors;
}

function getFieldValue(key, type) {
  switch (type) {
    case 'radio':
      const radioEl = document.querySelector(`input[name="${key}"]:checked`);
      return radioEl ? radioEl.value : null;
    case 'checkbox':
      const checkboxes = document.querySelectorAll(`input[name="${key}"]:checked`);
      return Array.from(checkboxes).map(cb => cb.value);
    case 'text':
      const textEl = document.getElementById(key) || document.querySelector(`input[name="${key}"]`);
      return textEl ? textEl.value.trim() : '';
    default:
      return null;
  }
}

// ========================
// UI描画関数
// ========================
function renderCategoryFields(category) {
  const categoryFields = CATEGORY_CONFIG.uiConfig[category] || [];
  const dynamicForm = document.getElementById('dynamic-form');
  
  categoryFields.forEach(field => {
    const fieldContainer = createFieldContainer(field);
    dynamicForm.appendChild(fieldContainer);
  });
}

function renderCommonFields() {
  const dynamicForm = document.getElementById('dynamic-form');
  
  CATEGORY_CONFIG.commonFields.forEach(field => {
    const fieldContainer = createFieldContainer(field);
    if (field.dependsOn) {
      fieldContainer.style.display = 'none';
      fieldContainer.setAttribute('data-depends-on', field.dependsOn);
      
      // showWhen属性がある場合（その他発送方法など）
      if (field.showWhen) {
        fieldContainer.setAttribute('data-show-when', field.showWhen);
      }
    }
    dynamicForm.appendChild(fieldContainer);
  });
}

function createFieldContainer(field) {
  const fieldContainer = document.createElement('div');
  fieldContainer.className = 'mb-4';
  
  const label = document.createElement('label');
  label.className = 'block mb-2 font-semibold';
  label.textContent = `【${field.label}】`;
  fieldContainer.appendChild(label);
  
  const inputElement = createInputElement(field);
  fieldContainer.appendChild(inputElement);
  
  return fieldContainer;
}

function createInputElement(field) {
  switch (field.type) {
    case 'text':
      return createTextInput(field);
    case 'radio':
      return createRadioGroup(field);
    case 'checkbox':
      return createCheckboxGroup(field);
    case 'toggle':
      return createToggleSwitch(field);
    default:
      return document.createElement('div');
  }
}

function createTextInput(field) {
  const input = document.createElement('input');
  input.type = 'text';
  input.id = field.key;
  input.name = field.key;
  input.placeholder = field.placeholder;
  input.className = 'w-full border px-3 py-2 rounded';
  return input;
}

function createRadioGroup(field) {
  const radioContainer = document.createElement('div');
  radioContainer.className = 'space-y-2';
  
  field.options.forEach(option => {
    const optionLabel = document.createElement('label');
    optionLabel.className = 'flex items-center';
    
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = field.key;
    radioInput.value = option.value;
    radioInput.className = 'mr-2';
    
    // 発送方法ラジオボタンの場合、変更イベントを追加
    if (field.key === 'shippingMethod') {
      radioInput.onchange = () => handleShippingMethodChange(option.value);
    }
    
    const optionText = document.createElement('span');
    optionText.textContent = option.label;
    
    optionLabel.appendChild(radioInput);
    optionLabel.appendChild(optionText);
    radioContainer.appendChild(optionLabel);
  });
  
  return radioContainer;
}

function createCheckboxGroup(field) {
  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'space-y-2';
  
  field.options.forEach(option => {
    const optionLabel = document.createElement('label');
    optionLabel.className = 'flex items-center';
    
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.name = field.key;
    checkboxInput.value = option.value;
    checkboxInput.className = 'mr-2';
    
    // 使用環境チェックボックスの場合、変更イベントを追加
    if (field.key === 'usageEnvironment') {
      checkboxInput.onchange = () => handleUsageEnvironmentChange();
    }
    
    const optionText = document.createElement('span');
    optionText.textContent = option.label;
    
    optionLabel.appendChild(checkboxInput);
    optionLabel.appendChild(optionText);
    checkboxContainer.appendChild(optionLabel);
  });
  
  return checkboxContainer;
}

function createToggleSwitch(field) {
  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'flex items-center space-x-3';
  
  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.id = field.key;
  toggleInput.name = field.key;
  toggleInput.className = 'sr-only peer';
  toggleInput.onchange = () => handleToggleChange(field.key);
  
  const toggleLabel = document.createElement('label');
  toggleLabel.htmlFor = field.key;
  toggleLabel.className = 'relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 cursor-pointer';
  
  const toggleText = document.createElement('span');
  toggleText.id = field.key + '_text';
  
  // トグル別初期テキスト設定
  if (field.key === 'priceNegotiationToggle') {
    toggleText.textContent = '⚪ 値下げ交渉の設定はしない';
  } else if (field.key === 'shippingToggle') {
    toggleText.textContent = '⚪ 発送方法の記載はしない';
  } else {
    toggleText.textContent = `⚪ ${field.label}はしない`;
  }
  toggleText.className = 'text-gray-600';
  
  toggleContainer.appendChild(toggleInput);
  toggleContainer.appendChild(toggleLabel);
  toggleContainer.appendChild(toggleText);
  
  return toggleContainer;
}

function clearDynamicForm() {
  const dynamicForm = document.getElementById('dynamic-form');
  dynamicForm.innerHTML = '';
}

function renderDynamicForm(category) {
  clearDynamicForm();
  renderCategoryFields(category);
  renderCommonFields();
}

// ========================
// データ取得関数
// ========================
function collectCategoryData(category) {
  const data = {};
  
  try {
    const categoryFields = (CATEGORY_CONFIG.uiConfig && CATEGORY_CONFIG.uiConfig[category]) || [];
    
    categoryFields.forEach(field => {
      if (field && field.key) {
        data[field.key] = getFieldValue(field);
      }
    });
  } catch (error) {
    console.warn('Error collecting category data:', error);
  }
  
  return data;
}

function collectCommonData() {
  const data = {};
  
  try {
    const commonFields = CATEGORY_CONFIG.commonFields || [];
    
    commonFields.forEach(field => {
      if (field && field.key) {
        data[field.key] = getFieldValue(field);
      }
    });
  } catch (error) {
    console.warn('Error collecting common data:', error);
  }
  
  return data;
}

function getFieldValue(field) {
  if (!field || !field.key) {
    console.warn('Invalid field passed to getFieldValue:', field);
    return "";
  }

  switch (field.type) {
    case 'text':
      const input = document.getElementById(field.key);
      if (!input) {
        console.warn(`Text input not found: ${field.key}`);
        return "";
      }
      return input.value.trim() || `${field.label}についての記載はありません`;
      
    case 'radio':
      const selectedRadio = document.querySelector(`input[name="${field.key}"]:checked`);
      return selectedRadio ? selectedRadio.value : "";
      
    case 'checkbox':
      const selectedCheckboxes = document.querySelectorAll(`input[name="${field.key}"]:checked`);
      if (!selectedCheckboxes.length) {
        if (field.key === 'returnPolicy') {
          return false;
        }
        return [];
      }
      
      const values = Array.from(selectedCheckboxes).map(cb => cb.value);
      
      if (field.key === 'accessories' && values.includes("なし")) {
        return ["特にございません"];
      } else if (field.key === 'returnPolicy') {
        return values.includes("accept");
      } else {
        return values;
      }
      
    case 'toggle':
      const toggleInput = document.getElementById(field.key);
      if (!toggleInput) {
        console.warn(`Toggle input not found: ${field.key}`);
        return false;
      }
      return toggleInput.checked;
      
    default:
      console.warn(`Unknown field type: ${field.type} for key: ${field.key}`);
      return "";
  }
}

/**
 * API送信用payloadを生成（型固定・余計なキー禁止）
 * @param {Object} categoryData - カテゴリ別データ
 * @param {Object} commonData - 共通データ
 * @param {string} productName - 商品名
 * @param {string} category - カテゴリ
 * @returns {Object} 型固定されたpayload
 */
function buildApiPayload(categoryData, commonData, productName, category) {
  // レガシー対応（nullチェック付き）
  const condition = (categoryData && categoryData.condition) || "状態は特に記載がありません";
  const accessories = (categoryData && categoryData.accessories) || ["特にございません"];
  const items = Array.isArray(accessories) ? accessories : [accessories];
  const returnPolicy = (commonData && commonData.returnPolicy) || false;
  
  // 価格交渉（強化されたfallback処理）
  let priceNegotiation = "";
  try {
    if (commonData && 
        commonData.priceNegotiationToggle && 
        commonData.priceNegotiationOption && 
        typeof commonData.priceNegotiationOption === 'string') {
      priceNegotiation = commonData.priceNegotiationOption;
    }
  } catch (error) {
    console.warn('Error processing price negotiation data:', error);
    priceNegotiation = "";
  }

  // 発送方法（追加）
  let shippingMethod = "";
  let customShipping = "";
  try {
    if (commonData && 
        commonData.shippingToggle && 
        commonData.shippingMethod && 
        typeof commonData.shippingMethod === 'string') {
      shippingMethod = commonData.shippingMethod;
      
      // "その他"の場合はcustomShippingも取得
      if (shippingMethod === 'その他' && commonData.customShipping) {
        customShipping = commonData.customShipping;
      }
    }
  } catch (error) {
    console.warn('Error processing shipping data:', error);
    shippingMethod = "";
    customShipping = "";
  }

  // 使用環境（追加）
  let usageEnvironment = [];
  let customEnvironment = "";
  try {
    if (commonData && commonData.usageEnvironment) {
      usageEnvironment = Array.isArray(commonData.usageEnvironment) ? 
        commonData.usageEnvironment : [commonData.usageEnvironment];
      
      // "その他"の場合はcustomEnvironmentも取得
      if (usageEnvironment.includes('その他') && commonData.customEnvironment) {
        customEnvironment = commonData.customEnvironment;
      }
    }
  } catch (error) {
    console.warn('Error processing usage environment data:', error);
    usageEnvironment = [];
    customEnvironment = "";
  }

  // 型固定されたpayload（余計なキー禁止）
  const payload = {
    // 必須フィールド
    category: category || "",
    productName: productName || "",
    items: items,
    
    // オプションフィールド（空でも送信）
    condition: condition,
    returnPolicy: returnPolicy,
    priceNegotiation: priceNegotiation,
    shippingMethod: shippingMethod,
    customShipping: customShipping,
    usageEnvironment: usageEnvironment,
    customEnvironment: customEnvironment
  };
  
  // スキーマ検証（開発時のみ）
  if (typeof APP_CONSTANTS !== 'undefined') {
    const allowedKeys = APP_CONSTANTS.PAYLOAD_SCHEMA.ALLOWED_KEYS();
    const payloadKeys = Object.keys(payload);
    const invalidKeys = payloadKeys.filter(key => !allowedKeys.includes(key));
    
    if (invalidKeys.length > 0) {
      console.warn('Invalid payload keys detected:', invalidKeys);
    }
  }
  
  return payload;
}

