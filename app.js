(() => {
  "use strict";

  const STORAGE_KEY = "english-academy-bmc-v1";
  const AI_SETTINGS_KEY = "english-academy-bmc-ai-v1";

  const SECTIONS = ["kp", "ka", "kr", "vp", "cr", "ch", "cs", "cost", "rs"];

  const SECTION_LABELS = {
    kp: "핵심 파트너",
    ka: "핵심 활동",
    kr: "핵심 자원",
    vp: "가치 제안",
    cr: "고객 관계",
    ch: "채널",
    cs: "고객 세그먼트",
    cost: "비용 구조",
    rs: "수익 흐름",
  };

  const SECTION_GUIDE = {
    kp: "학원 운영에 꼭 필요한 외부 파트너·협력 기관 (프랜차이즈, 교재사, 강사 에이전시, 학교 등)",
    ka: "가치를 만들고 전달하기 위한 핵심 업무·활동 (커리큘럼, 수업, 상담, 평가 등)",
    kr: "학원이 보유·활용하는 핵심 자산 (강사, 콘텐츠, 시설, 브랜드, 시스템 등)",
    vp: "학부모가 돈을 내고 선택할 차별화된 가치·약속 (성과, 관리, 경험)",
    cr: "고객(학부모·학생)과 관계를 맺고 유지하는 방식 (리포트, 상담, 커뮤니티)",
    ch: "고객에게 도달·유치·전달하는 채널 (온라인, 오프라인, 추천)",
    cs: "공략할 구체적 고객 집단 (학년, 니즈, 가정 유형)",
    cost: "고정·변동 주요 비용 항목 (인건비, 임대, 마케팅, 라이선스 등)",
    rs: "수익이 발생하는 방식 (수강료, 특강, 교재, 부가 서비스)",
  };

  const DEFAULT_MODELS = {
    openai: "gpt-5.6-luna",
    anthropic: "claude-sonnet-5",
    gemini: "gemini-3.6-flash",
    grok: "grok-4.5",
    custom: "gpt-5.6-luna",
  };

  const INSIGHT_KEY = "english-academy-bmc-insights-v1";
  const COMPETITOR_KEY = "english-academy-bmc-competitors-v1";

  const FRAMEWORKS = {
    swot: {
      id: "swot",
      title: "SWOT",
      question: "강점·약점·기회·위협으로 학원의 전략 포지션은?",
      columns: ["strengths", "weaknesses", "opportunities", "threats"],
      labels: { strengths: "강점", weaknesses: "약점", opportunities: "기회", threats: "위협" },
    },
    porter: {
      id: "porter",
      title: "Porter 5 Forces",
      question: "산업 경쟁 강도와 협상력은 어떤가?",
      columns: ["rivalry", "newEntrants", "substitutes", "buyerPower", "supplierPower"],
      labels: {
        rivalry: "기존 경쟁",
        newEntrants: "신규 진입",
        substitutes: "대체재",
        buyerPower: "구매자 교섭력",
        supplierPower: "공급자 교섭력",
      },
    },
    "blue-ocean": {
      id: "blue-ocean",
      title: "Blue Ocean (ERRC)",
      question: "제거·감소·증가·창조로 새 가치 곡선은?",
      columns: ["eliminate", "reduce", "raise", "create"],
      labels: { eliminate: "제거", reduce: "감소", raise: "증가", create: "창조" },
    },
    jtbd: {
      id: "jtbd",
      title: "Jobs To Be Done",
      question: "학부모/학생이 우리 학원을 '고용'하는 일은?",
      columns: ["functional", "emotional", "social", "hireCriteria"],
      labels: {
        functional: "기능적 Job",
        emotional: "감정적 Job",
        social: "사회적 Job",
        hireCriteria: "고용 기준",
      },
    },
    ansoff: {
      id: "ansoff",
      title: "Ansoff Matrix",
      question: "성장 경로(시장/상품)는 어디로 갈까?",
      columns: ["marketPenetration", "marketDevelopment", "productDevelopment", "diversification"],
      labels: {
        marketPenetration: "시장 침투",
        marketDevelopment: "시장 개발",
        productDevelopment: "제품 개발",
        diversification: "다각화",
      },
    },
    okr: {
      id: "okr",
      title: "OKR",
      question: "이번 분기 목표와 핵심 결과는?",
      columns: ["objectives", "keyResults", "initiatives", "risks"],
      labels: {
        objectives: "목표(O)",
        keyResults: "핵심결과(KR)",
        initiatives: "이니셔티브",
        risks: "리스크",
      },
    },
    "unit-econ": {
      id: "unit-econ",
      title: "Unit Economics",
      question: "LTV·CAC·공헌이익 관점의 수익성은?",
      columns: ["revenueDrivers", "costDrivers", "metrics", "levers"],
      labels: {
        revenueDrivers: "수익 드라이버",
        costDrivers: "비용 드라이버",
        metrics: "핵심 지표",
        levers: "개선 레버",
      },
    },
    vpc: {
      id: "vpc",
      title: "Value Proposition Canvas",
      question: "고객 과업·고통·이득과 가치제안의 정합은?",
      columns: ["customerJobs", "pains", "gains", "painRelievers", "gainCreators"],
      labels: {
        customerJobs: "고객 과업",
        pains: "고통",
        gains: "이득",
        painRelievers: "고통 완화",
        gainCreators: "이득 창출",
      },
    },
    competitor: {
      id: "competitor",
      title: "경쟁사 벤치마크",
      question: "경쟁사·대안 대비 우리의 위치와 이길 수 있는 지점은?",
      columns: [
        "set",
        "ourEdge",
        "theirEdge",
        "parity",
        "gaps",
        "priceValue",
        "winThemes",
        "watchMoves",
      ],
      labels: {
        set: "비교 대상",
        ourEdge: "우리 우위",
        theirEdge: "상대 우위",
        parity: "동등(Parity)",
        gaps: "메울 갭",
        priceValue: "가격·가치",
        winThemes: "이길 메시지",
        watchMoves: "모니터링 시그널",
      },
    },
    pdca: {
      id: "pdca",
      title: "PDCA 사고법",
      question: "계획-실행-점검-개선 루프로 무엇을 돌릴 것인가?",
      columns: ["plan", "do", "check", "act", "cadence", "owners", "metrics", "backlog"],
      labels: {
        plan: "Plan 계획",
        do: "Do 실행",
        check: "Check 점검",
        act: "Act 개선",
        cadence: "주기·리듬",
        owners: "오너·역할",
        metrics: "점검 지표",
        backlog: "다음 개선 백로그",
      },
    },
  };


  const SAMPLE = {
    title: "스마트잉글리시 학원 BMC",
    cards: {
      kp: [
        "프랜차이즈 본사 (커리큘럼·브랜드)",
        "교재 출판사 / 라이선스 파트너",
        "원어민 강사 에이전시",
        "지역 초등학교 방과후 협력",
      ],
      ka: [
        "수준별 커리큘럼 개발·운영",
        "내신 대비 특강",
        "학부모 상담 및 학습 코칭",
        "정기 모의고사·진단평가",
      ],
      kr: [
        "베테랑 강사진",
        "자체 제작 워크북",
        "학원 전용 학습 앱",
        "학원 시설·스터디 존",
      ],
      vp: [
        "철저한 1:1 오답 관리",
        "AI 기반 맞춤형 어휘 학습",
        "내신+수능 투트랙 로드맵",
        "스피킹 실전 클리닉",
      ],
      cr: [
        "주간 학습 리포트 발송",
        "카카오톡/밴드 채널 소통",
        "월 1회 학부모 상담 데이",
        "우수 학생 시상·동기부여",
      ],
      ch: [
        "지역 맘카페 바이럴",
        "아파트 단지 전단지",
        "블로그·인스타 콘텐츠 마케팅",
        "재원생 소개 이벤트",
      ],
      cs: [
        "초·중·고 내신 상위권 도약 학부모",
        "스피킹·회화 집중형 학생",
        "유학·특목고 준비 가정",
        "맞벌이 가정 (돌봄+학습)",
      ],
      cost: [
        "강사 인건비",
        "학원 임대료·관리비",
        "교재·프로그램 라이선스",
        "광고·마케팅비",
        "시설 유지·비품",
      ],
      rs: [
        "월 수강료",
        "방학 특강비",
        "교재·교보재 판매",
        "1:1 클리닉 추가 수강",
      ],
    },
  };

  /** @type {{ title: string, cards: Record<string, string[]> }} */
  let state = emptyState();

  /** @type {{ provider: string, model: string, apiKey: string, baseUrl: string }} */
  let aiSettings = {
    provider: "openai",
    model: DEFAULT_MODELS.openai,
    apiKey: "",
    baseUrl: "",
  };

  let aiBusy = false;
  let insightBusy = false;
  /** @type {null | { generatedAt: string, mode: string, frameworks: any[], actions: any[], summary: any }} */
  let insightState = null;
  let dragPayload = null;
  let statusTimer = null;

  const els = {
    form: document.getElementById("bmc-form"),
    section: document.getElementById("section-select"),
    text: document.getElementById("card-text"),
    charCount: document.getElementById("char-count"),
    status: document.getElementById("status"),
    title: document.getElementById("canvas-title"),
    canvas: document.getElementById("bmc-canvas"),
    btnClear: document.getElementById("btn-clear"),
    btnImport: document.getElementById("btn-import"),
    btnExportJson: document.getElementById("btn-export-json"),
    btnExportPng: document.getElementById("btn-export-png"),
    btnSample: document.getElementById("btn-sample"),
    btnRename: document.getElementById("btn-rename"),
    importFile: document.getElementById("import-file"),
    // AI
    aiName: document.getElementById("ai-academy-name"),
    aiContext: document.getElementById("ai-context"),
    aiCount: document.getElementById("ai-count"),
    aiMode: document.getElementById("ai-mode"),
    btnAiAll: document.getElementById("btn-ai-fill-all"),
    btnAiSection: document.getElementById("btn-ai-fill-section"),
    btnAiToggle: document.getElementById("btn-ai-toggle-settings"),
    aiSettings: document.getElementById("ai-settings"),
    aiProvider: document.getElementById("ai-provider"),
    aiModel: document.getElementById("ai-model"),
    aiApiKey: document.getElementById("ai-api-key"),
    aiBaseUrl: document.getElementById("ai-base-url"),
    customBaseWrap: document.getElementById("custom-base-wrap"),
    btnToggleKey: document.getElementById("btn-toggle-key"),
    btnAiSave: document.getElementById("btn-ai-save-settings"),
    btnAiClearKey: document.getElementById("btn-ai-clear-key"),
    aiProgress: document.getElementById("ai-progress"),
    aiProgressText: document.getElementById("ai-progress-text"),
    // Insights
    fwGrid: document.getElementById("fw-grid"),
    competitorNames: document.getElementById("competitor-names"),
    competitorNotes: document.getElementById("competitor-notes"),
    competitorBox: document.getElementById("competitor-box"),
    btnRunInsights: document.getElementById("btn-run-insights"),
    btnExportInsights: document.getElementById("btn-export-insights"),
    insightProgress: document.getElementById("insight-progress"),
    insightProgressText: document.getElementById("insight-progress-text"),
    insightBoard: document.getElementById("insight-board"),
    insightMeta: document.getElementById("insight-meta"),
    insightSummary: document.getElementById("insight-summary"),
    insightTabs: document.getElementById("insight-tabs"),
    insightPanels: document.getElementById("insight-panels"),
    insightRoadmap: document.getElementById("insight-roadmap"),
    btnApplyActions: document.getElementById("btn-apply-actions"),
    btnClearInsights: document.getElementById("btn-clear-insights"),
  };

  function emptyState() {
    const cards = {};
    SECTIONS.forEach((s) => (cards[s] = []));
    return { title: "우리 학원 비즈니스 모델", cards };
  }

  function setStatus(msg, kind = "info") {
    els.status.textContent = msg;
    els.status.dataset.kind = kind;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      els.status.textContent = "자동 저장됨 · 준비됨";
    }, 2800);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("localStorage save failed", err);
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return false;
      const next = emptyState();
      if (typeof data.title === "string" && data.title.trim()) next.title = data.title.trim();
      if (data.cards && typeof data.cards === "object") {
        SECTIONS.forEach((s) => {
          if (Array.isArray(data.cards[s])) {
            next.cards[s] = data.cards[s]
              .map((t) => String(t).trim())
              .filter(Boolean)
              .slice(0, 50);
          }
        });
      }
      state = next;
      return true;
    } catch (err) {
      console.warn("localStorage load failed", err);
      return false;
    }
  }

  function saveAiSettings() {
    try {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
    } catch (err) {
      console.warn("AI settings save failed", err);
    }
  }

  function loadAiSettings() {
    try {
      const raw = localStorage.getItem(AI_SETTINGS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return;
      if (data.provider) aiSettings.provider = String(data.provider);
      if (data.model) aiSettings.model = String(data.model);
      if (typeof data.apiKey === "string") aiSettings.apiKey = data.apiKey;
      if (typeof data.baseUrl === "string") aiSettings.baseUrl = data.baseUrl;
    } catch (err) {
      console.warn("AI settings load failed", err);
    }
  }

  function syncAiSettingsUI() {
    els.aiProvider.value = aiSettings.provider || "openai";
    els.aiModel.value = aiSettings.model || DEFAULT_MODELS[aiSettings.provider] || "";
    els.aiApiKey.value = aiSettings.apiKey || "";
    els.aiBaseUrl.value = aiSettings.baseUrl || "";
    els.customBaseWrap.classList.toggle("hidden", aiSettings.provider !== "custom");
  }

  function readAiSettingsFromUI() {
    aiSettings.provider = els.aiProvider.value;
    aiSettings.model = (els.aiModel.value || "").trim() || DEFAULT_MODELS[aiSettings.provider];
    aiSettings.apiKey = (els.aiApiKey.value || "").trim();
    aiSettings.baseUrl = (els.aiBaseUrl.value || "").trim().replace(/\/$/, "");
  }

  function render() {
    els.title.textContent = state.title;
    SECTIONS.forEach((section) => {
      const zone = els.canvas.querySelector(`[data-dropzone="${section}"]`);
      if (!zone) return;
      zone.innerHTML = "";
      const items = state.cards[section] || [];
      if (!items.length) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "• 항목을 추가하세요";
        zone.appendChild(empty);
        return;
      }
      items.forEach((text, index) => {
        zone.appendChild(createCardEl(section, index, text));
      });
    });
  }

  function createCardEl(section, index, text) {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.section = section;
    card.dataset.index = String(index);

    const textEl = document.createElement("div");
    textEl.className = "text";
    textEl.textContent = text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "icon-btn edit";
    editBtn.title = "수정";
    editBtn.setAttribute("aria-label", "수정");
    editBtn.textContent = "✎";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editCard(section, index);
    });

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "icon-btn";
    delBtn.title = "삭제";
    delBtn.setAttribute("aria-label", "삭제");
    delBtn.textContent = "×";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeCard(section, index);
    });

    actions.append(editBtn, delBtn);
    card.append(textEl, actions);

    card.addEventListener("dblclick", () => editCard(section, index));

    card.addEventListener("dragstart", (e) => {
      dragPayload = { section, index };
      card.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", `${section}:${index}`);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      dragPayload = null;
      els.canvas.querySelectorAll(".cell.drag-over").forEach((c) => c.classList.remove("drag-over"));
    });

    return card;
  }

  function addCard(section, text) {
    const t = text.trim();
    if (!t || !SECTIONS.includes(section)) return false;
    if (!state.cards[section]) state.cards[section] = [];
    if (state.cards[section].length >= 50) {
      setStatus("영역당 최대 50개까지 추가할 수 있습니다.", "warn");
      return false;
    }
    state.cards[section].push(t);
    save();
    render();
    setStatus(`「${SECTION_LABELS[section]}」에 카드 추가됨`);
    return true;
  }

  function removeCard(section, index) {
    if (!state.cards[section] || index < 0 || index >= state.cards[section].length) return;
    state.cards[section].splice(index, 1);
    save();
    render();
    setStatus("카드 삭제됨");
  }

  function editCard(section, index) {
    const current = state.cards[section]?.[index];
    if (current == null) return;
    const next = prompt("카드 내용 수정", current);
    if (next == null) return;
    const t = next.trim();
    if (!t) {
      setStatus("빈 내용은 저장되지 않습니다.", "warn");
      return;
    }
    state.cards[section][index] = t;
    save();
    render();
    setStatus("카드 수정됨");
  }

  function moveCard(fromSection, fromIndex, toSection) {
    if (!SECTIONS.includes(fromSection) || !SECTIONS.includes(toSection)) return;
    if (fromSection === toSection) return;
    const list = state.cards[fromSection];
    if (!list || fromIndex < 0 || fromIndex >= list.length) return;
    if ((state.cards[toSection] || []).length >= 50) {
      setStatus("대상 영역이 가득 찼습니다.", "warn");
      return;
    }
    const [item] = list.splice(fromIndex, 1);
    state.cards[toSection].push(item);
    save();
    render();
    setStatus(`「${SECTION_LABELS[toSection]}」로 이동됨`);
  }

  function setupDropzones() {
    els.canvas.querySelectorAll(".cell").forEach((cell) => {
      const section = cell.dataset.section;
      if (!section) return;

      cell.addEventListener("dragover", (e) => {
        if (!dragPayload) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        cell.classList.add("drag-over");
      });

      cell.addEventListener("dragleave", (e) => {
        if (!cell.contains(e.relatedTarget)) {
          cell.classList.remove("drag-over");
        }
      });

      cell.addEventListener("drop", (e) => {
        e.preventDefault();
        cell.classList.remove("drag-over");
        if (!dragPayload) return;
        moveCard(dragPayload.section, dragPayload.index, section);
        dragPayload = null;
      });
    });
  }

  function exportJson() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      title: state.title,
      cards: state.cards,
      meta: { app: "english-academy-bmc", locale: "ko-KR" },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = URL.createObjectURL(blob);
    a.download = `bmc-${slugify(state.title)}-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus("JSON 파일로 내보냈습니다");
  }

  function importJsonFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const next = emptyState();
        if (typeof data.title === "string" && data.title.trim()) next.title = data.title.trim();
        const source = data.cards || data;
        SECTIONS.forEach((s) => {
          if (Array.isArray(source[s])) {
            next.cards[s] = source[s].map((t) => String(t).trim()).filter(Boolean).slice(0, 50);
          }
        });
        state = next;
        save();
        render();
        setStatus("JSON을 가져왔습니다");
      } catch (err) {
        console.error(err);
        setStatus("유효하지 않은 JSON 파일입니다", "error");
        alert("JSON 파일을 읽지 못했습니다. 형식을 확인해 주세요.");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  async function exportPng() {
    if (typeof html2canvas !== "function") {
      alert("이미지 라이브러리를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.");
      return;
    }

    const btn = els.btnExportPng;
    const prev = btn.textContent;
    btn.disabled = true;
    btn.textContent = "저장 중…";
    setStatus("캔버스 이미지 생성 중…");

    const frame = document.getElementById("bmc-frame") || els.canvas;

    const captureRoot = document.createElement("div");
    captureRoot.style.cssText = [
      "position:fixed",
      "left:-10000px",
      "top:0",
      "width:1400px",
      "background:#fff",
      "padding:28px",
      "font-family:Apple SD Gothic Neo, Pretendard, Noto Sans KR, Georgia, serif",
      "color:#0f172a",
      "z-index:-1",
      "box-sizing:border-box",
    ].join(";");

    const heading = document.createElement("div");
    heading.style.cssText =
      "margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end;";
    heading.innerHTML = `
      <div>
        <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em;color:#1f2937;">${escapeHtml(state.title)}</div>
        <div style="margin-top:4px;color:#8a7344;font-size:13px;">The Business Model Canvas · 영어학원 원장용</div>
      </div>
      <div style="color:#a67c2d;font-size:12px;">${new Date().toLocaleDateString("ko-KR")}</div>
    `;

    const clone = frame.cloneNode(true);
    clone.id = "bmc-capture-frame";
    clone.style.cssText = [
      "width:1344px",
      "display:flex",
      "flex-direction:column",
      "background:#fff",
      "border:2px solid #c4a35a",
      "border-radius:4px",
      "box-shadow:none",
      "overflow:hidden",
    ].join(";");

    const grid = clone.querySelector(".bmc") || clone;
    grid.classList.add("capturing");
    if (grid.classList.contains("bmc")) {
      grid.style.cssText = [
        "width:100%",
        "height:760px",
        "display:grid",
        "grid-template-columns:1.1fr 1fr 1.25fr 1fr 1.1fr",
        "grid-template-rows:1.75fr 0.78fr",
        "gap:0",
        "background:#fff",
        "border:none",
        "padding:0",
        "min-height:760px",
      ].join(";");
    }

    clone.querySelectorAll(".icon-btn, .empty-state, .cell-hint").forEach((n) => n.remove());
    clone.querySelectorAll(".card .actions").forEach((n) => n.remove());

    captureRoot.append(heading, clone);
    document.body.appendChild(captureRoot);

    try {
      const canvas = await html2canvas(captureRoot, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        width: 1400,
        windowWidth: 1400,
      });
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = canvas.toDataURL("image/png");
      a.download = `bmc-${slugify(state.title)}-${stamp}.png`;
      a.click();
      setStatus("PNG 이미지를 저장했습니다");
    } catch (err) {
      console.error(err);
      setStatus("이미지 저장 실패", "error");
      alert("이미지 저장에 실패했습니다.");
    } finally {
      captureRoot.remove();
      btn.disabled = false;
      btn.textContent = prev;
    }
  }

  function slugify(s) {
    return (
      String(s)
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-가-힣]+/g, "")
        .slice(0, 40) || "canvas"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadSample() {
    if (hasAnyCards() && !confirm("현재 작성 내용을 샘플 데이터로 덮어쓸까요?")) return;
    state = {
      title: SAMPLE.title,
      cards: Object.fromEntries(SECTIONS.map((s) => [s, [...(SAMPLE.cards[s] || [])]])),
    };
    save();
    render();
    setStatus("샘플 데이터를 불러왔습니다");
  }

  function hasAnyCards() {
    return SECTIONS.some((s) => (state.cards[s] || []).length > 0);
  }

  function clearAll() {
    if (!confirm("모든 카드를 삭제하고 초기화할까요? (되돌릴 수 없습니다)")) return;
    state = emptyState();
    save();
    render();
    setStatus("캔버스를 초기화했습니다");
  }

  function renameTitle() {
    const next = prompt("캔버스 이름", state.title);
    if (next == null) return;
    const t = next.trim();
    if (!t) return;
    state.title = t.slice(0, 60);
    save();
    render();
    setStatus("이름이 변경되었습니다");
  }

  /* ===================== AI BYOK ===================== */

  function ensureApiKey() {
    readAiSettingsFromUI();
    if (!aiSettings.apiKey) {
      els.aiSettings.classList.remove("hidden");
      els.aiApiKey.focus();
      alert("API 키를 입력한 뒤 설정 저장을 눌러 주세요. (BYOK)");
      return false;
    }
    if (!aiSettings.model) {
      aiSettings.model = DEFAULT_MODELS[aiSettings.provider] || "gpt-5.6-luna";
      els.aiModel.value = aiSettings.model;
    }
    if (aiSettings.provider === "custom" && !aiSettings.baseUrl) {
      els.aiSettings.classList.remove("hidden");
      alert("커스텀 프로바이더는 Base URL이 필요합니다.");
      return false;
    }
    return true;
  }

  function setAiBusy(busy, text) {
    aiBusy = busy;
    els.btnAiAll.disabled = busy;
    els.btnAiSection.disabled = busy;
    els.aiProgress.classList.toggle("hidden", !busy);
    if (text) els.aiProgressText.textContent = text;
  }

  function getAcademyBrief() {
    const name = (els.aiName.value || "").trim();
    const ctx = (els.aiContext.value || "").trim();
    return {
      name: name || state.title || "영어학원",
      context: ctx || "한국 일반 영어학원 (초·중·고 대상)",
    };
  }

  function getCompetitorBrief() {
    const namesRaw = (els.competitorNames?.value || "").trim();
    const notes = (els.competitorNotes?.value || "").trim();
    const names = namesRaw
      ? namesRaw.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 8)
      : [];
    return {
      names: names.length ? names : ["인근 프랜차이즈 학원", "내신 전문 보습학원", "온라인 인강/앱", "1:1 과외"],
      namesRaw: namesRaw,
      notes: notes || "가격·커리큘럼·관리 강도·채널 영향력을 기준으로 비교",
    };
  }

  function saveCompetitorBrief() {
    try {
      localStorage.setItem(
        COMPETITOR_KEY,
        JSON.stringify({
          names: els.competitorNames?.value || "",
          notes: els.competitorNotes?.value || "",
        })
      );
    } catch (e) {}
  }

  function loadCompetitorBrief() {
    try {
      const raw = localStorage.getItem(COMPETITOR_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (els.competitorNames && typeof data.names === "string") els.competitorNames.value = data.names;
      if (els.competitorNotes && typeof data.notes === "string") els.competitorNotes.value = data.notes;
    } catch (e) {}
  }

  function syncCompetitorBoxVisibility() {
    if (!els.competitorBox || !els.fwGrid) return;
    const checked = [...els.fwGrid.querySelectorAll('input[type="checkbox"]:checked')].some((el) => el.value === "competitor");
    els.competitorBox.style.display = checked ? "" : "none";
  }

  function buildSystemPrompt() {
    return [
      "당신은 한국 영어학원 전문 경영 컨설턴트이자 Strategyzer 비즈니스 모델 캔버스 전문가입니다.",
      "원장이 바로 실행·검토할 수 있는 구체적이고 현실적인 아이디어만 한국어로 제안합니다.",
      "추상적 문구·진부한 슬로건·중복 표현을 피하고, 학원 맥락에 맞는 실행 가능한 항목을 씁니다.",
      "각 항목은 카드 한 장에 들어갈 짧은 문장(8~36자 권장, 최대 60자)으로 작성합니다.",
      "반드시 유효한 JSON만 출력합니다. 마크다운 코드블록·설명 문장·주석을 넣지 마세요.",
    ].join(" ");
  }

  function buildAllSectionsUserPrompt(count) {
    const { name, context } = getAcademyBrief();
    const existing = {};
    SECTIONS.forEach((s) => {
      existing[s] = (state.cards[s] || []).slice(0, 8);
    });

    const schemaHint = SECTIONS.map(
      (s) => `  "${s}": string[]  // ${SECTION_LABELS[s]} — ${SECTION_GUIDE[s]}`
    ).join("\n");

    return `다음 영어학원의 비즈니스 모델 캔버스 9개 영역을 채워 주세요.

학원명/컨셉: ${name}
학원 정보: ${context}
영역당 카드 수: 정확히 ${count}개

이미 있는 카드(참고·중복 금지):
${JSON.stringify(existing, null, 2)}

영역 가이드:
${SECTIONS.map((s) => `- ${s} (${SECTION_LABELS[s]}): ${SECTION_GUIDE[s]}`).join("\n")}

출력 JSON 스키마 (키는 반드시 아래 영문 코드 사용):
{
${schemaHint}
}

규칙:
- 각 배열 길이는 정확히 ${count}
- 항목은 한국어, 서로 다른 관점
- 기존 카드와 의미 중복 금지
- JSON 객체 하나만 출력`;
  }

  function buildOneSectionUserPrompt(section, count) {
    const { name, context } = getAcademyBrief();
    const existing = (state.cards[section] || []).slice(0, 12);
    const otherSummary = {};
    SECTIONS.filter((s) => s !== section).forEach((s) => {
      const arr = state.cards[s] || [];
      if (arr.length) otherSummary[s] = arr.slice(0, 4);
    });

    return `영어학원 BMC의 한 영역만 채워 주세요.

학원명/컨셉: ${name}
학원 정보: ${context}
대상 영역 코드: ${section}
영역 이름: ${SECTION_LABELS[section]}
영역 의미: ${SECTION_GUIDE[section]}
생성 개수: 정확히 ${count}개

이 영역 기존 카드(중복 금지): ${JSON.stringify(existing)}
다른 영역 요약(정합성 참고): ${JSON.stringify(otherSummary)}

출력 JSON:
{ "${section}": string[] }

규칙:
- 배열 길이 정확히 ${count}
- 한국어 짧은 실행형 문구
- JSON만 출력`;
  }

  function extractJson(text) {
    if (!text) throw new Error("빈 응답");
    let s = String(text).trim();
    // strip markdown fences
    const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) s = fence[1].trim();
    // direct parse
    try {
      return JSON.parse(s);
    } catch (_) {
      /* fallthrough */
    }
    // find first object
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(s.slice(start, end + 1));
    }
    throw new Error("JSON 파싱 실패");
  }

  function normalizeSectionItems(arr, count) {
    if (!Array.isArray(arr)) return [];
    const out = [];
    const seen = new Set();
    for (const raw of arr) {
      let t = String(raw ?? "")
        .replace(/^[\s\-•*·]+/, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!t) continue;
      if (t.length > 80) t = t.slice(0, 80);
      const key = t.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
      if (out.length >= count) break;
    }
    return out;
  }

  async function callOpenAICompatible({ baseUrl, apiKey, model, system, user }) {
    const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        // some providers support this
        response_format: { type: "json_object" },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        data?.error?.message || data?.message || data?.error || `${res.status} ${res.statusText}`;
      // retry without response_format if rejected
      if (String(msg).toLowerCase().includes("response_format") || res.status === 400) {
        const res2 = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.7,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          }),
        });
        const data2 = await res2.json().catch(() => ({}));
        if (!res2.ok) {
          throw new Error(
            data2?.error?.message || data2?.message || `${res2.status} ${res2.statusText}`
          );
        }
        return data2?.choices?.[0]?.message?.content || "";
      }
      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
    return data?.choices?.[0]?.message?.content || "";
  }

  async function callAnthropic({ apiKey, model, system, user }) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        temperature: 0.7,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error?.message || data?.message || `${res.status} ${res.statusText}`);
    }
    const parts = data?.content || [];
    return parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n");
  }

  async function callGemini({ apiKey, model, system, user }) {
    const m = model || "gemini-3.6-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      m
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        data?.error?.message || data?.message || `${res.status} ${res.statusText}`
      );
    }
    const parts = data?.candidates?.[0]?.content?.parts || [];
    return parts.map((p) => p.text || "").join("\n");
  }

  async function callLLM(system, user) {
    readAiSettingsFromUI();
    const { provider, model, apiKey, baseUrl } = aiSettings;
    if (provider === "openai") {
      return callOpenAICompatible({
        baseUrl: "https://api.openai.com/v1",
        apiKey,
        model: model || "gpt-5.6-luna",
        system,
        user,
      });
    }
    if (provider === "grok") {
      return callOpenAICompatible({
        baseUrl: "https://api.x.ai/v1",
        apiKey,
        model: model || "grok-4.5",
        system,
        user,
      });
    }
    if (provider === "custom") {
      return callOpenAICompatible({
        baseUrl: baseUrl || "https://api.openai.com/v1",
        apiKey,
        model: model || "gpt-5.6-luna",
        system,
        user,
      });
    }
    if (provider === "anthropic") {
      return callAnthropic({
        apiKey,
        model: model || "claude-sonnet-5",
        system,
        user,
      });
    }
    if (provider === "gemini") {
      return callGemini({
        apiKey,
        model: model || "gemini-3.6-flash",
        system,
        user,
      });
    }
    throw new Error("지원하지 않는 프로바이더입니다.");
  }

  function applySectionCards(section, items, mode) {
    const cleaned = items.filter(Boolean);
    if (!cleaned.length) return 0;
    if (mode === "append") {
      const cur = state.cards[section] || [];
      const existing = new Set(cur.map((t) => t.toLowerCase()));
      const merged = [...cur];
      for (const t of cleaned) {
        if (existing.has(t.toLowerCase())) continue;
        merged.push(t);
        existing.add(t.toLowerCase());
        if (merged.length >= 50) break;
      }
      state.cards[section] = merged;
      return merged.length - cur.length;
    }
    state.cards[section] = cleaned.slice(0, 50);
    return cleaned.length;
  }

  function markCellsLoading(sections, on) {
    sections.forEach((s) => {
      const cell = els.canvas.querySelector(`.cell[data-section="${s}"]`);
      if (cell) cell.classList.toggle("ai-loading", on);
    });
  }

  async function aiFillAll() {
    if (aiBusy) return;
    if (!ensureApiKey()) return;

    const count = Math.min(6, Math.max(3, Number(els.aiCount.value) || 4));
    const mode = els.aiMode.value === "append" ? "append" : "replace";

    if (
      mode === "replace" &&
      hasAnyCards() &&
      !confirm("AI 결과로 9개 영역을 덮어쓸까요? (기존 카드가 대체됩니다)")
    ) {
      return;
    }

    setAiBusy(true, "9개 영역 아이디어 생성 중…");
    markCellsLoading(SECTIONS, true);
    setStatus("AI가 캔버스를 작성하는 중…");

    try {
      const raw = await callLLM(buildSystemPrompt(), buildAllSectionsUserPrompt(count));
      const data = extractJson(raw);
      let total = 0;
      SECTIONS.forEach((s) => {
        const items = normalizeSectionItems(data[s], count);
        total += applySectionCards(s, items, mode);
      });

      const name = (els.aiName.value || "").trim();
      if (name && mode === "replace") {
        state.title = name.slice(0, 60);
      }

      save();
      render();
      setStatus(`AI 채우기 완료 · ${total}개 카드 반영`);
    } catch (err) {
      console.error(err);
      const msg = err?.message || String(err);
      setStatus("AI 요청 실패", "error");
      alert(
        `AI 요청에 실패했습니다.\n\n${msg}\n\n· API 키/모델/네트워크를 확인하세요.\n· 브라우저 CORS 제한이 있는 프로바이더는 커스텀 프록시 Base URL을 사용할 수 있습니다.`
      );
    } finally {
      markCellsLoading(SECTIONS, false);
      setAiBusy(false);
    }
  }

  async function aiFillSection() {
    if (aiBusy) return;
    if (!ensureApiKey()) return;

    const section = els.section.value;
    if (!SECTIONS.includes(section)) return;

    const count = Math.min(6, Math.max(3, Number(els.aiCount.value) || 4));
    const mode = els.aiMode.value === "append" ? "append" : "replace";

    if (
      mode === "replace" &&
      (state.cards[section] || []).length &&
      !confirm(`「${SECTION_LABELS[section]}」 카드를 AI 결과로 덮어쓸까요?`)
    ) {
      return;
    }

    setAiBusy(true, `「${SECTION_LABELS[section]}」 생성 중…`);
    markCellsLoading([section], true);
    setStatus(`AI가 ${SECTION_LABELS[section]} 작성 중…`);

    try {
      const raw = await callLLM(buildSystemPrompt(), buildOneSectionUserPrompt(section, count));
      const data = extractJson(raw);
      const items = normalizeSectionItems(data[section] ?? data.items ?? data.cards, count);
      if (!items.length) throw new Error("생성된 항목이 없습니다. 모델을 바꿔 다시 시도해 주세요.");
      const n = applySectionCards(section, items, mode);
      save();
      render();
      setStatus(`「${SECTION_LABELS[section]}」 AI 채우기 완료 · ${n}개`);
    } catch (err) {
      console.error(err);
      const msg = err?.message || String(err);
      setStatus("AI 요청 실패", "error");
      alert(`AI 요청에 실패했습니다.\n\n${msg}`);
    } finally {
      markCellsLoading([section], false);
      setAiBusy(false);
    }
  }


  /* ===================== Framework Insight Engine ===================== */

  function selectedFrameworkIds() {
    if (!els.fwGrid) return [];
    return [...els.fwGrid.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value);
  }

  function setInsightBusy(busy, text) {
    insightBusy = busy;
    if (els.btnRunInsights) els.btnRunInsights.disabled = busy;
    if (els.insightProgress) els.insightProgress.classList.toggle("hidden", !busy);
    if (text && els.insightProgressText) els.insightProgressText.textContent = text;
  }

  function saveInsights() {
    try {
      if (insightState) localStorage.setItem(INSIGHT_KEY, JSON.stringify(insightState));
      else localStorage.removeItem(INSIGHT_KEY);
    } catch (e) {
      console.warn(e);
    }
  }

  function loadInsights() {
    try {
      const raw = localStorage.getItem(INSIGHT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function bmcSnapshot() {
    const { name, context } = getAcademyBrief();
    const competitors = getCompetitorBrief();
    return {
      title: state.title,
      academyName: name,
      context,
      cards: state.cards,
      competitors,
    };
  }

  function joinCards(section, fallback = "데이터 없음") {
    const arr = state.cards[section] || [];
    return arr.length ? arr.join(" · ") : fallback;
  }

  /** Local heuristic analysis when no API key / offline */
  function heuristicFramework(id) {
    const fw = FRAMEWORKS[id];
    const vp = state.cards.vp || [];
    const cs = state.cards.cs || [];
    const ch = state.cards.ch || [];
    const cr = state.cards.cr || [];
    const cost = state.cards.cost || [];
    const rs = state.cards.rs || [];
    const kp = state.cards.kp || [];
    const ka = state.cards.ka || [];
    const kr = state.cards.kr || [];

    const pick = (arr, n = 2) => (arr.length ? arr.slice(0, n) : ["assumption: 데이터 보강 필요"]);
    const baseActions = [];

    const out = {
      id,
      title: fw.title,
      question: fw.question,
      mode: "heuristic",
      columns: {},
      findings: [],
      risks: [],
      opportunities: [],
      actions: [],
    };

    if (id === "swot") {
      out.columns = {
        strengths: pick(vp.concat(kr), 3),
        weaknesses: [
          cost.length ? `비용 압박: ${cost[0]}` : "assumption: 고정비 구조 점검 필요",
          cs.length < 2 ? "고객 세그먼트 정의가 좁거나 불명확" : "세그먼트별 전환율 데이터 부재 가능",
        ],
        opportunities: pick(ch.concat(cs), 3),
        threats: [
          "인근 대형 프랜차이즈/온라인 대체재 경쟁",
          "강사 이탈·시즌 수요 변동",
        ],
      };
      out.findings = [
        `가치제안 축: ${joinCards("vp")}`,
        `핵심자원 축: ${joinCards("kr")}`,
      ];
      out.opportunities = out.columns.opportunities.slice();
      out.risks = out.columns.threats.slice();
      out.actions = [
        { text: "상위 가치제안 1개를 상담 스크립트 첫 문장으로 고정", priority: "high", metric: "상담→등록 전환율", horizon: "30일", section: "cr" },
        { text: "약점 영역 비용 1개에 대해 단위당 원가 시트 작성", priority: "mid", metric: "학생 1인 공헌이익", horizon: "30일", section: "cost" },
        { text: "채널 1곳에 세그먼트별 메시지 A/B 테스트", priority: "mid", metric: "문의 수", horizon: "60일", section: "ch" },
      ];
    } else if (id === "porter") {
      out.columns = {
        rivalry: ["동일 상권 영어학원 가격·커리큘럼 경쟁 심화", "온라인 과외/앱 학습 대안 확산"],
        newEntrants: ["소형 스튜디오형 학원 진입 장벽 보통", "브랜드·강사 확보가 진입 병목"],
        substitutes: ["과외, 인강, AI 학습앱, 학교 방과후"],
        buyerPower: ["학부모 정보 탐색력 높음 → 가격·성과 민감", "재등록 협상력 존재"],
        supplierPower: [kp[0] ? `파트너 의존: ${kp[0]}` : "교재/강사 공급 협상력 중간"],
      };
      out.findings = ["구매자(학부모) 교섭력이 높아 성과 증빙이 핵심 방어 자산"];
      out.risks = ["가격 경쟁 고착 시 마진 하락"];
      out.opportunities = ["세그먼트 전문화로 경쟁 강도 회피"];
      out.actions = [
        { text: "경쟁 학원 3곳 대비 성과 증빙(리포트 샘플) 패키지화", priority: "high", metric: "상담 자료 사용률", horizon: "30일", section: "vp" },
        { text: "대체재 대비 차별점 1줄을 랜딩/전단지 상단 고정", priority: "mid", metric: "문의 전환", horizon: "30일", section: "ch" },
      ];
    } else if (id === "blue-ocean") {
      out.columns = {
        eliminate: ["실속 없는 과도한 경품성 이벤트", "성과와 무관한 일방적 공지성 소통"],
        reduce: ["저효율 전단지 살포 비중", "모든 학생 동일 숙제량"],
        raise: pick(vp.concat(cr), 3),
        create: ["주간 학습 데이터 대시보드", "학부모-학생 목표 공동 계약서", "졸업/진학 로드맵 클리닉"],
      };
      out.findings = ["증가(Raise)는 기존 가치제안 강화, 창조(Create)는 새 카테고리 실험"];
      out.actions = [
        { text: "ERRC 중 Create 1개를 4주 파일럿으로 설계", priority: "high", metric: "파일럿 참여 수", horizon: "30일", section: "ka" },
        { text: "Reduce 대상 채널 예산을 고성과 채널로 재배분", priority: "mid", metric: "CAC", horizon: "60일", section: "ch" },
      ];
    } else if (id === "jtbd") {
      out.columns = {
        functional: cs.length ? cs.map((c) => `${c}의 성적/스킬 목표 달성`) : ["내신 등급 향상", "말하기 자신감"],
        emotional: ["불안 감소(학부모)", "성취감·자신감(학생)"],
        social: ["주변 학부모 인정", "학교/또래 내 유능감 신호"],
        hireCriteria: pick(vp.concat(cr), 3),
      };
      out.findings = ["고용 기준이 가치제안·고객관계 카드와 일치하는지 점검 필요"];
      out.actions = [
        { text: "상담 시 JTBD 질문 3개 체크리스트 도입", priority: "high", metric: "니즈 파악 완성도", horizon: "14일", section: "cr" },
        { text: "세그먼트별 Job 문구를 광고 헤드라인에 반영", priority: "mid", metric: "CTR/문의", horizon: "30일", section: "ch" },
      ];
    } else if (id === "ansoff") {
      out.columns = {
        marketPenetration: ["재원생 추천 이벤트", "형제 할인", "레벨 업셀"],
        marketDevelopment: ["인접 학년 확장", "인근 단지 신규 상권"],
        productDevelopment: pick(vp.concat(ka), 3),
        diversification: ["학습 코칭 구독", "학부모 교육 워크숍", "B2B 방과후"],
      };
      out.findings = ["1순위는 침투(기존 고객 심화), 2순위 제품개발이 리스크 대비 효율적"];
      out.actions = [
        { text: "재원생 추천 프로그램 설계(보상·추적)", priority: "high", metric: "추천 등록 수", horizon: "30일", section: "rs" },
        { text: "기존 세그먼트용 부가 상품 1개 MVP", priority: "mid", metric: "부가매출", horizon: "60일", section: "vp" },
      ];
    } else if (id === "okr") {
      out.columns = {
        objectives: ["등록 효율 개선", "학습 성과 가시화", "운영 마진 안정"],
        keyResults: [
          "상담→등록 전환율 +20%",
          "주간 리포트 오픈율 60%+",
          "학생 1인 공헌이익 +15%",
        ],
        initiatives: pick(ka.concat(cr), 3),
        risks: ["시즌 비수기 등록 공백", "강사 일정 병목"],
      };
      out.actions = [
        { text: "분기 OKR 보드를 주간 스탠드업에 연결", priority: "high", metric: "KR 진척률", horizon: "90일", section: "ka" },
        { text: "KR별 오너(원장/실장/강사) 지정", priority: "mid", metric: "책임 명확성", horizon: "14일", section: "kr" },
      ];
    } else if (id === "unit-econ") {
      out.columns = {
        revenueDrivers: pick(rs, 3),
        costDrivers: pick(cost, 3),
        metrics: ["LTV(평균 수강개월×월수강료)", "CAC(채널별)", "재등록률", "공헌이익/학생"],
        levers: ["평균 수강개월 연장", "저효율 채널 컷", "특강 패키지 부착", "정원 최적화"],
      };
      out.findings = ["수익 카드와 비용 카드를 학생 1인 단위로 환산해야 의사결정 속도가 오른다"];
      out.actions = [
        { text: "채널별 CAC 트래킹 시트 구축", priority: "high", metric: "CAC", horizon: "30일", section: "ch" },
        { text: "재등록 방어 캠페인(만료 4주 전)", priority: "high", metric: "재등록률", horizon: "60일", section: "cr" },
      ];
    } else if (id === "vpc") {
      out.columns = {
        customerJobs: pick(cs, 3),
        pains: ["성적 정체", "숙제 관리 부담", "정보 비대칭 불안"],
        gains: ["등급 상승", "시간 절약", "투명한 피드백"],
        painRelievers: pick(vp.concat(cr), 3),
        gainCreators: pick(vp.concat(ka), 3),
      };
      out.findings = ["pain reliever가 실제 CR/KA 활동과 연결되어야 가치 전달이 완성된다"];
      out.actions = [
        { text: "고통(Pain) 1개에 대응하는 관리 루틴을 주간 운영에 삽입", priority: "high", metric: "만족도/재등록", horizon: "30일", section: "ka" },
        { text: "이득(Gain) 증빙 사례 3건 수집해 상담 덱에 추가", priority: "mid", metric: "등록 전환", horizon: "30일", section: "vp" },
      ];
    } else if (id === "competitor") {
      const brief = getCompetitorBrief();
      const rivals = brief.names;
      const r0 = rivals[0] || "주요 경쟁사";
      const r1 = rivals[1] || "대안 경쟁자";
      out.columns = {
        set: rivals.map((n, i) => `${i + 1}. ${n}`).concat([`메모: ${brief.notes}`]).slice(0, 6),
        ourEdge: pick(vp.concat(cr).concat(kr), 4),
        theirEdge: [
          `${r0}: 브랜드·규모 또는 인지도 우위 가능`,
          `${r1}: 특정 세그먼트(내신/회화) 특화 가능`,
          "온라인 대안: 낮은 가격·시간 유연성",
        ],
        parity: [
          "기본 교재·정규 수업 운영",
          ch[0] ? `채널 존재감 (${ch[0]})` : "지역 오프라인 채널",
          "학부모 상담 프로세스",
        ],
        gaps: [
          "경쟁사 대비 성과 증빙(전후 성적) 패키지 부족 가능",
          "가격 대비 가치 한 줄 메시지 미고정",
          "채널별 전환 데이터 트래킹 공백",
        ],
        priceValue: [
          rs[0] ? `우리 수익축: ${rs[0]}` : "assumption: 월 수강료 포지션 명시 필요",
          "프리미엄(관리 강도) vs 가성비(온라인) 스펙트럼에서 위치 선택",
          cost[0] ? `비용 제약: ${cost[0]}` : "원가 구조에 맞는 가격 밴드 설정",
        ],
        winThemes: pick(vp, 3)
          .concat(["주간 리포트 기반 불안 제거 메시지", "세그먼트별 Before→After 사례"])
          .slice(0, 4),
        watchMoves: [
          `${r0} 수강료·프로모션 변동`,
          "맘카페·입소문 키워드 변화",
          "신규 원어민/AI 학습 상품 출시",
          "관리 시간·셔틀·부가 서비스 확대 여부",
        ],
      };
      out.findings = [
        `비교군 ${rivals.length}곳 기준, 우리 우위는 가치제안·관계 관리에서 먼저 입증`,
        "Parity는 유지하고 Gap 1~2개만 집중 투자하는 것이 ROI에 유리",
      ];
      out.risks = [
        `${r0}의 가격 인하·프로모션 시 전환율 방어 필요`,
        "온라인 대안의 '편의성' 프레임에 말리면 관리 가치가 저평가됨",
      ];
      out.opportunities = [
        "세그먼트 특화 메시지로 전면 경쟁 회피",
        "성과 증빙 콘텐츠가 상담·채널 공통 자산이 됨",
      ];
      out.actions = [
        {
          text: `${r0} 포함 경쟁사 3곳 1페이지 벤치 시트(가격·커리큘럼·관리·채널) 작성`,
          priority: "high",
          metric: "벤치 시트 완성",
          horizon: "14일",
          section: "vp",
        },
        {
          text: "우리 우위 1개를 상담 오프닝·광고 헤드라인에 동일 문구로 고정",
          priority: "high",
          metric: "상담→등록 전환율",
          horizon: "30일",
          section: "ch",
        },
        {
          text: "상대 우위 항목 중 1개를 저비용으로 패리티 달성(또는 무시 결정 문서화)",
          priority: "mid",
          metric: "갭 클로즈 여부",
          horizon: "60일",
          section: "ka",
        },
        {
          text: "월 1회 경쟁 시그널 리뷰(가격·후기·신규 상품) 캘린더 고정",
          priority: "mid",
          metric: "리뷰 실행률",
          horizon: "90일",
          section: "cr",
        },
      ];
    } else if (id === "pdca") {
      const brief = getAcademyBrief();
      const topVp = vp[0] || "핵심 가치제안";
      const topKa = ka[0] || "핵심 운영 활동";
      const topCr = cr[0] || "학부모 소통";
      const topCh = ch[0] || "주요 채널";
      out.columns = {
        plan: [
          `목표: ${topVp} 전달력 강화 및 등록/재등록 개선`,
          `가설: ${topCr}를 표준화하면 상담 전환이 오른다`,
          cs[0] ? `타깃 세그먼트 고정: ${cs[0]}` : "타깃 세그먼트 1개로 실험 범위 한정",
          "성공 기준·기간·오너를 한 장에 명시",
        ],
        do: [
          `2~4주 실행: ${topKa}`,
          topCh ? `채널 실험: ${topCh} 메시지/오퍼 1안` : "채널 1곳에서 오퍼 실험",
          "상담 스크립트·주간 리포트 템플릿 실제 적용",
          "변경 로그(언제·무엇을) 간단 기록",
        ],
        check: [
          "선행지표: 문의 수, 상담 수, 등록 전환율",
          "후행지표: 재등록률, 이탈 사유",
          "학습 성과 가시화(리포트 오픈/반응)",
          "가정(assumption) 대비 실제 갭 메모",
        ],
        act: [
          "효과 큰 실행은 표준 프로세스로 고정",
          "효과 없는 활동은 축소·중단",
          "다음 사이클 가설 1개로 재정의",
          "BMC 카드(VP/CR/CH/KA) 문구 갱신",
        ],
        cadence: ["주간: 지표 15분 리뷰 (Check)", "월간: 실험 회고 + Act 결정", "분기: 목표·세그먼트 재정렬 (Plan 재설정)"],
        owners: ["원장: 목표·우선순위·중단 결정", "실장/상담: Do 실행·데이터 입력", "강사: 수업·관리 품질 Check 입력"],
        metrics: [
          "상담→등록 전환율",
          "채널별 문의→상담 전환",
          "재등록률 / 중도하차율",
          rs[0] ? `수익 지표: ${rs[0]} 관련 객단가` : "학생 1인 공헌이익",
        ],
        backlog: ["다음 실험 후보 3개 백로그화", "실패 실험 학습 1줄 기록", "표준화된 Playbook 항목 +1"],
      };
      out.findings = [
        "PDCA는 전략을 운영 리듬으로 바꾸는 장치 — Plan만 있고 Check가 없으면 개선이 쌓이지 않음",
        `${brief.name} 맥락에서 1사이클 = 하나의 가설 + 하나의 지표가 이상적`,
      ];
      out.risks = ["동시에 너무 많은 실험을 돌려 Check가 형식화됨", "지표 없는 Do는 활동량만 늘리고 학습이 없음"];
      out.opportunities = [
        "주간 Check 루틴이 경쟁 대응 속도보다 빨라지면 운영 우위가 됨",
        "Act 결과를 BMC 카드에 환원하면 조직 학습이 자산화됨",
      ];
      out.actions = [
        { text: "이번 주 PDCA 1사이클 시트를 만들고 가설·지표·오너·기한 기입", priority: "high", metric: "PDCA 시트 작성률", horizon: "7일", section: "ka" },
        { text: "주간 15분 Check 미팅 고정(전환율·문의·재등록 3지표)", priority: "high", metric: "주간 리뷰 실행률", horizon: "30일", section: "cr" },
        { text: "실험 1건 Do 후 Act로 표준화 또는 폐기 결정 문서화", priority: "mid", metric: "실험 완결 수", horizon: "30일", section: "vp" },
        { text: "월간 Act 결과를 채널 메시지/상담 스크립트에 반영", priority: "mid", metric: "메시지 갱신 주기", horizon: "60일", section: "ch" },
      ];
    }

    out.actions.forEach((a) => {
      a.framework = id;
    });
    return out;
  }

  function buildInsightSystemPrompt() {
    return [
      "당신은 한국 영어학원 전문 전략 컨설턴트다.",
      "입력된 Business Model Canvas를 지정된 비즈니스 프레임워크로 분석한다.",
      "추상론 금지. 원장이 바로 실험할 수 있는 구체적 인사이트/액션만 한국어로 작성.",
      "반드시 유효한 JSON만 출력. 마크다운 코드블록 금지.",
    ].join(" ");
  }

  function buildInsightUserPrompt(ids) {
    const snap = bmcSnapshot();
    const specs = ids.map((id) => {
      const fw = FRAMEWORKS[id];
      return {
        id,
        title: fw.title,
        question: fw.question,
        columns: fw.columns,
        labels: fw.labels,
      };
    });
    return `영어학원 BMC를 다음 프레임워크들로 분석하라.

학원: ${snap.academyName}
컨텍스트: ${snap.context}
BMC 제목: ${snap.title}
경쟁사/대안: ${(snap.competitors?.names || []).join(", ")}
경쟁 관찰 메모: ${snap.competitors?.notes || ""}
BMC 카드 JSON:
${JSON.stringify(snap.cards, null, 2)}

분석할 프레임워크:
${JSON.stringify(specs, null, 2)}

출력 JSON 스키마:
{
  "summary": {
    "headline": "한 줄 진단",
    "strategicPosition": "포지션 요약",
    "biggestRisk": "최대 리스크",
    "biggestOpportunity": "최대 기회"
  },
  "frameworks": [
    {
      "id": "swot",
      "title": "SWOT",
      "findings": ["..."],
      "risks": ["..."],
      "opportunities": ["..."],
      "columns": { "strengths": ["..."], "weaknesses": ["..."] },
      "actions": [
        { "text": "...", "priority": "high|mid|low", "metric": "...", "horizon": "30일", "section": "vp" }
      ]
    }
  ],
  "actions": [
    { "text": "통합 Top 액션", "priority": "high", "metric": "...", "horizon": "30일", "section": "cr", "framework": "swot" }
  ]
}

규칙:
- frameworks 배열은 요청 id를 모두 포함
- 각 framework columns 키는 스펙의 columns를 사용
- 각 framework actions 2~4개, 통합 actions 5개
- section은 kp|ka|kr|vp|cr|ch|cs|cost|rs 중 하나
- 가정은 문장 앞에 assumption: 표기
- competitor 프레임워크가 포함되면 columns에 set/ourEdge/theirEdge/parity/gaps/priceValue/winThemes/watchMoves를 채우고, 실제 경쟁사 이름을 문장에 넣어라
- 경쟁사 벤치마크 actions는 조사·메시지·패리티/차별화 실험으로 구체화
- pdca 프레임워크가 포함되면 columns에 plan/do/check/act/cadence/owners/metrics/backlog를 채우고, 한 사이클=한 가설·한 지표 원칙을 지켜라
- PDCA actions는 주간 Check 루틴, 실험 시트, 표준화/폐기 결정 등 운영 루프로 구체화`;
  }

  function normalizeInsightPayload(data, ids, mode) {
    const frameworks = [];
    const list = Array.isArray(data?.frameworks) ? data.frameworks : [];
    ids.forEach((id) => {
      const fw = FRAMEWORKS[id];
      const found = list.find((x) => x && (x.id === id || x.title === fw.title)) || {};
      const columns = {};
      fw.columns.forEach((col) => {
        const raw = (found.columns && found.columns[col]) || found[col] || [];
        columns[col] = normalizeSectionItems(raw, 6);
      });
      const item = {
        id,
        title: fw.title,
        question: fw.question,
        mode,
        columns,
        findings: normalizeSectionItems(found.findings || [], 6),
        risks: normalizeSectionItems(found.risks || [], 6),
        opportunities: normalizeSectionItems(found.opportunities || [], 6),
        actions: Array.isArray(found.actions)
          ? found.actions.slice(0, 6).map((a) => normalizeAction(a, id))
          : [],
      };
      if (!item.actions.length) {
        // fallback fill from heuristic actions if AI omitted
        item.actions = heuristicFramework(id).actions;
      }
      frameworks.push(item);
    });

    let actions = Array.isArray(data?.actions)
      ? data.actions.slice(0, 8).map((a) => normalizeAction(a, a.framework || ids[0]))
      : [];
    if (!actions.length) {
      actions = frameworks.flatMap((f) => f.actions).slice(0, 5);
    }
    // dedupe by text
    const seen = new Set();
    actions = actions.filter((a) => {
      const k = a.text.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    const summary = {
      headline: String(data?.summary?.headline || frameworks[0]?.findings?.[0] || "BMC 기반 전략 진단 완료").slice(0, 120),
      strategicPosition: String(data?.summary?.strategicPosition || joinCards("vp")).slice(0, 160),
      biggestRisk: String(data?.summary?.biggestRisk || frameworks[0]?.risks?.[0] || "리스크 데이터 보완 필요").slice(0, 160),
      biggestOpportunity: String(data?.summary?.biggestOpportunity || frameworks[0]?.opportunities?.[0] || "기회 데이터 보완 필요").slice(0, 160),
    };

    return {
      generatedAt: new Date().toISOString(),
      mode,
      academy: getAcademyBrief(),
      title: state.title,
      frameworks,
      actions,
      summary,
    };
  }

  function normalizeAction(a, frameworkId) {
    if (typeof a === "string") {
      return {
        text: a.trim().slice(0, 120),
        priority: "mid",
        metric: "정의 필요",
        horizon: "30일",
        section: "vp",
        framework: frameworkId,
      };
    }
    const section = SECTIONS.includes(a?.section) ? a.section : "vp";
    const pr = String(a?.priority || "mid").toLowerCase();
    return {
      text: String(a?.text || a?.action || "").trim().slice(0, 120) || "액션 보완 필요",
      priority: pr === "high" || pr === "low" ? pr : "mid",
      metric: String(a?.metric || "정의 필요").slice(0, 60),
      horizon: String(a?.horizon || "30일").slice(0, 20),
      section,
      framework: a?.framework || frameworkId,
    };
  }

  async function analyzeWithAI(ids) {
    const raw = await callLLM(buildInsightSystemPrompt(), buildInsightUserPrompt(ids));
    const data = extractJson(raw);
    return normalizeInsightPayload(data, ids, "ai");
  }

  function analyzeWithHeuristic(ids) {
    const frameworks = ids.map((id) => heuristicFramework(id));
    const actions = [];
    const seen = new Set();
    frameworks.forEach((f) => {
      (f.actions || []).forEach((a) => {
        const k = a.text.toLowerCase();
        if (seen.has(k)) return;
        seen.add(k);
        actions.push(a);
      });
    });
    return normalizeInsightPayload(
      {
        summary: {
          headline: "로컬 휴리스틱 기반 1차 전략 진단",
          strategicPosition: `가치제안 중심: ${joinCards("vp")}`,
          biggestRisk: actions[0] ? "실행 우선순위 분산 위험" : "데이터 공백",
          biggestOpportunity: joinCards("ch", "채널 실험 여지"),
        },
        frameworks,
        actions: actions.slice(0, 5),
      },
      ids,
      "heuristic"
    );
  }

  async function runInsights() {
    if (insightBusy) return;
    const ids = selectedFrameworkIds().filter((id) => FRAMEWORKS[id]);
    if (!ids.length) {
      alert("분석할 프레임워크를 하나 이상 선택하세요.");
      return;
    }
    if (!hasAnyCards()) {
      if (!confirm("캔버스가 비어 있습니다. 샘플 데이터로 채운 뒤 분석할까요?")) return;
      // load sample without confirm loop
      state = {
        title: SAMPLE.title,
        cards: Object.fromEntries(SECTIONS.map((s) => [s, [...(SAMPLE.cards[s] || [])]])),
      };
      save();
      render();
    }

    saveCompetitorBrief();
    setInsightBusy(true, `${ids.length}개 프레임워크 분석 중…`);
    setStatus("프레임워크 인사이트 생성 중…");

    try {
      let result;
      // Prefer AI if key present; else heuristic
      readAiSettingsFromUI();
      if (aiSettings.apiKey) {
        try {
          result = await analyzeWithAI(ids);
        } catch (err) {
          console.warn("AI insight failed, fallback heuristic", err);
          result = analyzeWithHeuristic(ids);
          result.mode = "heuristic-fallback";
          result.summary.headline = `AI 실패로 로컬 진단 전환 · ${result.summary.headline}`;
        }
      } else {
        result = analyzeWithHeuristic(ids);
      }
      insightState = result;
      saveInsights();
      renderInsights();
      setStatus(`인사이트 완료 · ${result.mode} · ${result.frameworks.length}개 프레임워크`);
    } catch (err) {
      console.error(err);
      alert(`인사이트 분석 실패\n\n${err?.message || err}`);
      setStatus("인사이트 실패", "error");
    } finally {
      setInsightBusy(false);
    }
  }

  function renderInsights() {
    if (!els.insightBoard) return;
    if (!insightState) {
      els.insightBoard.hidden = true;
      return;
    }
    els.insightBoard.hidden = false;
    const s = insightState.summary || {};
    const when = new Date(insightState.generatedAt).toLocaleString("ko-KR");
    els.insightMeta.textContent = `${when} · 모드: ${insightState.mode} · ${insightState.frameworks.length}개 프레임워크`;

    els.insightSummary.innerHTML = [
      ["한 줄 진단", s.headline],
      ["전략 포지션", s.strategicPosition],
      ["최대 리스크", s.biggestRisk],
      ["최대 기회", s.biggestOpportunity],
    ]
      .map(
        ([label, value]) =>
          `<div class="summary-card"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(
            value || "-"
          )}</div></div>`
      )
      .join("");

    // tabs + panels
    els.insightTabs.innerHTML = "";
    els.insightPanels.innerHTML = "";
    insightState.frameworks.forEach((fw, idx) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "insight-tab" + (idx === 0 ? " active" : "");
      tab.textContent = fw.title;
      tab.dataset.target = fw.id;
      tab.addEventListener("click", () => {
        els.insightTabs.querySelectorAll(".insight-tab").forEach((t) => t.classList.remove("active"));
        els.insightPanels.querySelectorAll(".insight-panel").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        const panel = els.insightPanels.querySelector(`[data-panel="${fw.id}"]`);
        if (panel) panel.classList.add("active");
      });
      els.insightTabs.appendChild(tab);

      const panel = document.createElement("div");
      panel.className = "insight-panel" + (idx === 0 ? " active" : "");
      panel.dataset.panel = fw.id;
      const cols = FRAMEWORKS[fw.id]?.columns || Object.keys(fw.columns || {});
      const labels = FRAMEWORKS[fw.id]?.labels || {};
      const colHtml = cols
        .map((c) => {
          const items = fw.columns?.[c] || [];
          return `<div class="insight-col"><h4>${escapeHtml(labels[c] || c)}</h4><ul>${
            items.length
              ? items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")
              : "<li class='muted'>항목 없음</li>"
          }</ul></div>`;
        })
        .join("");
      const actHtml = (fw.actions || [])
        .map((a) => `<li><strong>[${escapeHtml(a.priority)}]</strong> ${escapeHtml(a.text)} <span class="muted">· ${escapeHtml(a.metric)} · ${escapeHtml(a.horizon)}</span></li>`)
        .join("");
      panel.innerHTML = `
        <h3>${escapeHtml(fw.title)}</h3>
        <p class="fw-question">${escapeHtml(fw.question || "")}</p>
        <div class="insight-cols">${colHtml}</div>
        <div class="insight-col" style="margin-top:10px">
          <h4>프레임워크 액션</h4>
          <ul>${actHtml || "<li>없음</li>"}</ul>
        </div>`;
      els.insightPanels.appendChild(panel);
    });

    // roadmap table
    const rows = (insightState.actions || [])
      .map((a, i) => {
        const badge = `<span class="badge-priority ${escapeHtml(a.priority)}">${escapeHtml(a.priority)}</span>`;
        return `<tr>
          <td>${i + 1}</td>
          <td>${badge}</td>
          <td>${escapeHtml(a.text)}</td>
          <td>${escapeHtml(a.metric)}</td>
          <td>${escapeHtml(a.horizon)}</td>
          <td>${escapeHtml((SECTION_LABELS[a.section] || a.section) + "")}</td>
          <td>${escapeHtml(a.framework || "")}</td>
        </tr>`;
      })
      .join("");
    els.insightRoadmap.innerHTML = `
      <h3>Top 실행 로드맵</h3>
      <table class="action-table">
        <thead><tr><th>#</th><th>우선</th><th>액션</th><th>지표</th><th>기간</th><th>BMC 영역</th><th>출처</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="7">액션 없음</td></tr>'}</tbody>
      </table>`;
  }

  function exportInsights() {
    if (!insightState) {
      alert("먼저 프레임워크 분석을 실행하세요.");
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    // JSON
    const jsonBlob = new Blob([JSON.stringify(insightState, null, 2)], { type: "application/json" });
    const a1 = document.createElement("a");
    a1.href = URL.createObjectURL(jsonBlob);
    a1.download = `bmc-insights-${stamp}.json`;
    a1.click();
    URL.revokeObjectURL(a1.href);

    // Markdown briefing
    const md = insightsToMarkdown(insightState);
    const mdBlob = new Blob([md], { type: "text/markdown" });
    const a2 = document.createElement("a");
    a2.href = URL.createObjectURL(mdBlob);
    a2.download = `bmc-insights-${stamp}.md`;
    a2.click();
    URL.revokeObjectURL(a2.href);
    setStatus("인사이트 JSON/MD 내보내기 완료");
  }

  function insightsToMarkdown(data) {
    const lines = [];
    lines.push(`# ${data.title || "BMC"} 전략 인사이트 브리핑`);
    lines.push("");
    lines.push(`- 생성: ${data.generatedAt}`);
    lines.push(`- 모드: ${data.mode}`);
    lines.push(`- 학원: ${data.academy?.name || ""}`);
    lines.push("");
    lines.push("## Executive Summary");
    lines.push(`- 진단: ${data.summary?.headline || ""}`);
    lines.push(`- 포지션: ${data.summary?.strategicPosition || ""}`);
    lines.push(`- 리스크: ${data.summary?.biggestRisk || ""}`);
    lines.push(`- 기회: ${data.summary?.biggestOpportunity || ""}`);
    lines.push("");
    (data.frameworks || []).forEach((fw) => {
      lines.push(`## ${fw.title}`);
      lines.push(`> ${fw.question || ""}`);
      lines.push("");
      const labels = FRAMEWORKS[fw.id]?.labels || {};
      Object.keys(fw.columns || {}).forEach((c) => {
        lines.push(`### ${labels[c] || c}`);
        (fw.columns[c] || []).forEach((i) => lines.push(`- ${i}`));
        lines.push("");
      });
    });
    lines.push("## Top Actions");
    (data.actions || []).forEach((a, i) => {
      lines.push(`${i + 1}. **[${a.priority}]** ${a.text} (${a.metric}, ${a.horizon}, ${a.section})`);
    });
    lines.push("");
    return lines.join("\n");
  }

  function applyActionsToCanvas() {
    if (!insightState?.actions?.length) {
      alert("적용할 액션이 없습니다.");
      return;
    }
    let n = 0;
    insightState.actions.slice(0, 5).forEach((a) => {
      const section = SECTIONS.includes(a.section) ? a.section : "vp";
      const text = `▶ ${a.text}`.slice(0, 80);
      if (!state.cards[section]) state.cards[section] = [];
      if (state.cards[section].some((t) => t === text)) return;
      if (state.cards[section].length >= 50) return;
      state.cards[section].push(text);
      n++;
    });
    save();
    render();
    setStatus(`액션 ${n}개를 캔버스 카드로 추가했습니다`);
  }

  function clearInsights() {
    if (!insightState) return;
    if (!confirm("인사이트 결과를 삭제할까요?")) return;
    insightState = null;
    saveInsights();
    renderInsights();
    setStatus("인사이트 결과를 삭제했습니다");
  }

  function bindInsightEvents() {
    if (els.btnRunInsights) els.btnRunInsights.addEventListener("click", () => runInsights());
    if (els.btnExportInsights) els.btnExportInsights.addEventListener("click", () => exportInsights());
    if (els.btnApplyActions) els.btnApplyActions.addEventListener("click", () => applyActionsToCanvas());
    if (els.btnClearInsights) els.btnClearInsights.addEventListener("click", () => clearInsights());
    if (els.fwGrid) {
      els.fwGrid.addEventListener("change", () => {
        syncCompetitorBoxVisibility();
      });
    }
    if (els.competitorNames) {
      els.competitorNames.addEventListener("change", saveCompetitorBrief);
      els.competitorNames.addEventListener("blur", saveCompetitorBrief);
    }
    if (els.competitorNotes) {
      els.competitorNotes.addEventListener("change", saveCompetitorBrief);
      els.competitorNotes.addEventListener("blur", saveCompetitorBrief);
    }
    syncCompetitorBoxVisibility();
  }


  function bindAiEvents() {
    els.btnAiToggle.addEventListener("click", () => {
      els.aiSettings.classList.toggle("hidden");
    });

    els.aiProvider.addEventListener("change", () => {
      const p = els.aiProvider.value;
      els.customBaseWrap.classList.toggle("hidden", p !== "custom");
      if (!els.aiModel.value || Object.values(DEFAULT_MODELS).includes(els.aiModel.value)) {
        els.aiModel.value = DEFAULT_MODELS[p] || "";
      }
    });

    els.btnToggleKey.addEventListener("click", () => {
      const isPw = els.aiApiKey.type === "password";
      els.aiApiKey.type = isPw ? "text" : "password";
      els.btnToggleKey.textContent = isPw ? "숨김" : "보기";
    });

    els.btnAiSave.addEventListener("click", () => {
      readAiSettingsFromUI();
      saveAiSettings();
      setStatus(
        aiSettings.apiKey
          ? `API 설정 저장됨 · ${aiSettings.provider}/${aiSettings.model}`
          : "설정 저장됨 (API 키 없음)"
      );
    });

    els.btnAiClearKey.addEventListener("click", () => {
      if (!confirm("저장된 API 키를 삭제할까요?")) return;
      aiSettings.apiKey = "";
      els.aiApiKey.value = "";
      saveAiSettings();
      setStatus("API 키가 삭제되었습니다");
    });

    els.btnAiAll.addEventListener("click", () => aiFillAll());
    els.btnAiSection.addEventListener("click", () => aiFillSection());
  }

  function bindEvents() {
    els.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const section = els.section.value;
      const text = els.text.value;
      if (addCard(section, text)) {
        els.text.value = "";
        updateCharCount();
        els.text.focus();
      }
    });

    els.text.addEventListener("input", updateCharCount);

    els.text.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        els.form.requestSubmit();
      }
    });

    els.btnClear.addEventListener("click", clearAll);
    els.btnSample.addEventListener("click", loadSample);
    els.btnRename.addEventListener("click", renameTitle);
    els.btnExportJson.addEventListener("click", exportJson);
    els.btnExportPng.addEventListener("click", exportPng);

    els.btnImport.addEventListener("click", () => els.importFile.click());
    els.importFile.addEventListener("change", () => {
      const file = els.importFile.files && els.importFile.files[0];
      if (file) importJsonFile(file);
      els.importFile.value = "";
    });

    setupDropzones();
    bindAiEvents();
    bindInsightEvents();
  }

  function updateCharCount() {
    const n = els.text.value.length;
    els.charCount.textContent = `${n}/200`;
  }

  function init() {
    loadAiSettings();
    syncAiSettingsUI();
    const restored = load();
    bindEvents();
    render();
    updateCharCount();
    const keyHint = aiSettings.apiKey ? "API 키 준비됨" : "API 키 설정 필요";
    insightState = loadInsights();
    if (insightState) renderInsights();
    setStatus(restored ? `이전 내용 복원 · ${keyHint}` : `새 캔버스 · ${keyHint}`);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
