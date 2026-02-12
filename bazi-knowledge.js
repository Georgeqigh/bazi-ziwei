/**
 * 八字知识库 - 基础常量、数据表、规则配置
 * 包含所有静态数据和配置信息
 */

// ===================== 基础常量定义 =====================

// 天干地支
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干属性
const STEM_ELEMENTS = { 
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', 
  '戊': '土', '己': '土', '庚': '金', '辛': '金', 
  '壬': '水', '癸': '水' 
};

const STEM_YIN_YANG = { 
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', 
  '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴', 
  '壬': '阳', '癸': '阴' 
};

// 地支属性
const BRANCH_ELEMENTS = { 
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', 
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' 
};

const BRANCH_YIN_YANG = { 
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴', 
  '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴' 
};

// 地支藏干
const BRANCH_HIDDEN_STEMS = {
  '子': [{ stem: '癸', power: 1.0 }],
  '丑': [{ stem: '己', power: 0.5 }, { stem: '癸', power: 0.3 }, { stem: '辛', power: 0.2 }],
  '寅': [{ stem: '甲', power: 0.6 }, { stem: '丙', power: 0.3 }, { stem: '戊', power: 0.1 }],
  '卯': [{ stem: '乙', power: 1.0 }],
  '辰': [{ stem: '戊', power: 0.6 }, { stem: '乙', power: 0.2 }, { stem: '癸', power: 0.2 }],
  '巳': [{ stem: '丙', power: 0.6 }, { stem: '庚', power: 0.3 }, { stem: '戊', power: 0.1 }],
  '午': [{ stem: '丁', power: 0.7 }, { stem: '己', power: 0.3 }],
  '未': [{ stem: '己', power: 0.6 }, { stem: '丁', power: 0.3 }, { stem: '乙', power: 0.1 }],
  '申': [{ stem: '庚', power: 0.7 }, { stem: '壬', power: 0.2 }, { stem: '戊', power: 0.1 }],
  '酉': [{ stem: '辛', power: 1.0 }],
  '戌': [{ stem: '戊', power: 0.6 }, { stem: '辛', power: 0.3 }, { stem: '丁', power: 0.1 }],
  '亥': [{ stem: '壬', power: 0.7 }, { stem: '甲', power: 0.3 }]
};

// 五行关系
const ELEMENT_RELATIONS = {
  '木': { '生': '火', '被生': '水', '克': '土', '被克': '金' },
  '火': { '生': '土', '被生': '木', '克': '金', '被克': '水' },
  '土': { '生': '金', '被生': '火', '克': '水', '被克': '木' },
  '金': { '生': '水', '被生': '土', '克': '木', '被克': '火' },
  '水': { '生': '木', '被生': '金', '克': '火', '被克': '土' }
};

// 十二长生
const TWELVE_LIFE_STAGES = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

// 长生宫位对应
const LIFE_STAGE_BRANCHES = {
  '木阳': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
  '木阴': ['午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌', '酉', '申', '未'],
  '火阳': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  '火阴': ['酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌'],
  '土阳': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  '土阴': ['酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌'],
  '金阳': ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
  '金阴': ['子', '亥', '戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑'],
  '水阳': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
  '水阴': ['卯', '寅', '丑', '子', '亥', '戌', '酉', '申', '未', '午', '巳', '辰']
};

// 纳音五行映射
const NAYIN_WUXING = {
  '海中金': '金', '炉中火': '火', '大林木': '木', '路旁土': '土', '剑锋金': '金', '山头火': '火',
  '涧下水': '水', '城头土': '土', '白蜡金': '金', '杨柳木': '木', '泉中水': '水', '屋上土': '土',
  '霹雳火': '火', '松柏木': '木', '长流水': '水', '沙中金': '金', '山下火': '火', '平地木': '木',
  '壁上土': '土', '金箔金': '金', '佛灯火': '火', '天河水': '水', '大驿土': '土', '钗钏金': '金',
  '桑柘木': '木', '大溪水': '水', '沙中土': '土', '天上火': '火', '石榴木': '木', '大海水': '水'
};

// 纳音表
const NAYIN_TABLE = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火', '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土', '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土', '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木', '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木', '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '沙中金', '乙未': '沙中金', '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金', '甲辰': '佛灯火', '乙巳': '佛灯火',
  '丙午': '天河水', '丁未': '天河水', '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水', '丙辰': '沙中土', '丁巳': '沙中土',
  '戊午': '天上火', '己未': '天上火', '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};

// ===================== 节气相关常量 =====================

// 节气顺序
const SOLAR_TERMS_ORDER = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

// 节气时间数据表（2024年示例）
const SOLAR_TERMS_DATA = {
  2024: [
    { name: '小寒', month: 1, day: 6, hour: 4, minute: 49 },
    { name: '大寒', month: 1, day: 20, hour: 22, minute: 7 },
    { name: '立春', month: 2, day: 4, hour: 16, minute: 27 },
    { name: '雨水', month: 2, day: 19, hour: 12, minute: 13 },
    { name: '惊蛰', month: 3, day: 5, hour: 10, minute: 23 },
    { name: '春分', month: 3, day: 20, hour: 11, minute: 6 },
    { name: '清明', month: 4, day: 4, hour: 15, minute: 2 },
    { name: '谷雨', month: 4, day: 19, hour: 22, minute: 0 },
    { name: '立夏', month: 5, day: 5, hour: 8, minute: 10 },
    { name: '小满', month: 5, day: 20, hour: 21, minute: 0 },
    { name: '芒种', month: 6, day: 5, hour: 12, minute: 10 },
    { name: '夏至', month: 6, day: 21, hour: 4, minute: 51 },
    { name: '小暑', month: 7, day: 6, hour: 22, minute: 20 },
    { name: '大暑', month: 7, day: 22, hour: 15, minute: 45 },
    { name: '立秋', month: 8, day: 7, hour: 8, minute: 9 },
    { name: '处暑', month: 8, day: 22, hour: 23, minute: 0 },
    { name: '白露', month: 9, day: 7, hour: 11, minute: 12 },
    { name: '秋分', month: 9, day: 22, hour: 20, minute: 44 },
    { name: '寒露', month: 10, day: 8, hour: 3, minute: 0 },
    { name: '霜降', month: 10, day: 23, hour: 6, minute: 14 },
    { name: '立冬', month: 11, day: 7, hour: 6, minute: 20 },
    { name: '小雪', month: 11, day: 22, hour: 3, minute: 56 },
    { name: '大雪', month: 12, day: 6, hour: 23, minute: 17 },
    { name: '冬至', month: 12, day: 21, hour: 17, minute: 40 }
  ]
};

// 节气对应地支映射
const TERM_TO_BRANCH_MAP = {
  '立春': '寅', '惊蛰': '卯', '清明': '辰', '立夏': '巳', '芒种': '午',
  '小暑': '未', '立秋': '申', '白露': '酉', '寒露': '戌', '立冬': '亥',
  '大雪': '子', '小寒': '丑'
};

// ===================== 神煞数据库 =====================

const SHEN_SHA_DATABASE = {
  '天乙贵人': {
    rule: (yearPillar, dayPillar) => {
      const dayGui = { '甲': '丑', '乙': '子', '丙': '酉', '丁': '申', '戊': '卯', '己': '寅', '庚': '亥', '辛': '戌', '壬': '巳', '癸': '辰' };
      const yearGui = { '甲': '未', '乙': '申', '丙': '亥', '丁': '酉', '戊': '丑', '己': '子', '庚': '午', '辛': '巳', '壬': '卯', '癸': '寅' };
      const dayStem = dayPillar ? dayPillar.charAt(0) : '';
      const yearStem = yearPillar ? yearPillar.charAt(0) : '';
      return [dayGui[dayStem] || '', yearGui[yearStem] || ''].filter(Boolean);
    },
    type: '吉',
    power: 0.9,
    desc: '命中最吉之神，主聪明智慧、贵人相助'
  },
  '文昌贵人': {
    rule: (_, dayPillar) => {
      const wen = { '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' };
      const dayStem = dayPillar ? dayPillar.charAt(0) : '';
      return wen[dayStem] ? [wen[dayStem]] : [];
    },
    type: '吉',
    power: 0.6,
    desc: '主学业有成，聪明伶俐，文采出众'
  },
  '桃花': {
    rule: (_, dayPillar) => {
      const tao = { '申子辰': '酉', '寅午戌': '卯', '亥卯未': '子', '巳酉丑': '午' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      for (const key of Object.keys(tao)) {
        if (key.includes(dayBranch)) return [tao[key]];
      }
      return [];
    },
    type: '半吉半凶',
    power: 0.4,
    desc: '主异性缘佳，利社交，但也易因色招祸'
  },
  '羊刃': {
    rule: (_, dayPillar) => {
      const ren = { '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳', '戊': '午', '己': '巳', '庚': '酉', '辛': '申', '壬': '子', '癸': '亥' };
      const dayStem = dayPillar ? dayPillar.charAt(0) : '';
      return ren[dayStem] ? [ren[dayStem]] : [];
    },
    type: '凶',
    power: 0.7,
    desc: '主性格刚烈，易冲动，有魄力但易招灾'
  },
  '驿马': {
    rule: (_, dayPillar) => {
      const ma = { '申子辰': '寅', '寅午戌': '申', '亥卯未': '巳', '巳酉丑': '亥' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      for (const key of Object.keys(ma)) {
        if (key.includes(dayBranch)) return [ma[key]];
      }
      return [];
    },
    type: '半吉半凶',
    power: 0.5,
    desc: '主奔波走动，利外出发展'
  },
  '华盖': {
    rule: (_, dayPillar) => {
      const hua = { '申子辰': '辰', '寅午戌': '戌', '亥卯未': '未', '巳酉丑': '丑' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      for (const key of Object.keys(hua)) {
        if (key.includes(dayBranch)) return [hua[key]];
      }
      return [];
    },
    type: '半吉半凶',
    power: 0.5,
    desc: '吉则才华横溢，凶则孤僻寡合'
  },
  '将星': {
    rule: (_, dayPillar) => {
      const jiang = { '子': '子', '丑': '酉', '寅': '寅', '卯': '卯', '辰': '子', '巳': '酉', '午': '午', '未': '卯', '申': '申', '酉': '酉', '戌': '午', '亥': '亥' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      return jiang[dayBranch] ? [jiang[dayBranch]] : [];
    },
    type: '吉',
    power: 0.6,
    desc: '主有领导才能，做事果断，可掌实权'
  },
  '天德贵人': {
    rule: (_, __, monthBranch) => {
      const de = { '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙', '子': '庚', '丑': '巳' };
      return de[monthBranch] ? [de[monthBranch]] : [];
    },
    type: '吉',
    power: 0.8,
    desc: '主吉祥如意，逢凶化吉'
  },
  '月德贵人': {
    rule: (_, __, monthBranch) => {
      const de = { '寅': '丙', '卯': '甲', '辰': '壬', '巳': '庚', '午': '丙', '未': '甲', '申': '壬', '酉': '庚', '戌': '丙', '亥': '甲', '子': '壬', '丑': '庚' };
      return de[monthBranch] ? [de[monthBranch]] : [];
    },
    type: '吉',
    power: 0.7,
    desc: '主福泽深厚，诸事顺遂'
  },
  '红鸾': {
    rule: (yearPillar) => {
      const luan = { '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌', '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰' };
      const yearBranch = yearPillar ? yearPillar.charAt(1) : '';
      return luan[yearBranch] ? [luan[yearBranch]] : [];
    },
    type: '吉',
    power: 0.5,
    desc: '主婚姻喜事，异性缘旺'
  }
};

// ===================== 格局分析常量 =====================

// 正格局类型
const STANDARD_PATTERNS = {
  '正官格': {
    shishen: '正官',
    score: 75,
    desc: '品行端正，重视名誉，有责任心，适合公职、管理'
  },
  '七杀格': {
    shishen: '七杀',
    score: 60,
    desc: '七杀攻身，压力重重，需印化或食制'
  },
  '正财格': {
    shishen: '正财',
    score: 70,
    desc: '勤俭持家，务实可靠，财富稳定，适合经商、金融'
  },
  '偏财格': {
    shishen: '偏财',
    score: 72,
    desc: '善于理财，机缘众多，富贵可期，适合投资、创业'
  },
  '正印格': {
    shishen: '正印',
    score: 78,
    desc: '仁慈善良，学识渊博，贵人相助，适合教育、研究'
  },
  '偏印格': {
    shishen: '偏印',
    score: 65,
    desc: '聪明特异，钻研精神，适合技术、艺术，但易孤独'
  },
  '食神格': {
    shishen: '食神',
    score: 68,
    desc: '温和善良，才华出众，福气深厚，适合艺术、技术'
  },
  '伤官格': {
    shishen: '伤官',
    score: 58,
    desc: '伤官见官，恃才傲物，易招是非'
  },
  '劫财格': {
    shishen: '劫财',
    score: 62,
    desc: '朋友众多，善于合作，但易破财，需注意理财'
  },
  '比肩格': {
    shishen: '比肩',
    score: 60,
    desc: '独立自主，自强不息，适合创业、技术工作'
  }
};

// 特殊格局类型
const SPECIAL_PATTERNS = {
  '专旺格': {
    condition: (dayElement, elementBalance) => {
      const dayElementCount = elementBalance.count[dayElement] || 0;
      const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
      return (dayElementCount / total) > 0.65;
    },
    score: 85,
    desc: '气势专旺，富贵非凡，行运顺其气势则吉'
  },
  '从财格': {
    condition: (pillars, dayElement, elementBalance) => {
      const dayElementCount = elementBalance.count[dayElement] || 0;
      const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
      if ((dayElementCount / total) < 0.20) {
        const wealthElement = ELEMENT_RELATIONS[dayElement].克;
        const wealthCount = elementBalance.count[wealthElement] || 0;
        return (wealthCount / total) > 0.50;
      }
      return false;
    },
    score: 88,
    desc: '弃命从财，富甲一方，善理财，适合经商'
  },
  '从杀格': {
    condition: (pillars, dayElement, elementBalance) => {
      const dayElementCount = elementBalance.count[dayElement] || 0;
      const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
      if ((dayElementCount / total) < 0.20) {
        const killElement = ELEMENT_RELATIONS[dayElement].被克;
        const killCount = elementBalance.count[killElement] || 0;
        return (killCount / total) > 0.50;
      }
      return false;
    },
    score: 86,
    desc: '弃命从杀，威权显赫，有领导才能，适合军政'
  },
  '从儿格': {
    condition: (pillars, dayElement, elementBalance) => {
      const dayElementCount = elementBalance.count[dayElement] || 0;
      const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
      if ((dayElementCount / total) < 0.20) {
        const childElement = ELEMENT_RELATIONS[dayElement].生;
        const childCount = elementBalance.count[childElement] || 0;
        return (childCount / total) > 0.50;
      }
      return false;
    },
    score: 84,
    desc: '弃命从儿，才华出众，艺术天赋，适合文艺、技术'
  }
};

// 化气格局
const HUAQI_PATTERNS = {
  '甲己化土': { element: '土', score: 82, desc: '天干化合为土，变化灵活，善于变通' },
  '乙庚化金': { element: '金', score: 82, desc: '天干化合为金，坚毅果决，适合金融' },
  '丙辛化水': { element: '水', score: 82, desc: '天干化合为水，智慧灵动，适合策划' },
  '丁壬化木': { element: '木', score: 82, desc: '天干化合为木，生机勃勃，适合创意' },
  '戊癸化火': { element: '火', score: 82, desc: '天干化合为火，热情积极，适合营销' }
};

// 贵人格
const GUIREN_PATTERNS = {
  '魁罡格': {
    pillars: ['庚辰', '庚戌', '壬辰', '壬戌'],
    score: 80,
    desc: '魁罡掌权，性格刚强，聪明果断，忌刑冲'
  },
  '日德格': {
    pillars: ['甲寅', '丙辰', '戊辰', '庚戌', '壬戌'],
    score: 78,
    desc: '仁德厚重，福报深厚，贵人相助'
  },
  '金神格': {
    pillars: ['乙丑', '己巳', '癸酉'],
    score: 83,
    desc: '金神入火乡，富贵天下响，威猛刚强'
  }
};

// 三奇贵人
const SANQI_GUIREN = [
  ['甲', '戊', '庚'],
  ['乙', '丙', '丁'],
  ['壬', '癸', '辛']
];

// ===================== 评分系统常量 =====================

// 神煞系统配置
const SHENSHA = {
  '天乙贵人': {
    rule: (yearPillar, dayPillar) => {
      const gui = { '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'], '乙': ['子', '申'], '己': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'], '壬': ['卯', '巳'], '癸': ['卯', '巳'] };
      const dayStem = dayPillar ? dayPillar.charAt(0) : '';
      return gui[dayStem] || [];
    },
    type: '吉',
    power: 0.8,
    desc: '主贵人相助，逢凶化吉，事业顺利'
  },
  '文昌贵人': {
    rule: (_, dayPillar) => {
      const chang = { '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' };
      const dayStem = dayPillar ? dayPillar.charAt(0) : '';
      return chang[dayStem] ? [chang[dayStem]] : [];
    },
    type: '吉',
    power: 0.7,
    desc: '主聪明好学，文采出众，利于考试、学术'
  },
  '太极贵人': {
    rule: (_, dayPillar) => {
      const tai = { '甲': '子', '乙': '午', '丙': '子', '丁': '午', '戊': '子', '己': '午', '庚': '子', '辛': '午', '壬': '子', '癸': '午' };
      const dayStem = dayPillar ? dayPillar.charAt(0) : '';
      return tai[dayStem] ? [tai[dayStem]] : [];
    },
    type: '吉',
    power: 0.6,
    desc: '主聪明睿智，有悟性，利于修行、哲学'
  },
  '桃花': {
    rule: (_, __, monthBranch) => {
      const tao = { '寅': '酉', '卯': '申', '辰': '未', '巳': '午', '午': '巳', '未': '辰', '申': '卯', '酉': '寅', '戌': '丑', '亥': '子', '子': '亥', '丑': '戌' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      for (const key of Object.keys(tao)) {
        if (key.includes(dayBranch)) return [tao[key]];
      }
      return [];
    },
    type: '半吉半凶',
    power: 0.4,
    desc: '主异性缘佳，利社交，但也易因色招祸'
  },
  '羊刃': {
    rule: (_, dayPillar) => {
      const ren = { '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳', '戊': '午', '己': '巳', '庚': '酉', '辛': '申', '壬': '子', '癸': '亥' };
      const dayStem = dayPillar ? dayPillar.charAt(0) : '';
      return ren[dayStem] ? [ren[dayStem]] : [];
    },
    type: '凶',
    power: 0.7,
    desc: '主性格刚烈，易冲动，有魄力但易招灾'
  },
  '驿马': {
    rule: (_, dayPillar) => {
      const ma = { '申子辰': '寅', '寅午戌': '申', '亥卯未': '巳', '巳酉丑': '亥' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      for (const key of Object.keys(ma)) {
        if (key.includes(dayBranch)) return [ma[key]];
      }
      return [];
    },
    type: '半吉半凶',
    power: 0.5,
    desc: '主奔波走动，利外出发展'
  },
  '华盖': {
    rule: (_, dayPillar) => {
      const hua = { '申子辰': '辰', '寅午戌': '戌', '亥卯未': '未', '巳酉丑': '丑' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      for (const key of Object.keys(hua)) {
        if (key.includes(dayBranch)) return [hua[key]];
      }
      return [];
    },
    type: '半吉半凶',
    power: 0.5,
    desc: '吉则才华横溢，凶则孤僻寡合'
  },
  '将星': {
    rule: (_, dayPillar) => {
      const jiang = { '子': '子', '丑': '酉', '寅': '寅', '卯': '卯', '辰': '子', '巳': '酉', '午': '午', '未': '卯', '申': '申', '酉': '酉', '戌': '午', '亥': '亥' };
      const dayBranch = dayPillar ? dayPillar.charAt(1) : '';
      return jiang[dayBranch] ? [jiang[dayBranch]] : [];
    },
    type: '吉',
    power: 0.6,
    desc: '主有领导才能，做事果断，可掌实权'
  },
  '天德贵人': {
    rule: (_, __, monthBranch) => {
      const de = { '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙', '子': '庚', '丑': '巳' };
      return de[monthBranch] ? [de[monthBranch]] : [];
    },
    type: '吉',
    power: 0.8,
    desc: '主吉祥如意，逢凶化吉'
  },
  '月德贵人': {
    rule: (_, __, monthBranch) => {
      const de = { '寅': '丙', '卯': '甲', '辰': '壬', '巳': '庚', '午': '丙', '未': '甲', '申': '壬', '酉': '庚', '戌': '丙', '亥': '甲', '子': '壬', '丑': '庚' };
      return de[monthBranch] ? [de[monthBranch]] : [];
    },
    type: '吉',
    power: 0.7,
    desc: '主福泽深厚，诸事顺遂'
  },
  '红鸾': {
    rule: (yearPillar) => {
      const luan = { '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌', '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰' };
      const yearBranch = yearPillar ? yearPillar.charAt(1) : '';
      return luan[yearBranch] ? [luan[yearBranch]] : [];
    },
    type: '吉',
    power: 0.5,
    desc: '主婚姻喜事，异性缘旺'
  }
};
const PATTERNS = {
  // 正格局
  '正官格': {
    level: '正格',
    score: 75,
    description: '品行端正，重视名誉，有责任心，适合公职、管理'
  },
  '七杀格': {
    level: '正格',
    score: 60,
    description: '七杀攻身，压力重重，需印化或食制'
  },
  '正财格': {
    level: '正格',
    score: 70,
    description: '勤俭持家，务实可靠，财富稳定，适合经商、金融'
  },
  '偏财格': {
    level: '正格',
    score: 72,
    description: '善于理财，机缘众多，富贵可期，适合投资、创业'
  },
  '正印格': {
    level: '正格',
    score: 78,
    description: '仁慈善良，学识渊博，贵人相助，适合教育、研究'
  },
  '偏印格': {
    level: '正格',
    score: 65,
    description: '聪明特异，钻研精神，适合技术、艺术，但易孤独'
  },
  '食神格': {
    level: '正格',
    score: 68,
    description: '温和善良，才华出众，福气深厚，适合艺术、技术'
  },
  '伤官格': {
    level: '正格',
    score: 58,
    description: '伤官见官，恃才傲物，易招是非'
  },
  '劫财格': {
    level: '正格',
    score: 62,
    description: '朋友众多，善于合作，但易破财，需注意理财'
  },
  '比肩格': {
    level: '正格',
    score: 60,
    description: '独立自主，自强不息，适合创业、技术工作'
  },
  
  // 特殊格局
  '专旺格': {
    level: '特殊格局',
    score: 85,
    description: '气势专旺，富贵非凡，行运顺其气势则吉'
  },
  '从财格': {
    level: '特殊格局',
    score: 88,
    description: '弃命从财，富甲一方，善理财，适合经商'
  },
  '从杀格': {
    level: '特殊格局',
    score: 86,
    description: '从杀格成，威权显赫，适合军警、执法'
  },
  '从儿格': {
    level: '特殊格局',
    score: 84,
    description: '从儿格成，聪明伶俐，适合技艺、创作'
  },
  
  // 化气格局
  '甲己化土': {
    level: '化气格',
    score: 82,
    description: '天干化合为土，变化灵活，善于变通'
  },
  '乙庚化金': {
    level: '化气格',
    score: 82,
    description: '天干化合为金，坚毅果决，适合金融'
  },
  '丙辛化水': {
    level: '化气格',
    score: 82,
    description: '天干化合为水，智慧灵动，适合策划'
  },
  '丁壬化木': {
    level: '化气格',
    score: 82,
    description: '天干化合为木，生机勃勃，适合创意'
  },
  '戊癸化火': {
    level: '化气格',
    score: 82,
    description: '天干化合为火，热情积极，适合营销'
  }
};
const SHISHEN_SCORES = {
  '正官': 75, '七杀': 65, '正印': 80, '偏印': 70,
  '正财': 78, '偏财': 72, '食神': 82, '伤官': 60,
  '比肩': 68, '劫财': 55
};

// 吉神煞加分
const JI_SHENSHA_BONUS = {
  '天乙贵人': 5,
  '文昌贵人': 3,
  '天德贵人': 4,
  '月德贵人': 4,
  '将星': 3,
  '红鸾': 2
};

// 凶神煞扣分
const XIONG_SHENSHA_PENALTY = {
  '羊刃': -4,
  '七杀': -3,
  '伤官': -2
};

// 好的十神组合
const GOOD_SHISHEN_COMBOS = [
  ['正官', '正印'],
  ['正财', '正官'],
  ['食神', '正财'],
  ['七杀', '食神'],
  ['伤官', '正印']
];

// 不利的十神组合
const BAD_SHISHEN_COMBOS = [
  ['伤官', '正官'],
  ['劫财', '正财'],
  ['七杀', '正官'],
  ['偏印', '食神']
];

// 大运建议映射
const DAYUN_ADVICE_MAP = {
  '正官': '利于事业发展，适合争取职位、提升名誉',
  '七杀': '压力较大，但也是机遇，适合开拓、攻坚',
  '正财': '财运稳定，适合积累财富、稳健投资',
  '偏财': '偏财运佳，适合投资、创业',
  '正印': '学习运佳，适合进修、考证，贵人相助',
  '偏印': '适合研究、技术工作，但需注意人际关系',
  '食神': '才华展现，适合艺术、创作，生活安逸',
  '伤官': '才华横溢，但易有是非，需注意言行',
  '比肩': '合作机会多，但竞争也激烈',
  '劫财': '易有破财，需注意理财，避免借贷'
};

// 导出八字知识库常量
if (typeof window !== 'undefined') {
  window.BAZI_CONSTANTS = {
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    STEM_ELEMENTS,
    STEM_YIN_YANG,
    BRANCH_ELEMENTS,
    BRANCH_YIN_YANG,
    NAYIN_WUXING,
    PATTERNS,
    SHENSHA,
    SHISHEN_SCORES,
    JI_SHENSHA_BONUS,
    XIONG_SHENSHA_PENALTY,
    GOOD_SHISHEN_COMBOS,
    BAD_SHISHEN_COMBOS,
    DAYUN_ADVICE_MAP
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    STEM_ELEMENTS,
    STEM_YIN_YANG,
    BRANCH_ELEMENTS,
    BRANCH_YIN_YANG,
    NAYIN_WUXING,
    PATTERNS,
    SHENSHA,
    SHISHEN_SCORES,
    JI_SHENSHA_BONUS,
    XIONG_SHENSHA_PENALTY,
    GOOD_SHISHEN_COMBOS,
    BAD_SHISHEN_COMBOS,
    DAYUN_ADVICE_MAP
  };
}