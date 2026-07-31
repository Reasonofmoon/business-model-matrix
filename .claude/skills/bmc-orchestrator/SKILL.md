---
name: bmc-orchestrator
description: >
  영어학원 BMC 앱/비즈니스 인사이트 랩의 오케스트레이터. BMC 작성, 프레임워크 분석,
  인사이트 종합, 앱 기능 확장, 재실행·업데이트·보완 요청 시 반드시 사용.
  트리거: "BMC", "비즈니스 모델 캔버스", "프레임워크 분석", "인사이트", "SWOT",
  "블루오션", "JTBD", "학원 전략", "다시 분석", "인사이트 업데이트".
version: 1.0.0
---

# BMC Insight Lab Orchestrator

## Phase 0: 컨텍스트 확인
1. `index.html` / `app.js` / `style.css`와 `_workspace/` 존재 여부를 읽는다.
2. 모드 결정: 초기 실행 / 부분 재실행 / 새 실행(이전 `_workspace` → `_workspace_prev`).

## Phase 1: 캔버스 정리 (canvas-curator)
- 입력: 학원 컨텍스트 + 현재 BMC JSON
- 출력: `_workspace/01_canvas-curator_bmc.json`

## Phase 2: 프레임워크 분석 (framework-analyst) — 병렬 가능
- 선택 프레임워크: SWOT, Porter 5 Forces, Blue Ocean ERRC, JTBD, Ansoff, OKR, Unit Economics, Value Proposition Canvas
- 출력: `_workspace/02_framework-analyst_insights.json`

## Phase 3: 인사이트 종합 (insight-synthesizer)
- 교차 검증, Top 5 액션, 90일 로드맵
- 출력: `_workspace/03_insight-synthesizer_briefing.md`

## Phase 4: 앱 반영
- UI에 인사이트 패널/리포트 렌더
- 필요 시 캔버스 카드 후보를 사용자 확인 후 반영

## 에러 핸들링
- AI/네트워크 실패 1회 재시도 후, 해당 프레임워크 누락을 보고서에 명시하고 진행
- 상충 인사이트는 삭제하지 않고 출처 병기

## 테스트 시나리오
- 정상: 샘플 BMC → 전체 프레임워크 분석 → 브리핑 생성
- 에러: API 키 없음 → 로컬 휴리스틱 분석으로 폴백
