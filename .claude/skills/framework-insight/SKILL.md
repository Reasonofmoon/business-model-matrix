---
name: framework-insight
description: >
  BMC 데이터를 다양한 비즈니스 프레임워크로 분석해 실행 가능한 인사이트를 생성한다.
  SWOT, Porter, Blue Ocean, JTBD, Ansoff, OKR, Unit Economics, VPC 요청 또는
  "프레임워크 적용", "전략 인사이트", "학원 진단" 시 사용.
version: 1.0.0
---

# Framework Insight Skill

## 지원 프레임워크
| ID | 이름 | 핵심 질문 |
|----|------|-----------|
| swot | SWOT | 강점·약점·기회·위협은? |
| porter | Porter 5 Forces | 산업 매력도와 협상력은? |
| blue-ocean | Blue Ocean ERRC | 제거·감소·증가·창조할 요소는? |
| jtbd | Jobs To Be Done | 학부모/학생이 고용하는 일은? |
| ansoff | Ansoff Matrix | 성장 경로는? |
| okr | OKR | 분기 목표와 핵심 결과는? |
| unit-econ | Unit Economics | LTV/CAC/공헌이익은? |
| vpc | Value Proposition Canvas | 고객 과업·고통·이득 정합은? |

## 출력 품질 기준
- 각 프레임워크당 findings ≥ 3, actions ≥ 2
- 영어학원 용어 사용 (수강료, 재원율, 상담 전환, 내신 등)
- 가정은 `assumption:` 접두로 명시

## 로컬 폴백
API 키가 없으면 규칙 기반 휴리스틱으로 초안 인사이트를 생성한다.
