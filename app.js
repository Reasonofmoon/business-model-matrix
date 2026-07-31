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
    setStatus(restored ? `이전 내용 복원 · ${keyHint}` : `새 캔버스 · ${keyHint}`);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
