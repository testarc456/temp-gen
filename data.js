// ========================
// データ設定・カテゴリ定義
// ========================
const CATEGORY_CONFIG = {
  // カテゴリ別の動的フィールド設定
  uiConfig: {
    "家電・スマホ": [
      { 
        key: "condition", 
        label: "商品の状態", 
        type: "radio",
        required: true,
        options: [
          { value: "新品・未使用です", label: "新品・未使用" },
          { value: "美品で、使用回数はごくわずかです", label: "美品（使用わずか）" },
          { value: "使用感はありますが、目立つ傷や汚れはありません", label: "やや使用感あり" },
          { value: "全体的に使用感があり、傷や汚れがあります", label: "傷・汚れあり" }
        ]
      },
      { 
        key: "accessories", 
        label: "付属品", 
        type: "checkbox",
        required: false,
        options: [
          { value: "取扱説明書", label: "取扱説明書" },
          { value: "外箱", label: "外箱" },
          { value: "保証書", label: "保証書" },
          { value: "充電ケーブル", label: "充電ケーブル" },
          { value: "イヤホン", label: "イヤホン" },
          { value: "なし", label: "付属品なし" }
        ]
      },
      { key: "operation", label: "動作確認の状況", type: "text", placeholder: "初期化済み／動作確認済み／特に不具合なしなど" },
      { key: "warranty", label: "保証の有無", type: "text", placeholder: "購入日から1年保証あり／保証書ありなど" }
    ],
    
    "ファッション": [
      { 
        key: "condition", 
        label: "商品の状態", 
        type: "radio",
        options: [
          { value: "新品・未使用です", label: "新品・未使用" },
          { value: "新品・未使用に近い状態です", label: "未使用に近い" },
          { value: "目立った傷や汚れなし", label: "目立った傷汚れなし" },
          { value: "やや傷や汚れあり", label: "やや傷汚れあり" },
          { value: "傷や汚れあり", label: "傷汚れあり" },
          { value: "全体的に状態が悪い", label: "全体的に状態悪い" }
        ]
      },
      { key: "size", label: "サイズ", type: "text", placeholder: "M／L／XL などのサイズ表記" },
      { key: "material", label: "素材", type: "text", placeholder: "綿／ポリエステル／ウールなど" },
      { key: "brand", label: "ブランド", type: "text", placeholder: "ユニクロ／GU／ZARA など" }
    ],

    // 今後追加予定のカテゴリ
    "本・雑誌": [
      { 
        key: "condition", 
        label: "商品の状態", 
        type: "radio",
        options: [
          { value: "新品・未使用です", label: "新品・未使用" },
          { value: "ほぼ新品の状態です", label: "ほぼ新品" },
          { value: "目立った汚れや破れはありません", label: "目立った汚れなし" },
          { value: "使用感はありますが読むのに問題ありません", label: "やや使用感あり" },
          { value: "汚れや破れがあります", label: "汚れ・破れあり" }
        ]
      },
      { 
        key: "cover", 
        label: "帯・カバーの有無", 
        type: "radio",
        options: [
          { value: "帯・カバーともにあります", label: "あり" },
          { value: "帯・カバーはありません", label: "なし" }
        ]
      },
      { 
        key: "writing", 
        label: "書き込み・折れ", 
        type: "radio",
        options: [
          { value: "書き込み・折れはありません", label: "なし" },
          { value: "軽微な書き込みがあります", label: "軽微" },
          { value: "ページ折れがあります", label: "ページ折れあり" }
        ]
      },
      { 
        key: "edition", 
        label: "初版・重版", 
        type: "radio",
        options: [
          { value: "初版です", label: "初版" },
          { value: "重版です", label: "重版" }
        ]
      },
      { key: "publisher", label: "出版社", type: "text", placeholder: "集英社／講談社／小学館など" },
      { key: "isbn", label: "ISBN", type: "text", placeholder: "978-4-08-123456-7など（任意）" }
    ],

    "化粧品・美容": [
      { 
        key: "condition", 
        label: "商品の状態", 
        type: "radio",
        options: [
          { value: "新品・未開封です", label: "新品・未開封" },
          { value: "新品・未使用です", label: "新品・未使用" },
          { value: "数回使用しましたがほぼ新品状態です", label: "数回使用のみ" },
          { value: "半分程度残っています", label: "半分程度残量" },
          { value: "残量少なめです", label: "残量少なめ" }
        ]
      },
      { key: "expiry", label: "使用期限", type: "text", placeholder: "2025年12月まで／製造から3年以内など" },
      { key: "brand", label: "ブランド", type: "text", placeholder: "資生堂／花王／コーセーなど" }
    ],

    "ホビー": [
      { 
        key: "condition", 
        label: "商品の状態", 
        type: "radio",
        options: [
          { value: "新品・未開封です", label: "新品・未開封" },
          { value: "新品・未使用です", label: "新品・未使用" },
          { value: "美品で、使用回数はごくわずかです", label: "美品（使用わずか）" },
          { value: "使用感はありますが、目立つ傷や汚れはありません", label: "やや使用感あり" },
          { value: "傷や汚れがあります", label: "傷・汚れあり" }
        ]
      },
      { key: "completeness", label: "セット内容", type: "text", placeholder: "全て揃っています／○○が欠品していますなど" },
      { key: "series", label: "シリーズ・作品名", type: "text", placeholder: "ポケモン／ドラゴンボール／ワンピースなど" }
    ],

    "その他": [
      { 
        key: "condition", 
        label: "商品の状態", 
        type: "radio",
        options: [
          { value: "新品・未使用です", label: "新品・未使用" },
          { value: "美品で、使用回数はごくわずかです", label: "美品（使用わずか）" },
          { value: "使用感はありますが、目立つ傷や汚れはありません", label: "やや使用感あり" },
          { value: "全体的に使用感があり、傷や汚れがあります", label: "傷・汚れあり" }
        ]
      },
      { key: "description", label: "詳細説明", type: "text", placeholder: "商品の特徴や注意点があれば記載してください" }
    ]
  },
  
  // 基本フィールド（商品名等）
  basicFields: [
    {
      key: "productName",
      label: "商品名",
      type: "text",
      required: true,
      maxLength: 50,
      placeholder: "例：商品名を入力してください"
    }
  ],
  
  // 全カテゴリ共通のフィールド（購入者意思決定フロー順）
  commonFields: [
    // 商品情報 → 使用環境（商品状態の後に表示される）
    { 
      key: "usageEnvironment", 
      label: "使用環境", 
      type: "checkbox",
      required: false,
      options: [
        { value: "ペットなし", label: "ペットなし" },
        { value: "喫煙なし", label: "喫煙なし" },
        { value: "暗所保管", label: "暗所保管" },
        { value: "クローゼットで保管", label: "クローゼットで保管" },
        { value: "非常に丁寧に扱いました", label: "非常に丁寧に扱いました" },
        { value: "その他", label: "その他（自由入力）" }
      ]
    },
    { 
      key: "customEnvironment", 
      label: "その他の使用環境", 
      type: "text",
      required: false,
      maxLength: 100,
      dependsOn: "usageEnvironment",
      showWhen: "その他",
      placeholder: "例：湿度管理された部屋で保管・日光の当たらない場所など"
    },

    // 取引条件 → 返品対応
    { 
      key: "returnPolicy", 
      label: "返品について", 
      type: "checkbox",
      required: false,
      options: [
        { value: "accept", label: "返品を受け付ける（3日以内、送料購入者負担）" }
      ]
    },

    // 取引条件 → 値下げ交渉
    { 
      key: "priceNegotiationToggle", 
      label: "値下げ交渉の設定", 
      type: "toggle"
    },
    { 
      key: "priceNegotiationOption", 
      label: "交渉への対応", 
      type: "radio",
      dependsOn: "priceNegotiationToggle",
      options: [
        { value: "ご予算に応じて価格のご相談承ります。お気軽にお声掛けください。", label: "歓迎" },
        { value: "大幅なお値下げは難しいのですが、可能な範囲で調整します。", label: "条件付き" },
        { value: "値下げ交渉はご遠慮いただいております。ご了承ください。", label: "交渉不可" }
      ]
    },

    // 取引条件 → 発送方法
    { 
      key: "shippingToggle", 
      label: "発送方法の記載", 
      type: "toggle"
    },
    { 
      key: "shippingMethod", 
      label: "発送方法", 
      type: "radio",
      dependsOn: "shippingToggle",
      options: [
        { value: "らくらくメルカリ便", label: "らくらくメルカリ便（ヤマト・匿名配送・追跡・補償あり）" },
        { value: "ゆうゆうメルカリ便", label: "ゆうゆうメルカリ便（郵便局・匿名配送・追跡・補償あり）" },
        { value: "レターパック", label: "レターパック（追跡あり・匿名なし）" },
        { value: "クリックポスト", label: "クリックポスト（追跡あり・匿名なし・安価）" },
        { value: "スマートレター", label: "スマートレター（安価・追跡補償なし）" },
        { value: "定形・定形外郵便", label: "定形・定形外郵便（追跡補償なし・最安）" },
        { value: "その他", label: "その他（自由入力）" }
      ]
    },
    { 
      key: "customShipping", 
      label: "その他の発送方法", 
      type: "text",
      dependsOn: "shippingMethod",
      showWhen: "その他",
      placeholder: "例：佐川急便・ヤマト宅急便・手渡しなど"
    }
  ],

  // カテゴリ別プレースホルダー
  categoryPlaceholders: {
    '家電・スマホ': '例：iPhone 16 Pro',
    'ファッション': '例：ASICS × JJJJound GEL‑KAYANO 14',
    '本・雑誌': '例：『鬼滅の刃』全23巻セット',
    '化粧品・美容': '例：DUO ザ クレンジングバーム ブラックリペア',
    'ホビー': '例：ポケモンカードゲーム MEGA 拡張パック「メガブレイブ」',
    'その他': '例：Francfranc フレ ハンディファン'
  },

  // API設定
  apiUrl: 'https://template-generator-api.trasd208.workers.dev'
};