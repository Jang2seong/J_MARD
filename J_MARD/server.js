const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
const reportUrl = process.env.REPORT_TO_URL;
const reportUri = process.env.CSP_REPORT_URI;
const enableHstsPreload = process.env.ENABLE_HSTS_PRELOAD === 'true';

// 보안: 서버 정보 노출 비활성화
app.disable('x-powered-by');

// 보안 헤더 미들웨어
app.use((req, res, next) => {
    // Content-Security-Policy 기본값
    let csp = "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";
    if (reportUrl) {
      csp += ' report-to csp-endpoint;';
    }
    if (reportUri) {
      csp += ` report-uri ${reportUri};`;
    }
    res.setHeader('Content-Security-Policy', csp);

    // CSP report-to 헤더 (REPORT_TO_URL 환경 변수가 설정된 경우에만 추가)
    if (reportUrl) {
      res.setHeader('Report-To', JSON.stringify({ group: 'csp-endpoint', max_age: 10886400, endpoints: [{ url: reportUrl }], include_subdomains: true }));
    }

    // HSTS 기본 설정; preload는 명시적으로 활성화해야 추가
    let hsts = 'max-age=63072000; includeSubDomains';
    if (enableHstsPreload) {
      hsts += '; preload';
    }
    res.setHeader('Strict-Transport-Security', hsts);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), interest-cohort=()');

  // X-Powered-By 노출 제거
  res.removeHeader('X-Powered-By');
  next();
});

// CSP report receiver for testing (logs reports to console)
app.post('/csp-report', express.json({ type: ['application/csp-report', 'application/json'] }), (req, res) => {
  try {
    console.log('CSP Report:', JSON.stringify(req.body));
  } catch (e) {
    console.log('CSP Report received');
  }
  res.status(204).end();
});

// 정적 파일 제공 (워크스페이스 루트)
app.use(express.static(path.join(__dirname)));

// SPA fallback: index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Secure static server running on http://localhost:${port}`);
});
