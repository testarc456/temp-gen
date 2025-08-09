// ========================
// 定数定義
// ========================

const APP_CONSTANTS = {
  // API設定
  API: {
    ENDPOINT: 'https://template-generator-api.trasd208.workers.dev',
    TIMEOUT_MS: 30000,
    RETRY_COUNT: 3
  },
  
  // バリデーション制限
  VALIDATION: {
    PRODUCT_NAME_MAX_LENGTH: 50,
    CUSTOM_FIELD_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 200
  },
  
  // UI設定
  UI: {
    LOADING_TEXT: "🤖 AIが生成中...",
    DEFAULT_BUTTON_TEXT: "テンプレートを生成する",
    COPY_SUCCESS_MESSAGE: "テンプレートをコピーしました！"
  },
  
  // レート制限
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 10,
    COOLDOWN_MS: 1000
  },
  
  // エラーメッセージ
  ERRORS: {
    NETWORK_ERROR: "通信エラーが発生しました。しばらくしてから再試行してください。",
    VALIDATION_ERROR: "入力内容に問題があります。確認してください。",
    API_ERROR: "サーバーエラーが発生しました。時間を置いて再試行してください。",
    TIMEOUT_ERROR: "処理がタイムアウトしました。再試行してください。",
    RATE_LIMIT_ERROR: "リクエストが多すぎます。しばらくお待ちください。"
  },
  
  // Payloadスキーマ（バグ源の9割を防ぐ）
  PAYLOAD_SCHEMA: {
    REQUIRED_KEYS: ['category', 'productName', 'items'],
    OPTIONAL_KEYS: ['condition', 'returnPolicy', 'priceNegotiation', 'shippingMethod', 'customShipping', 'usageEnvironment', 'customEnvironment'],
    ALLOWED_KEYS: function() {
      return [...this.REQUIRED_KEYS, ...this.OPTIONAL_KEYS];
    }
  },
  
  // KVテンプレートバージョン管理（地雷回避）
  KV_KEYS: {
    CURRENT_TEMPLATE_VERSION: 'v1',
    TEMPLATES: {
      CONDITION: 'CONDITION_TEMPLATE:v1',
      USAGE_ENVIRONMENT: 'USAGE_ENVIRONMENT_TEMPLATE:v1',
      RETURN_POLICY_ACCEPT: 'RETURN_POLICY_ACCEPT:v1',
      RETURN_POLICY_REJECT: 'RETURN_POLICY_REJECT:v1',
      PRICE_NEGOTIATION: 'PRICE_NEGOTIATION_TEMPLATE:v1',
      SHIPPING_METHOD: 'SHIPPING_METHOD_TEMPLATE:v1'
    }
  }
};

// レガシー互換性のため既存のCATEGORY_CONFIG.apiUrlを更新
if (typeof CATEGORY_CONFIG !== 'undefined') {
  CATEGORY_CONFIG.apiUrl = APP_CONSTANTS.API.ENDPOINT;
}