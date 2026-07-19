/**
 * 毕业证生成器
 */

export const DIPLOMA_SPECIALTIES = [
  '计算机科学与技术',
  '通信工程',
  '电子信息工程',
  '网络工程',
  '软件工程',
  '数据科学与大数据技术',
  '人工智能',
  '信息安全'
]

export const DIPLOMA_DEGREES = ['学士', '硕士', '博士']

export function generateDiplomaNumber(year) {
  const random = Math.floor(10000 + Math.random() * 90000)
  return `PUC-D${year}${random}`
}

/**
 * Generate anti-counterfeit watermark pattern
 * Subtle but visible microtext + guilloche-style pattern
 */
function generateAntiCounterfeitWatermark() {
  let microtext = ''
  // Microtext lines - very small, repeating verification text
  const lines = [
    'POLISH UNIVERSITY OF COMMUNICATIONS',
    'WWW.10010.EDU.PL',
    'DIPLOMA VERIFICATION',
    'PUC OFFICIAL DOCUMENT'
  ]
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

/**
 * Generate QR code data URL using the qrcode npm package
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

export function generateDiplomaHTML(data, qrCodeDataURL, logoDataURL, docTemplate = null) {
  // If docTemplate is provided (from i18n), use it; otherwise use hardcoded Chinese (fallback)
  const doc = docTemplate || {
    mainTitle: '毕业证书',
    mainTitleEn: 'GRADUATION DIPLOMA',
    uniName: '波兰联通大学',
    uniNameEn: 'Polish University of Communications',
    website: 'www.10010.edu.pl',
    numberPrefix: '证书编号',
    infoLabels: { name: '姓名', englishName: '英文姓名', idNumber: '身份证号/护照号' },
    body: '学生 <strong>{name}</strong>（{englishName}），性别{gender}，于 <strong>{enrollmentYear}</strong> 年入读波兰联通大学 <strong>{specialty}</strong> 专业，修完 <strong>{degree}</strong> 学位规定的全部课程，成绩合格，准予毕业。学制 <strong>{studyDuration}</strong>，毕业日期：<strong>{graduationDate}</strong>，证书编号：<strong>{diplomaNumber}</strong>。特发此证，以资证明。本证书系波兰联通大学正式颁发的学历证书，可通过学校官方网站（www.10010.edu.pl）扫描二维码验证真伪。',
    signatureRoles: { dean: '教务处处长', president: '校　　长' },
    signatureNames: { dean: 'GUIXIANGZHONG', president: 'WANGZHENG' },
    qrLabel: '扫码验证',
    noticeTitle: '重要说明 / Important Notice',
    notices: ['本毕业证书为波兰联通大学正式学历证书，请妥善保管。', '证书真伪可通过扫描右下方二维码或访问学校官网验证。', 'This diploma is an official document of Polish University of Communications.', 'Any alteration or forgery of this document is subject to legal prosecution.'],
    footerText: '波兰联通大学'
  }

  const watermarks = generateAntiCounterfeitWatermark()
  // Use the user-entered graduationDate (form field) for both the body text
  // and the footer so the printed diploma reflects the date the operator
  // actually filled in. Falls back to today's date if missing/malformed.
  let dateStr = ''
  if (data.graduationDate) {
    const parts = String(data.graduationDate).split('-')
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      const d = parseInt(parts[2], 10)
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        dateStr = `${y}年${m}月${d}日`
      }
    }
  }
  if (!dateStr) {
    const today = new Date()
    dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  }
  const gradDate = dateStr

  // Replace placeholders in body
  let bodyHtml = doc.body
    .replace('{name}', data.name)
    .replace('{englishName}', data.englishName)
    .replace('{gender}', data.gender || '—')
    .replace('{enrollmentYear}', data.enrollmentYear)
    .replace('{specialty}', data.specialty)
    .replace('{degree}', data.degree)
    .replace('{studyDuration}', data.studyDuration || '四年')
    .replace('{graduationDate}', gradDate)
    .replace('{diplomaNumber}', data.diplomaNumber)

  const qrImg = qrCodeDataURL
    ? `<img src="${qrCodeDataURL}" alt="验证二维码" class="diploma-qr-img" />`
    : ''

  const logoImg = logoDataURL
    ? `<img src="${logoDataURL}" alt="校徽" class="diploma-logo-img" />`
    : `<img src="/images/favicon.ico" alt="校徽" class="diploma-logo-img" />`

  const noticesHtml = doc.notices.map(n => `<p>${n}</p>`).join('')

  return `
    <div class="diploma-doc" id="diplomaDoc">
      <div class="wave-border wave-top"></div>
      <div class="wave-border wave-bottom"></div>
      <div class="wave-border wave-left"></div>
      <div class="wave-border wave-right"></div>

      ${watermarks}

      <div class="diploma-header">
        ${logoImg}
        <div class="diploma-title-group">
          <h1 class="diploma-uni-name">${doc.uniName}</h1>
          <p class="diploma-uni-name-en">${doc.uniNameEn}</p>
          <p class="diploma-website">${doc.website}</p>
        </div>
      </div>

      <div class="diploma-main-title">
        <h2>${doc.mainTitle}</h2>
        <p>${doc.mainTitleEn}</p>
      </div>

      <div class="diploma-number">
        ${doc.numberPrefix}: ${data.diplomaNumber}
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

      <div class="diploma-info">
        ${bodyHtml}
      </div>

      <div class="diploma-signatures">
        <div class="signature-item">
          <p class="signature-role">${doc.signatureRoles.dean}</p>
          <p class="signature-name">${doc.signatureNames.dean}</p>
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

      <div class="diploma-footer">
        <p>${doc.footerText}</p>
        <p>${gradDate}</p>
      </div>

      <div class="diploma-notice">
        <h3>${doc.noticeTitle}</h3>
        ${noticesHtml}
      </div>

      <img src="/images/unio.png" alt="UNIO" class="diploma-watermark-logo" />
    </div>
  `
}

export function validateDiplomaForm(data) {
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
    errors.specialty = '请选择专业'
  }

  if (!data.degree) {
    errors.degree = '请选择学位类型'
  }

  if (!data.enrollmentYear) {
    errors.enrollmentYear = '请选择入学年份'
  }

  if (!data.graduationDate) {
    errors.graduationDate = '请选择毕业日期'
  }

  return errors
}
