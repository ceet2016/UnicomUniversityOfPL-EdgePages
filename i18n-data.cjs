const fs = require('fs');
const path = require('path');

const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const ja = JSON.parse(fs.readFileSync('src/locales/ja.json', 'utf8'));
const ko = JSON.parse(fs.readFileSync('src/locales/ko.json', 'utf8'));

function setNested(obj, key, val) {
  const parts = key.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = val;
}

// ========== ACADEMICS ==========
// researchAreas
const researchAreas = {
  zh: [
    { title: '人工智能', desc: '深度学习、自然语言处理、计算机视觉、智能决策等方向的前沿研究，在医疗AI、自动驾驶等领域取得突破性进展。', image: '/images/picsum_4.jpg', tags: ['深度学习', 'NLP', '计算机视觉'] },
    { title: '生物科技', desc: '生物信息学、基因工程、合成生物学等交叉学科研究，致力于解决人类健康和可持续发展的关键问题。', image: '/images/picsum_5.jpg', tags: ['基因工程', '生物信息', '合成生物'] },
    { title: '环境科学', desc: '气候变化、环境污染治理、可再生能源等领域的研究，为可持续发展提供科学依据和技术支持。', image: '/images/picsum_6.jpg', tags: ['气候研究', '污染治理', '可再生能源'] },
    { title: '数据科学', desc: '大数据分析、数据挖掘、分布式计算等方向，构建智能数据处理平台，服务科学研究和产业应用。', image: '/images/picsum_8.jpg', tags: ['大数据', '数据挖掘', '分布式计算'] }
  ],
  en: [
    { title: 'Artificial Intelligence', desc: 'Cutting-edge research in deep learning, NLP, computer vision, and intelligent decision-making, with breakthrough progress in medical AI and autonomous driving.', image: '/images/picsum_4.jpg', tags: ['Deep Learning', 'NLP', 'Computer Vision'] },
    { title: 'Biotechnology', desc: 'Interdisciplinary research in bioinformatics, genetic engineering, and synthetic biology, dedicated to solving key problems in human health and sustainable development.', image: '/images/picsum_5.jpg', tags: ['Genetic Engineering', 'Bioinformatics', 'Synthetic Biology'] },
    { title: 'Environmental Science', desc: 'Research in climate change, environmental pollution control, and renewable energy, providing scientific basis and technical support for sustainable development.', image: '/images/picsum_6.jpg', tags: ['Climate Research', 'Pollution Control', 'Renewable Energy'] },
    { title: 'Data Science', desc: 'Big data analytics, data mining, and distributed computing, building intelligent data processing platforms for scientific research and industrial applications.', image: '/images/picsum_8.jpg', tags: ['Big Data', 'Data Mining', 'Distributed Computing'] }
  ],
  ja: [
    { title: '人工知能', desc: 'ディープラーニング、自然言語処理、コンピュータビジョン、知的決定などの前沿研究。医療AI、自動運転などの分野で突破的進展を遂げる。', image: '/images/picsum_4.jpg', tags: ['ディープラーニング', 'NLP', 'コンピュータビジョン'] },
    { title: 'バイオテクノロジー', desc: 'バイオインフォマティクス、遺伝子工学、合成生物学などの学際的研究。人間の健康と持続可能な発展の鍵問題の解決に尽力。', image: '/images/picsum_5.jpg', tags: ['遺伝子工学', 'バイオインフォマティクス', '合成生物学'] },
    { title: '環境科学', desc: '気候変動、環境汚染治理、再生可能エネルギーなどの研究。持続可能な発展に科学的根拠と技術支援を提供。', image: '/images/picsum_6.jpg', tags: ['気候研究', '汚染治理', '再生可能エネルギー'] },
    { title: 'データサイエンス', desc: 'ビッグデータ分析、データマイニング、分散コンピューティングなどの方向。知能データ処理プラットフォームを構築。', image: '/images/picsum_8.jpg', tags: ['ビッグデータ', 'データマイニング', '分散コンピューティング'] }
  ],
  ko: [
    { title: '인공지능', desc: '딥러닝, 자연어 처리, 컴퓨터 비전, 지능형 의사결정 등의 최전방 연구. 의료 AI, 자율주행 등의 분야에서 돌파적 진전을 이룩.', image: '/images/picsum_4.jpg', tags: ['딥러닝', 'NLP', '컴퓨터 비전'] },
    { title: '바이오테크놀로지', desc: '바이오인포매틱스, 유전자 공학, 합성 생물학 등의 교차 학과 연구. 인류 건강과 지속 가능한 발전의 열쇠 문제 해결에 전념.', image: '/images/picsum_5.jpg', tags: ['유전자 공학', '바이오인포매틱스', '합성 생물'] },
    { title: '환경과학', desc: '기후 변화, 환경 오염 관리, 재생 가능 에너지 등의 연구. 지속 가능한 발전을 위해 과학적 근거와 기술 지원을 제공.', image: '/images/picsum_6.jpg', tags: ['기후 연구', '오염 관리', '재생 가능 에너지'] },
    { title: '데이터 사이언스', desc: '빅데이터 분석, 데이터 마이닝, 분산 컴퓨팅 등의 방향. 지능형 데이터 처리 플랫폼을 구축.', image: '/images/picsum_8.jpg', tags: ['빅데이터', '데이터 마이닝', '분산 컴퓨팅'] }
  ]
};

// projects
const projects = {
  zh: [
    { title: '智能医疗诊断系统', desc: '基于深度学习的医学影像分析系统，能够辅助医生进行疾病诊断，准确率已达到国际领先水平。', status: '进行中', statusClass: 'status-active', leader: '张教授团队', duration: '2023-2025' },
    { title: '可持续能源解决方案', desc: '开发新型太阳能电池和储能技术，提高能源利用效率，为波兰及欧洲的能源转型提供技术支撑。', status: '已完成', statusClass: 'status-done', leader: '李教授团队', duration: '2021-2024' },
    { title: '智慧城市物联网', desc: '构建城市级物联网平台，实现交通、安防、环境监测等领域的智能化管理，已在华沙市试点应用。', status: '进行中', statusClass: 'status-active', leader: '王教授团队', duration: '2022-2026' }
  ],
  en: [
    { title: 'Intelligent Medical Diagnosis System', desc: 'AI-based medical imaging analysis system that assists doctors in disease diagnosis, with accuracy reaching international leading level.', status: 'In Progress', statusClass: 'status-active', leader: 'Prof. Zhang Team', duration: '2023-2025' },
    { title: 'Sustainable Energy Solutions', desc: 'Developing new solar cells and energy storage technologies, improving energy efficiency, providing technical support for Poland and Europe energy transition.', status: 'Completed', statusClass: 'status-done', leader: 'Prof. Li Team', duration: '2021-2024' },
    { title: 'Smart City IoT', desc: 'Building city-level IoT platform, realizing intelligent management in transportation, security, environmental monitoring, piloted in Warsaw.', status: 'In Progress', statusClass: 'status-active', leader: 'Prof. Wang Team', duration: '2022-2026' }
  ],
  ja: [
    { title: '知能医療診断システム', desc: 'ディープラーニングに基づく医療画像分析システム。医者の疾病診断を補助し、正確率は国際的な先駆レベルに達している。', status: '進行中', statusClass: 'status-active', leader: '張教授チーム', duration: '2023-2025' },
    { title: '持続可能エネルギーソリューション', desc: '新型太陽電池とエネルギー貯蔵技術を開発。エネルギー利用効率を向上させ、ポーランドとヨーロッパのエネルギー転換に技術支援を提供。', status: '完了', statusClass: 'status-done', leader: '李教授チーム', duration: '2021-2024' },
    { title: 'スマートシティーIoT', desc: '都市レベルのIoTプラットフォームを構築。交通、安全、環境モニタリングなどの分野の知能化管理を実現。ワルシャワ市で試験的に応用済み。', status: '進行中', statusClass: 'status-active', leader: '王教授チーム', duration: '2022-2026' }
  ],
  ko: [
    { title: '지능형 의료 진단 시스템', desc: 'AI 기반 의료 영상 분석 시스템. 의사의 질병 진단을 보조하며, 정확률가 국제 선도 수준에 도달함.', status: '진행 중', statusClass: 'status-active', leader: '장 교수 팀', duration: '2023-2025' },
    { title: '지속 가능 에너지 솔루션', desc: '신형 태양 전지와 에너지 저장 기술 개발. 에너지 이용 효률을 제고하고, 폴란드와 유럽의 에너지 전환에 기술 지원을 제공.', status: '완료', statusClass: 'status-done', leader: '이 교수 팀', duration: '2021-2024' },
    { title: '스마트 시티 IoT', desc: '도시급 IoT 플랫폼 구축. 교통, 안보, 환경 모니터링 등 분야의 지능형 관리를 실현. 바르샤바 시에서 시범 응용 완료.', status: '진행 중', statusClass: 'status-active', leader: '왕 교수 팀', duration: '2022-2026' }
  ]
};

// resources
const resources = {
  zh: [
    { title: '图书馆', desc: '藏书超过100万册，提供丰富的电子资源和数据库访问服务。' },
    { title: '实验室', desc: '拥有50余个专业实验室，配备先进的科研仪器和设备。' },
    { title: '学术期刊', desc: '学校主办3本国际学术期刊，覆盖通信、计算机和数据科学领域。' },
    { title: '学术交流', desc: '定期举办国际学术会议和讲座，促进学术交流与合作。' }
  ],
  en: [
    { title: 'Library', desc: 'Collection of over 1 million volumes, providing rich electronic resources and database access services.' },
    { title: 'Laboratories', desc: 'Over 50 specialized laboratories equipped with advanced scientific instruments and equipment.' },
    { title: 'Academic Journals', desc: 'University publishes 3 international academic journals, covering communications, computer science and data science.' },
    { title: 'Academic Exchange', desc: 'Regularly hosts international academic conferences and lectures, promoting academic exchange and cooperation.' }
  ],
  ja: [
    { title: '図書館', desc: '蔵書は100万冊以上。豊富な電子リソースとデータベース・アクセスサービスを提供。' },
    { title: '実験室', desc: '50余りの専門実験室を擁し、先駆的な科学儀器と設備を備えている。' },
    { title: '学術期刊', desc: '学校は3冊の国際学術期刊を主催。通信、コンピューター、データサイエンス分野をカバー。' },
    { title: '学術交流', desc: '定期的に国際学術会議と講座を開催。学術交流と協力を促進。' }
  ],
  ko: [
    { title: '도서관', desc: '장서 100만 권 이상, 풍부한 전자 리소스와 데이터베이스 액세스 서비스 제공.' },
    { title: '실험실', desc: '50여 개 전문 실험실 보유, 선진적인 과학 기기와 설비 구비.' },
    { title: '학술 저널', desc: '학교는 3권의 국제 학술 저널을 주최, 통신, 컴퓨터, 데이터 사이언스 분야 커버.' },
    { title: '학술 교류', desc: '정기적으로 국제 학술 회의와 강좌 개최. 학술 교류와 협력을 촉진.' }
  ]
};

['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.academics) obj.academics = {};
  obj.academics.researchAreas = researchAreas[lang];
  obj.academics.projects = projects[lang];
  obj.academics.resources = resources[lang];
});

// sectionTitles for AcademicsView template
const sectionTitles = {
  zh: { researchTitle: '研究领域', researchSubtitle: '聚焦前沿科技，探索未知领域', projectsTitle: '重点项目', projectsSubtitle: '高水平科研项目，引领学术前沿', resourcesTitle: '学术资源', resourcesSubtitle: '丰富的学术资源，助力教学科研' },
  en: { researchTitle: 'Research Areas', researchSubtitle: 'Exploring frontier technologies, discovering the unknown', projectsTitle: 'Key Projects', projectsSubtitle: 'High-level research projects, leading academic frontiers', resourcesTitle: 'Academic Resources', resourcesSubtitle: 'Rich academic resources, supporting teaching and research' },
  ja: { researchTitle: '研究分野', researchSubtitle: '前沿技術を探索し、未知の分野を発見', projectsTitle: '重点プロジェクト', projectsSubtitle: '高レベルの科学研究プロジェクト', resourcesTitle: '学術リソース', resourcesSubtitle: '豊富な学術リソース' },
  ko: { researchTitle: '연구 분야', researchSubtitle: '전연 기술 탐구, 미지의 분야 발견', projectsTitle: '중점 프로젝트', projectsSubtitle: '고수준 과학 연구 프로젝트', resourcesTitle: '학술 리소스', resourcesSubtitle: '풍부한 학술 리소스' }
};
['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.academics) obj.academics = {};
  obj.academics.sectionTitles = sectionTitles[lang];
});

// ========== ADMISSIONS ==========
const plans = {
  zh: [
    { title: '本科招生', degree: 'Bachelor Programs', deadline: '全年接受申请', duration: '4年', featured: false, features: ['50+ 本科专业可选', '双语教学（中英）', '国际交换生机会', '奖学金覆盖面广'] },
    { title: '硕士招生', degree: 'Master Programs', deadline: '全年接受申请', duration: '2年', featured: true, features: ['30+ 硕士专业方向', '导师制个性化培养', '参与前沿科研项目', '国际联合培养机会'] },
    { title: '博士招生', degree: 'PhD Programs', deadline: '全年接受申请', duration: '3-5年', featured: false, features: ['20+ 博士研究方向', '全额奖学金支持', '国际会议资助', '高水平论文发表指导'] }
  ],
  en: [
    { title: 'Undergraduate Admissions', degree: 'Bachelor Programs', deadline: 'Accepting applications year-round', duration: '4 years', featured: false, features: ['50+ undergraduate majors available', 'Bilingual teaching (Chinese/English)', 'International exchange opportunities', 'Wide scholarship coverage'] },
    { title: 'Master Admissions', degree: 'Master Programs', deadline: 'Accepting applications year-round', duration: '2 years', featured: true, features: ['30+ master degree directions', 'Mentor-based personalized training', 'Participate in frontier research projects', 'International joint training opportunities'] },
    { title: 'PhD Admissions', degree: 'PhD Programs', deadline: 'Accepting applications year-round', duration: '3-5 years', featured: false, features: ['20+ PhD research directions', 'Full scholarship support', 'International conference funding', 'High-level paper publication guidance'] }
  ],
  ja: [
    { title: '学部募集', degree: 'Bachelor Programs', deadline: '年間随時受付', duration: '4年', featured: false, features: ['50+ 学部専攻利用可能', 'バイリンガル教育（中英）', '国際交換生機会', '奨学金普及率が高い'] },
    { title: '修士募集', degree: 'Master Programs', deadline: '年間随時受付', duration: '2年', featured: true, features: ['30+ 修士専攻方向', 'メンター制個別化培養', '前沿科学研究プロジェクト参加', '国際共同育成機会'] },
    { title: '博士募集', degree: 'PhD Programs', deadline: '年間随時受付', duration: '3-5年', featured: false, features: ['20+ 博士研究方向', '全額奨学金支援', '国際会議資金', '高レベル論文発表指導'] }
  ],
  ko: [
    { title: '학부 모집', degree: 'Bachelor Programs', deadline: '연중 지원 접수', duration: '4년', featured: false, features: ['50+ 학부 전공 선택 가능', '이중 언어 교육 (중영)', '국제 교환생 기회', '장학금 혜택 범위가 넓음'] },
    { title: '석사 모집', degree: 'Master Programs', deadline: '연중 지원 접수', duration: '2년', featured: true, features: ['30+ 석사 전공 방향', '멘토제 개별화 육성', '최전방 과학 연구 프로젝트 참여', '국제 공동 육성 기회'] },
    { title: '박사 모집', degree: 'PhD Programs', deadline: '연중 지원 접수', duration: '3-5년', featured: false, features: ['20+ 박사 연구 방향', '전액 장학금 지원', '국제 회의 자금', '고수준 논문 발표 지도'] }
  ]
};

const requirements = {
  zh: [
    { title: '语言要求', desc: '非英语母语申请者需提供英语水平证明', items: ['雅思 IELTS 6.5 分以上', '托福 TOEFL 90 分以上', '或同等英语水平证明'] },
    { title: '学术要求', desc: '具有良好的学术背景和学习能力', items: ['本科申请：高中毕业或同等学历', '硕士申请：相关专业学士学位', '博士申请：相关专业硕士学位', 'GPA 3.0 以上者优先'] },
    { title: '申请材料', desc: '准备完整的申请材料是成功录取的关键', items: ['在线申请表', '学历证明和成绩单', '个人陈述（PS）', '推荐信 2-3 封', '有效护照复印件'] }
  ],
  en: [
    { title: 'Language Requirements', desc: 'Non-native English speakers need to provide English proficiency proof', items: ['IELTS 6.5 or above', 'TOEFL 90 or above', 'Or equivalent English proficiency proof'] },
    { title: 'Academic Requirements', desc: 'Possess good academic background and learning ability', items: ['Undergraduate: High school diploma or equivalent', 'Master: Bachelor degree in related field', 'PhD: Master degree in related field', 'GPA 3.0 or above preferred'] },
    { title: 'Application Materials', desc: 'Preparing complete application materials is key to successful admission', items: ['Online application form', 'Degree certificate and transcript', 'Personal Statement (PS)', '2-3 recommendation letters', 'Valid passport copy'] }
  ],
  ja: [
    { title: '言語要件', desc: '英語母国語ではない出願者は英語力証明を提供する必要がある', items: ['IELTS 6.5以上', 'TOEFL 90以上', 'または同等の英語力証明'] },
    { title: '学術要件', desc: '良好な学術的背景と学習能力を有する', items: ['学部出願：高校卒業または同等学歴', '修士出願：関連専攻学士号', '博士出願：関連専攻修士号', 'GPA 3.0以上優先'] },
    { title: '出願材料', desc: '完備した出願材料の準備は成功录取の鍵', items: ['在線出願申請書', '学歴証明と成績証明', '個人陳述（PS）', '推薦状 2-3通', '有効パスポートコピー'] }
  ],
  ko: [
    { title: '언어 요건', desc: '영어 모국어가 아닌 지원자는 영어 수준 증명을 제공할 필요가 있음', items: ['IELTS 6.5 이상', 'TOEFL 90 이상', '또는 동등 영어 수준이 증명'] },
    { title: '학술 요건', desc: '양호한 학술 배경과 학습 능력을 소유', items: ['학부 지원: 고등학교 졸업 또는 동등 학력', '석사 지원: 관련 전공 학사 학위', '박사 지원: 관련 전공 석사 학위', 'GPA 3.0 이상 우선'] },
    { title: '지원 서류', desc: '완비된 지원 서류 준비는 성공 입학의 열쇠', items: ['온라인 지원서', '학력 증명과 성적 증명', '개인 진술 (PS)', '추천서 2-3통', '유효한 여권 사본'] }
  ]
};

const processSteps = {
  zh: [
    { title: '在线申请', desc: '填写在线申请表，上传所需材料' },
    { title: '材料审核', desc: '招生委员会审核申请材料' },
    { title: '面试评估', desc: '部分专业需要参加在线面试' },
    { title: '录取通知', desc: '发放录取通知书，办理入学手续' }
  ],
  en: [
    { title: 'Online Application', desc: 'Fill out online application form and upload required materials' },
    { title: 'Document Review', desc: 'Admissions committee reviews application materials' },
    { title: 'Interview Assessment', desc: 'Some programs require online interview' },
    { title: 'Admission Notice', desc: 'Issue admission letter and complete enrollment procedures' }
  ],
  ja: [
    { title: '在線出願', desc: '在線出願申請書を記入し、必要な材料を了載' },
    { title: '材料審査', desc: '募集委員会が出願材料を審査' },
    { title: '面接評価', desc: '一部の専攻は在線面接を受ける必要がある' },
    { title: '录取通知', desc: '录取通知書を発行し、入学手続を弁理' }
  ],
  ko: [
    { title: '온라인 지원', desc: '온라인 지원서 작성하고, 필요한 서류 업로드' },
    { title: '서류 심사', desc: '입학 위원회가 지원 서류 심사' },
    { title: '면접 평가', desc: '일부 전공은 온라인 면접 참여 필요' },
    { title: '입학 통지', desc: '입학 허가서 발행하고, 입학 수속 처리' }
  ]
};

// admissions section titles
const admSectionTitles = {
  zh: { plansTitle: '招生计划', plansSubtitle: '本科、硕士、博士全面招生中', requirementsTitle: '入学要求', requirementsSubtitle: '了解申请条件，做好充分准备', processTitle: '申请流程', processSubtitle: '四步完成申请，轻松入学', ctaTitle: '准备好开启你的大学之旅了吗？', ctaDesc: '立即申请，加入波兰联通大学，与我们一起连接未来' },
  en: { plansTitle: 'Admission Plans', plansSubtitle: 'Undergraduate, Master, PhD - Now Recruiting', requirementsTitle: 'Admission Requirements', requirementsSubtitle: 'Understand application conditions, prepare well', processTitle: 'Application Process', processSubtitle: 'Complete application in 4 steps, easy enrollment', ctaTitle: 'Ready to start your university journey?', ctaDesc: 'Apply now, join Polish University of Communications, and connect the future with us' },
  ja: { plansTitle: '募集計画', plansSubtitle: '学部、修士、博士 - 本格募集', requirementsTitle: '入学要件', requirementsSubtitle: '出願条件を理解し、十分に準備', processTitle: '出願プロセス', processSubtitle: '4ステップで出願完遂、楽に入学', ctaTitle: '大学の旅を始める準備はできましたか？', ctaDesc: '今すぐ出願、ポーランド聯通大学に加入し、私達と一緒に未来を接続' },
  ko: { plansTitle: '모집 계획', plansSubtitle: '학부, 석사, 박사 - 본격 모집 중', requirementsTitle: '입학 요건', requirementsSubtitle: '지원 조건 이해하고, 충분히 준비', processTitle: '지원 절차', processSubtitle: '4단계로 지원 완료, 손쉽게 입학', ctaTitle: '대학 여정을 시작할 준비가 되셨나요？', ctaDesc: '지금 지원하세요. 폴란드 연통 대학에 가입하고, 우리와 함께 미래를 연결하세요' }
};

['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.admissions) obj.admissions = {};
  obj.admissions.plans = plans[lang];
  obj.admissions.requirements = requirements[lang];
  obj.admissions.processSteps = processSteps[lang];
  obj.admissions.sectionTitles = admSectionTitles[lang];
});

// ========== CAMPUS ==========
const facilities = {
  zh: [
    { title: '现代化图书馆', desc: '藏书超过100万册，提供安静的学习空间和丰富的电子资源，24小时开放自习区。' },
    { title: '体育设施', desc: '标准田径场、游泳池、篮球馆、羽毛球馆等一应俱全，满足多样化的运动需求。' },
    { title: '餐饮服务', desc: '多个食堂和咖啡厅，提供中西式餐饮选择，满足不同口味需求，食品安全有保障。' },
    { title: '学生宿舍', desc: '舒适的学生公寓，配备空调、独立卫浴、高速网络，提供安全温馨的居住环境。' }
  ],
  en: [
    { title: 'Modern Library', desc: 'Collection of over 1 million volumes, providing quiet study spaces and rich electronic resources, 24-hour study area available.' },
    { title: 'Sports Facilities', desc: 'Standard track and field, swimming pool, basketball gym, badminton gym, etc. Fully equipped to meet diverse sports needs.' },
    { title: 'Dining Services', desc: 'Multiple cafeterias and coffee shops, providing Chinese and Western dining options, meeting different taste needs, food safety guaranteed.' },
    { title: 'Student Dormitory', desc: 'Comfortable student apartments, equipped with AC, private bathroom, high-speed internet, providing safe and warm living environment.' }
  ],
  ja: [
    { title: '現代化図書館', desc: '蔵書は100万冊以上。静かな学習空間と豊富な電子リソースを提供。24時間自習エリア利用可能。' },
    { title: '体育施設', desc: '標準陸上競技場、プール、バスケットボール館、バドミントン館など完備。多様化した運動需要を満足。' },
    { title: '飲食サービス', desc: '複数の食堂とコーヒーショップ。中華と西洋の飲食選択を提供。異なる味覚需要を満足、食品安全保障あり。' },
    { title: '学生寮', desc: '快適な学生アパート。エアコン、独立バスルーム、高速インターネット完備。安全で温かい居住環境を提供。' }
  ],
  ko: [
    { title: '현대화 도서관', desc: '장서 100만 권 이상, 조용한 학습 공간과 풍부한 전자 리소스 제공. 24시간 자습 구역 이용 가능.' },
    { title: '체육 시설', desc: '표준 육상 경기장, 수영장, 농구장, 배드민턴장 등 완비. 다양한 운동 수요 만족.' },
    { title: '음식 서비스', desc: '복수의 식당과 커피숍. 중화와 서양의 음식 선택 제공. 다른 미각 수요 만족, 식품 안전 보장.' },
    { title: '학생 기숙사', desc: '편안한 학생 아파트. 에어컨, 독립 욕실, 고속 인터넷完備. 안전하고 따뜻한 거주 환경 제공.' }
  ]
};

const activities = {
  zh: [
    { title: '校园文化节', tag: '文化活动', date: '2024年6月', desc: '以"创新·融合·未来"为主题的第十届校园文化节，涵盖文艺演出、科技展览、创意市集等丰富活动。' },
    { title: '体育竞赛', tag: '体育活动', date: '2024年5月', desc: '一年一度的校际运动会，涵盖田径、篮球、足球、游泳等多个项目，展现学生的体育精神。' },
    { title: '学术讲座', tag: '学术活动', date: '2024年4月', desc: '邀请国际知名学者来校举办学术讲座，涵盖前沿科技、人文社科等多个领域。' }
  ],
  en: [
    { title: 'Campus Culture Festival', tag: 'Cultural Activity', date: 'June 2024', desc: 'The 10th Campus Culture Festival with the theme "Innovation · Integration · Future", covering literary performances, tech exhibitions, creative markets and other rich activities.' },
    { title: 'Sports Competition', tag: 'Sports Activity', date: 'May 2024', desc: 'Annual inter-school sports meeting, covering track and field, basketball, football, swimming and other events, showcasing students athletic spirit.' },
    { title: 'Academic Lectures', tag: 'Academic Activity', date: 'April 2024', desc: 'Inviting world-renowned scholars to give academic lectures, covering frontier technology, humanities and social sciences.' }
  ],
  ja: [
    { title: 'キャンパス文化祭', tag: '文化活動', date: '2024年6月', desc: '「革新・融合・未来」をテーマにした第10回キャンパス文化祭。文芸公演、科技展覧、創意市集など豊富な活動をカバー。' },
    { title: '体育競技', tag: '体育活動', date: '2024年5月', desc: '年一度の校際運動会。陸上競技、バスケットボール、フットボール、水泳など複数の項目をカバー。学生の体育精神を展示。' },
    { title: '学術講座', tag: '学術活動', date: '2024年4月', desc: '国際的に有名な学者を招いて学術講座を開催。前沿科技、人文社科など複数の分野をカバー。' }
  ],
  ko: [
    { title: '캠퍼스 문화제', tag: '문화 활동', date: '2024년 6월', desc: '"혁신·융합·미래"를 주제로 한 제10회 캠퍼스 문화제. 문예 공연, 테크 전시, 창의 시장 등 풍부한 활동.' },
    { title: '체육 경기', tag: '체육 활동', date: '2024년 5월', desc: '연례교 제전. 육상 경기, 농구, 축구, 수영 등 복수 종목, 학생의 체육 정신을 전시.' },
    { title: '학술 강좌', tag: '학술 활동', date: '2024년 4월', desc: '국제적으로 유명한 학자를 초청해 학술 강좌 개최. 최전 기술, 인문 사과 등 복수 분야.' }
  ]
};

const organizations = {
  zh: [
    { title: '学生会', desc: '代表学生利益，组织各类校园活动，是学生与学校沟通的桥梁，培养领导力和组织能力。', members: '200+' },
    { title: '学术社团', desc: '涵盖计算机、通信、人工智能等领域的学术社团，定期举办技术分享和项目实践活动。', members: '500+' },
    { title: '兴趣俱乐部', desc: '音乐、舞蹈、摄影、书法、电竞等各类兴趣俱乐部，满足学生的多元化兴趣发展需求。', members: '800+' }
  ],
  en: [
    { title: 'Student Union', desc: 'Represents student interests, organizes various campus activities, serves as a bridge between students and the university, cultivating leadership and organizational abilities.', members: '200+' },
    { title: 'Academic Clubs', desc: 'Academic clubs covering computer science, communications, AI and other fields, regularly holding tech sharing and project practice activities.', members: '500+' },
    { title: 'Interest Clubs', desc: 'Music, dance, photography, calligraphy, esports and other interest clubs, meeting students diverse interest development needs.', members: '800+' }
  ],
  ja: [
    { title: '学生委員会', desc: '学生の利益を代表し、各類のキャンパス活動を組織。学生と学校の溝通の架け橋であり、指導力と組織能力を培養。', members: '200+' },
    { title: '学術サークル', desc: 'コンピューター、通信、人工知能などをカバーする学術サークル。定期的に技術分譲とプロジェクト実践活動を開催。', members: '500+' },
    { title: '興味クラブ', desc: '音楽、ダンス、撮影、書道、eスポーツなど各類の興味クラブ。学生の多様化した興味発展需要を満足。', members: '800+' }
  ],
  ko: [
    { title: '학생 회', desc: '학생 이익 대표, 각류 캠퍼스 활동 조직. 학생과 학교 소통의 가교, 지도력과 조직 능력 배양.', members: '200+' },
    { title: '학술 동아리', desc: '컴퓨터, 통신, 인공지능 등 커버하는 학술 동아리. 정기적으로 기술 공유와 프로젝트 실천 활동 개최.', members: '500+' },
    { title: '취미 클럽', desc: '음악, 댄스, 촬영, 서예, e스포츠 등 각류 취미 클럽. 학생의 다원화된 취미 발전 수요 만족.', members: '800+' }
  ]
};

const campusSectionTitles = {
  zh: { facilitiesTitle: '校园设施', facilitiesSubtitle: '完善的设施，为学习生活保驾护航', activitiesTitle: '学生活动', activitiesSubtitle: '丰富多彩的校园文化，激发青春活力', orgsTitle: '学生组织', orgsSubtitle: '加入社团，拓展视野，提升能力' },
  en: { facilitiesTitle: 'Campus Facilities', facilitiesSubtitle: 'Comprehensive facilities, supporting learning and life', activitiesTitle: 'Student Activities', activitiesSubtitle: 'Colorful campus culture, inspiring youth vitality', orgsTitle: 'Student Organizations', orgsSubtitle: 'Join clubs, expand horizons, enhance abilities' },
  ja: { facilitiesTitle: 'キャンパス施設', facilitiesSubtitle: '完備した施設、学習と生活をサポート', activitiesTitle: '学生活動', activitiesSubtitle: '多多彩なキャンパス文化、青春の活力を刺激', orgsTitle: '学生組織', orgsSubtitle: 'サークルに加入し、視野を拡大、能力を向上' },
  ko: { facilitiesTitle: '캠퍼스 시설', facilitiesSubtitle: '완비된 시설, 학습과 생활 지원', activitiesTitle: '학생 활동', activitiesSubtitle: '다채로운 캠퍼스 문화, 청춘 활력 자극', orgsTitle: '학생 조직', orgsSubtitle: '동아리 가입, 시야 확대, 능력 향상' }
};

['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.campus) obj.campus = {};
  obj.campus.facilities = facilities[lang];
  obj.campus.activities = activities[lang];
  obj.campus.organizations = organizations[lang];
  obj.campus.sectionTitles = campusSectionTitles[lang];
});

// ========== CONTACT ==========
const contactItems = {
  zh: [
    { title: '地址', value: '波兰华沙市大学路123号', note: 'ul. Uniwersytecka 123, Warszawa' },
    { title: '电话', value: '+48 22 107 98 99', note: '招生热线：周一至周五 9:00-17:00' },
    { title: '邮箱', value: 'uniomo@10010.edu.pl', note: '我们将在 24 小时内回复您的邮件' },
    { title: '办公时间', value: '周一至周五 8:30 - 17:00', note: '节假日除外' }
  ],
  en: [
    { title: 'Address', value: 'ul. Uniwersytecka 123, Warszawa, Poland', note: 'Warsaw Campus' },
    { title: 'Phone', value: '+48 22 107 98 99', note: 'Admission hotline: Mon-Fri 9:00-17:00' },
    { title: 'Email', value: 'uniomo@10010.edu.pl', note: 'We will reply to your email within 24 hours' },
    { title: 'Office Hours', value: 'Mon-Fri 8:30 - 17:00', note: 'Except holidays' }
  ],
  ja: [
    { title: '住所', value: 'ポーランド、ワルシャワ市、大学路123号', note: 'ul. Uniwersytecka 123, Warszawa' },
    { title: '電話', value: '+48 22 107 98 99', note: '募集ホットライン：月-金 9:00-17:00' },
    { title: 'メール', value: 'uniomo@10010.edu.pl', note: '24時間以内にメールに返信いたします' },
    { title: '営業時間', value: '月-金 8:30 - 17:00', note: '祝日除く' }
  ],
  ko: [
    { title: '주소', value: '폴란드, 바르샤바 시, 대학로 123호', note: 'ul. Uniwersytecka 123, Warszawa' },
    { title: '전화', value: '+48 22 107 98 99', note: '모집 핫트라인: 월-금 9:00-17:00' },
    { title: '이메일', value: 'uniomo@10010.edu.pl', note: '24시간 이내에 이메일에 회신할 것입니다' },
    { title: '근무 시간', value: '월-금 8:30 - 17:00', note: '공휴일 제외' }
  ]
};

const contactFormLabels = {
  zh: { name: '姓名', email: '邮箱', phone: '电话', type: '咨询类型', message: '消息内容', namePlaceholder: '请输入您的姓名', emailPlaceholder: '请输入您的邮箱', phonePlaceholder: '请输入您的电话', typePlaceholder: '请选择', typeOptions: ['招生咨询', '学术咨询', '一般咨询', '其他'], submit: '提交消息', submitting: '提交中...', successMsg: '消息提交成功！我们将尽快与您联系。', validation: { name: '请输入姓名', email: '请输入邮箱', emailInvalid: '邮箱格式不正确', message: '请输入消息内容' } },
  en: { name: 'Name', email: 'Email', phone: 'Phone', type: 'Inquiry Type', message: 'Message', namePlaceholder: 'Enter your name', emailPlaceholder: 'Enter your email', phonePlaceholder: 'Enter your phone', typePlaceholder: 'Please select', typeOptions: ['Admission Inquiry', 'Academic Inquiry', 'General Inquiry', 'Other'], submit: 'Send Message', submitting: 'Submitting...', successMsg: 'Message submitted successfully! We will contact you soon.', validation: { name: 'Please enter your name', email: 'Please enter your email', emailInvalid: 'Invalid email format', message: 'Please enter your message' } },
  ja: { name: '氏名', email: 'メール', phone: '電話', type: '問い合わせ種類', message: 'メッセージ', namePlaceholder: '氏名を入力してください', emailPlaceholder: 'メールを入力してください', phonePlaceholder: '電話を入力してください', typePlaceholder: '選択してください', typeOptions: ['募集相談', '学術相談', '一般相談', 'その他'], submit: 'メッセージ送信', submitting: '送信中...', successMsg: 'メッセージが正常に送信されました！近日中にご連絡いたします。', validation: { name: '氏名を入力してください', email: 'メールを入力してください', emailInvalid: 'メール形式が正しくありません', message: 'メッセージを入力してください' } },
  ko: { name: '성명', email: '이메일', phone: '전화', type: '문의 유형', message: '메시지', namePlaceholder: '성명을 입력하세요', emailPlaceholder: '이메일을 입력하세요', phonePlaceholder: '전화를 입력하세요', typePlaceholder: '선택해 주세요', typeOptions: ['모집 문의', '학술 문의', '일반 문의', '기타'], submit: '메시지 보내기', submitting: '제출 중...', successMsg: '메시지가 성공적으로 제출되었습니다! 곧 연락드리겠습니다.', validation: { name: '성명을 입력하세요', email: '이메일을 입력하세요', emailInvalid: '이메일 형식이 올바르지 않습니다', message: '메시지를 입력하세요' } }
};

const contactSectionTitles = {
  zh: { title: '联系方式', subtitle: '随时与我们取得联系', formTitle: '发送消息', formSubtitle: '填写以下表单，我们将尽快回复您', mapTitle: '校园位置', mapSubtitle: '波兰华沙市大学路123号', mapInfo: ['周一至周五 8:30 - 17:00', '校园安全 24 小时值守'] },
  en: { title: 'Contact Us', subtitle: 'Get in touch with us anytime', formTitle: 'Send Message', formSubtitle: 'Fill out the form below, we will reply as soon as possible', mapTitle: 'Campus Location', mapSubtitle: 'ul. Uniwersytecka 123, Warszawa, Poland', mapInfo: ['Mon-Fri 8:30 - 17:00', 'Campus security 24-hour on duty'] },
  ja: { title: '連絡先', subtitle: 'いつでもご連絡ください', formTitle: 'メッセージ送信', formSubtitle: '以下のフォームに記入し、できるだけ早くご返信いたします', mapTitle: 'キャンパス位置', mapSubtitle: 'ポーランド、ワルシャワ市、大学路123号', mapInfo: ['月-金 8:30 - 17:00', 'キャンパス安全 24時間值守'] },
  ko: { title: '연락처', subtitle: '언제든지 저희에게 연락하세요', formTitle: '메시지 보내기', formSubtitle: '아래 양식을 작성하시면, 가능한 한 빨리 회신드리겠습니다', mapTitle: '캠퍼스 위치', mapSubtitle: '폴란드, 바르샤바 시, 대학로 123호', mapInfo: ['월-금 8:30 - 17:00', '캠퍼스 안전 24시간 당직'] }  
};

['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.contact) obj.contact = {};
  obj.contact.items = contactItems[lang];
  obj.contact.formLabels = contactFormLabels[lang];
  obj.contact.sectionTitles = contactSectionTitles[lang];
});

// ========== LOGIN ==========
const loginLabels = {
  zh: { brandTitle: '波兰联通大学', brandTitleEn: 'Polish University of Communications', brandMotto: '卓越教育 · 连接未来', brandMottoEn: 'Excellence in Education, Connecting the Future', brandDesc: '波兰联通大学校务管理系统\n请使用管理员账号登录以管理录取通知书', mobileWarning: '为获得最佳体验，请使用电脑端登录管理系统', loginTitle: '校务管理系统', loginSubtitle: '管理员登录', username: '用户名', password: '密码', usernamePlaceholder: '请输入用户名', passwordPlaceholder: '请输入密码', loginBtn: '登 录', loggingIn: '登录中...', error: '用户名或密码错误，请重试', backHome: '返回首页', queryLetter: '录取通知书查询', queryDiploma: '毕业证查询' },
  en: { brandTitle: 'Polish University of Communications', brandTitleEn: 'Polish University of Communications', brandMotto: 'Excellence in Education', brandMottoEn: 'Connecting the Future', brandDesc: 'Polish University of Communications\nCampus Management System\nPlease login with administrator account to manage admission letters', mobileWarning: 'For the best experience, please use PC to login to the management system', loginTitle: 'Campus Management System', loginSubtitle: 'Administrator Login', username: 'Username', password: 'Password', usernamePlaceholder: 'Enter username', passwordPlaceholder: 'Enter password', loginBtn: 'Login', loggingIn: 'Logging in...', error: 'Incorrect username or password, please retry', backHome: 'Back to Home', queryLetter: 'Admission Letter Query', queryDiploma: 'Diploma Query' },
  ja: { brandTitle: 'ポーランド聯通大学', brandTitleEn: 'Polish University of Communications', brandMotto: '卓越教育 · 未来を接続', brandMottoEn: 'Excellence in Education, Connecting the Future', brandDesc: 'ポーランド聯通大学\n校務管理システム\n管理者アカウントでログインし、录取通知書を管理してください', mobileWarning: '最適な体験のために、PC端末で管理システムにログインしてください', loginTitle: '校務管理システム', loginSubtitle: '管理者ログイン', username: 'ユーザー名', password: 'パスワード', usernamePlaceholder: 'ユーザー名を入力', passwordPlaceholder: 'パスワードを入力', loginBtn: 'ログイン', loggingIn: 'ログイン中...', error: 'ユーザー名またはパスワードが間違っています、再試行してください', backHome: 'ホームに戻る', queryLetter: '录取通知書照会', queryDiploma: '卒業証書照会' },
  ko: { brandTitle: '폴란드 연통 대학', brandTitleEn: 'Polish University of Communications', brandMotto: '탁월한 교육 · 미래 연결', brandMottoEn: 'Excellence in Education, Connecting the Future', brandDesc: '폴란드 연통 대학\n교무 관리 시스템\n관리자 계정으로 로그인하여 입학 허가서를 관리하십시오', mobileWarning: '최적의 경험을 위해, PC에서 관리 시스템에 로그인하십시오', loginTitle: '교무 관리 시스템', loginSubtitle: '관리자 로그인', username: '사용자명', password: '비밀번호', usernamePlaceholder: '사용자명을 입력하세요', passwordPlaceholder: '비밀번호를 입력하세요', loginBtn: '로그인', loggingIn: '로그인 중...', error: '사용자명 또는 비밀번호가 틀렸습니다, 다시 시도하십시오', backHome: '홈으로 돌아가기', queryLetter: '입학 허가서 조회', queryDiploma: '졸업증서 조회' }
};

['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.login) obj.login = {};
  Object.assign(obj.login, loginLabels[lang]);
});

// validation errors for login
setNested(zh, 'login.validation.username', '请输入用户名');
setNested(zh, 'login.validation.password', '请输入密码');
setNested(en, 'login.validation.username', 'Please enter username');
setNested(en, 'login.validation.password', 'Please enter password');
setNested(ja, 'login.validation.username', 'ユーザー名を入力してください');
setNested(ja, 'login.validation.password', 'パスワードを入力してください');
setNested(ko, 'login.validation.username', '사용자명을 입력하세요');
setNested(ko, 'login.validation.password', '비밀번호를 입력하세요');

// ========== DASHBOARD ==========
const dashboardLabels = {
  zh: { title: '校务管理系统', welcome: '请选择需要使用的管理功能', admissionLetter: '录取通知书生成', admissionLetterDesc: '填写学生信息，生成正式录取通知书，支持下载和在线查询验证。', diploma: '毕业证颁发', diplomaDesc: '为毕业生颁发正式毕业证书，支持下载和在线查询验证。', publicQuery: '公开查询入口', queryLetter: '录取通知书查询', queryDiploma: '毕业证查询' },
  en: { title: 'Campus Management System', welcome: 'Please select the management function you need', admissionLetter: 'Issue Admission Letter', admissionLetterDesc: 'Fill in student information, generate formal admission letter, support download and online verification.', diploma: 'Issue Diploma', diplomaDesc: 'Issue formal graduation diplomas, support download and online verification.', publicQuery: 'Public Query Portal', queryLetter: 'Admission Letter Query', queryDiploma: 'Diploma Query' },
  ja: { title: '校務管理システム', welcome: '使用する管理機能を選択してください', admissionLetter: '录取通知書発行', admissionLetterDesc: '学生情報を記入し、正式な录取通知書を生成。ダウンロードと在線照会検証をサポート。', diploma: '卒業証書発行', diplomaDesc: '卒業生に正式な卒業証書を発行。ダウンロードと在線照会検証をサポート。', publicQuery: '公開照会入口', queryLetter: '录取通知書照会', queryDiploma: '卒業証書照会' },
  ko: { title: '교무 관리 시스템', welcome: '사용할 관리 기능을 선택해 주세요', admissionLetter: '입학 허가서 발행', admissionLetterDesc: '학생 정보 작성하고, 정식 입학 허가서 생성. 다운로드와 온라인 검증 지원.', diploma: '졸업증서 발행', diplomaDesc: '졸업생에게 정식 졸업증서 발행. 다운로드와 온라인 검증 지원.', publicQuery: '공개 조회 입구', queryLetter: '입학 허가서 조회', queryDiploma: '졸업증서 조회' }
};

['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.dashboard) obj.dashboard = {};
  Object.assign(obj.dashboard, dashboardLabels[lang]);
});

// ========== SELECT / DIPLOMA SELECT ==========
const selectLabels = {
  zh: { heroTitle: '录取通知书查询', heroSubtitle: 'Admission Letter Verification System', cardTitle: '在线查询', cardDesc: '请输入您的个人信息以查询录取通知书', nameLabel: '姓名', idLabel: '身份证号 / 护照号', namePlaceholder: '请输入姓名', idPlaceholder: '请输入证件号码', searchBtn: '查 询', searching: '查询中...', errorName: '请输入完整的姓名（至少2个字符）', errorId: '请输入完整的身份证号/护照号（至少6位）', errorNotFound: '未找到录取通知书，请检查姓名和身份证号是否正确', errorServer: '查询服务暂时不可用，请稍后重试或联系学校招生办公室', resultBadge: '查询成功', resultTitle: '录取通知书', downloadBtn: '下载原图', infoTitle: '查询说明', infoText: '请输入与录取通知书上一致的姓名和证件号码。姓名支持中文和英文，证件号码支持身份证及护照。', contactTitle: '联系方式', contactText: '如有查询问题，请联系招生办公室：uniomo@10010.edu.pl 或致电 +48 22 107 98 99。', securityTitle: '安全提示', securityText: '本查询系统仅供验证录取通知书真伪使用。请妥善保管个人信息，切勿向他人泄露证件号码。', backHome: '返回首页' },
  en: { heroTitle: 'Admission Letter Query', heroSubtitle: 'Admission Letter Verification System', cardTitle: 'Online Query', cardDesc: 'Please enter your personal information to query admission letter', nameLabel: 'Name', idLabel: 'ID Number / Passport Number', namePlaceholder: 'Enter your name', idPlaceholder: 'Enter your ID number', searchBtn: 'Search', searching: 'Searching...', errorName: 'Please enter full name (at least 2 characters)', errorId: 'Please enter complete ID/passport number (at least 6 characters)', errorNotFound: 'Admission letter not found, please check name and ID number', errorServer: 'Query service temporarily unavailable, please retry later or contact admission office', resultBadge: 'Query Successful', resultTitle: 'Admission Letter', downloadBtn: 'Download', infoTitle: 'Query Instructions', infoText: 'Please enter the same name and ID number as on the admission letter. Name supports Chinese and English, ID supports ID card and passport.', contactTitle: 'Contact', contactText: 'If you have query problems, please contact admission office: uniomo@10010.edu.pl or call +48 22 107 98 99.', securityTitle: 'Security Notice', securityText: 'This query system is only for verifying admission letter authenticity. Please keep personal information safe and do not disclose ID number to others.', backHome: 'Back to Home' },
  ja: { heroTitle: '录取通知書照会', heroSubtitle: 'Admission Letter Verification System', cardTitle: '在線照会', cardDesc: '個人情報を入力して录取通知書を照会してください', nameLabel: '氏名', idLabel: '身分証番号 / パスポート番号', namePlaceholder: '氏名を入力してください', idPlaceholder: '証明書番号を入力してください', searchBtn: '照 会', searching: '照会中...', errorName: '完全な氏名を入力してください（少なくとも2文字）', errorId: '完全な身分証番号/パスポート番号を入力してください（少なくとも6文字）', errorNotFound: '录取通知書が見つかりません。氏名と身分証番号が正しいか確認してください', errorServer: '照会サービスは一時的に利用できません。後で再試行するか、学校募集弁公室にご連絡ください', resultBadge: '照会成功', resultTitle: '录取通知書', downloadBtn: '原図ダウンロード', infoTitle: '照会説明', infoText: '录取通知書と一致する氏名と証明書番号を入力してください。氏名は中国語と英語をサポートし、証明書番号は身分証とパスポートをサポートします。', contactTitle: '連絡先', contactText: '照会に問題がある場合は、募集弁公室にご連絡ください：uniomo@10010.edu.pl または電話 +48 22 107 98 99。', securityTitle: '安全提示', securityText: '本照会システムは录取通知書の真偽検証のみに使用されます。個人情報を大切に保管し、他人に証明書番号を漏らさないでください。', backHome: 'ホームに戻る' },
  ko: { heroTitle: '입학 허가서 조회', heroSubtitle: 'Admission Letter Verification System', cardTitle: '온라인 조회', cardDesc: '개인 정보를 입력하여 입학 허가서를 조회하십시오', nameLabel: '성명', idLabel: '신분증 번호 / 여권 번호', namePlaceholder: '성명을 입력하세요', idPlaceholder: '증명서 번호를 입력하세요', searchBtn: '조 회', searching: '조회 중...', errorName: '전체 성명을 입력하세요 (적어도 2문자)', errorId: '전체 신분증/여권 번호를 입력하세요 (적어도 6문자)', errorNotFound: '입학 허가서를 찾을 수 없습니다. 성명과 신분증 번호가 정확한지 확인하십시오', errorServer: '조회 서비스가 일시적으로 이용 불가능합니다. 나중에 다시 시도하거나 학교 모집 판공실에 연락하십시오', resultBadge: '조회 성공', resultTitle: '입학 허가서', downloadBtn: '원본 이미지 다운로드', infoTitle: '조회 설명', infoText: '입학 허가서와 일치하는 성명과 증명서 번호를 입력하십시오. 성명은 중국어와 영어를 지원하며, 증명서 번호는 신분증과 여권을 지원합니다.', contactTitle: '연락처', contactText: '조회에 문제가 있는 경우, 모집 판공실에 연락하십시오: uniomo@10010.edu.pl 또는 전화 +48 22 107 98 99.', securityTitle: '안전 힌트', securityText: '본 조회 시스템은 입학 허가서 진위 검증만을 위해 사용됩니다. 개인 정보를 잘 보관하고, 타인에게 증명서 번호를 누설하지 마십시오.', backHome: '홈으로 돌아가기' }
};

['zh','en','ja','ko'].forEach(lang => {
  const obj = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.select) obj.select = {};
  Object.assign(obj.select, selectLabels[lang]);
});

// diplomaSelect - similar structure, different heroTitle/resultTitle
const diplomaSelectLabels = JSON.parse(JSON.stringify(selectLabels));
['zh','en','ja','ko'].forEach(lang => {
  const src = selectLabels[lang];
  const tgt = lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:ko;
  if (!tgt.diplomaSelect) tgt.diplomaSelect = {};
  tgt.diplomaSelect.heroTitle = lang==='zh'?'毕业证查询':lang==='en'?'Diploma Query':lang==='ja'?'卒業証書照会':'졸업증서 조회';
  tgt.diplomaSelect.heroSubtitle = 'Diploma Verification System';
  tgt.diplomaSelect.cardTitle = src.cardTitle;
  tgt.diplomaSelect.cardDesc = lang==='zh'?'请输入您的个人信息以查询毕业证书':lang==='en'?'Please enter your personal information to query diploma':lang==='ja'?'個人情報を入力して卒業証書を照会してください':'개인 정보를 입력하여 졸업증서를 조회하십시오';
  tgt.diplomaSelect.nameLabel = src.nameLabel;
  tgt.diplomaSelect.idLabel = src.idLabel;
  tgt.diplomaSelect.namePlaceholder = src.namePlaceholder;
  tgt.diplomaSelect.idPlaceholder = src.idPlaceholder;
  tgt.diplomaSelect.searchBtn = src.searchBtn;
  tgt.diplomaSelect.searching = src.searching;
  tgt.diplomaSelect.errorName = src.errorName;
  tgt.diplomaSelect.errorId = src.errorId;
  tgt.diplomaSelect.errorNotFound = lang==='zh'?'未找到毕业证书，请检查姓名和身份证号是否正确':lang==='en'?'Diploma not found, please check name and ID number':lang==='ja'?'卒業証書が見つかりません。氏名と身分証番号が正しいか確認してください':'졸업증서를 찾을 수 없습니다. 성명과 신분증 번호가 정확한지 확인하십시오';
  tgt.diplomaSelect.errorServer = src.errorServer;
  tgt.diplomaSelect.resultBadge = src.resultBadge;
  tgt.diplomaSelect.resultTitle = lang==='zh'?'毕业证书':lang==='en'?'Diploma':lang==='ja'?'卒業証書':'졸업증서';
  tgt.diplomaSelect.downloadBtn = src.downloadBtn;
  tgt.diplomaSelect.infoTitle = src.infoTitle;
  tgt.diplomaSelect.infoText = lang==='zh'?'请输入与毕业证书上一致的姓名和证件号码。姓名支持中文和英文，证件号码支持身份证及护照。':lang==='en'?'Please enter the same name and ID number as on the diploma. Name supports Chinese and English, ID supports ID card and passport.':lang==='ja'?'卒業証書と一致する氏名と証明書番号を入力してください。氏名は中国語と英語をサポートし、証明書番号は身分証とパスポートをサポートします。':'졸업증서와 일치하는 성명과 증명서 번호를 입력하십시오. 성명은 중국어와 영어를 지원하며, 증명서 번호는 신분증과 여권을 지원합니다.';
  tgt.diplomaSelect.contactTitle = src.contactTitle;
  tgt.diplomaSelect.contactText = lang==='zh'?'如有查询问题，请联系教务处：uniomo@10010.edu.pl 或致电 +48 22 107 98 99。':lang==='en'?'If you have query problems, please contact academic affairs office: uniomo@10010.edu.pl or call +48 22 107 98 99.':lang==='ja'?'照会に問題がある場合は、教務処にご連絡ください：uniomo@10010.edu.pl または電話 +48 22 107 98 99。':'조회에 문제가 있는 경우, 교무처에 연락하십시오: uniomo@10010.edu.pl 또는 전화 +48 22 107 98 99.';
  tgt.diplomaSelect.securityTitle = src.securityTitle;
  tgt.diplomaSelect.securityText = lang==='zh'?'本查询系统仅供验证毕业证书真伪使用。请妥善保管个人信息，切勿向他人泄露证件号码。':lang==='en'?'This query system is only for verifying diploma authenticity. Please keep personal information safe and do not disclose ID number to others.':lang==='ja'?'本照会システムは卒業証書の真偽検証のみに使用されます。個人情報を大切に保管し、他人に証明書番号を漏らさないでください。':'본 조회 시스템은 졸업증서 진위 검증만을 위해 사용됩니다. 개인 정보를 잘 보관하고, 타인에게 증명서 번호를 누설하지 마십시오.';
  tgt.diplomaSelect.backHome = src.backHome;
});

// ========== ABOUT (features, missions, timeline already in zh, need en,ja,ko) ==========
// features for en, ja, ko
const features = {
  en: [
    { title: 'Excellence in Teaching', desc: 'First-class teaching team and comprehensive teaching system, focusing on combining theory with practice, cultivating students innovation and practical abilities.' },
    { title: 'Frontier Research', desc: 'Multiple research centers dedicated to cutting-edge research in AI, communications, data science and other fields, with internationally leading achievements.' },
    { title: 'International Perspective', desc: 'Established cooperative relations with 100+ universities worldwide, providing students with broad international exchange platforms.' },
    { title: 'Beautiful Campus', desc: 'Garden-like campus with advanced facilities, providing students with an ideal environment for learning and living.' },
    { title: 'Personalized Development', desc: 'Rich elective courses and club activities, supporting students in developing personal interests and specialties.' },
    { title: 'Employment Support', desc: 'Dedicated career guidance center and alumni network, providing comprehensive employment support and services.' }
  ],
  ja: [
    { title: '卓越した教育', desc: '一流の教育チームと完備した教育体系。理論と実践の結合に焦点を当て、学生の革新と実践能力を培養。' },
    { title: '前沿研究', desc: '複数の研究中心がAI、通信、データサイエンスなどの前沿研究に専念。国際的に先駆的な成果を持つ。' },
    { title: '国際的視野', desc: '世界100余りの大学と協力関係を確立。学生に広範な国際交換プラットフォームを提供。' },
    { title: '美しいキャンパス', desc: '庭園式キャンパスと先駆的な施設。学生に理想的な学習と生活環境を提供。' },
    { title: '個性化発展', desc: '豊富な選択科目とサークル活動。学生の個性的な興味と特長の発展をサポート。' },
    { title: '就職支援', desc: '専門的なキャリア指導センターと校友ネットワーク。包括的な就職支援とサービスを提供。' }
  ],
  ko: [
    { title: '탁월한 교육', desc: '일류 교육 팀과 완비된 교육 체계. 이론과 실천의 결합에 초점을 맞춤, 학생의 혁신과 실천 능력 배양.' },
    { title: '최전 연구', desc: '복수의 연구 센터가 AI, 통신, 데이터 사이언스 등 최전 연구에 전념. 국제적으로 선도적인 성과 보유.' },
    { title: '국제적 시야', desc: '세계 100여 개 대학과 협력 관계 확립. 학생에게 광범한 국제 교환 플랫폼 제공.' },
    { title: '아름다운 캠퍼스', desc: '정원식 캠퍼스와 선진적인 시설. 학생에게 이상적인 학습과 생활 환경 제공.' },
    { title: '개성화 발전', desc: '풍부한 선택 과목과 동아리 활동. 학생의 개성적인 취미와 특장 발전 지원.' },
    { title: '취업 지원', desc: '전문적인 커리어 지도 센터와 동문 네트워크. 포괄적인 취업 지원과 서비스 제공.' }
  ]
};

['en','ja','ko'].forEach(lang => {
  const obj = lang==='en'?en:lang==='ja'?ja:ko;
  if (!obj.about) obj.about = {};
  obj.about.features = features[lang];
});

//about.introText already added earlier, need to make sure it's consistent
// Already added introText1/2/3 to all 4 files earlier

// Write all files
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2), 'utf8');
fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('src/locales/ja.json', JSON.stringify(ja, null, 2), 'utf8');
fs.writeFileSync('src/locales/ko.json', JSON.stringify(ko, null, 2), 'utf8');

console.log('=== DONE ===');
console.log('All locale files updated successfully!');
