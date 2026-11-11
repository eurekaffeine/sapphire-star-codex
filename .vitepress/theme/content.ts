export const locales = {
  root: {
    brand: 'Sapphire Star Codex', label: 'English', lang: 'en', path: '/', privacy: 'Privacy policy', support: 'Support us',
    description: 'Monster Hunter reference data and armor builds for Wilds, Rise with Sunbreak, and World with Iceborne.',
    nav: ['Features', 'FAQ', 'About', 'Download'],
    contents: 'On this page', top: 'Back to top', appearance: 'Appearance', menu: 'Menu',
  },
  'zh-hans': {
    brand: '苍蓝星图鉴', label: '简体中文', lang: 'zh-Hans', path: '/zh-hans/', privacy: '隐私政策', support: '支持我们',
    description: '苍蓝星图鉴：查询怪物弱点、装备性能与素材来源，按目标技能搜索配装。支持《荒野》《崛起＋曙光》《世界＋冰原》。',
    nav: ['功能', '常见问题', '关于', '下载'],
    contents: '本页目录', top: '返回顶部', appearance: '外观', menu: '菜单',
  },
  'zh-hant': {
    brand: '蒼藍星圖鑑', label: '繁體中文', lang: 'zh-Hant', path: '/zh-hant/', privacy: '隱私權政策', support: '支持我們',
    description: '蒼藍星圖鑑：查詢魔物弱點、裝備性能與素材來源，依目標技能搜尋配裝。支援《荒野》《崛起＋破曉》《世界＋冰原》。',
    nav: ['功能', '常見問題', '關於', '下載'],
    contents: '本頁目錄', top: '返回頂部', appearance: '外觀', menu: '選單',
  },
  'ja-jp': {
    brand: '青い星のハンターノート', label: '日本語', lang: 'ja-JP', path: '/ja-jp/', privacy: 'プライバシーポリシー', support: '開発を支援',
    description: 'ワイルズ、ライズとサンブレイク、ワールドとアイスボーンのデータと装備検索。',
    nav: ['機能', 'よくある質問', 'このアプリについて', 'ダウンロード'],
    contents: '目次', top: '先頭に戻る', appearance: '表示', menu: 'メニュー',
  },
} as const

export type LocaleKey = keyof typeof locales
export type ScreenshotKey = 'home' | 'hitzones' | 'weapon' | 'builder' | 'saved'
type Feature = { tab: string; title: string; body: string; image: ScreenshotKey; alt: string }
export type Copy = {
  title: string; intro: string; coverage: string; explore: string;
  featureHeading: string; featureIntro: string;
  sectionTitle: string; previousFeature: string; nextFeature: string; features: Feature[];
  downloadTitle: string; soon: string; openStore: string; storeDetails: [string, string, string];
  footer: string; support: string; privacy: string;
}

export const translations: Record<LocaleKey, Copy> = {
  root: {
    title: 'Monster Hunter reference and armor builds',
    intro: 'Look up weaknesses, equipment and materials. Find armor sets for your required skills.',
    coverage: 'Wilds, Rise with Sunbreak, and World with Iceborne.',
    explore: 'View features', sectionTitle: 'Features', featureHeading: 'From weaknesses to armor builds', featureIntro: 'Browse game data, compare equipment and search for armor sets. Core features work offline, without ads or paid features.', previousFeature: 'Previous feature', nextFeature: 'Next feature',
    features: [
      { tab: 'Dex', title: 'Browse by game', body: 'Switch between three game databases. Search monsters, weapons, armor, items, skills and quests.', image: 'home', alt: 'Wilds home screen in an iPhone 18 Pro frame' },
      { tab: 'Monsters', title: 'Monster weaknesses and hitzones', body: 'Compare elemental weaknesses and hitzones by body part. Check where materials drop.', image: 'hitzones', alt: 'Rey Dau hitzones in an iPhone 18 Pro frame' },
      { tab: 'Gear', title: 'Equipment and crafting', body: 'Check attack, affinity, sharpness, skills and crafting materials. Open related items directly from the equipment page.', image: 'weapon', alt: 'Hope Blade I stats and sharpness' },
      { tab: 'Builds', title: 'Armor set search', body: 'Set required skills, fix equipment and limit results to owned decorations. Rise supports owned talismans and Qurious armor.', image: 'builder', alt: 'Wilds armor search results and skill filters' },
      { tab: 'Saved', title: 'Saved entries and builds', body: 'Save monsters, equipment and quests for quick access. Keep your armor builds for later editing.', image: 'saved', alt: 'Saved monsters, weapons, items and quests' },
    ],
    downloadTitle: 'Choose your platform', soon: 'Coming soon', openStore: 'Open store', storeDetails: ['iPhone and iPad', 'Android phones and tablets', 'HarmonyOS devices'],
    footer: 'An independent, non-commercial fan app. Not affiliated with CAPCOM. Monster Hunter artwork and game data belong to CAPCOM Co., Ltd.',
    support: 'About and support', privacy: 'Privacy policy',
  },
  'zh-hans': {
    title: '怪物猎人图鉴与配装',
    intro: '查询怪物弱点、装备性能与素材来源，按目标技能搜索配装。',
    coverage: '支持《荒野》《崛起＋曙光》《世界＋冰原》。',
    explore: '查看功能', sectionTitle: '功能', featureHeading: '从怪物弱点到配装方案', featureIntro: '查阅游戏资料、比较装备性能、按技能搜索配装。核心功能离线可用，免费无广告。', previousFeature: '上一个功能', nextFeature: '下一个功能',
    features: [
      { tab: '图鉴', title: '三款游戏的独立图鉴', body: '按游戏浏览怪物、武器、防具与任务资料，支持名称搜索。各游戏资料独立整理，保留不同作品的机制与数值。', image: 'home', alt: 'iPhone 18 Pro 边框中的荒野首页' },
      { tab: '弱点', title: '怪物弱点与部位肉质', body: '比较属性弱点与各部位肉质，了解攻击属性和部位的选择依据，并查询素材掉落来源。', image: 'hitzones', alt: 'iPhone 18 Pro 边框中的煌雷龙肉质详情' },
      { tab: '装备', title: '装备性能与制作素材', body: '查看攻击力、会心率、斩味、技能与制作素材，并从装备页面直接访问相关素材和技能详情。', image: 'weapon', alt: '希望大剑Ⅰ的属性与斩味' },
      { tab: '配装', title: '按目标技能搜索配装', body: '设定技能与等级，固定指定装备，并按已持有的装饰品数量筛选组合。《崛起》还支持自有护石与怪异炼化防具。', image: 'builder', alt: '荒野配装搜索结果与技能筛选' },
      { tab: '收藏', title: '资料收藏与配装保存', body: '收藏常用的怪物、装备与任务资料，便于再次查阅。配装方案可保存并继续编辑。', image: 'saved', alt: '收藏的怪物、武器、道具与任务' },
    ],
    downloadTitle: '选择下载平台', soon: '尚未上架', openStore: '打开商店', storeDetails: ['iPhone 与 iPad', 'Android 手机与平板', '鸿蒙设备'],
    footer: '由爱好者独立开发的非商业应用，与 CAPCOM 无关联，亦未获其认可或支持。Monster Hunter 的游戏美术与数据归 CAPCOM Co., Ltd. 所有。',
    support: '关于与支持', privacy: '隐私政策',
  },
  'zh-hant': {
    title: '魔物獵人圖鑑與配裝',
    intro: '查詢魔物弱點、裝備性能與素材來源，依目標技能搜尋配裝。',
    coverage: '支援《荒野》《崛起＋破曉》《世界＋冰原》。',
    explore: '查看功能', sectionTitle: '功能', featureHeading: '從魔物弱點到配裝方案', featureIntro: '查閱遊戲資料、比較裝備性能、依技能搜尋配裝。核心功能離線可用，免費無廣告。', previousFeature: '上一個功能', nextFeature: '下一個功能',
    features: [
      { tab: '圖鑑', title: '三款遊戲的獨立圖鑑', body: '依遊戲瀏覽魔物、武器、防具與任務資料，支援名稱搜尋。各遊戲資料獨立整理，保留不同作品的機制與數值。', image: 'home', alt: 'iPhone 18 Pro 邊框中的荒野首頁' },
      { tab: '弱點', title: '魔物弱點與部位肉質', body: '比較屬性弱點與各部位肉質，了解攻擊屬性和部位的選擇依據，並查詢素材掉落來源。', image: 'hitzones', alt: 'iPhone 18 Pro 邊框中的煌雷龍肉質詳情' },
      { tab: '裝備', title: '裝備性能與製作素材', body: '查看攻擊力、會心率、斬味、技能與製作素材，並從裝備頁面直接開啟相關素材和技能詳情。', image: 'weapon', alt: '希望大劍Ⅰ的屬性與斬味' },
      { tab: '配裝', title: '依目標技能搜尋配裝', body: '設定技能與等級，固定指定裝備，並依已持有的裝飾品數量篩選組合。《崛起》另支援自有護石與傀異鍊化防具。', image: 'builder', alt: '荒野配裝搜尋結果與技能篩選' },
      { tab: '收藏', title: '資料收藏與配裝儲存', body: '收藏常用的魔物、裝備與任務資料，方便再次查閱。配裝方案可儲存並繼續編輯。', image: 'saved', alt: '收藏的魔物、武器、道具與任務' },
    ],
    downloadTitle: '選擇下載平台', soon: '尚未上架', openStore: '開啟商店', storeDetails: ['iPhone 與 iPad', 'Android 手機與平板', 'HarmonyOS 裝置'],
    footer: '由愛好者獨立開發的非商業應用程式，與 CAPCOM 無關聯，亦未獲其認可或支援。Monster Hunter 的遊戲美術與資料歸 CAPCOM Co., Ltd. 所有。',
    support: '關於與支援', privacy: '隱私權政策',
  },
  'ja-jp': {
    title: 'モンスターハンターの図鑑と装備検索',
    intro: '弱点、装備、素材の入手方法を確認。必要なスキルから防具の組み合わせを検索できます。',
    coverage: 'ワイルズ、ライズとサンブレイク、ワールドとアイスボーンに対応。',
    explore: '機能を見る', sectionTitle: '機能', featureHeading: '弱点の確認から装備検索まで', featureIntro: '作品別のデータや装備性能を確認し、必要なスキルから防具を検索。基本機能はオフラインで使え、広告や有料機能はありません。', previousFeature: '前の機能', nextFeature: '次の機能',
    features: [
      { tab: '図鑑', title: '作品別のデータ', body: '3作品のデータを切り替えて、モンスター、武器、防具、アイテム、スキル、クエストを検索できます。', image: 'home', alt: 'iPhone 18 Pro フレーム内のワイルズホーム画面' },
      { tab: '弱点', title: 'モンスターの弱点と肉質', body: '属性の弱点、部位ごとの肉質、素材の入手方法を確認できます。', image: 'hitzones', alt: 'iPhone 18 Pro フレーム内のレ・ダウの肉質' },
      { tab: '装備', title: '装備性能と生産素材', body: '攻撃力、会心率、斬れ味、スキル、生産素材を確認。装備画面から関連項目を開けます。', image: 'weapon', alt: 'ホープブレイドⅠの性能と斬れ味' },
      { tab: '装備検索', title: '防具の組み合わせを検索', body: '必要スキルや固定装備を指定し、所持装飾品の数で検索を絞れます。ライズの所持護石と傀異錬成防具にも対応。', image: 'builder', alt: 'ワイルズの装備検索結果とスキルの絞り込み' },
      { tab: '保存', title: 'お気に入りと装備セット', body: 'モンスター、装備、クエストを保存して、すぐに確認。装備セットは保存後も編集できます。', image: 'saved', alt: '保存したモンスター、武器、アイテム、クエスト' },
    ],
    downloadTitle: 'プラットフォームを選択', soon: '近日公開', openStore: 'ストアを開く', storeDetails: ['iPhone と iPad', 'Android スマートフォンとタブレット', 'HarmonyOS 端末'],
    footer: '独立した非営利のファンアプリです。CAPCOM とは関係ありません。Monster Hunter の画像とゲームデータは CAPCOM Co., Ltd. に帰属します。',
    support: 'このアプリについて', privacy: 'プライバシーポリシー',
  },
}
