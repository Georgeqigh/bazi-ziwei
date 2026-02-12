/**
 * 完整八字命理计算系统 v2.0
 * 整合原始版本与增强功能，包含：
 * 1. 精确节气计算（1900-2100年）
 * 2. 完整命局格局分析（25+种格局）
 * 3. 30+核心神煞系统
 * 4. 大运排盘与流年分析
 * 5. 五行平衡与综合评分
 * 
 * 使用方法：
 * const bazi = BaziCalculator.generate(birthDate, longitude, isMale);
 * const result = BaziCalculator.format(bazi, 'zh-CN');
 */

// 常量已移至 bazi-knowledge.js，通过script标签引入

// ===================== 2. 精确节气计算模块 =====================
class SolarTermCalculator {
  static SOLAR_TERMS_ORDER = SOLAR_TERMS_ORDER;
  static SOLAR_TERMS_DATA = SOLAR_TERMS_DATA;

  static calculateSolarTerm(year, termIndex) {
    if (this.SOLAR_TERMS_DATA[year] && this.SOLAR_TERMS_DATA[year][termIndex]) {
      const term = this.SOLAR_TERMS_DATA[year][termIndex];
      return new Date(year, term.month - 1, term.day, term.hour, term.minute, 0);
    }
    return this.calculateByFormula(year, termIndex);
  }

  static calculateByFormula(year, termIndex) {
    const constants = [5.4055, 20.12, 3.87, 18.73, 5.63, 20.646, 4.81, 20.1, 5.52, 21.04, 5.678, 21.37,
                      7.108, 22.83, 7.5, 23.13, 7.646, 23.042, 8.318, 23.438, 7.438, 22.36, 7.18, 21.94];
    const D = 0.2422;
    const C = constants[termIndex] || 15.0;
    
    let day = Math.floor(C + year * D - Math.floor(year / 4));
    if (year > 2000) day += 1;
    
    let month = Math.floor((termIndex + 1) / 2);
    if (termIndex >= 22) month = 0;
    else if (termIndex >= 20) month = 11;
    
    day = Math.max(1, Math.min(day, 31));
    return new Date(year, month, day, 12, 0, 0);
  }

  static getSolarTerm(date) {
    const year = date.getFullYear();
    
    for (let i = 0; i < 24; i++) {
      const termDate = this.calculateSolarTerm(year, i);
      if (date >= termDate) {
        const nextIndex = (i + 1) % 24;
        const nextTermDate = this.calculateSolarTerm(
          nextIndex === 0 ? year + 1 : year, 
          nextIndex
        );
        
        if (date < nextTermDate) {
          return {
            name: this.SOLAR_TERMS_ORDER[i],
            date: termDate,
            next: {
              name: this.SOLAR_TERMS_ORDER[nextIndex],
              date: nextTermDate
            },
            daysUntilNext: Math.floor((nextTermDate - date) / (1000 * 60 * 60 * 24))
          };
        }
      }
    }
    return null;
  }

  static getMonthBranchBySolarTerm(date) {
    const solarTerm = this.getSolarTerm(date);
    if (!solarTerm) return EARTHLY_BRANCHES[date.getMonth()];
    
    const termToBranch = TERM_TO_BRANCH_MAP;
    
    return termToBranch[solarTerm.name] || EARTHLY_BRANCHES[date.getMonth()];
  }

  static calculateSolarTermDiff(birthDate, isShun) {
    const solarTerm = this.getSolarTerm(birthDate);
    if (!solarTerm) return 0;
    
    if (isShun) {
      return Math.max(0, Math.floor((solarTerm.next.date - birthDate) / (1000 * 60 * 60 * 24)));
    } else {
      return Math.max(0, Math.floor((birthDate - solarTerm.date) / (1000 * 60 * 60 * 24)));
    }
  }
}

// 神煞数据库已移至 bazi-knowledge.js

// ===================== 4. 八字核心数据类 =====================
class EightCharacters {
  constructor() {
    this.yearPillar = '';
    this.monthPillar = '';
    this.dayPillar = '';
    this.hourPillar = '';
    this.dayMaster = '';
    
    this.nayin = {};
    this.tenGods = {};
    this.shenSha = {};
    this.lifeStage = {};
    this.elementBalance = {};
    this.hiddenStems = {};
    this.kongWang = {};
    this.diShi = {};
    
    this.patterns = [];
    this.patternLevel = {};
    this.usefulGods = [];
    this.avoidGods = [];
    
    this.daYun = {
      startAge: 0,
      direction: '',
      stages: []
    };
    
    this.liuNian = [];
    this.totalScore = 0;
    this.solarTermInfo = null;
  }
}

// ===================== 5. 工具函数 =====================
function includesAll(arr, elements) {
  return elements.every(el => arr.includes(el));
}

function getCombinations(arr, length) {
  const result = [];
  const combine = (start, path) => {
    if (path.length === length) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      combine(i + 1, path);
      path.pop();
    }
  };
  combine(0, []);
  return result;
}

function calculateTrueSolarTime(birthDate, longitude) {
  const standardLongitude = 120;
  const timeDiff = (longitude - standardLongitude) * 4;
  return new Date(birthDate.getTime() + timeDiff * 60 * 1000);
}

function getHourBranch(hour) {
  if (hour === 23 || hour === 0) return '子';
  return EARTHLY_BRANCHES[Math.floor((hour + 1) % 24 / 2)];
}

function getYearGanZhi(year) {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return HEAVENLY_STEMS[ganIndex < 0 ? ganIndex + 10 : ganIndex] + 
         EARTHLY_BRANCHES[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex];
}

function getDayGanZhi(date) {
  const baseDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
  const ganIndex = (0 + diffDays) % 10;
  const zhiIndex = (10 + diffDays) % 12;
  return HEAVENLY_STEMS[ganIndex < 0 ? ganIndex + 10 : ganIndex] + 
         EARTHLY_BRANCHES[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex];
}

function getMonthStem(yearGan, monthBranch) {
  const hu = {
    '甲': '丙', '乙': '戊', '丙': '庚', '丁': '壬', '戊': '甲',
    '己': '丙', '庚': '戊', '辛': '庚', '壬': '壬', '癸': '甲'
  };
  const baseGan = hu[yearGan];
  const baseIndex = HEAVENLY_STEMS.indexOf(baseGan);
  const branchIndex = EARTHLY_BRANCHES.indexOf(monthBranch);
  const ganIndex = (baseIndex + branchIndex - 2) % 10;
  return HEAVENLY_STEMS[ganIndex < 0 ? ganIndex + 10 : ganIndex];
}

function getHourStem(dayGan, hourBranch) {
  const shu = {
    '甲': '甲', '乙': '丙', '丙': '戊', '丁': '庚', '戊': '壬',
    '己': '甲', '庚': '丙', '辛': '戊', '壬': '庚', '癸': '壬'
  };
  const baseGan = shu[dayGan];
  const baseIndex = HEAVENLY_STEMS.indexOf(baseGan);
  const branchIndex = EARTHLY_BRANCHES.indexOf(hourBranch);
  const ganIndex = (baseIndex + branchIndex) % 10;
  return HEAVENLY_STEMS[ganIndex];
}

function getShiShenRelation(dayMaster, otherStem) {
  if (!dayMaster || !otherStem) return '';
  
  const dmElement = STEM_ELEMENTS[dayMaster];
  const dmYinYang = STEM_YIN_YANG[dayMaster];
  const osElement = STEM_ELEMENTS[otherStem];
  const osYinYang = STEM_YIN_YANG[otherStem];

  if (dmElement === osElement) {
    return dmYinYang === osYinYang ? '比肩' : '劫财';
  }
  if (ELEMENT_RELATIONS[dmElement].生 === osElement) {
    return dmYinYang === osYinYang ? '食神' : '伤官';
  }
  if (ELEMENT_RELATIONS[dmElement].被生 === osElement) {
    return dmYinYang === osYinYang ? '偏印' : '正印';
  }
  if (ELEMENT_RELATIONS[dmElement].克 === osElement) {
    return dmYinYang === osYinYang ? '偏财' : '正财';
  }
  if (ELEMENT_RELATIONS[dmElement].被克 === osElement) {
    return dmYinYang === osYinYang ? '七杀' : '正官';
  }
  return '';
}

function calculateTenGods(pillars) {
  const dayMaster = pillars.day.charAt(0);
  return {
    year: getShiShenRelation(dayMaster, pillars.year.charAt(0)),
    month: getShiShenRelation(dayMaster, pillars.month.charAt(0)),
    day: getShiShenRelation(dayMaster, pillars.day.charAt(0)),
    hour: getShiShenRelation(dayMaster, pillars.hour.charAt(0))
  };
}

function getNayin(ganZhi) {
  return NAYIN_TABLE[ganZhi] || '';
}

function calculateAllNayin(pillars) {
  return {
    year: getNayin(pillars.year),
    month: getNayin(pillars.month),
    day: getNayin(pillars.day),
    hour: getNayin(pillars.hour)
  };
}

function calculateAllShenSha(yearPillar, monthPillar, dayPillar) {
  const result = {};
  const monthBranch = monthPillar ? monthPillar.charAt(1) : '';

  for (const [name, config] of Object.entries(SHEN_SHA_DATABASE)) {
    const values = config.rule(yearPillar, dayPillar, monthBranch);
    if (values.length > 0) {
      result[name] = {
        positions: values,
        type: config.type,
        power: config.power,
        desc: config.desc
      };
    }
  }
  return result;
}

function calculateLifeStageStrength(dayMaster) {
  const element = STEM_ELEMENTS[dayMaster];
  const yinYang = STEM_YIN_YANG[dayMaster];
  const key = `${element}${yinYang === '阳' ? '阳' : '阴'}`;
  const stages = TWELVE_LIFE_STAGES;
  const branches = LIFE_STAGE_BRANCHES[key];
  return { stages, branches, strength: stages.indexOf('帝旺') + 1 };
}

function calculateElementBalance(pillars) {
  const elements = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  
  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach(pillar => {
    if (pillar) {
      const stem = pillar.charAt(0);
      elements[STEM_ELEMENTS[stem]] += 1.0;
    }
  });
  
  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach(pillar => {
    if (pillar) {
      const branch = pillar.charAt(1);
      const hiddenStems = BRANCH_HIDDEN_STEMS[branch];
      if (hiddenStems) {
        hiddenStems.forEach(hidden => {
          const element = STEM_ELEMENTS[hidden.stem];
          elements[element] += hidden.power;
        });
      }
    }
  });
  
  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  const ratio = {};
  const score = {};
  
  for (const [key, value] of Object.entries(elements)) {
    ratio[key] = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0.00%';
    score[key] = Math.round((value / 8) * 100);
  }
  
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  
  return {
    count: elements,
    ratio,
    score,
    strongest: { element: sorted[0][0], value: sorted[0][1] },
    weakest: { element: sorted[sorted.length - 1][0], value: sorted[sorted.length - 1][1] },
    balanceIndex: calculateBalanceIndex(elements)
  };
}

function calculateBalanceIndex(elements) {
  const values = Object.values(elements);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const balanceScore = Math.max(0, 100 - stdDev * 20);
  return Math.round(balanceScore);
}

function getHiddenStems(branch) {
  return BRANCH_HIDDEN_STEMS[branch] ? 
    BRANCH_HIDDEN_STEMS[branch].map(h => h.stem).join('') : '';
}

function getDiShi(dayMaster, branch) {
  const element = STEM_ELEMENTS[dayMaster];
  const yinYang = STEM_YIN_YANG[dayMaster];
  const key = `${element}${yinYang === '阳' ? '阳' : '阴'}`;
  const branches = LIFE_STAGE_BRANCHES[key];
  const stages = TWELVE_LIFE_STAGES;
  const branchIndex = branches.indexOf(branch);
  return branchIndex >= 0 ? stages[branchIndex] : '';
}

function getKongWang(ganzhi) {
  if (!ganzhi || ganzhi.length !== 2) return '';
  
  const gan = ganzhi.charAt(0);
  const zhi = ganzhi.charAt(1);
  const ganIndex = HEAVENLY_STEMS.indexOf(gan);
  const zhiIndex = EARTHLY_BRANCHES.indexOf(zhi);
  
  const xunIndex = Math.floor((ganIndex - zhiIndex + 12) % 12);
  const kongwangPairs = [
    ['戌', '亥'], ['申', '酉'], ['午', '未'], ['辰', '巳'],
    ['寅', '卯'], ['子', '丑']
  ];
  
  return kongwangPairs[xunIndex] ? kongwangPairs[xunIndex].join('') : '';
}

function filterShenShaToPillar(allShenSha, pillar) {
  if (!pillar || !allShenSha) return '';
  const result = [];
  for (const [name, config] of Object.entries(allShenSha)) {
    if (config.positions && config.positions.length > 0) {
      result.push(name);
    }
  }
  return result.slice(0, 3).join('、');
}

// ===================== 6. 完整命局格局分析系统 =====================
class PatternAnalyzer {
  static analyzeCompletePatterns(pillars, elementBalance, tenGods, dayMaster) {
    const allPatterns = [];
    
    const standardPatterns = this.analyzeStandardPatterns(pillars, dayMaster, tenGods);
    allPatterns.push(...standardPatterns);
    
    const specialPatterns = this.analyzeSpecialPatterns(pillars, elementBalance, dayMaster);
    allPatterns.push(...specialPatterns);
    
    const externalPatterns = this.analyzeExternalPatterns(pillars, dayMaster);
    allPatterns.push(...externalPatterns);
    
    const comprehensive = this.analyzeComprehensivePattern(allPatterns);
    if (comprehensive) allPatterns.push(comprehensive);
    
    const patternLevel = this.evaluatePatternLevel(allPatterns);
    
    return {
      patterns: allPatterns,
      level: patternLevel,
      mainPattern: this.getMainPattern(allPatterns),
      usefulGods: this.calculateUsefulGods(pillars, elementBalance, dayMaster),
      avoidGods: this.calculateAvoidGods(pillars, elementBalance, dayMaster)
    };
  }

  static analyzeStandardPatterns(pillars, dayMaster, tenGods) {
    const patterns = [];
    const monthStem = pillars.month.charAt(0);
    const monthShiShen = getShiShenRelation(dayMaster, monthStem);
    
    if (monthShiShen === '正官' && STANDARD_PATTERNS['正官格']) {
      const pattern = STANDARD_PATTERNS['正官格'];
      patterns.push({
        name: '正官格',
        type: '正格',
        subtype: '官格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (monthShiShen === '七杀') {
      const hasControl = this.hasSevenKillControl(pillars, dayMaster);
      const pattern = STANDARD_PATTERNS['七杀格'];
      patterns.push({
        name: hasControl ? '七杀有制格' : '七杀无制格',
        type: '正格',
        subtype: '杀格',
        score: hasControl ? pattern.score + 20 : pattern.score,
        desc: hasControl ? '杀重有制，威权显赫，魄力非凡' : pattern.desc
      });
    }
    
    if (monthShiShen === '正财' && STANDARD_PATTERNS['正财格']) {
      const pattern = STANDARD_PATTERNS['正财格'];
      patterns.push({
        name: '正财格',
        type: '正格',
        subtype: '财格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (monthShiShen === '偏财' && STANDARD_PATTERNS['偏财格']) {
      const pattern = STANDARD_PATTERNS['偏财格'];
      patterns.push({
        name: '偏财格',
        type: '正格',
        subtype: '财格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (monthShiShen === '正印' && STANDARD_PATTERNS['正印格']) {
      const pattern = STANDARD_PATTERNS['正印格'];
      patterns.push({
        name: '正印格',
        type: '正格',
        subtype: '印格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (monthShiShen === '偏印' && STANDARD_PATTERNS['偏印格']) {
      const pattern = STANDARD_PATTERNS['偏印格'];
      patterns.push({
        name: '偏印格',
        type: '正格',
        subtype: '印格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (monthShiShen === '食神' && STANDARD_PATTERNS['食神格']) {
      const pattern = STANDARD_PATTERNS['食神格'];
      patterns.push({
        name: '食神格',
        type: '正格',
        subtype: '食伤格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (monthShiShen === '伤官') {
      const hasControl = this.hasShangGuanControl(pillars, dayMaster);
      const pattern = STANDARD_PATTERNS['伤官格'];
      patterns.push({
        name: hasControl ? '伤官配印格' : '伤官见官格',
        type: '正格',
        subtype: '食伤格',
        score: hasControl ? pattern.score + 24 : pattern.score,
        desc: hasControl ? '伤官配印，才华横溢，名利双收' : pattern.desc
      });
    }
    
    const hasJieCai = this.isJieCaiGe(pillars, dayMaster, tenGods);
    if (hasJieCai && STANDARD_PATTERNS['劫财格']) {
      const pattern = STANDARD_PATTERNS['劫财格'];
      patterns.push({
        name: '劫财格',
        type: '正格',
        subtype: '比劫格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    const hasBiJian = this.isBiJianGe(pillars, dayMaster, tenGods);
    if (hasBiJian && STANDARD_PATTERNS['比肩格']) {
      const pattern = STANDARD_PATTERNS['比肩格'];
      patterns.push({
        name: '比肩格',
        type: '正格',
        subtype: '比劫格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    return patterns;
  }

  static analyzeSpecialPatterns(pillars, elementBalance, dayMaster) {
    const patterns = [];
    const dayElement = STEM_ELEMENTS[dayMaster];
    
    if (SPECIAL_PATTERNS['专旺格'].condition(dayElement, elementBalance)) {
      const pattern = SPECIAL_PATTERNS['专旺格'];
      patterns.push({
        name: `${dayElement}专旺格`,
        type: '特殊格局',
        subtype: '专旺',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (SPECIAL_PATTERNS['从财格'].condition(pillars, dayElement, elementBalance)) {
      const pattern = SPECIAL_PATTERNS['从财格'];
      patterns.push({
        name: '从财格',
        type: '特殊格局',
        subtype: '从格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (SPECIAL_PATTERNS['从杀格'].condition(pillars, dayElement, elementBalance)) {
      const pattern = SPECIAL_PATTERNS['从杀格'];
      patterns.push({
        name: '从杀格',
        type: '特殊格局',
        subtype: '从格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (SPECIAL_PATTERNS['从儿格'].condition(pillars, dayElement, elementBalance)) {
      const pattern = SPECIAL_PATTERNS['从儿格'];
      patterns.push({
        name: '从儿格',
        type: '特殊格局',
        subtype: '从格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    const huaQiPattern = this.analyzeHuaQiGeFromKnowledge(pillars);
    if (huaQiPattern) patterns.push(huaQiPattern);
    
    if (this.isTwoElementPattern(elementBalance)) {
      patterns.push({
        name: '两神成像格',
        type: '特殊格局',
        subtype: '成像',
        score: 90,
        desc: '五行清纯，富贵清奇，品性高洁'
      });
    }
    
    if (this.isSanQiGuiRenFromKnowledge(pillars)) {
      patterns.push({
        name: '三奇贵人格',
        type: '特殊格局',
        subtype: '贵格',
        score: 82,
        desc: '奇能异巧，超凡脱俗，遇难呈祥'
      });
    }
    
    if (this.isGuiRenPattern(pillars, '金神格')) {
      const pattern = GUIREN_PATTERNS['金神格'];
      patterns.push({
        name: '金神格',
        type: '特殊格局',
        subtype: '贵格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (this.isGuiRenPattern(pillars, '魁罡格')) {
      const pattern = GUIREN_PATTERNS['魁罡格'];
      patterns.push({
        name: '魁罡格',
        type: '特殊格局',
        subtype: '贵格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    if (this.isGuiRenPattern(pillars, '日德格')) {
      const pattern = GUIREN_PATTERNS['日德格'];
      patterns.push({
        name: '日德格',
        type: '特殊格局',
        subtype: '德格',
        score: pattern.score,
        desc: pattern.desc
      });
    }
    
    return patterns;
  }

  static analyzeExternalPatterns(pillars, dayMaster) {
    const patterns = [];
    
    if (this.isHuDieShuangFeiGe(pillars)) {
      patterns.push({
        name: '蝴蝶双飞格',
        type: '外格',
        subtype: '对称格',
        score: 76,
        desc: '对称和谐，福气加倍，事多成双'
      });
    }
    
    return patterns;
  }

  static analyzeComprehensivePattern(patterns) {
    const specialPatterns = patterns.filter(p => p.type === '特殊格局');
    const standardPatterns = patterns.filter(p => p.type === '正格');
    
    if (specialPatterns.length > 1) {
      return {
        name: `多重特殊格局`,
        type: '综合格局',
        subtype: '多重',
        score: Math.min(95, specialPatterns[0].score + 5),
        desc: '格局多重，富贵非凡，但需行运配合'
      };
    }
    
    if (standardPatterns.length >= 2) {
      const hasSpecialCombo = this.checkSpecialCombination(standardPatterns);
      if (hasSpecialCombo) return hasSpecialCombo;
    }
    
    return null;
  }

  static checkSpecialCombination(patterns) {
    const patternNames = patterns.map(p => p.name);
    
    if (patternNames.includes('正官格') && patternNames.includes('正印格')) {
      return {
        name: '官印相生格',
        score: 85,
        desc: '官印相生，贵气十足，仕途顺畅'
      };
    }
    
    if ((patternNames.includes('正财格') || patternNames.includes('偏财格')) && 
        patternNames.includes('正官格')) {
      return {
        name: '财官双美格',
        score: 87,
        desc: '财官双美，富贵双全，事业财富皆佳'
      };
    }
    
    if (patternNames.includes('食神格') && 
        (patternNames.includes('正财格') || patternNames.includes('偏财格'))) {
      return {
        name: '食神生财格',
        score: 83,
        desc: '食神生财，技艺生财，靠才华致富'
      };
    }
    
    return null;
  }

  // 辅助判断方法
  static hasSevenKillControl(pillars, dayMaster) {
    const tenGods = calculateTenGods(pillars);
    const hasShiShen = Object.values(tenGods).includes('食神');
    const hasYin = Object.values(tenGods).includes('正印') || 
                   Object.values(tenGods).includes('偏印');
    return hasShiShen || hasYin;
  }

  static hasShangGuanControl(pillars, dayMaster) {
    const tenGods = calculateTenGods(pillars);
    const hasYin = Object.values(tenGods).includes('正印') || 
                   Object.values(tenGods).includes('偏印');
    return hasYin;
  }

  static isJieCaiGe(pillars, dayMaster, tenGods) {
    const monthStem = pillars.month.charAt(0);
    const monthShiShen = getShiShenRelation(dayMaster, monthStem);
    return monthShiShen === '劫财';
  }

  static isBiJianGe(pillars, dayMaster, tenGods) {
    const monthStem = pillars.month.charAt(0);
    const monthShiShen = getShiShenRelation(dayMaster, monthStem);
    return monthShiShen === '比肩';
  }

  static isZhuanWangGe(dayElement, elementBalance) {
    const dayElementCount = elementBalance.count[dayElement] || 0;
    const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
    return (dayElementCount / total) > 0.65;
  }

  static isCongCaiGe(pillars, dayElement, elementBalance) {
    const dayElementCount = elementBalance.count[dayElement] || 0;
    const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
    if ((dayElementCount / total) < 0.20) {
      const wealthElement = ELEMENT_RELATIONS[dayElement].克;
      const wealthCount = elementBalance.count[wealthElement] || 0;
      return (wealthCount / total) > 0.50;
    }
    return false;
  }

  static isCongShaGe(pillars, dayElement, elementBalance) {
    const dayElementCount = elementBalance.count[dayElement] || 0;
    const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
    if ((dayElementCount / total) < 0.20) {
      const killElement = ELEMENT_RELATIONS[dayElement].被克;
      const killCount = elementBalance.count[killElement] || 0;
      return (killCount / total) > 0.50;
    }
    return false;
  }

  static isCongErGe(pillars, dayElement, elementBalance) {
    const dayElementCount = elementBalance.count[dayElement] || 0;
    const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
    if ((dayElementCount / total) < 0.20) {
      const childElement = ELEMENT_RELATIONS[dayElement].生;
      const childCount = elementBalance.count[childElement] || 0;
      return (childCount / total) > 0.50;
    }
    return false;
  }

  static analyzeHuaQiGeFromKnowledge(pillars) {
    const yearStem = pillars.year.charAt(0);
    const monthStem = pillars.month.charAt(0);
    
    const combinations = [yearStem + monthStem, monthStem + yearStem];
    
    for (const combination of combinations) {
      const patternName = `${combination}化${combination === yearStem + monthStem ? '前' : '后'}干`;
      if (HUAQI_PATTERNS[patternName]) {
        const pattern = HUAQI_PATTERNS[patternName];
        return {
          name: `${pattern.element}化气格`,
          type: '特殊格局',
          subtype: '化气',
          score: pattern.score,
          desc: pattern.desc
        };
      }
    }
    
    return null;
  }

  static isTwoElementPattern(elementBalance) {
    const nonZeroElements = Object.entries(elementBalance.count)
      .filter(([_, count]) => count > 0);
    
    if (nonZeroElements.length === 2) {
      const ratio = nonZeroElements[0][1] / nonZeroElements[1][1];
      return ratio >= 0.5 && ratio <= 2;
    }
    return false;
  }

  static isSanQiGuiRenFromKnowledge(pillars) {
    const stems = [
      pillars.year.charAt(0),
      pillars.month.charAt(0),
      pillars.day.charAt(0)
    ];
    
    for (const sanqi of SANQI_GUIREN) {
      if (sanqi.every(stem => stems.includes(stem))) {
        return true;
      }
    }
    return false;
  }

  static isGuiRenPattern(pillars, patternName) {
    if (!GUIREN_PATTERNS[patternName]) return false;
    
    const pattern = GUIREN_PATTERNS[patternName];
    return pattern.pillars.some(pillar => 
      pillars.year === pillar || pillars.month === pillar || 
      pillars.day === pillar || pillars.hour === pillar
    );
  }

  static isHuDieShuangFeiGe(pillars) {
    const pillarsArray = Object.values(pillars);
    
    for (let i = 0; i < pillarsArray.length; i++) {
      for (let j = i + 1; j < pillarsArray.length; j++) {
        if (pillarsArray[i] === pillarsArray[j]) {
          return true;
        }
      }
    }
    
    return pillars.year === pillars.hour && pillars.month === pillars.day;
  }

  static evaluatePatternLevel(patterns) {
    if (patterns.length === 0) {
      return { level: '普通', score: 50, desc: '无明显格局，普通命造' };
    }
    
    const bestPattern = patterns.sort((a, b) => b.score - a.score)[0];
    const avgScore = patterns.reduce((sum, p) => sum + p.score, 0) / patterns.length;
    
    let level, desc;
    
    if (bestPattern.score >= 85) {
      level = '上等';
      desc = '格局清奇，富贵非凡';
    } else if (bestPattern.score >= 75) {
      level = '中上';
      desc = '格局不错，有所作为';
    } else if (bestPattern.score >= 65) {
      level = '中等';
      desc = '格局平常，平稳发展';
    } else if (bestPattern.score >= 55) {
      level = '中下';
      desc = '格局一般，需多努力';
    } else {
      level = '普通';
      desc = '格局平常，普通命造';
    }
    
    if (patterns.length >= 3) {
      level = `${level}（多重格局）`;
      desc = `${desc}，具备多种格局特征`;
    }
    
    return {
      level,
      score: Math.round(avgScore),
      desc,
      bestPattern: bestPattern.name
    };
  }

  static getMainPattern(patterns) {
    if (patterns.length === 0) return null;
    
    const specialPatterns = patterns.filter(p => p.type === '特殊格局');
    if (specialPatterns.length > 0) {
      return specialPatterns.sort((a, b) => b.score - a.score)[0];
    }
    
    const standardPatterns = patterns.filter(p => p.type === '正格');
    if (standardPatterns.length > 0) {
      return standardPatterns.sort((a, b) => b.score - a.score)[0];
    }
    
    return patterns.sort((a, b) => b.score - a.score)[0];
  }

  static calculateUsefulGods(pillars, elementBalance, dayMaster) {
    const dayElement = STEM_ELEMENTS[dayMaster];
    const isStrong = this.isDayMasterStrong(pillars, elementBalance, dayMaster);
    const usefulGods = [];
    
    if (isStrong) {
      usefulGods.push({
        type: '财',
        element: ELEMENT_RELATIONS[dayElement].克,
        desc: '泄身生财，获取财富'
      });
      usefulGods.push({
        type: '官',
        element: ELEMENT_RELATIONS[dayElement].被克,
        desc: '约束自身，获得地位'
      });
      usefulGods.push({
        type: '食伤',
        element: ELEMENT_RELATIONS[dayElement].生,
        desc: '泄身吐秀，展现才华'
      });
    } else {
      usefulGods.push({
        type: '印',
        element: ELEMENT_RELATIONS[dayElement].被生,
        desc: '生扶日主，增强力量'
      });
      usefulGods.push({
        type: '比劫',
        element: dayElement,
        desc: '帮扶日主，增强实力'
      });
    }
    
    return usefulGods;
  }

  static calculateAvoidGods(pillars, elementBalance, dayMaster) {
    const dayElement = STEM_ELEMENTS[dayMaster];
    const isStrong = this.isDayMasterStrong(pillars, elementBalance, dayMaster);
    const avoidGods = [];
    
    if (isStrong) {
      avoidGods.push({
        type: '印',
        element: ELEMENT_RELATIONS[dayElement].被生,
        desc: '生身更旺，过于膨胀'
      });
      avoidGods.push({
        type: '比劫',
        element: dayElement,
        desc: '帮身更旺，竞争破财'
      });
    } else {
      avoidGods.push({
        type: '财',
        element: ELEMENT_RELATIONS[dayElement].克,
        desc: '耗身破财，压力增大'
      });
      avoidGods.push({
        type: '官',
        element: ELEMENT_RELATIONS[dayElement].被克,
        desc: '克身太过，压力重重'
      });
      avoidGods.push({
        type: '食伤',
        element: ELEMENT_RELATIONS[dayElement].生,
        desc: '泄身太过，精力耗散'
      });
    }
    
    return avoidGods;
  }

  static isDayMasterStrong(pillars, elementBalance, dayMaster) {
    const dayElement = STEM_ELEMENTS[dayMaster];
    const dayElementCount = elementBalance.count[dayElement] || 0;
    const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
    return (dayElementCount / total) > 0.30;
  }
}

// ===================== 7. 大运计算 =====================
function calculateStartAge(birthDate, monthBranch, dayMaster, isMale) {
  const dmYinYang = STEM_YIN_YANG[dayMaster];
  const isShun = (isMale && dmYinYang === '阳') || (!isMale && dmYinYang === '阴');
  const diffDays = SolarTermCalculator.calculateSolarTermDiff(birthDate, isShun);
  
  const years = Math.floor(diffDays / 3);
  const remainingDays = diffDays % 3;
  const months = Math.floor(remainingDays * 4);
  
  return years + (months / 12);
}

function calculateDaYun(monthPillar, dayMaster, isMale, startAge) {
  if (!monthPillar || !dayMaster) {
    return { startAge: 0, direction: '', stages: [] };
  }
  
  // 确保startAge有默认值
  const validStartAge = typeof startAge === 'number' && !isNaN(startAge) ? startAge : 0;
  
  const dmYinYang = STEM_YIN_YANG[dayMaster];
  const isShun = (isMale && dmYinYang === '阳') || (!isMale && dmYinYang === '阴');

  const monthGanIndex = HEAVENLY_STEMS.indexOf(monthPillar.charAt(0));
  const monthZhiIndex = EARTHLY_BRANCHES.indexOf(monthPillar.charAt(1));

  const stages = [];
  let currentAge = validStartAge;

  for (let i = 0; i < 10; i++) {
    let ganIndex, zhiIndex;
    if (isShun) {
      ganIndex = (monthGanIndex + i) % 10;
      zhiIndex = (monthZhiIndex + i) % 12;
    } else {
      ganIndex = (monthGanIndex - i + 10) % 10;
      zhiIndex = (monthZhiIndex - i + 12) % 12;
    }
    
    const ganZhi = HEAVENLY_STEMS[ganIndex] + EARTHLY_BRANCHES[zhiIndex];
    const tenGod = getShiShenRelation(dayMaster, HEAVENLY_STEMS[ganIndex]);
    const element = STEM_ELEMENTS[HEAVENLY_STEMS[ganIndex]];
    
    // 计算大运评分
    const score = SHISHEN_SCORES[tenGod] || 60;

    stages.push({
      ganZhi,
      startAge: Math.floor(currentAge),
      endAge: Math.floor(currentAge + 9),
      tenGod,
      element,
      score
    });
    currentAge += 10;
  }

  return {
    startAge: Math.floor(validStartAge),
    direction: isShun ? '顺排' : '逆排',
    stages
  };
}

// ===================== 8. 流年计算 =====================
function calculateLiuNian(birthYear, pillars, dayMaster) {
  const result = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const ganZhi = getYearGanZhi(year);
    const tenGod = getShiShenRelation(dayMaster, ganZhi.charAt(0));
    
    const liuNianShenSha = {};
    for (const [name, config] of Object.entries(SHEN_SHA_DATABASE)) {
      const values = config.rule(ganZhi, ganZhi, '');
      if (values.length > 0) {
        liuNianShenSha[name] = { positions: values, type: config.type };
      }
    }

    const chongHe = [];
    const yearBranch = ganZhi.charAt(1);
    const chongMap = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
    const heMap = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
    
    for (const [pillarName, pillar] of Object.entries(pillars)) {
      if (pillar) {
        const pillarBranch = pillar.charAt(1);
        if (chongMap[yearBranch] === pillarBranch) {
          chongHe.push(`冲${pillarName}柱`);
        }
        if (heMap[yearBranch] === pillarBranch) {
          chongHe.push(`合${pillarName}柱`);
        }
      }
    }

    // 计算流年评分
    let score = SHISHEN_SCORES[tenGod] || 60;
    
    // 根据冲合调整分数
    if (chongHe.length > 0) {
      if (chongHe.some(c => c.includes('冲'))) score -= 5;
      if (chongHe.some(c => c.includes('合'))) score += 3;
    }
    
    // 根据神煞调整分数
    let shenShaBonus = 0;
    for (const [name, config] of Object.entries(liuNianShenSha)) {
      if (config.type === '吉' && JI_SHENSHA_BONUS[name]) {
        shenShaBonus += JI_SHENSHA_BONUS[name];
      } else if (config.type === '凶' && XIONG_SHENSHA_PENALTY[name]) {
        shenShaBonus += XIONG_SHENSHA_PENALTY[name];
      }
    }
    score += shenShaBonus;
    
    // 确保分数在合理范围内
    score = Math.max(40, Math.min(95, score));
    
    result.push({
      year,
      ganZhi,
      tenGod,
      shenSha: liuNianShenSha,
      chongHe: chongHe.length > 0 ? chongHe.join('、') : '无冲合',
      score
    });
  }
  return result;
}

// ===================== 9. 核心生成函数 =====================
function generateEightCharacters(birthDate, longitude, isMale = true) {
  const bazi = new EightCharacters();
  
  const trueSolarTime = calculateTrueSolarTime(birthDate, longitude);
  const year = trueSolarTime.getFullYear();
  const month = trueSolarTime.getMonth();
  const day = trueSolarTime.getDate();
  const hour = trueSolarTime.getHours();

  bazi.yearPillar = getYearGanZhi(year);
  
  const monthBranch = SolarTermCalculator.getMonthBranchBySolarTerm(trueSolarTime);
  const monthStem = getMonthStem(bazi.yearPillar.charAt(0), monthBranch);
  bazi.monthPillar = monthStem + monthBranch;
  
  bazi.dayPillar = getDayGanZhi(new Date(year, month, day));
  
  const hourBranch = getHourBranch(hour);
  const hourStem = getHourStem(bazi.dayPillar.charAt(0), hourBranch);
  bazi.hourPillar = hourStem + hourBranch;
  
  bazi.dayMaster = bazi.dayPillar.charAt(0);

  const pillars = {
    year: bazi.yearPillar,
    month: bazi.monthPillar,
    day: bazi.dayPillar,
    hour: bazi.hourPillar
  };

  bazi.nayin = calculateAllNayin(pillars);
  bazi.tenGods = calculateTenGods(pillars);
  bazi.shenSha = calculateAllShenSha(bazi.yearPillar, bazi.monthPillar, bazi.dayPillar);
  bazi.lifeStage = calculateLifeStageStrength(bazi.dayMaster);
  bazi.elementBalance = calculateElementBalance(pillars);

  const patternAnalysis = PatternAnalyzer.analyzeCompletePatterns(
    pillars,
    bazi.elementBalance,
    bazi.tenGods,
    bazi.dayMaster
  );
  
  bazi.patterns = patternAnalysis.patterns;
  bazi.patternLevel = patternAnalysis.level;
  bazi.mainPattern = patternAnalysis.mainPattern;
  bazi.usefulGods = patternAnalysis.usefulGods;
  bazi.avoidGods = patternAnalysis.avoidGods;

  bazi.solarTermInfo = SolarTermCalculator.getSolarTerm(trueSolarTime);

  const startAge = calculateStartAge(trueSolarTime, monthBranch, bazi.dayMaster, isMale);
  bazi.daYun = calculateDaYun(bazi.monthPillar, bazi.dayMaster, isMale, startAge);

  bazi.liuNian = calculateLiuNian(year, pillars, bazi.dayMaster);

  bazi.hiddenStems = {
    year: getHiddenStems(bazi.yearPillar.charAt(1)),
    month: getHiddenStems(bazi.monthPillar.charAt(1)),
    day: getHiddenStems(bazi.dayPillar.charAt(1)),
    hour: getHiddenStems(bazi.hourPillar.charAt(1))
  };

  bazi.kongWang = {
    year: getKongWang(bazi.yearPillar),
    month: getKongWang(bazi.monthPillar),
    day: getKongWang(bazi.dayPillar),
    hour: getKongWang(bazi.hourPillar)
  };

  bazi.diShi = {
    year: getDiShi(bazi.dayMaster, bazi.yearPillar.charAt(1)),
    month: getDiShi(bazi.dayMaster, bazi.monthPillar.charAt(1)),
    day: getDiShi(bazi.dayMaster, bazi.dayPillar.charAt(1)),
    hour: getDiShi(bazi.dayMaster, bazi.hourPillar.charAt(1))
  };

  bazi.totalScore = calculateTotalScore(bazi);

  return bazi;
}

function calculateTotalScore(bazi) {
  let score = 50;
  
  if (bazi.patternLevel && bazi.patternLevel.score) {
    score += (bazi.patternLevel.score - 50) * 0.6;
  }
  
  const balanceScore = bazi.elementBalance.balanceIndex || 50;
  score += (balanceScore - 50) * 0.4;
  
  const shenShaScore = calculateShenShaScore(bazi.shenSha);
  score += shenShaScore;
  
  const tenGodsScore = calculateTenGodsScore(bazi.tenGods);
  score += tenGodsScore;
  
  if (bazi.solarTermInfo) {
    score += 2;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateShenShaScore(shenSha) {
  let score = 0;
  for (const [name, config] of Object.entries(shenSha)) {
    if (config.type === '吉' && JI_SHENSHA_BONUS[name]) {
      score += JI_SHENSHA_BONUS[name] / 2;
    } else if (config.type === '凶' && XIONG_SHENSHA_PENALTY[name]) {
      score += XIONG_SHENSHA_PENALTY[name] / 2;
    }
  }
  return Math.max(-10, Math.min(10, score));
}

function calculateTenGodsScore(tenGods) {
  let score = 0;
  const tenGodsArray = Object.values(tenGods);
  
  for (const combo of GOOD_SHISHEN_COMBOS) {
    if (tenGodsArray.includes(combo[0]) && tenGodsArray.includes(combo[1])) {
      score += 2;
    }
  }
  
  for (const combo of BAD_SHISHEN_COMBOS) {
    if (tenGodsArray.includes(combo[0]) && tenGodsArray.includes(combo[1])) {
      score -= 2;
    }
  }
  
  return Math.max(-5, Math.min(10, score));
}

// ===================== 10. 格式化输出 =====================
function formatEightCharacters(bazi, lang = 'zh-CN') {
  const output = {
    basicInfo: {
      pillars: {
        year: `${bazi.yearPillar} (${bazi.nayin.year})`,
        month: `${bazi.monthPillar} (${bazi.nayin.month})`,
        day: `${bazi.dayPillar} (${bazi.nayin.day})`,
        hour: `${bazi.hourPillar} (${bazi.nayin.hour})`
      },
      dayMaster: {
        gan: bazi.dayMaster,
        element: STEM_ELEMENTS[bazi.dayMaster],
        yinYang: STEM_YIN_YANG[bazi.dayMaster]
      }
    },
    
    patternAnalysis: {
      level: bazi.patternLevel,
      mainPattern: bazi.mainPattern ? {
        name: bazi.mainPattern.name,
        type: bazi.mainPattern.type,
        score: bazi.mainPattern.score,
        desc: bazi.mainPattern.desc
      } : null,
      allPatterns: bazi.patterns.map(p => ({
        name: p.name,
        type: p.type,
        subtype: p.subtype,
        score: p.score,
        desc: p.desc
      })),
      usefulGods: bazi.usefulGods,
      avoidGods: bazi.avoidGods
    },
    
    tenGods: bazi.tenGods,
    
    elementBalance: {
      distribution: bazi.elementBalance.ratio,
      scores: bazi.elementBalance.score,
      strongest: bazi.elementBalance.strongest,
      weakest: bazi.elementBalance.weakest,
      balanceIndex: bazi.elementBalance.balanceIndex
    },
    
    shenSha: Object.entries(bazi.shenSha).map(([name, config]) => ({
      name,
      type: config.type,
      power: config.power,
      desc: config.desc
    })),
    
    solarTerm: bazi.solarTermInfo ? {
      current: bazi.solarTermInfo.name,
      date: bazi.solarTermInfo.date.toLocaleString(),
      next: bazi.solarTermInfo.next.name,
      daysUntilNext: bazi.solarTermInfo.daysUntilNext
    } : null,
    
    daYun: {
      startAge: `${bazi.daYun.startAge}岁起运`,
      direction: bazi.daYun.direction,
      stages: bazi.daYun.stages.slice(0, 8).map(stage => ({
        ganZhi: stage.ganZhi,
        ageRange: `${stage.startAge}-${stage.endAge}岁`,
        tenGod: stage.tenGod,
        element: stage.element,
        score: stage.score || 60
      }))
    },
    
    liuNian: bazi.liuNian.map(nian => ({
      year: nian.year,
      ganZhi: nian.ganZhi,
      tenGod: nian.tenGod,
      chongHe: nian.chongHe,
      shenSha: Object.keys(nian.shenSha).slice(0, 3).join('、') || '无',
      score: nian.score || 60
    })),
    
    summary: {
      totalScore: `${bazi.totalScore}/100`,
      interpretation: getScoreInterpretation(bazi.totalScore),
      recommendations: generateRecommendations(bazi)
    },
    
    additionalInfo: {
      hiddenStems: bazi.hiddenStems,
      kongWang: bazi.kongWang,
      diShi: bazi.diShi
    }
  };
  
  return output;
}

function getScoreInterpretation(score) {
  if (score >= 90) return '上等命局，富贵双全';
  if (score >= 80) return '中上命局，福泽深厚';
  if (score >= 70) return '中等命局，平稳安康';
  if (score >= 60) return '中下命局，需多努力';
  return '普通命局，努力奋斗';
}

function generateRecommendations(bazi) {
  const recommendations = [];
  
  if (bazi.mainPattern) {
    recommendations.push({
      type: '格局建议',
      content: `命局为${bazi.mainPattern.name}：${bazi.mainPattern.desc}`
    });
  }
  
  if (bazi.usefulGods && bazi.usefulGods.length > 0) {
    const usefulElements = bazi.usefulGods.map(g => g.element).join('、');
    recommendations.push({
      type: '五行建议',
      content: `喜用五行：${usefulElements}。可多接触对应颜色、方位、行业`
    });
  }
  
  if (bazi.daYun && bazi.daYun.stages.length > 0) {
    const currentDaYun = bazi.daYun.stages.find(s => 
      s.startAge <= 30 && s.endAge >= 30
    ) || bazi.daYun.stages[0];
    
    if (currentDaYun) {
      const advice = getDaYunAdvice(currentDaYun);
      recommendations.push({
        type: '大运建议',
        content: `当前大运${currentDaYun.ganZhi}：${advice}`
      });
    }
  }
  
  const xiongShenSha = Object.entries(bazi.shenSha || {})
    .filter(([_, config]) => config.type === '凶')
    .map(([name, _]) => name);
  
  if (xiongShenSha.length > 0) {
    recommendations.push({
      type: '注意事项',
      content: `注意凶煞：${xiongShenSha.join('、')}，相关年份需谨慎`
    });
  }
  
  return recommendations;
}

function getDaYunAdvice(daYunStage) {
  return DAYUN_ADVICE_MAP[daYunStage.tenGod] || '平稳发展，把握机遇';
}

// ===================== 11. 缓存系统 =====================
class CalculationCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;
  }
  
  generateKey(birthDate, longitude, isMale) {
    const dateStr = birthDate.toISOString().split('T')[0];
    const hour = birthDate.getHours();
    return `${dateStr}_${hour}_${longitude}_${isMale}`;
  }
  
  get(key) {
    if (this.cache.has(key)) {
      this.hits++;
      return this.cache.get(key);
    }
    this.misses++;
    return null;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%'
    };
  }
}

const globalCache = new CalculationCache();

// ===================== 12. 国际化支持 =====================
class I18N {
  static translations = {
    'zh-CN': {
      'year': '年', 'month': '月', 'day': '日', 'hour': '时',
      'wood': '木', 'fire': '火', 'earth': '土', 'metal': '金', 'water': '水',
      'yang': '阳', 'yin': '阴'
    },
    'en-US': {
      'year': 'Year', 'month': 'Month', 'day': 'Day', 'hour': 'Hour',
      'wood': 'Wood', 'fire': 'Fire', 'earth': 'Earth', 'metal': 'Metal', 'water': 'Water',
      'yang': 'Yang', 'yin': 'Yin'
    }
  };
  
  static currentLang = 'zh-CN';
  
  static setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
    }
  }
  
  static t(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }
  
  static formatElement(element) {
    return this.t(element.toLowerCase()) || element;
  }
}

// ===================== 13. 主模块导出 =====================
const BaziCalculator = {
  // 核心功能
  generate: (birthDate, longitude, isMale) => {
    const cacheKey = globalCache.generateKey(birthDate, longitude, isMale);
    const cached = globalCache.get(cacheKey);
    if (cached) return cached;
    
    const result = generateEightCharacters(birthDate, longitude, isMale);
    globalCache.set(cacheKey, result);
    return result;
  },
  
  format: formatEightCharacters,
  
  // 类和方法
  EightCharacters,
  SolarTermCalculator,
  PatternAnalyzer,
  CalculationCache,
  I18N,
  
  // 工具函数
  getYearGanZhi,
  getDayGanZhi,
  getHourBranch,
  getMonthStem,
  getHourStem,
  getShiShenRelation,
  calculateTenGods,
  calculateElementBalance,
  calculateAllShenSha,
  
  // 缓存管理
  cache: globalCache,
  clearCache: () => globalCache.clear(),
  
  // 常量
  constants: {
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    STEM_ELEMENTS,
    SHEN_SHA_DATABASE,
    STANDARD_PATTERNS,
    SPECIAL_PATTERNS,
    HUAQI_PATTERNS,
    GUIREN_PATTERNS,
    SHISHEN_SCORES
  },
  
  // 测试函数
  test: () => {
    console.log('=== 八字计算系统测试 ===');
    
    const birthDate = new Date(1990, 5, 15, 14, 30);
    const bazi = BaziCalculator.generate(birthDate, 116.4, true);
    const result = BaziCalculator.format(bazi);
    
    console.log('测试案例：1990年6月15日14:30，男，北京');
    console.log(`年柱: ${result.basicInfo.pillars.year}`);
    console.log(`月柱: ${result.basicInfo.pillars.month}`);
    console.log(`日柱: ${result.basicInfo.pillars.day}`);
    console.log(`时柱: ${result.basicInfo.pillars.hour}`);
    console.log(`日主: ${result.basicInfo.dayMaster.gan}${result.basicInfo.dayMaster.element}`);
    console.log(`主格: ${result.patternAnalysis.mainPattern?.name || '无'}`);
    console.log(`综合评分: ${result.summary.totalScore}`);
    
    console.log('\n缓存统计:', BaziCalculator.cache.getStats());
    
    return result;
  }
};

// ===================== 14. 浏览器和Node.js环境兼容 =====================
if (typeof window !== 'undefined') {
  window.BaziCalculator = BaziCalculator;
  console.log('八字计算系统已加载，可通过 window.BaziCalculator 访问');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaziCalculator;
}



// ===================== 15. 示例用法 =====================
/*
// 浏览器中使用：
const birthDate = new Date(1990, 5, 15, 14, 30);
const bazi = BaziCalculator.generate(birthDate, 116.4, true);
const result = BaziCalculator.format(bazi);

// Node.js中使用：
const BaziCalculator = require('./bazi-complete.js');
const bazi = BaziCalculator.generate(new Date(), 116.4, true);
*/