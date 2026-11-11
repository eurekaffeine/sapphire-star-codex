export const locale = {
  brand: '苍蓝星图鉴', label: '简体中文', lang: 'zh-Hans', path: '/', privacy: '隐私政策', support: '支持我们',
  description: '苍蓝星图鉴：查询怪物弱点、装备性能与素材来源，按目标技能搜索配装。支持《荒野》《崛起＋曙光》《世界＋冰原》。',
  nav: ['功能', '常见问题', '关于', '下载'],
  contents: '本页目录', top: '返回顶部', appearance: '外观', menu: '菜单',
} as const

export type ScreenshotKey = 'home' | 'hitzones' | 'weapon' | 'builder' | 'saved'
type Feature = { tab: string; title: string; body: string; image: ScreenshotKey; alt: string }
export type Copy = {
  title: string; intro: string; coverage: string; explore: string;
  featureHeading: string; featureIntro: string;
  sectionTitle: string; previousFeature: string; nextFeature: string; features: Feature[];
  downloadTitle: string; soon: string; openStore: string; storeDetails: [string, string, string];
  footer: string; support: string; privacy: string;
}

export const copy: Copy = {
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
}
