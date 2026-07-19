/**
 * 录取通知书生成器
 * 从原 script.js 移植到 Vue 工具函数
 */

export const SPECIALTIES = [
  '计算机科学与技术',
  '通信工程',
  '电子信息工程',
  '网络工程',
  '软件工程',
  '数据科学与大数据技术',
  '人工智能',
  '信息安全'
]

export const DEGREES = ['学士', '硕士', '博士']
export const YEARS = ['2024', '2025', '2026']
export const SEMESTERS = ['春季', '秋季']

/**
 * Multi-language translations for the selectable options.
 * The canonical value (the one stored in the form) is Chinese; these tables
 * map that canonical value to the label used for other locales, both for the
 * dropdown display and for the generated letter body.
 */
export const OPTION_TRANSLATIONS = {
  specialty: {
    '计算机科学与技术': { en: 'Computer Science and Technology', ja: 'コンピュータ科学と技術', ko: '컴퓨터 과학 및 기술' },
    '通信工程': { en: 'Communications Engineering', ja: '通信工学', ko: '통신 공학' },
    '电子信息工程': { en: 'Electronic Information Engineering', ja: '電子情報工学', ko: '전자 정보 공학' },
    '网络工程': { en: 'Network Engineering', ja: 'ネットワーク工学', ko: '네트워크 공학' },
    '软件工程': { en: 'Software Engineering', ja: 'ソフトウェア工学', ko: '소프트웨어 공학' },
    '数据科学与大数据技术': { en: 'Data Science and Big Data Technology', ja: 'データサイエンスとビッグデータ技術', ko: '데이터 과학 및 빅데이터 기술' },
    '人工智能': { en: 'Artificial Intelligence', ja: '人工知能', ko: '인공지능' },
    '信息安全': { en: 'Information Security', ja: '情報セキュリティ', ko: '정보 보안' }
  },
  degree: {
    '学士': { en: "Bachelor's", ja: '学士', ko: '학사' },
    '硕士': { en: "Master's", ja: '修士', ko: '석사' },
    '博士': { en: 'Doctoral', ja: '博士', ko: '박사' }
  },
  semester: {
    '春季': { en: 'Spring', ja: '春学期', ko: '봄' },
    '秋季': { en: 'Autumn', ja: '秋学期', ko: '가을' }
  }
}

/**
 * Translate a canonical (Chinese) option value into the given locale.
 * Falls back to the original value when no translation is available or the
 * locale is Chinese.
 */
export function translateOption(type, value, locale = 'zh') {
  if (!value || locale === 'zh') return value
  const table = OPTION_TRANSLATIONS[type]
  if (!table || !table[value]) return value
  return table[value][locale] || value
}

export function generateAdmissionNumber(year) {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `PUC${year}${random}`
}

/**
 * Generate QR code data URL using the qrcode npm package
 * This replaces the old window.QRCode global approach that was unreliable
 */
export async function generateQRCodeDataURL(text) {
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(text, {
    width: 100,
    margin: 1,
    color: {
      dark: '#8B4513',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  })
}

/**
 * Generate anti-counterfeit watermark pattern
 * - Microtext: very small repeating verification text, visible but not obvious
 * - Guilloche pattern: subtle circular SVG pattern like security paper
 */
function generateAntiCounterfeitWatermark() {
  // Microtext lines - small text scattered across the document
  const lines = [
    'POLISH UNIVERSITY OF COMMUNICATIONS',
    'WWW.10010.EDU.PL',
    'ADMISSION VERIFICATION',
    'PUC OFFICIAL DOCUMENT'
  ]
  let microtext = ''
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 95
    const y = Math.random() * 95
    const rotation = Math.random() * 60 - 30
    const opacity = 0.025 + Math.random() * 0.025
    const text = lines[i % lines.length]
    microtext += `<span class="watermark-micro" style="left:${x}%;top:${y}%;transform:rotate(${rotation}deg);opacity:${opacity}">${text}</span>`
  }

  // Guilloche-style SVG pattern overlay - subtle security pattern
  const guilloche = `
    <svg class="guilloche-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 1754" preserveAspectRatio="none">
      <defs>
        <pattern id="guilloche" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(139,69,19,0.015)" stroke-width="0.5"/>
          <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(139,69,19,0.02)" stroke-width="0.3"/>
          <circle cx="60" cy="60" r="20" fill="none" stroke="rgba(139,69,19,0.015)" stroke-width="0.3"/>
          <path d="M 0 60 Q 30 30 60 60 T 120 60" fill="none" stroke="rgba(139,69,19,0.01)" stroke-width="0.3"/>
          <path d="M 60 0 Q 30 30 60 60 T 60 120" fill="none" stroke="rgba(139,69,19,0.01)" stroke-width="0.3"/>
        </pattern>
      </defs>
      <rect width="1240" height="1754" fill="url(#guilloche)"/>
    </svg>
  `

  return microtext + guilloche
}

export function generateLetterHTML(data, qrCodeDataURL, logoDataURL, docTemplate = null, locale = 'zh') {
  // If docTemplate is provided (from i18n), use it; otherwise use hardcoded Chinese (fallback)
  const doc = docTemplate || {
    mainTitle: '录取通知书',
    mainTitleEn: 'ADMISSION LETTER',
    uniName: '波兰联通大学',
    uniNameEn: 'Polish University of Communications',
    website: 'www.10010.edu.pl',
    numberPrefix: '编号',
    infoLabels: { name: '姓名', englishName: '英文姓名', idNumber: '身份证号/护照号' },
    body: '经审核，兹录取你为波兰联通大学 <strong>{degree}</strong> 研究生，就读 <strong>{specialty}</strong> 专业，<strong>{year}</strong> 年 <strong>{semester}</strong> 学期入学。学籍编号: <strong>{number}</strong>。请按本通知书规定的时间，携带本通知书、身份证件及相关材料，到波兰联通大学报到注册。具体报到时间和地点请关注学校官方网站（www.10010.edu.pl）发布的相关通知。祝贺你成为波兰联通大学的一员，愿你在今后的学习生活中取得优异的成绩！',
    signatureRoles: { director: '招生办主任', president: '校　　长' },
    signatureNames: { director: 'GUIXIANGZHONG', president: 'WANGZHENG' },
    qrLabel: '扫码验证',
    noticeTitle: '重要提醒 / Important Notice',
    notices: ['本通知书为波兰联通大学正式录取文件，请妥善保管。', '报到时请携带本通知书原件、身份证件原件及复印件。', 'This admission letter is an official document of Polish University of Communications.', 'Please bring this letter and your ID documents for registration.'],
    footerText: '波兰联通大学招生办公室'
  }

  const watermarks = generateAntiCounterfeitWatermark()
  // Use the user-entered issueDate (form field) instead of new Date() so the
  // printed letter reflects the date the operator actually filled in.
  // Falls back to today's date only if issueDate is missing/malformed.
  // Format the issue date as a locale-neutral "YYYY/MM/DD" string so the
  // generated letter shows the same slash-separated form across all
  // languages (Chinese previously used "年月日", now unified to "/").
  const formatDate = (y, m, d) =>
    `${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`

  let dateStr = ''
  if (data.issueDate) {
    const parts = String(data.issueDate).split('-')
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      const d = parseInt(parts[2], 10)
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        dateStr = formatDate(y, m, d)
      }
    }
  }
  if (!dateStr) {
    const today = new Date()
    dateStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  }

  // Translate the selectable options (degree / specialty / semester) into the
  // current locale so the generated letter content is fully localized.
  const degreeText = translateOption('degree', data.degree, locale)
  const specialtyText = translateOption('specialty', data.specialty, locale)
  const semesterText = translateOption('semester', data.semester, locale)

  // Replace placeholders in body. Use global replacement and support both the
  // {number} and {admissionNumber} placeholder spellings so the admission
  // number renders correctly across all language templates.
  let bodyHtml = doc.body
    .replace(/\{degree\}/g, degreeText)
    .replace(/\{specialty\}/g, specialtyText)
    .replace(/\{year\}/g, data.year)
    .replace(/\{semester\}/g, semesterText)
    .replace(/\{number\}/g, data.admissionNumber)
    .replace(/\{admissionNumber\}/g, data.admissionNumber)

  const qrImg = qrCodeDataURL
    ? `<img src="${qrCodeDataURL}" alt="验证二维码" class="letter-qr-img" />`
    : ''

  const logoImg = logoDataURL
    ? `<img src="${logoDataURL}" alt="校徽" class="letter-logo-img" />`
    : `<img src="/images/favicon.ico" alt="校徽" class="letter-logo-img" />`

  const noticesHtml = doc.notices.map(n => `<p>${n}</p>`).join('')

  return `
    <div class="admission-letter" id="admissionLetter">
      <div class="wave-border wave-top"></div>
      <div class="wave-border wave-bottom"></div>
      <div class="wave-border wave-left"></div>
      <div class="wave-border wave-right"></div>

      ${watermarks}

      <div class="letter-header">
        ${logoImg}
        <div class="letter-title-group">
          <h1 class="letter-uni-name">${doc.uniName}</h1>
          <p class="letter-uni-name-en">${doc.uniNameEn}</p>
          <p class="letter-website">${doc.website}</p>
        </div>
      </div>

      <div class="letter-main-title">
        <h2>${doc.mainTitle}</h2>
        <p>${doc.mainTitleEn}</p>
      </div>

      <div class="letter-number">
        ${doc.numberPrefix}: ${data.admissionNumber}
      </div>

      <div class="student-info">
        <div class="info-row">
          <span class="info-label">${doc.infoLabels.name}:</span>
          <span class="info-value">${data.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${doc.infoLabels.englishName}:</span>
          <span class="info-value">${data.englishName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${doc.infoLabels.idNumber}:</span>
          <span class="info-value">${data.idNumber}</span>
        </div>
      </div>

      <div class="admission-info">
        ${bodyHtml}
      </div>

      <div class="letter-signatures">
        <div class="signature-item">
          <p class="signature-role">${doc.signatureRoles.director}</p>
          <p class="signature-name">${doc.signatureNames.director}</p>
          <div class="signature-line"></div>
        </div>
        <div class="signature-item">
          <p class="signature-role">${doc.signatureRoles.president}</p>
          <p class="signature-name">${doc.signatureNames.president}</p>
          <div class="signature-line"></div>
        </div>
        <div class="signature-item signature-qr">
          ${qrImg}
          <p class="qr-label">${doc.qrLabel}</p>
        </div>
      </div>

      <div class="letter-footer">
        <p>${doc.footerText}</p>
        <p>${dateStr}</p>
      </div>

      <div class="letter-notice">
        <h3>${doc.noticeTitle}</h3>
        ${noticesHtml}
      </div>

      <img src="/images/unio.png" alt="UNIO" class="letter-watermark-logo" />
    </div>
  `
}

export function validateForm(data) {
  const errors = {}

  if (!data.name || !data.name.trim()) {
    errors.name = '请输入学生姓名'
  } else if (data.name.length > 8) {
    errors.name = '姓名最多8个字符'
  }

  if (!data.englishName || !data.englishName.trim()) {
    errors.englishName = '请输入英文姓名'
  } else if (data.englishName.length > 32) {
    errors.englishName = '英文姓名最多32个字符'
  }

  if (!data.idNumber || !data.idNumber.trim()) {
    errors.idNumber = '请输入身份证号/护照号'
  } else if (data.idNumber.length > 20) {
    errors.idNumber = '身份证号最多20个字符'
  }

  if (!data.specialty) {
    errors.specialty = '请选择录取专业'
  }

  if (!data.degree) {
    errors.degree = '请选择学位类型'
  }

  if (!data.year) {
    errors.year = '请选择入学年份'
  }

  if (!data.semester) {
    errors.semester = '请选择入学学期'
  }

  if (!data.issueDate) {
    errors.issueDate = '请选择发出日期'
  }

  return errors
}
