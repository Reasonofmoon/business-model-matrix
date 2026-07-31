# 영어학원 비즈니스 모델 캔버스 (BMC)

Strategyzer Business Model Canvas 구조를 기반으로, 영어학원 원장·창업 준비자가 9개 영역을 시각적으로 작성하는 웹 앱입니다.  
**BYOK(Bring Your Own Key)** 로 본인 API 키를 연결하면 AI가 각 영역을 최적 아이디어로 자동 채웁니다.

## 라이브 데모

GitHub Pages 배포 후: https://reasonofmoon.github.io/business-model-matrix/

## 구성

```
business-model-matrix/
├── index.html   # 레이아웃·AI 패널·9분할 캔버스
├── style.css    # Strategyzer형 CSS Grid + 반응형
├── app.js       # 카드 CRUD, DnD, LocalStorage, JSON/PNG, BYOK AI
└── README.md
```

## 기능

| 기능 | 설명 |
|------|------|
| **AI 자동 채우기 (BYOK)** | 학원 정보 기반 9영역/선택 영역 아이디어 생성 |
| 카드 추가 | 9개 영역 선택 후 텍스트 카드 생성 |
| 수정/삭제 | 더블클릭·✎ 수정, × 삭제 |
| 드래그 앤 드롭 | 카드를 다른 영역으로 이동 |
| 자동 저장 | `localStorage` 즉시 저장·복원 |
| JSON 내보내기/가져오기 | 백업 및 공유 |
| PNG 저장 | html2canvas로 캔버스만 고해상도 캡처 |
| 샘플 데이터 | AI 없이 영어학원 예시 채우기 |

## AI 자동 채우기 사용법

1. 좌측 **AI 자동 채우기** → **설정**
2. 프로바이더·모델·API 키 입력 → **설정 저장**
3. 학원명/컨셉, 위치·타깃·강점 등 학원 정보 작성
4. **전체 9영역 AI 채우기** 또는 아래 영역 선택 후 **선택 영역만 채우기**
5. 채우기 방식: **덮어쓰기** / **기존에 추가**, 영역당 3~6개 선택

### 지원 프로바이더

| 프로바이더 | 기본 모델 예시 | 비고 |
|-----------|----------------|------|
| OpenAI | `gpt-4o-mini` | Chat Completions |
| Anthropic | `claude-sonnet-4-20250514` | Messages API |
| Google Gemini | `gemini-2.0-flash` | generateContent |
| xAI (Grok) | `grok-2-latest` | OpenAI 호환 |
| 커스텀 | 사용자 지정 | OpenAI 호환 Base URL |

### 보안·주의

- API 키는 **브라우저 localStorage에만** 저장되며 앱 서버로 전송되지 않습니다.
- 공용 기기에서는 사용 후 **키 삭제**를 권장합니다.
- 일부 프로바이더는 브라우저 **CORS** 제한이 있을 수 있습니다. 막히면 OpenAI 호환 프록시 Base URL(커스텀)을 사용하세요.
- Gemini는 URL 쿼리 키 방식이라 브라우저에서 비교적 잘 동작하는 편입니다.

## 9개 영역 (영어학원 맞춤)

1. **KP** 핵심 파트너  
2. **KA** 핵심 활동  
3. **KR** 핵심 자원  
4. **VP** 가치 제안  
5. **CR** 고객 관계  
6. **CH** 채널  
7. **CS** 고객 세그먼트  
8. **CS** 비용 구조  
9. **RS** 수익 흐름  

## 기술 스택

- HTML5 / CSS3 Grid / Vanilla JS (ES6+)
- Local Storage (캔버스 + AI 설정)
- html2canvas (PNG export)
- BYOK: OpenAI / Anthropic / Gemini / xAI / OpenAI-compatible

## 로컬 실행

정적 파일이므로 `index.html`을 브라우저에서 열거나 간단 서버로 실행합니다.

```bash
python3 -m http.server 8080
```
