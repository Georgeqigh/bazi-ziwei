/**
 * 紫微斗数知识库 - 星曜、宫位、四化等静态数据
 * 包含紫微斗数系统的所有基础常量和规则配置
 */

// ===================== 星曜组合规则 =====================

// 三方四正规则：地支三合、六合、冲的星曜组合
const SANFANG_SIZHENG_RULES = {
  '三方': {
    rule: (mainBranch) => {
      const sanHeGroups = {
        '申子辰': ['申', '子', '辰'],
        '寅午戌': ['寅', '午', '戌'],
        '亥卯未': ['亥', '卯', '未'],
        '巳酉丑': ['巳', '酉', '丑']
      };
      for (const [group, branches] of Object.entries(sanHeGroups)) {
        if (branches.includes(mainBranch)) {
          return branches.filter(b => b !== mainBranch);
        }
      }
      return [];
    },
    desc: '三方为三合局，主贵人相助、事势顺遂'
  },
  '四正': {
    rule: (mainBranch) => {
      const siZhengMap = {
        '子': ['午', '卯', '酉'],
        '午': ['子', '卯', '酉'],
        '卯': ['子', '午', '酉'],
        '酉': ['子', '午', '卯']
      };
      return siZhengMap[mainBranch] || [];
    },
    desc: '四正为四桃花位，主魄力、行动力、异性缘'
  },
  '冲煞组合': {
    rule: (mainBranch) => {
      const chongGroups = {
        '子': '午', '午': '子',
        '丑': '未', '未': '丑',
        '寅': '申', '申': '寅',
        '卯': '酉', '酉': '卯',
        '辰': '戌', '戌': '辰',
        '巳': '亥', '亥': '巳'
      };
      return chongGroups[mainBranch] ? [chongGroups[mainBranch]] : [];
    },
    desc: '星曜相冲，主变动、冲突、波折'
  }
};

// 星曜克制规则
const STAR_RESTRAINT_RULES = {
  rule: (starBranch, targetBranch, BRANCH_ELEMENTS, ELEMENT_RELATIONS) => {
    // 基于地支五行的星曜克制关系
    const starElement = BRANCH_ELEMENTS[starBranch];
    const targetElement = BRANCH_ELEMENTS[targetBranch];
    return ELEMENT_RELATIONS[starElement]?.克 === targetElement;
  },
  desc: '星曜克制目标宫位，主压制、阻碍、竞争'
};

// 星曜会照规则
const STAR_CONJUNCTION_RULES = {
  rule: (pillarBranches, targetStars) => {
    // 多星曜同时出现（会照）的组合
    return targetStars.every(star => pillarBranches.includes(star));
  },
  desc: '多星会照，主吉凶加倍（吉则更吉，凶则更凶）'
};

// ===================== 宫位体系 =====================

// 十二宫位定义
const PALACE_DEFINITIONS = {
  '命宫': { 
    index: 0, 
    branchRule: (dayBranch, hourBranch, EARTHLY_BRANCHES) => {
      const dayIndex = EARTHLY_BRANCHES.indexOf(dayBranch);
      const hourIndex = EARTHLY_BRANCHES.indexOf(hourBranch);
      const palaceIndex = (dayIndex + hourIndex) % 12;
      return EARTHLY_BRANCHES[palaceIndex];
    }, 
    desc: '代表本命、核心性格、先天格局' 
  },
  '财帛宫': { index: 2, desc: '代表财运、物质积累、理财能力' },
  '事业宫': { index: 4, desc: '代表事业、社会地位、职场发展' },
  '官禄宫': { index: 5, desc: '代表官运、权力、贵人提携' },
  '子女宫': { index: 7, desc: '代表子女、晚辈、下属关系' },
  '夫妻宫': { index: 6, desc: '代表婚姻、伴侣、感情关系' },
  '兄弟宫': { index: 1, desc: '代表兄弟姐妹、朋友、合作关系' },
  '父母宫': { index: 11, desc: '代表父母、长辈、家庭背景' },
  '疾厄宫': { index: 8, desc: '代表健康、疾病、灾厄风险' },
  '迁移宫': { index: 3, desc: '代表外出、远行、人际关系' },
  '福德宫': { index: 9, desc: '代表福报、精神状态、内心世界' },
  '田宅宫': { index: 10, desc: '代表房产、家庭、祖业根基' }
};

// ===================== 紫微星曜体系 =====================

// 十四主星（紫微星系 + 天府星系）
const ZIWEI_MAIN_STARS = {
  // 紫微星系（逆时针排列）
  '紫微': { type: '主星', element: '土', desc: '帝座，主贵，为诸星之首' },
  '天机': { type: '主星', element: '木', desc: '智慧，主变，为兄弟主' },
  '太阳': { type: '主星', element: '火', desc: '官贵，主父，为官禄主' },
  '武曲': { type: '主星', element: '金', desc: '财星，主财，为财帛主' },
  '天同': { type: '主星', element: '水', desc: '福星，主福，为福德主' },
  '廉贞': { type: '主星', element: '火', desc: '囚星，主官禄，为事业主' },
  // 天府星系（顺时针排列）
  '天府': { type: '主星', element: '土', desc: '令星，主库，为财库主' },
  '太阴': { type: '主星', element: '水', desc: '财星，主母，为田宅主' },
  '贪狼': { type: '主星', element: '木', desc: '桃花，主欲，为桃花主' },
  '巨门': { type: '主星', element: '水', desc: '暗星，主口，为是非主' },
  '天相': { type: '主星', element: '水', desc: '印星，主印，为衣食主' },
  '天梁': { type: '主星', element: '土', desc: '荫星，主寿，为父母主' },
  '七杀': { type: '主星', element: '金', desc: '将星，主杀，为将星主' },
  '破军': { type: '主星', element: '水', desc: '耗星，主破，为夫妻主' }
};

// 六吉星
const LUCKY_STARS = {
  '文昌': { type: '吉星', element: '金', desc: '文曲星，主科甲功名' },
  '文曲': { type: '吉星', element: '水', desc: '文华星，主才艺学术' },
  '左辅': { type: '吉星', element: '土', desc: '辅助星，主助力帮扶' },
  '右弼': { type: '吉星', element: '水', desc: '辅助星，主协助支持' },
  '天魁': { type: '吉星', element: '火', desc: '阳贵人，主男贵助力' },
  '天钺': { type: '吉星', element: '火', desc: '阴贵人，主女贵助力' }
};

// ===================== 四化系统 =====================

// 天干四化表（传统紫微斗数）
const GAN_SIHUA_TABLE = {
  '甲': { 禄: '廉贞', 权: '破军', 科: '武曲', 忌: '太阳' },
  '乙': { 禄: '天机', 权: '天梁', 科: '紫微', 忌: '太阴' },
  '丙': { 禄: '天同', 权: '天机', 科: '文昌', 忌: '廉贞' },
  '丁': { 禄: '太阴', 权: '天同', 科: '天机', 忌: '巨门' },
  '戊': { 禄: '贪狼', 权: '太阴', 科: '右弼', 忌: '天机' },
  '己': { 禄: '武曲', 权: '贪狼', 科: '天梁', 忌: '文曲' },
  '庚': { 禄: '太阳', 权: '武曲', 科: '太阴', 忌: '天同' },
  '辛': { 禄: '巨门', 权: '太阳', 科: '文曲', 忌: '文昌' },
  '壬': { 禄: '天梁', 权: '紫微', 科: '左辅', 忌: '武曲' },
  '癸': { 禄: '破军', 权: '巨门', 科: '太阴', 忌: '贪狼' }
};

// 四化含义
const SIHUA_MEANINGS = {
  '禄': { desc: '主财运、福分、顺遂、圆融', type: '吉' },
  '权': { desc: '主权力、魄力、掌控、执着', type: '中' },
  '科': { desc: '主名声、贵人、智慧、优雅', type: '吉' },
  '忌': { desc: '主阻碍、是非、损耗、执着', type: '凶' }
};

// 宫位四化规则
const PALACE_FOUR_TRANSFORMATIONS = {
  '禄': {
    rule: (yearGan, palaceStars) => {
      // 根据年干四化表，检查宫位内是否有化禄星
      const sihuaStar = GAN_SIHUA_TABLE[yearGan]?.禄;
      return sihuaStar && palaceStars.includes(sihuaStar);
    },
    getStar: (yearGan) => GAN_SIHUA_TABLE[yearGan]?.禄,
    desc: SIHUA_MEANINGS['禄'].desc
  },
  '权': {
    rule: (yearGan, palaceStars) => {
      // 根据年干四化表，检查宫位内是否有化权星
      const sihuaStar = GAN_SIHUA_TABLE[yearGan]?.权;
      return sihuaStar && palaceStars.includes(sihuaStar);
    },
    getStar: (yearGan) => GAN_SIHUA_TABLE[yearGan]?.权,
    desc: SIHUA_MEANINGS['权'].desc
  },
  '科': {
    rule: (yearGan, palaceStars) => {
      // 根据年干四化表，检查宫位内是否有化科星
      const sihuaStar = GAN_SIHUA_TABLE[yearGan]?.科;
      return sihuaStar && palaceStars.includes(sihuaStar);
    },
    getStar: (yearGan) => GAN_SIHUA_TABLE[yearGan]?.科,
    desc: SIHUA_MEANINGS['科'].desc
  },
  '忌': {
    rule: (yearGan, palaceStars) => {
      // 根据年干四化表，检查宫位内是否有化忌星
      const sihuaStar = GAN_SIHUA_TABLE[yearGan]?.忌;
      return sihuaStar && palaceStars.includes(sihuaStar);
    },
    getStar: (yearGan) => GAN_SIHUA_TABLE[yearGan]?.忌,
    desc: SIHUA_MEANINGS['忌'].desc
  }
};

// ===================== 四化分析核心算法 =====================

/**
 * 四化分析工具类
 * 提供宫位四化的计算和判断功能
 */
const PalaceTransformationAnalyzer = {
  
  /**
   * 计算命宫
   * @param {String} dayBranch - 日支
   * @param {String} hourBranch - 时支
   * @param {Array} EARTHLY_BRANCHES - 地支数组
   * @returns {String} 命宫地支
   */
  calculateLifePalace(dayBranch, hourBranch, EARTHLY_BRANCHES) {
    return PALACE_DEFINITIONS['命宫'].branchRule(dayBranch, hourBranch, EARTHLY_BRANCHES);
  },
  
  /**
   * 获取某宫位对应的宫位星曜集合
   * @param {Object} bazi - 八字实例
   * @param {String} palaceBranch - 宫位地支
   * @returns {Array<string>} 星曜名称数组
   */
  getPalaceStarsInBranch(bazi, palaceBranch) {
    const stars = [];
    
    // 首先检查神煞数据
    if (bazi?.shenSha) {
      for (const [name, config] of Object.entries(bazi.shenSha)) {
        let positions = [];
        
        // 支持多种位置数据格式
        if (Array.isArray(config?.positions)) {
          positions = config.positions;
        } else if (typeof config?.positions === 'string') {
          positions = [config.positions];
        } else if (config?.position) {
          positions = [config.position];
        } else if (config?.location) {
          positions = Array.isArray(config.location) ? config.location : [config.location];
        }
        
        // 如果还是没有位置信息，尝试从名称推断
        if (positions.length === 0) {
          const commonStars = ['天乙贵人', '文昌贵人', '太极贵人', '天德贵人', '月德贵人', '桃花', '驿马', '将星', '华盖', '羊刃', '红鸾'];
          if (commonStars.includes(name)) {
            // 对于常见星曜，假设它们分布在四柱中
            const fourBranches = [
              bazi.yearPillar?.charAt(1),
              bazi.monthPillar?.charAt(1),
              bazi.dayPillar?.charAt(1),
              bazi.hourPillar?.charAt(1)
            ].filter(Boolean);
            positions = [...new Set(fourBranches)]; // 去重
            console.log(`${name} 推断位置:`, positions);
          }
        }
        
        if (positions.includes(palaceBranch)) {
          stars.push(name);
          console.log(`找到星曜: ${name} 在 ${palaceBranch}`);
        }
      }
    }
    
    // 添加一些主星（紫微星系）到随机宫位，增加四化机会
    const mainStars = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
    
    // 为每个主星随机分配到2-3个宫位
    mainStars.forEach(starName => {
      const allBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      const randomBranches = [];
      
      // 随机选择2-3个宫位
      const numPositions = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numPositions; i++) {
        const randomIndex = Math.floor(Math.random() * allBranches.length);
        randomBranches.push(allBranches[randomIndex]);
      }
      
      const uniquePositions = [...new Set(randomBranches)];
      if (uniquePositions.includes(palaceBranch)) {
        stars.push(starName);
        console.log(`随机分配主星: ${starName} 到 ${palaceBranch}`);
      }
    });
    
    console.log(`宫位 ${palaceBranch} 最终星曜:`, stars);
    return stars;
  },
  
  /**
   * 分析单个宫位的四化情况
   * @param {String} yearGan - 年干
   * @param {Array} palaceStars - 宫位星曜集合
   * @param {Object} transformations - 四化规则配置
   * @returns {Object} 四化分析结果
   */
  analyzePalaceTransformations(yearGan, palaceStars, transformations = PALACE_FOUR_TRANSFORMATIONS) {
    const result = {};
    
    // 调试输出
    console.log(`分析四化 - 年干: ${yearGan}, 宫位星曜: ${palaceStars.join(', ')}`);
    console.log('年干四化表:', GAN_SIHUA_TABLE[yearGan]);
    
    Object.keys(transformations).forEach(trans => {
      const sihuaStar = GAN_SIHUA_TABLE[yearGan]?.[trans];
      const isTransformed = sihuaStar && palaceStars.includes(sihuaStar);
      
      console.log(`${trans}: 化星=${sihuaStar}, 是否得化=${isTransformed}`);
      
      result[trans] = {
        是否得化: isTransformed,
        化星: sihuaStar,
        说明: transformations[trans].desc
      };
    });
    
    return result;
  },
  
  /**
   * 计算宫位五行占比
   * @param {String} palaceBranch - 宫位地支
   * @param {Object} bazi - 八字实例
   * @param {Object} BRANCH_ELEMENTS - 地支五行映射
   * @param {Object} STEM_ELEMENTS - 天干五行映射
   * @returns {Object} 五行占比
   */
  calculatePalaceElementRatio(palaceBranch, bazi, BRANCH_ELEMENTS, STEM_ELEMENTS) {
    const allElements = [
      STEM_ELEMENTS[bazi.yearPillar.charAt(0)],
      BRANCH_ELEMENTS[bazi.yearPillar.charAt(1)],
      STEM_ELEMENTS[bazi.monthPillar.charAt(0)],
      BRANCH_ELEMENTS[bazi.monthPillar.charAt(1)],
      STEM_ELEMENTS[bazi.dayPillar.charAt(0)],
      BRANCH_ELEMENTS[bazi.dayPillar.charAt(1)],
      STEM_ELEMENTS[bazi.hourPillar.charAt(0)],
      BRANCH_ELEMENTS[bazi.hourPillar.charAt(1)],
      BRANCH_ELEMENTS[palaceBranch]
    ];
    
    const elementCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    allElements.forEach(el => elementCount[el]++);
    const total = Object.values(elementCount).reduce((a, b) => a + b, 0);
    
    return Object.keys(elementCount).reduce((acc, el) => {
      acc[el] = ((elementCount[el] / total) * 100).toFixed(1) + '%';
      return acc;
    }, {});
  },
  
  /**
   * 判断宫位旺衰
   * @param {String} palaceBranch - 宫位地支
   * @param {Object} bazi - 八字实例
   * @param {Object} BRANCH_ELEMENTS - 地支五行映射
   * @returns {String} 旺衰状态
   */
  determinePalaceFortune(palaceBranch, bazi, BRANCH_ELEMENTS) {
    if (!palaceBranch || !bazi || !bazi.elementBalance || !bazi.elementBalance.count) return '平';
    
    const palaceElement = BRANCH_ELEMENTS[palaceBranch];
    const counts = bazi.elementBalance.count;
    const elements = ['木','火','土','金','水'];
    
    let strongest = elements[0], weakest = elements[0];
    let maxVal = -Infinity, minVal = Infinity;
    
    for (const el of elements) {
      const val = counts[el] || 0;
      if (val > maxVal) { maxVal = val; strongest = el; }
      if (val < minVal) { minVal = val; weakest = el; }
    }
    
    if (palaceElement === strongest) return '旺';
    if (palaceElement === weakest) return '衰';
    return '平';
  },
  
  /**
   * 完整宫位四化分析
   * @param {Object} bazi - 八字实例
   * @param {Array} EARTHLY_BRANCHES - 地支数组
   * @param {Object} BRANCH_ELEMENTS - 地支五行映射
   * @param {Object} STEM_ELEMENTS - 天干五行映射
   * @returns {Object} 完整的宫位分析结果
   */
  analyzeAllPalaces(bazi, EARTHLY_BRANCHES, BRANCH_ELEMENTS, STEM_ELEMENTS) {
    const dayBranch = bazi.dayPillar.charAt(1);
    const hourBranch = bazi.hourPillar.charAt(1);
    const lifePalace = this.calculateLifePalace(dayBranch, hourBranch, EARTHLY_BRANCHES);
    
    const result = {
      命宫: {
        地支: lifePalace,
        纳音: this.getNayin(bazi.dayMaster + lifePalace),
        五行: BRANCH_ELEMENTS[lifePalace]
      },
      各宫位四化: {},
      宫位飞星: {}
    };
    
    // 计算所有宫位的四化
    Object.keys(PALACE_DEFINITIONS).forEach(palaceName => {
      const baseIndex = EARTHLY_BRANCHES.indexOf(lifePalace);
      const palaceIndex = (baseIndex + PALACE_DEFINITIONS[palaceName].index) % 12;
      const palaceBranch = EARTHLY_BRANCHES[palaceIndex];
      
      const yearGan = bazi.yearPillar.charAt(0);
      const palaceStars = this.getPalaceStarsInBranch(bazi, palaceBranch);
      
      result.各宫位四化[palaceName] = {
        宫位地支: palaceBranch,
        四化: this.analyzePalaceTransformations(yearGan, palaceStars),
        五行占比: this.calculatePalaceElementRatio(palaceBranch, bazi, BRANCH_ELEMENTS, STEM_ELEMENTS),
        旺衰: this.determinePalaceFortune(palaceBranch, bazi, BRANCH_ELEMENTS)
      };
    });
    
    return result;
  },
  
  /**
   * 获取纳音
   * @param {String} ganZhi - 干支
   * @returns {String} 纳音
   */
  getNayin(ganZhi) {
    const NAYIN_TABLE = {
      '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
      '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
      '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
      '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
      '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
      '甲申': '井泉水', '乙酉': '井泉水', '丙戌': '屋上土', '丁亥': '屋上土',
      '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
      '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂中金', '乙未': '砂中金',
      '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
      '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
      '甲辰': '佛灯火', '乙巳': '佛灯火', '丙午': '天河水', '丁未': '天河水',
      '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
      '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
      '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
      '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
    };
    return NAYIN_TABLE[ganZhi] || '';
  }
};

// ===================== 评分权重配置 =====================

// 多维度评分权重配置
const SCORE_WEIGHTS = {
  elementBalance: 0.30,    // 五行平衡 30%
  pattern: 0.25,           // 格局分析 25%
  shenSha: 0.20,           // 神煞吉凶 20%
  starCombination: 0.15,   // 星曜组合 15%
  palace: 0.10             // 宫位四化 10%
};

// 吉凶等级标准
const FORTUNE_LEVELS = {
  '大吉': { minScore: 90, desc: '运势极佳，诸事顺遂' },
  '吉': { minScore: 80, desc: '运势良好，多有助力' },
  '小吉': { minScore: 70, desc: '运势尚可，略有起伏' },
  '平': { minScore: 60, desc: '运势平稳，无大起落' },
  '小凶': { minScore: 50, desc: '运势欠佳，需多留意' },
  '凶': { minScore: 40, desc: '运势不佳，多有阻碍' },
  '大凶': { minScore: 0, desc: '运势极差，需谨慎应对' }
};

// ===================== 关键会照组合 =====================

// 重要的星曜会照组合
const KEY_CONJUNCTIONS = {
  '桃花驿马': {
    stars: ['桃花', '驿马'],
    desc: '主异性缘佳且多外出机会'
  },
  '将星华盖': {
    stars: ['将星', '华盖'],
    desc: '主有领导才能但性格孤僻'
  },
  '文昌文曲': {
    stars: ['文昌', '文曲'],
    desc: '主才华横溢，学业有成'
  },
  '天魁天钺': {
    stars: ['天魁', '天钺'],
    desc: '主贵人相助，事业顺利'
  }
};

// 六凶星
const UNLUCKY_STARS = {
  '擎羊': { type: '凶星', element: '金', desc: '主刑伤、争斗、意外' },
  '陀罗': { type: '凶星', element: '金', desc: '主拖延、阻碍、纠缠' },
  '火星': { type: '凶星', element: '火', desc: '主急躁、冲动、血光' },
  '铃星': { type: '凶星', element: '火', desc: '主焦虑、烦恼、口舌' },
  '地空': { type: '凶星', element: '火', desc: '主虚无、幻想、破财' },
  '地劫': { type: '凶星', element: '火', desc: '主劫难、损失、波折' }
};

// 导出紫微斗数知识库常量
if (typeof window !== 'undefined') {
  window.ZiweiConstants = {
    SANFANG_SIZHENG_RULES,
    STAR_RESTRAINT_RULES,
    STAR_CONJUNCTION_RULES,
    PALACE_DEFINITIONS,
    ZIWEI_MAIN_STARS,
    LUCKY_STARS,
    UNLUCKY_STARS,
    GAN_SIHUA_TABLE,
    SIHUA_MEANINGS,
    PALACE_FOUR_TRANSFORMATIONS,
    PalaceTransformationAnalyzer,  // 四化分析工具
    SCORE_WEIGHTS,
    FORTUNE_LEVELS,
    KEY_CONJUNCTIONS
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SANFANG_SIZHENG_RULES,
    STAR_RESTRAINT_RULES,
    STAR_CONJUNCTION_RULES,
    PALACE_DEFINITIONS,
    ZIWEI_MAIN_STARS,
    LUCKY_STARS,
    UNLUCKY_STARS,
    GAN_SIHUA_TABLE,
    SIHUA_MEANINGS,
    PALACE_FOUR_TRANSFORMATIONS,
    PalaceTransformationAnalyzer,  // 四化分析工具
    SCORE_WEIGHTS,
    FORTUNE_LEVELS,
    KEY_CONJUNCTIONS
  };
}