로컬 보안 테스트 서버 사용법

이 저장소 루트에 간단한 Express 서버(`server.js`)를 추가했습니다. 이 서버는 정적 파일을 제공하며 다음 보안 헤더를 응답에 설정합니다:

- Content-Security-Policy: default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; report-to csp-endpoint; report-uri /csp-report;
- Report-To: {"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"https://<YOUR_DEPLOY_DOMAIN>/csp-report"}],"include_subdomains":true}
- Strict-Transport-Security: max-age=63072000; includeSubDomains
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: no-referrer
- Permissions-Policy: geolocation=(), camera=(), microphone=(), interest-cohort=()

설치 및 실행

1. Node.js가 설치되어 있는지 확인하세요 (v16+ 권장).
2. 프로젝트 루트에서 패키지 설치:

```bash
cd ~/Desktop/Nomard
npm install
```

3. 서버 실행:

```bash
npm start
# 또는
node server.js
```

4. 브라우저에서 열기:

http://localhost:8000

주의사항

- `Strict-Transport-Security` 헤더는 HTTPS 환경에서만 효과적입니다. 로컬 테스트는 HTTP로 동작하므로 HSTS 동작은 확인되지 않습니다. 배포시 HTTPS가 정상 동작하면 HSTS를 유지하고, `preload`를 적용할 때는 도메인이 준비된 상태인지 반드시 재확인하세요.
- `Report-To` 헤더는 `REPORT_TO_URL` 환경 변수에 실제 배포 도메인을 지정해야 합니다. 예:

```bash
REPORT_TO_URL=https://<YOUR_DEPLOY_DOMAIN>/csp-report npm start
```

  실제 배포 환경에서는 `https://<YOUR_DEPLOY_DOMAIN>/csp-report` 형태로 설정하세요.
- `CSP_REPORT_URI` 환경 변수를 사용하면 추가 CSP 위반 리포트 엔드포인트를 지정할 수 있습니다. 예:

```bash
CSP_REPORT_URI=https://<YOUR_DEPLOY_DOMAIN>/csp-report
```
- `ENABLE_HSTS_PRELOAD=true`를 설정하면 HSTS에 `preload`가 추가됩니다. 기본적으로는 `preload` 없이 안전하게 설정됩니다.

- 배포 환경(예: Netlify, GitHub Pages, Nginx, Apache 등)에서는 서버/플랫폼 설정으로 동일한 헤더를 적용하는 것이 권장됩니다. 원하시는 호스팅을 알려주시면 해당 플랫폼용 설정 예시를 만들어 드립니다.
- CSP는 엄격하게 설정되어 있으므로 외부 서드파티 스크립트나 인라인 스타일/스크립트를 사용하면 차단됩니다. 필요한 경우 구체적으로 허용 도메인 또는 nonce/SRI 방식을 적용하세요.

CSP 위반 테스트 방법

1. 로컬 서버를 실행합니다:

```bash
cd ~/Desktop/Nomard
npm start
```

2. 브라우저에서 `http://localhost:8000`을 열고 개발자 도구를 켭니다.
3. 콘솔에서 다음을 입력해 인라인 스크립트 위반을 시도합니다:

```javascript
const script = document.createElement('script');
script.textContent = "console.log('CSP test');";
document.body.appendChild(script);
```

4. 브라우저에서 CSP 위반 메시지가 나타나면 `/csp-report`로 리포트가 전송되는지 확인합니다.
5. 서버 콘솔에 `CSP Report:` 로그가 출력되는지 확인합니다.

실제 배포 환경에서 헤더 확인

- Nginx: `curl -I https://<YOUR_DEPLOY_DOMAIN>` 또는 `curl -I http://<YOUR_DEPLOY_DOMAIN>`로 응답 헤더를 확인합니다.
- Netlify: `_headers` 파일을 배포 후 `curl -I https://<YOUR_DEPLOY_DOMAIN>`로 응답 헤더를 확인합니다.
- Apache: `.htaccess` 적용 후 `curl -I https://<YOUR_DEPLOY_DOMAIN>`로 헤더를 확인합니다.

확인할 헤더:
- `Content-Security-Policy`
- `Report-To`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

`curl` 예시:

```bash
curl -I https://your-domain.com
```
