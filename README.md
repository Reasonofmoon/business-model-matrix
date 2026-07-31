# 영어학원 비즈니스 인사이트 랩

Strategyzer **Business Model Canvas** + **8대 비즈니스 프레임워크** 교차 분석 웹앱입니다.  
영어학원 원장·창업 준비자가 BMC를 작성하고, SWOT·Porter·Blue Ocean·JTBD 등으로 실행 인사이트를 얻습니다.

## 라이브 데모

https://reasonofmoon.github.io/business-model-matrix/

## 핵심 기능

| 기능 | 설명 |
|------|------|
| BMC 9분할 캔버스 | Strategyzer형 표 그리드, 드래그앤드롭 카드 |
| BYOK AI 자동 채우기 | OpenAI / Anthropic / Gemini / Grok / 커스텀 |
| **프레임워크 인사이트** | SWOT, Porter 5, Blue Ocean ERRC, JTBD, Ansoff, OKR, Unit Economics, VPC |
| 로컬 폴백 진단 | API 키 없이도 휴리스틱 1차 분석 |
| Top 실행 로드맵 | 우선순위·지표·기간·BMC 영역 매핑 |
| 액션 → 카드 | Top 액션을 캔버스 카드로 환원 |
| JSON/MD/PNG | 인사이트·캔버스 내보내기 |

## 8대 프레임워크

1. **SWOT** — 강점·약점·기회·위협  
2. **Porter 5 Forces** — 산업 경쟁 구조  
3. **Blue Ocean ERRC** — 제거·감소·증가·창조  
4. **JTBD** — 고객이 학원을 고용하는 일  
5. **Ansoff** — 성장 경로  
6. **OKR** — 분기 목표/핵심결과  
7. **Unit Economics** — LTV·CAC·공헌이익  
8. **Value Proposition Canvas** — 과업·고통·이득 정합  

## 사용 흐름

1. 학원 정보 입력 또는 샘플 데이터 로드  
2. (선택) BYOK로 BMC 9영역 AI 채우기  
3. 프레임워크 선택 후 **선택 프레임워크 분석**  
4. 하단 **전략 인사이트 보드**에서 탭·로드맵 확인  
5. **Top 액션 → 카드 후보**로 캔버스에 환원, JSON/MD 내보내기  

## 하네스 (개발/확장)

```
.claude/
  agents/   canvas-curator, framework-analyst, insight-synthesizer
  skills/   bmc-orchestrator, framework-insight, canvas-ops
CLAUDE.md   하네스 포인터
```

관련 작업 요청 시 `bmc-orchestrator` 스킬을 사용합니다.

## 기술 스택

- HTML5 / CSS Grid / Vanilla JS
- localStorage (캔버스 + AI 설정 + 인사이트)
- html2canvas
- BYOK LLM APIs

## 로컬 실행

```bash
python3 -m http.server 8080
```

브라우저에서 `index.html`을 엽니다.
