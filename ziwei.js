/**
 * 八字命理系统扩展模块 v2.1
 * 基于bazi_completeV2.js扩展，新增：
 * 1. 星曜组合规则（三方四正、星曜克制、星曜会照）
 * 2. 宫位分析体系（宫位四化、宫位飞星、宫位五行占比）
 * 3. 优化吉凶算法（多维度加权评分、格局+五行+神煞综合判断）
 * 
 * 依赖：bazi_completeV2.js 中所有常量/类/工具函数
 * 使用方式：
 * const bazi = BaziCalculator.generate(birthDate, longitude, isMale);
 * const extendedResult = BaziExtendedAnalyzer.analyze(bazi);
 */

// 常量已移至 ziwei-knowledge.js，通过script标签引入

class StarCombinationAnalyzer {
  /**
   * 分析命局中的星曜组合
   * @param {EightCharacters} bazi - 八字实例
   * @returns {Object} 星曜组合分析结果
   */
  static analyze(bazi) {
    const allBranches = [
      bazi.yearPillar.charAt(1),
      bazi.monthPillar.charAt(1),
      bazi.dayPillar.charAt(1),
      bazi.hourPillar.charAt(1)
    ];
    const result = {};

    // 分析每个地支的三方四正
    result['三方四正'] = allBranches.reduce((acc, branch, index) => {
      const pillarName = ['年支', '月支', '日支', '时支'][index];
      acc[pillarName] = {
        三方: SANFANG_SIZHENG_RULES['三方'].rule(branch),
        四正: SANFANG_SIZHENG_RULES['四正'].rule(branch),
        相冲: SANFANG_SIZHENG_RULES['冲煞组合'].rule(branch)
      };
      return acc;
    }, {});

    // 分析星曜克制关系
    result['星曜克制'] = allBranches.map((branch, index) => {
      const otherBranches = allBranches.filter((_, i) => i !== index);
      return {
        主星: branch,
        克制的星曜: otherBranches.filter(target => 
          STAR_RESTRAINT_RULES.rule(branch, target, BRANCH_ELEMENTS, ELEMENT_RELATIONS)
        ),
        被克制的星曜: otherBranches.filter(target => 
          STAR_RESTRAINT_RULES.rule(target, branch, BRANCH_ELEMENTS, ELEMENT_RELATIONS)
        )
      };
    });

    // 分析关键星曜会照
    result['关键会照'] = {};
    Object.entries(KEY_CONJUNCTIONS).forEach(([comboName, comboConfig]) => {
      const starPositions = comboConfig.stars
        .map(starName => bazi.shenSha[starName]?.positions[0])
        .filter(Boolean);
      result['关键会照'][comboName] = STAR_CONJUNCTION_RULES.rule(allBranches, starPositions);
    });

    return result;
  }
}

// 宫位分析体系和四化系统已移至 ziwei-knowledge.js

class PalaceAnalyzer {
  /**
   * 完整宫位分析
   * @param {EightCharacters} bazi - 八字实例
   * @param {Number} targetYear - 目标流年（可选）
   * @returns {Object} 宫位分析结果
   */
  static analyze(bazi, targetYear = null) {
    // 确保ZiweiConstants已正确加载
    if (typeof ZiweiConstants === 'undefined') {
      console.error('ZiweiConstants未定义');
      // 降级使用本地实现
      return this.fallbackAnalyze(bazi, targetYear);
    }
    
    if (!ZiweiConstants.PalaceTransformationAnalyzer) {
      console.error('PalaceTransformationAnalyzer未定义');
      return this.fallbackAnalyze(bazi, targetYear);
    }
    
    // 调用知识库中的核心算法
    const result = ZiweiConstants.PalaceTransformationAnalyzer.analyzeAllPalaces(
      bazi, 
      EARTHLY_BRANCHES, 
      BRANCH_ELEMENTS, 
      STEM_ELEMENTS
    );
    
    // 计算流年飞星（如果指定目标年份）
    if (targetYear) {
      Object.keys(PALACE_DEFINITIONS).forEach(palaceName => {
        const palaceBranch = result.各宫位四化[palaceName].宫位地支;
        result.宫位飞星[palaceName] = this.calculateFlyingStar(targetYear, palaceBranch);
      });
    }
    
    return result;
  }
  
  /**
   * 降级分析方法（当知识库不可用时使用）
   */
  static fallbackAnalyze(bazi, targetYear = null) {
    console.warn('使用降级分析方法');
    
    const dayBranch = bazi.dayPillar.charAt(1);
    const hourBranch = bazi.hourPillar.charAt(1);
    const lifePalace = PALACE_DEFINITIONS['命宫'].branchRule(dayBranch, hourBranch, EARTHLY_BRANCHES);
    
    const result = {
      命宫: {
        地支: lifePalace,
        纳音: getNayin(bazi.dayMaster + lifePalace),
        五行: BRANCH_ELEMENTS[lifePalace]
      },
      各宫位四化: {},
      宫位飞星: {}
    };
    
    // 简化的宫位分析
    Object.keys(PALACE_DEFINITIONS).forEach(palaceName => {
      const baseIndex = EARTHLY_BRANCHES.indexOf(lifePalace);
      const palaceIndex = (baseIndex + PALACE_DEFINITIONS[palaceName].index) % 12;
      const palaceBranch = EARTHLY_BRANCHES[palaceIndex];
      
      result.各宫位四化[palaceName] = {
        宫位地支: palaceBranch,
        四化: { 禄: { 是否得化: false }, 权: { 是否得化: false }, 科: { 是否得化: false }, 忌: { 是否得化: false } },
        五行占比: { 木: '20%', 火: '20%', 土: '20%', 金: '20%', 水: '20%' },
        旺衰: '平'
      };
    });
    
    return result;
  }
  
  /**
   * 宫位飞星计算（流年飞星到各宫位）
   * @param {Number} year - 流年年份
   * @param {String} basePalaceBranch - 宫位基础地支
   * @returns {Object} 飞星结果
   */
  static calculateFlyingStar(year, basePalaceBranch) {
    const yearGanZhi = getYearGanZhi(year);
    const yearBranch = yearGanZhi.charAt(1);
    const baseIndex = EARTHLY_BRANCHES.indexOf(basePalaceBranch);
    const flyIndex = (baseIndex + EARTHLY_BRANCHES.indexOf(yearBranch)) % 12;
    return {
      飞星地支: EARTHLY_BRANCHES[flyIndex],
      飞星纳音: getNayin(yearGanZhi.slice(0,1) + EARTHLY_BRANCHES[flyIndex]),
      飞星五行: BRANCH_ELEMENTS[EARTHLY_BRANCHES[flyIndex]]
    };
  }
  
  /**
   * 获取某宫位对应的宫位星曜集合（代理方法）
   * @param {EightCharacters} bazi
   * @param {String} palaceBranch
   * @returns {Array<string>} 星曜名称数组
   */
  static getPalaceStarsInBranch(bazi, palaceBranch) {
    return ZiweiConstants.PalaceTransformationAnalyzer.getPalaceStarsInBranch(bazi, palaceBranch);
  }
  
  /**
   * 计算宫位五行占比（代理方法）
   * @param {String} palaceBranch - 宫位地支
   * @param {EightCharacters} bazi - 八字实例
   * @returns {Object} 五行占比
   */
  static calculatePalaceElementRatio(palaceBranch, bazi) {
    return ZiweiConstants.PalaceTransformationAnalyzer.calculatePalaceElementRatio(
      palaceBranch, 
      bazi, 
      BRANCH_ELEMENTS, 
      STEM_ELEMENTS
    );
  }
  
  /**
   * 判断宫位旺衰（代理方法）
   * @param {String} palaceBranch - 宫位地支
   * @param {EightCharacters} bazi - 八字实例
   * @returns {String} 旺衰状态
   */
  static determinePalaceFortune(palaceBranch, bazi) {
    return ZiweiConstants.PalaceTransformationAnalyzer.determinePalaceFortune(
      palaceBranch, 
      bazi, 
      BRANCH_ELEMENTS
    );
  }
}

// ===================== 扩展3：优化吉凶算法 =====================
class FortuneAlgorithmOptimizer {
  /**
   * 多维度加权评分（总分100）
   * @param {EightCharacters} bazi - 八字实例
   * @returns {Object} 评分结果 + 吉凶判断
   */
  static calculateWeightedScore(bazi) {
    // 1. 五行平衡分（满分30分）
    const elementScore = this.calculateElementBalanceScore(bazi.elementBalance);
    // 2. 格局分（满分25分）
    const patternScore = this.calculatePatternScore(bazi.patterns, bazi.patternLevel);
    // 3. 神煞分（满分20分）
    const shenShaScore = this.calculateShenShaScore(bazi.shenSha);
    // 4. 星曜组合分（满分15分）
    const starCombinationScore = this.calculateStarCombinationScore(bazi);
    // 5. 宫位四化分（满分10分）
    const palaceScore = this.calculatePalaceScore(bazi);

    const totalScore = elementScore + patternScore + shenShaScore + starCombinationScore + palaceScore;
    return {
      分项评分: {
        五行平衡: elementScore,
        格局分析: patternScore,
        神煞吉凶: shenShaScore,
        星曜组合: starCombinationScore,
        宫位四化: palaceScore
      },
      总评分: totalScore,
      吉凶等级: this.getFortuneLevel(totalScore),
      核心结论: this.generateFortuneConclusion(bazi, totalScore)
    };
  }

  /**
   * 五行平衡评分
   * @param {Object} elementBalance - 五行平衡数据
   * @returns {Number} 评分（0-30）
   */
  static calculateElementBalanceScore(elementBalance) {
    if (!elementBalance || !elementBalance.count) {
      console.warn('elementBalance数据无效:', elementBalance);
      return 15; // 返回默认中等分数
    }
    
    const idealRatio = { 木: 0.2, 火: 0.2, 土: 0.2, 金: 0.2, 水: 0.2 };
    let score = 30;
    
    // 计算总数
    const total = Object.values(elementBalance.count).reduce((a, b) => a + b, 0);
    if (total === 0) {
      console.warn('五行总数为0');
      return 15;
    }
    
    Object.keys(idealRatio).forEach(el => {
      // 使用count计算实际比例
      const count = elementBalance.count[el] || 0;
      const actual = count / total;
      const diff = Math.abs(actual - idealRatio[el]);
      score -= diff * 30; // 偏离越大扣分越多
    });
    
    return Math.max(0, Math.min(30, score));
  }

  /**
   * 格局评分
   * @param {Array} patterns - 格局列表
   * @param {Object} patternLevel - 格局等级对象 {level, score, desc, bestPattern}
   * @returns {Number} 评分（0-25）
   */
  static calculatePatternScore(patterns, patternLevel) {
    if (patterns.length === 0) return 12.5; // 无格局基础分（25分制的中等分）
    
    // 直接使用八字模块计算好的格局评分（满分100分），转换为25分制
    const rawScore = patternLevel?.score || 50;
    const convertedScore = (rawScore / 100) * 25;
    
    return Math.max(0, Math.min(25, convertedScore));
  }

  /**
   * 神煞评分
   * @param {Object} shenSha - 神煞数据
   * @returns {Number} 评分（0-20）
   */
  static calculateShenShaScore(shenSha) {
    let score = 10; // 基础分
    Object.values(shenSha).forEach(sha => {
      const power = sha.power || 0;
      if (sha.type === '吉') {
        score += power * 5; // 吉神加分
      } else if (sha.type === '凶') {
        score -= power * 5; // 凶神扣分
      } else {
        score += power * 1; // 半吉半凶少量加分
      }
    });
    return Math.max(0, Math.min(20, score));
  }

  /**
   * 星曜组合评分
   * @param {EightCharacters} bazi - 八字实例
   * @returns {Number} 评分（0-15）
   */
  static calculateStarCombinationScore(bazi) {
    const starCombResult = StarCombinationAnalyzer.analyze(bazi);
    let score = 7.5; // 基础分
    // 三方四正加分
    Object.values(starCombResult['三方四正']).forEach(item => {
      if (item.三方.length > 0 && item.四正.length > 0) {
        score += 3;
      }
    });
    // 冲煞组合扣分
    Object.values(starCombResult['三方四正']).forEach(item => {
      if (item.相冲.length > 0) {
        score -= 2;
      }
    });
    // 关键会照加分/扣分
    if (starCombResult['关键会照']['桃花驿马']) score += 2;
    if (starCombResult['关键会照']['将星华盖']) score += 1.5;
    return Math.max(0, Math.min(15, score));
  }

  /**
   * 宫位四化评分
   * @param {EightCharacters} bazi - 八字实例
   * @returns {Number} 评分（0-10）
   */
  static calculatePalaceScore(bazi) {
    const palaceResult = PalaceAnalyzer.analyze(bazi);
    let score = 5; // 基础分
    // 命宫四化加分/扣分
    const lifePalaceTransform = palaceResult.各宫位四化['命宫'].四化;
    if (lifePalaceTransform.禄.是否得化) score += 2;
    if (lifePalaceTransform.权.是否得化) score += 1.5;
    if (lifePalaceTransform.科.是否得化) score += 1;
    if (lifePalaceTransform.忌.是否得化) score -= 3;
    return Math.max(0, Math.min(10, score));
  }

  /**
   * 根据总分判断吉凶等级
   * @param {Number} totalScore - 总评分
   * @returns {String} 吉凶等级
   */
  static getFortuneLevel(totalScore) {
    // 按照百分制转换为100分制进行比较
    const score = totalScore * (100 / (SCORE_WEIGHTS.elementBalance + SCORE_WEIGHTS.pattern + 
                                     SCORE_WEIGHTS.shenSha + SCORE_WEIGHTS.starCombination + SCORE_WEIGHTS.palace));
    
    for (const [level, config] of Object.entries(FORTUNE_LEVELS)) {
      if (score >= config.minScore) {
        return level;
      }
    }
    return '大凶';
  }

  /**
   * 生成吉凶核心结论
   * @param {EightCharacters} bazi - 八字实例
   * @param {Number} totalScore - 总评分
   * @returns {String} 结论
   */
  static generateFortuneConclusion(bazi, totalScore) {
    const level = this.getFortuneLevel(totalScore);
    const dayMaster = bazi.dayMaster;
    const dmElement = STEM_ELEMENTS[dayMaster];
    
    // 修复：从对象数组中提取element属性
    const usefulGodsList = bazi.usefulGods || [];
    const avoidGodsList = bazi.avoidGods || [];
    
    const coreGods = usefulGodsList.length > 0 
      ? usefulGodsList.map(g => g.element).join('、') 
      : '无';
    const avoidGods = avoidGodsList.length > 0 
      ? avoidGodsList.map(g => g.element).join('、') 
      : '无';

    const baseConclusion = `日主${dayMaster}(${dmElement})，吉凶等级：${level}（总分${totalScore.toFixed(1)}）。`;
    const godConclusion = `喜用神为：${coreGods}，忌神为：${avoidGods}。`;
    
    if (level.includes('吉')) {
      return `${baseConclusion}${godConclusion}整体运势顺遂，宜顺势而为，重点发展喜用神相关领域。`;
    } else if (level === '平') {
      return `${baseConclusion}${godConclusion}运势平稳，无大起大落，宜稳扎稳打，平衡五行短板。`;
    } else {
      return `${baseConclusion}${godConclusion}运势多阻，需规避忌神相关风险，通过风水、行为调整弥补五行不足。`;
    }
  }
}

// ===================== 整合扩展入口 =====================
class BaziExtendedAnalyzer {
  /**
   * 完整扩展分析入口
   * @param {EightCharacters} bazi - 八字实例
   * @param {Number} targetYear - 流年年份（可选）
   * @returns {Object} 完整扩展分析结果
   */
  static analyze(bazi, targetYear = null) {
    return {
      基础八字: bazi,
      星曜组合分析: StarCombinationAnalyzer.analyze(bazi),
      宫位分析: PalaceAnalyzer.analyze(bazi, targetYear),
      优化吉凶评分: FortuneAlgorithmOptimizer.calculateWeightedScore(bazi)
    };
  }
}

// 导出紫微斗数本地常量（避免与知识库冲突）
const LocalZiweiConstants = {
  SANFANG_SIZHENG_RULES,
  STAR_RESTRAINT_RULES,
  STAR_CONJUNCTION_RULES,
  PALACE_DEFINITIONS,
  ZIWEI_MAIN_STARS,
  LUCKY_STARS,
  GAN_SIHUA_TABLE,
  SIHUA_MEANINGS,
  PALACE_FOUR_TRANSFORMATIONS,
  SCORE_WEIGHTS,
  FORTUNE_LEVELS,
  KEY_CONJUNCTIONS
};

// 导出模块
if (typeof window !== 'undefined') {
  window.ZiweiConstants = ZiweiConstants;
  window.BaziExtendedAnalyzer = BaziExtendedAnalyzer;
  window.renderZiweiExtendedUI = renderZiweiExtendedUI;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BaziExtendedAnalyzer,
    StarCombinationAnalyzer,
    PalaceAnalyzer,
    FortuneAlgorithmOptimizer,
    renderZiweiExtendedUI,
    ZiweiConstants
  };
}

// UI 渲染扩展：将紫薇扩展分析填充到页面中
function renderZiweiExtendedUI(extendedResult) {
  console.log('renderZiweiExtendedUI ext:', extendedResult);
  try {
    if (!extendedResult) {
      console.warn('extendedResult为空');
      return;
    }
    
    // 调试输出数据结构
    console.log('数据结构检查:');
    console.log('- 星曜组合分析:', extendedResult['星曜组合分析']);
    console.log('- 宫位分析:', extendedResult['宫位分析']);
    
    const star = extendedResult['星曜组合分析'] || {};
    const sixHuiDiv = document.getElementById('six-hui-content');
    const nobleDiv = document.getElementById('noble-content');
    const palaceFortuneDiv = document.getElementById('palace-fortune-container');
    
    // 六合分析
    if (sixHuiDiv) {
      const sanfang = star['三方四正'] || {};
      const keys = ['年支','月支','日支','时支'];
      const parts = keys.map((k) => {
        const info = sanfang[k] || {};
        const tri = Array.isArray(info.三方) ? info.三方.join('、') : '';
        const four = Array.isArray(info.四正) ? info.四正.join('、') : '';
        const con = Array.isArray(info.相冲) ? info.相冲.join('、') : '';
        const six = info['六合'] ? (Array.isArray(info['六合']) ? info['六合'].join('、') : info['六合']) : '无';
        return `<div><strong>${k}</strong> 三方: ${tri || '—'}； 四正: ${four || '—'}； 相冲: ${con || '—'}； 六合: ${six}</div>`;
      });
      sixHuiDiv.innerHTML = parts.length ? parts.join('') : '<div>无六合信息</div>';
    }
    
    // 贵人会照分析
    if (nobleDiv) {
      const ck = star['关键会照'] || {};
      const lines = [];
      if (ck['桃花驿马']) lines.push(`<div>桃花驿马: 存在</div>`);
      if (ck['将星华盖']) lines.push(`<div>将星华盖: 存在</div>`);
      if (ck['贵人会照']) lines.push(`<div>贵人会照: 存在</div>`);
      nobleDiv.innerHTML = lines.length ? lines.join('') : '<div>无贵人会照信息</div>';
    }
    
    // 宫位旺衰分析
    if (palaceFortuneDiv) {
      const palInfo = (extendedResult['宫位分析'] && extendedResult['宫位分析']['各宫位四化'])
        || (extendedResult['宫位分析'] && extendedResult['宫位分析']['四化'])
        || {};
      const lines = [];
      Object.entries(palInfo).forEach(([name, info]) => {
        const trans = info?.四化 || {};
        const zh = info?.宫位地支 || '';
        const 禄 = trans.禄?.是否得化 ? `禄: 有化${trans.禄?.说明 ? '（'+trans.禄.说明+'）' : ''}` : '禄: 无化';
        const 权 = trans.权?.是否得化 ? `权: 有化${trans.权?.说明 ? '（'+trans.权.说明+'）' : ''}` : '权: 无化';
        const 科 = trans.科?.是否得化 ? `科: 有化${trans.科?.说明 ? '（'+trans.科.说明+'）' : ''}` : '科: 无化';
        const 忌 = trans.忌?.是否得化 ? `忌: 有化${trans.忌?.说明 ? '（'+trans.忌.说明+'）' : ''}` : '忌: 无化';
        const five = info?.五行占比 ? Object.entries(info.五行占比).map(([k,v]) => `${k}:${v}`).join(' ') : '';
        lines.push(`<tr><td>${name}</td><td>${zh}</td><td>${禄}</td><td>${权}</td><td>${科}</td><td>${忌}</td><td>${five}</td></tr>`);
      });
      const tbody = document.getElementById('palace-sihua-tbody');
      if (tbody) tbody.innerHTML = lines.length ? lines.join('') : '<tr><td colspan="7" style="text-align:center;color:#7f8c8d;">无数据</td></tr>';
    }
  } catch (e) {
    console.error('渲染紫薇扩展UI出错', e);
  }
}
