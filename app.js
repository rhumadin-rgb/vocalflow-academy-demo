const STORAGE_KEY = "vocalflow-demo-v1";
const today = new Date();
const todayKey = dateKey(today);
const monthKey = todayKey.slice(0, 7);

function dateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

const seed = {
  students: [
    { id: 1, name: "이지우", phone: "010-2841-5632", guardian: "이수연", guardianPhone: "010-9251-1004", level: "입시반", teacher: "박서연", monthlyFee: 320000, balance: 5, granted: 8, due: 0, noShows: 0 },
    { id: 2, name: "김민준", phone: "010-6190-4420", guardian: "김혜진", guardianPhone: "010-1120-4491", level: "취미반", teacher: "최도윤", monthlyFee: 240000, balance: 2, granted: 8, due: 240000, noShows: 1 },
    { id: 3, name: "박하늘", phone: "010-3312-8765", guardian: "박윤정", guardianPhone: "010-8812-7021", level: "입시반", teacher: "박서연", monthlyFee: 320000, balance: 6, granted: 8, due: 0, noShows: 0 },
    { id: 4, name: "정유나", phone: "010-5572-0391", guardian: "본인", guardianPhone: "010-5572-0391", level: "취미반", teacher: "이준호", monthlyFee: 240000, balance: 0, granted: 8, due: 240000, noShows: 2 },
    { id: 5, name: "오시은", phone: "010-7391-6612", guardian: "오지영", guardianPhone: "010-1083-2901", level: "입시반", teacher: "최도윤", monthlyFee: 320000, balance: 4, granted: 8, due: 0, noShows: 0 },
    { id: 6, name: "윤서준", phone: "010-4165-2981", guardian: "본인", guardianPhone: "010-4165-2981", level: "취미반", teacher: "이준호", monthlyFee: 240000, balance: 1, granted: 8, due: 240000, noShows: 0 },
    { id: 7, name: "한채원", phone: "010-2380-5538", guardian: "한미정", guardianPhone: "010-8371-3357", level: "입시반", teacher: "박서연", monthlyFee: 320000, balance: 7, granted: 8, due: 0, noShows: 0 }
  ],
  teachers: [
    { id: 1, name: "박서연", subject: "보컬 · 입시", phone: "010-2211-0101", rate: 35000, adjustment: 0, fixedRoom: "레슨실 A", fixedDays: [1, 2, 3, 4, 5] },
    { id: 2, name: "최도윤", subject: "보컬 · 취미", phone: "010-3382-1010", rate: 30000, adjustment: 0, fixedRoom: "레슨실 B", fixedDays: [1, 2, 3, 4, 5] },
    { id: 3, name: "이준호", subject: "보컬 · 작곡", phone: "010-9012-4250", rate: 32000, adjustment: 0, fixedRoom: "레슨실 C", fixedDays: [1, 2, 3, 4, 5] }
  ],
  lessons: [
    { id: 1, date: todayKey, time: "10:00", studentId: 1, teacher: "박서연", type: "입시 보컬", room: "레슨실 A", status: "present", feedback: { strengths: "호흡을 안정적으로 유지하면서 고음 구간을 끝까지 연결했어요.", focus: "후렴 첫 소절에서 턱과 목에 힘이 들어가지 않도록 유의해요.", homework: "느린 템포로 립트릴 5분, 후렴 구간을 녹음해 듣고 체크하기", updatedAt: todayKey } },
    { id: 2, date: todayKey, time: "11:00", studentId: 3, teacher: "박서연", type: "입시 보컬", room: "레슨실 A", status: "planned" },
    { id: 3, date: todayKey, time: "13:00", studentId: 2, teacher: "최도윤", type: "취미 보컬", room: "레슨실 B", status: "planned" },
    { id: 4, date: todayKey, time: "14:00", studentId: 5, teacher: "최도윤", type: "입시 보컬", room: "레슨실 B", status: "planned" },
    { id: 5, date: todayKey, time: "16:00", studentId: 4, teacher: "이준호", type: "취미 보컬", room: "레슨실 C", status: "planned" },
    { id: 6, date: todayKey, time: "17:00", studentId: 6, teacher: "이준호", type: "취미 보컬", room: "레슨실 C", status: "planned" },
    { id: 7, date: todayKey, time: "18:00", studentId: 7, teacher: "박서연", type: "입시 보컬", room: "레슨실 A", status: "planned" }
  ],
  bookings: [
    { id: 1, date: todayKey, start: "10:00", hours: 1, room: "연습실 1", person: "이지우", role: "원생", status: "booked" },
    { id: 2, date: todayKey, start: "11:00", hours: 1, room: "연습실 2", person: "강사 박서연", role: "강사", status: "booked" },
    { id: 3, date: todayKey, start: "13:00", hours: 2, room: "연습실 3", person: "김민준", role: "원생", status: "booked" },
    { id: 4, date: todayKey, start: "15:00", hours: 1, room: "연습실 1", person: "박하늘", role: "원생", status: "booked" },
    { id: 5, date: todayKey, start: "17:00", hours: 1, room: "연습실 2", person: "강사 최도윤", role: "강사", status: "booked" }
  ],
  transactions: [
    { id: 1, date: `${monthKey}-01`, kind: "수입", category: "수강료", detail: "월 수강료 납부", amount: 320000, recurring: false },
    { id: 2, date: `${monthKey}-02`, kind: "지출", category: "임대료", detail: "학원 월 임대료", amount: 1800000, recurring: true },
    { id: 3, date: `${monthKey}-03`, kind: "지출", category: "관리비", detail: "건물 관리비", amount: 280000, recurring: true },
    { id: 4, date: `${monthKey}-05`, kind: "수입", category: "연습실 대여", detail: "외부 연습실 이용료", amount: 90000, recurring: true },
    { id: 5, date: `${monthKey}-06`, kind: "지출", category: "공과금", detail: "전기·수도·인터넷", amount: 163000, recurring: true },
    { id: 6, date: `${monthKey}-08`, kind: "수입", category: "수강료", detail: "수강료 납부", amount: 240000, recurring: false }
  ],
  settings: { noShowLimit: 3, lessonRate: 30000, lastRecurringMonth: monthKey },
  users: [
    { id: 1, name: "김보이스", email: "owner@example.com", role: "owner", active: true },
    { id: 2, name: "박관리", email: "manager@example.com", role: "manager", active: true },
    { id: 3, name: "박서연", email: "teacher@example.com", role: "teacher", active: true },
    { id: 4, name: "이지우", email: "student@example.com", role: "student", active: true }
  ],
  activity: [
    { text: "<strong>이지우</strong> 학생의 출석이 기록되었어요.", time: "10:04", color: "green" },
    { text: "<strong>김민준</strong> 학생의 수강료가 미납 상태예요.", time: "09:30", color: "orange" },
    { text: "<strong>박서연</strong> 강사가 레슨실 A를 배정받았어요.", time: "어제", color: "" }
  ]
};

let state = loadState();
let currentPage = "dashboard";
let selectedDate = todayKey;
let studentSearch = "";
let toastTimer;
let viewingRole = localStorage.getItem("vocalflow-role") || "owner";
if (!["owner", "manager", "teacher", "student"].includes(viewingRole)) viewingRole = "owner";
const content = document.getElementById("appContent");

function applyMonthlyRecurring() {
  if (state.settings.lastRecurringMonth === monthKey) return;
  const templates = state.recurringTemplate || [...new Map(state.transactions.filter(item => item.recurring).map(item => [item.detail, item])).values()];
  const currentMonth = new Date(`${monthKey}-01T12:00:00`);
  templates.forEach((item, index) => {
    const day = Number(String(item.date).slice(-2)) || index + 1;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Math.min(day, 28));
    state.transactions.push({ ...item, id: Date.now() + index, date: dateKey(date), recurring: true });
  });
  state.settings.lastRecurringMonth = monthKey;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("정기 회계 내역을 저장하지 못했습니다.", error);
  }
}
applyMonthlyRecurring();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(seed);
    const parsed = JSON.parse(saved);
    return { ...structuredClone(seed), ...parsed, users: Array.isArray(parsed.users) ? parsed.users : structuredClone(seed.users) };
  } catch (error) {
    console.error("저장된 데이터를 불러오지 못했습니다.", error);
    return structuredClone(seed);
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("데이터를 저장하지 못했습니다.", error);
    toast("브라우저 저장 공간에 기록하지 못했습니다.");
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function money(amount) { return `${Number(amount || 0).toLocaleString("ko-KR")}원`; }
function studentById(id) { return state.students.find(student => student.id === Number(id)); }
function lessonCount(studentId) { return state.lessons.filter(lesson => lesson.studentId === Number(studentId) && lesson.status === "present").length; }
function remaining(student) { return Math.max(0, Number(student.granted || 0) - lessonCount(student.id)); }
function fullDate(date = todayKey) {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}
function heading(title, subtitle, actions = "") {
  return `<div class="page-heading"><div><div class="eyebrow">VOCALFLOW / STUDIO MANAGEMENT</div><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function stat(label, value, unit, foot, icon, color = "") {
  return `<div class="stat-card"><div class="stat-top">${label}<span class="stat-icon ${color}">${icon}</span></div><div class="stat-value">${value}<small>${unit}</small></div><div class="stat-foot">${foot}</div></div>`;
}
function statusPill(status) {
  const labels = { paid: ["납부 완료", "paid"], due: ["미납", "due"], present: ["출석", "present"], planned: ["예정", "leave"], absent: ["결석", "absent"], booked: ["예약 완료", "active"], noshow: ["노쇼", "absent"], cancelled: ["취소", "leave"] };
  const item = labels[status] || [status, "leave"];
  return `<span class="status ${item[1]}">${item[0]}</span>`;
}

const pageNames = { dashboard: "대시보드", schedule: "수업 · 출결", feedback: "수업 피드백", students: "원생 · 수납", rooms: "연습실 예약", teachers: "강사 · 급여", accounting: "수입 · 지출", settings: "설정", users: "사용자 관리" };
const rolePages = {
  owner: ["dashboard", "schedule", "feedback", "students", "rooms", "teachers", "accounting", "settings", "users"],
  manager: ["dashboard", "schedule", "feedback", "students", "rooms", "teachers", "accounting", "settings", "users"],
  teacher: ["dashboard", "schedule", "feedback", "rooms", "teachers"],
  student: ["dashboard", "schedule", "students", "rooms"]
};
const roleNames = { owner: "원장", manager: "관리자", teacher: "강사", student: "원생" };

function render() {
  if (!rolePages[viewingRole].includes(currentPage)) currentPage = "dashboard";
  document.getElementById("breadcrumb").textContent = pageNames[currentPage] || "연습실 현황";
  document.querySelectorAll(".nav-item[data-page]").forEach(button => {
    const allowed = rolePages[viewingRole].includes(button.dataset.page);
    button.hidden = !allowed;
    button.classList.toggle("active", button.dataset.page === currentPage);
  });
  document.querySelector(".profile-copy strong").textContent = viewingRole === "owner" ? "김보이스 원장님" : viewingRole === "manager" ? "박관리 매니저님" : viewingRole === "teacher" ? "박서연 강사님" : "이지우 학생";
  document.querySelector(".profile-copy small").textContent = `${roleNames[viewingRole]} 계정`;
  const pages = {
    dashboard: renderDashboard,
    schedule: renderSchedule,
    feedback: renderFeedbackPage,
    students: renderStudents,
    rooms: renderRooms,
    teachers: renderTeachers,
    accounting: renderAccounting,
    settings: renderSettings,
    users: renderUsers
  };
  content.innerHTML = (pages[currentPage] || renderDashboard)();
}

function renderDashboard() {
  const lessons = state.lessons.filter(item => item.date === todayKey && (viewingRole !== "teacher" || item.teacher === "박서연") && (viewingRole !== "student" || item.studentId === 1));
  const attended = lessons.filter(item => item.status === "present").length;
  const dueList = state.students.filter(student => student.due > 0);
  const dueSum = dueList.reduce((sum, student) => sum + student.due, 0);
  const received = state.transactions.filter(item => item.date.startsWith(monthKey) && item.kind === "수입").reduce((sum, item) => sum + Number(item.amount), 0);
  const privateRole = viewingRole === "teacher" || viewingRole === "student";
  const shownLessons = lessons.slice(0, 6);
  const todayRows = shownLessons.length ? shownLessons.map(item => {
    const student = studentById(item.studentId);
    return `<div class="schedule-row"><div class="schedule-time">${item.time}</div><div class="schedule-accent ${item.status === "present" ? "mint" : item.teacher === "이준호" ? "coral" : item.teacher === "최도윤" ? "blue" : ""}"></div><div class="lesson-info"><strong>${escapeHtml(student?.name || "원생")} <span class="muted">· ${escapeHtml(item.type)}</span></strong><small>${escapeHtml(item.teacher)} 강사 · ${escapeHtml(item.room)}</small></div>${statusPill(item.status)}</div>`;
  }).join("") : `<div class="empty-state">오늘 예정된 수업이 없습니다.</div>`;
  const activities = state.activity.slice(0, 4).map(item => `<div class="activity-row"><span class="activity-dot ${item.color}"></span><div class="activity-copy">${item.text}</div><time>${escapeHtml(item.time)}</time></div>`).join("");
  return `${heading(`좋은 하루예요, ${roleNames[viewingRole]}님 👋`, privateRole ? "예시 데이터를 바꿔보며 기능을 확인하세요. 변경 내용은 이 브라우저에만 저장됩니다." : "예시 데이터를 바꿔보며 오늘의 학원 운영 기능을 확인하세요.", `<span class="date-chip">${fullDate()}</span><button class="button" data-action="reset-demo">데모 초기화</button>${viewingRole === "owner" || viewingRole === "manager" ? `<button class="button primary" data-action="add-lesson">＋ 수업 추가</button>` : ""}`)}
    <div class="stats-grid">
      ${stat(privateRole ? "나의 오늘 수업" : "오늘 수업", lessons.length, "건", `<span class="up">${attended}건 출석 완료</span> · ${Math.max(0, lessons.length - attended)}건 남음`, "▦")}
      ${viewingRole === "student" ? stat("잔여 레슨", remaining(state.students[0]), "회", "출석 완료 수업 기준", "◷", "green") : viewingRole === "teacher" ? stat("담당 원생", state.students.filter(student => student.teacher === "박서연").length, "명", "내 수업 담당 원생", "♙", "green") : stat("재원생", state.students.length, "명", "이번 달 등록 원생 기준", "♙", "green")}
      ${privateRole ? stat(viewingRole === "student" ? "나의 수강료" : "이번 달 예상 급여", viewingRole === "student" ? money(state.students[0].due || state.students[0].monthlyFee) : money(payrollFor("박서연").base + payrollFor("박서연").adjustment), "", viewingRole === "student" ? (state.students[0].due ? "납부 확인이 필요해요" : "이번 달 수납 완료") : `${payrollFor("박서연").count}회 출석 수업 기준`, "₩", "orange") : stat("이번 달 수납", money(received), "", `<span class="up">수납 기록 합계</span> · ${monthKey.replace("-", ".")}`, "₩", "orange")}
      ${privateRole ? stat("연습실", "예약", "가능", "연습실 이용 현황 확인", "⌂", "pink") : stat("미납 수강료", money(dueSum), "", `${dueList.length}명의 납부 확인이 필요해요`, "!", "pink")}
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><div class="panel-title">${privateRole ? "나의 오늘 수업" : "오늘의 수업"}</div><div class="panel-caption">${fullDate()}</div></div><button class="text-button" data-page="schedule">${privateRole ? "수업 확인" : "전체 일정 보기"} →</button></div><div class="schedule-list">${todayRows}</div></section>
      <div class="quick-stack">
        ${privateRole ? `<section class="panel"><div class="panel-head"><div><div class="panel-title">${viewingRole === "student" ? "나의 수강권" : "급여 현황"}</div><div class="panel-caption">${viewingRole === "student" ? "수업 출결에 따라 자동 계산" : "출석 기록 기준 예상 급여"}</div></div><button class="text-button" data-page="${viewingRole === "student" ? "students" : "teachers"}">자세히 →</button></div><div class="collection-summary"><div><small>${viewingRole === "student" ? "잔여 레슨" : "출석 수업"}</small><div class="amount"><strong>${viewingRole === "student" ? `${remaining(state.students[0])}회` : `${payrollFor("박서연").count}회`}</strong></div></div><div style="text-align:right"><small>${viewingRole === "student" ? "납부 상태" : "예상 급여"}</small><div style="color:${viewingRole === "student" && state.students[0].due ? "#e16d7a" : "#5144d2"}"><strong>${viewingRole === "student" ? (state.students[0].due ? "미납" : "완납") : money(payrollFor("박서연").base + payrollFor("박서연").adjustment)}</strong></div></div></div></section>` :
        `<section class="panel collection-panel"><div class="panel-head"><div><div class="panel-title">이번 달 수납 현황</div><div class="panel-caption">등록 원생 기준 예상 수강료</div></div><button class="text-button" data-page="students">관리 →</button></div><div class="collection-summary"><div><small>수납 완료</small><div class="amount"><strong>${money(state.students.filter(student => !student.due).reduce((sum, student) => sum + student.monthlyFee, 0))}</strong></div></div><div style="text-align:right"><small>미납</small><div style="color:#e16d7a"><strong>${money(dueSum)}</strong></div></div></div><div class="progress-track"><span style="width:${state.students.length ? Math.round((state.students.filter(student => !student.due).length / state.students.length) * 100) : 0}%"></span></div><div class="collection-legend"><span>수납 ${state.students.filter(student => !student.due).length}명</span><span>미납 ${dueList.length}명</span></div></section>
        <section class="panel alert-panel"><div class="panel-head"><div><div class="panel-title">확인이 필요해요</div><div class="panel-caption">원생의 수납과 연습실 이용</div></div><button class="text-button" data-page="students">전체 보기 →</button></div>
          <div class="alert-item"><span class="alert-mark red">₩</span><div class="alert-copy"><strong>미납 수강료 ${dueList.length}명</strong><small>${dueList.slice(0, 2).map(student => escapeHtml(student.name)).join(", ") || "대상 없음"}${dueList.length > 2 ? ` 외 ${dueList.length - 2}명` : ""}</small></div><button class="button small" data-action="remind-all">알림 보내기</button></div>
          <div class="alert-item"><span class="alert-mark">!</span><div class="alert-copy"><strong>잔여 레슨 2회 이하</strong><small>${state.students.filter(student => remaining(student) <= 2).length}명에게 수강 연장 안내</small></div><button class="text-button" data-page="students">확인 →</button></div>
        </section>`}
      </div>
    </div>
    ${privateRole ? "" : `<div class="lower-grid">
      <section class="panel"><div class="panel-head"><div><div class="panel-title">월간 수입 · 지출</div><div class="panel-caption">최근 6개월 운영 현황</div></div><button class="text-button" data-page="accounting">회계 관리 →</button></div><div class="bar-chart-wrap"><div class="chart-summary"><strong>${money(received)}</strong><small>이번 달 수입</small></div>${chartMarkup()}</div></section>
      <section class="panel"><div class="panel-head"><div><div class="panel-title">최근 활동</div><div class="panel-caption">학원에서 일어난 최근 기록</div></div></div><div class="activity-list">${activities}</div></section>
    </div>`}`;
}

function chartMarkup() {
  const months = ["5월", "6월", "7월", "8월", "9월", "10월"];
  const vals = [65, 82, 70, 89, 76, 94];
  return `<div class="bar-chart">${months.map((month, index) => `<div class="bar-set"><div class="bar-pair"><span class="bar primary-bar" style="height:${vals[index]}%"></span><span class="bar" style="height:${Math.max(16, vals[index] - 25)}%"></span></div><span class="bar-label">${month}</span></div>`).join("")}</div>`;
}

function renderSchedule() {
  const lessons = state.lessons.filter(item => item.date === selectedDate && (viewingRole !== "teacher" || item.teacher === "박서연") && (viewingRole !== "student" || item.studentId === 1)).sort((a, b) => a.time.localeCompare(b.time));
  const rows = lessons.map(item => {
    const student = studentById(item.studentId);
    const action = item.status !== "present"
      ? viewingRole === "student" ? "—" : `<button class="button small" data-action="attendance" data-id="${item.id}">출석 처리</button>`
      : item.feedback
        ? `<button class="button small" data-action="${viewingRole === "student" ? "view-feedback" : "edit-feedback"}" data-id="${item.id}">${viewingRole === "student" ? "피드백 보기" : "피드백 수정"}</button>`
        : viewingRole === "student" ? `<span class="muted">작성 대기</span>` : `<button class="button small" data-action="edit-feedback" data-id="${item.id}">피드백 작성</button>`;
    return `<tr><td>${item.time}</td><td><strong>${escapeHtml(student?.name || "원생")}</strong></td><td>${escapeHtml(item.teacher)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.room)}</td><td>${statusPill(item.status)}</td><td>${action}</td></tr>`;
  }).join("");
  const actions = `<input class="date-chip" id="scheduleDate" aria-label="날짜 선택" type="date" value="${selectedDate}">${viewingRole === "owner" || viewingRole === "manager" ? `<button class="button primary" data-action="add-lesson">＋ 수업 추가</button>` : ""}`;
  return `${heading("수업 · 출결", "수업 일정을 확인하고 출석 기록을 관리하세요.", actions)}
    <div class="notice"><strong>출결 자동 연동</strong> · 출석 처리 시 원생의 잔여 레슨 횟수가 차감되고 강사 급여 계산에 자동 반영됩니다.</div>
    <div class="student-summary">${stat("선택일 수업", lessons.length, "건", fullDate(selectedDate), "▦")}${stat("출석 완료", lessons.filter(item => item.status === "present").length, "건", "출결이 기록된 수업", "✓", "green")}${stat("출석 대기", lessons.filter(item => item.status === "planned").length, "건", "출석 처리 전 수업", "◷", "orange")}</div>
    <section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">수업 일정</div><div class="panel-caption">${fullDate(selectedDate)}</div></div><span class="muted" style="font-size:9px">${lessons.length}건</span></div>
    <table class="data-table"><thead><tr><th>시간</th><th>원생</th><th>담당 강사</th><th>수업</th><th>강의실</th><th>출결</th><th>수업 피드백</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="empty-state">선택한 날짜에 등록된 수업이 없습니다.</div></td></tr>`}</tbody></table></section>
    ${renderFeedbackHistory(lessons)}`;
}

function renderFeedbackHistory(lessons) {
  const recordedLessons = lessons.filter(lesson => lesson.status === "present" && lesson.feedback);
  const headingText = viewingRole === "student" ? "내 수업 피드백" : "수업 피드백";
  const description = viewingRole === "student" ? "강사가 남긴 레슨 리뷰와 다음 연습 과제를 확인하세요." : "출석 처리된 1:1 수업에 학습 코멘트와 연습 과제를 남길 수 있습니다.";
  const cards = recordedLessons.map(lesson => {
    const student = studentById(lesson.studentId);
    return `<article class="feedback-card"><div class="feedback-card-head"><div><strong>${viewingRole === "student" ? escapeHtml(lesson.teacher) + " 강사" : escapeHtml(student?.name || "원생") + " 학생"} · ${escapeHtml(lesson.type)}</strong><small>${fullDate(lesson.date)} · ${lesson.time} · ${escapeHtml(lesson.teacher)} 강사</small></div><button class="text-button" data-action="view-feedback" data-id="${lesson.id}">자세히 보기 →</button></div><div class="feedback-preview"><span>수업 코멘트</span><p>${escapeHtml(lesson.feedback.strengths || lesson.feedback.focus || "피드백 내용이 없습니다.")}</p></div><div class="feedback-homework"><span>다음 연습 과제</span><p>${escapeHtml(lesson.feedback.homework || "등록된 과제가 없습니다.")}</p></div></article>`;
  }).join("");
  return `<section class="feedback-section"><div class="feedback-section-heading"><div><h2>${headingText}</h2><p>${description}</p></div><span class="feedback-count">${recordedLessons.length}건</span></div>${cards || `<div class="panel empty-state">${viewingRole === "student" ? "아직 등록된 수업 피드백이 없습니다." : "선택한 날짜에 피드백이 등록된 수업이 없습니다."}</div>`}</section>`;
}

function renderFeedbackPage() {
  const lessons = state.lessons
    .filter(lesson => viewingRole !== "teacher" || lesson.teacher === "박서연")
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  const completedLessons = lessons.filter(lesson => lesson.status === "present");
  const pendingFeedback = completedLessons.filter(lesson => !lesson.feedback);
  const feedbackRows = lessons.map(lesson => {
    const student = studentById(lesson.studentId);
    const action = lesson.status !== "present"
      ? `<span class="muted">출석 처리 후 작성 가능</span>`
      : lesson.feedback
        ? `<button class="button small" data-action="edit-feedback" data-id="${lesson.id}">피드백 수정</button>`
        : `<button class="button small primary" data-action="edit-feedback" data-id="${lesson.id}">피드백 작성</button>`;
    const feedbackState = lesson.status !== "present"
      ? statusPill(lesson.status)
      : lesson.feedback
        ? `<span class="status paid">작성 완료</span>`
        : `<span class="status due">작성 대기</span>`;
    return `<tr><td>${fullDate(lesson.date)} · ${lesson.time}</td><td><strong>${escapeHtml(student?.name || "원생")}</strong></td><td>${escapeHtml(lesson.teacher)}</td><td>${escapeHtml(lesson.type)}</td><td>${feedbackState}</td><td>${action}</td></tr>`;
  }).join("");
  return `${heading("수업 피드백", "출석 완료된 1:1 레슨의 피드백을 작성하고 이전 기록을 관리하세요.", `<button class="button" data-page="schedule">▦ 수업 · 출결 보기</button>`)}
    <div class="notice"><strong>작성 방법</strong> · 출석 처리가 완료된 수업에서 피드백을 작성할 수 있습니다. 작성한 코멘트와 연습 과제는 원생 권한 화면에서도 확인할 수 있습니다.</div>
    <div class="student-summary">${stat("담당 수업", lessons.length, "건", "등록된 전체 레슨", "▦")}${stat("피드백 작성 대기", pendingFeedback.length, "건", "출석 완료 후 작성 필요", "◷", "orange")}${stat("피드백 작성 완료", completedLessons.length - pendingFeedback.length, "건", "원생에게 공유 가능", "✓", "green")}</div>
    <section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">레슨별 피드백</div><div class="panel-caption">출석 완료된 수업을 선택해 작성하거나 수정하세요.</div></div><span class="muted" style="font-size:9px">${lessons.length}건</span></div>
    <table class="data-table"><thead><tr><th>수업 일시</th><th>원생</th><th>담당 강사</th><th>레슨</th><th>피드백 상태</th><th>관리</th></tr></thead><tbody>${feedbackRows || `<tr><td colspan="6"><div class="empty-state">등록된 수업이 없습니다.</div></td></tr>`}</tbody></table></section>`;
}

function renderStudents() {
  const visibleStudents = state.students.filter(student => {
    if (viewingRole === "student" && student.id !== 1) return false;
    const query = studentSearch.trim().toLowerCase();
    return !query || `${student.name} ${student.teacher} ${student.level}`.toLowerCase().includes(query);
  });
  const dueTotal = state.students.reduce((sum, student) => sum + student.due, 0);
  const body = visibleStudents.map(student => `<tr><td><strong>${escapeHtml(student.name)}</strong></td><td>${escapeHtml(student.level)}</td><td>${escapeHtml(student.teacher)}</td><td>${remaining(student)}회 <span class="muted">/ ${student.granted}회</span></td><td>${money(student.monthlyFee)}</td><td>${student.due > 0 ? statusPill("due") : statusPill("paid")}</td><td>${student.due > 0 && viewingRole !== "student" ? `<button class="button small" data-action="remind-student" data-id="${student.id}">납부 알림</button>` : student.due === 0 ? `<button class="button small" data-action="payment" data-id="${student.id}">수납 등록</button>` : "—"}</td></tr>`).join("");
  const actions = viewingRole === "student" ? "" : `<button class="button" data-action="remind-all">♧ 미납 일괄 알림</button><button class="button primary" data-action="add-student">＋ 원생 등록</button>`;
  return `${heading(viewingRole === "student" ? "나의 수강 정보" : "원생 · 수납", viewingRole === "student" ? "남은 레슨과 수강료 납부 현황을 확인하세요." : "원생별 수강권, 레슨 잔여 횟수와 수납 현황을 관리하세요.", actions)}
    <div class="student-summary">${stat("재원 원생", state.students.length, "명", "등록된 전체 원생", "♙", "green")}${stat("미납 원생", state.students.filter(student => student.due > 0).length, "명", `미납 수강료 ${money(dueTotal)}`, "₩", "pink")}${stat("잔여 레슨 부족", state.students.filter(student => remaining(student) <= 2).length, "명", "2회 이하 남은 원생", "◷", "orange")}</div>
    <section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">원생 목록</div><div class="panel-caption">출석 기록 기준으로 잔여 레슨 자동 계산</div></div><div class="filters"><input class="search-box" id="studentSearch" placeholder="이름, 강사, 반 검색" value="${escapeHtml(studentSearch)}"></div></div>
    <table class="data-table"><thead><tr><th>원생</th><th>수강반</th><th>담당 강사</th><th>잔여 레슨</th><th>월 수강료</th><th>납부 상태</th><th>관리</th></tr></thead><tbody>${body || `<tr><td colspan="7"><div class="empty-state">검색 결과가 없습니다.</div></td></tr>`}</tbody></table><div class="table-footer"><span>총 ${visibleStudents.length}명</span><span>수납 등록 시 수강권 횟수가 갱신됩니다.</span></div></section>`;
}

function renderRooms() {
  const rooms = ["연습실 1", "연습실 2", "연습실 3", "레슨실 A", "레슨실 B", "레슨실 C"];
  const allBookingsToday = state.bookings.filter(booking => booking.date === todayKey && booking.status === "booked");
  const bookingsToday = state.bookings.filter(booking => booking.date === todayKey && (viewingRole === "owner" || viewingRole === "manager" || (viewingRole === "student" ? booking.person === "이지우" : booking.person === "강사 박서연")));
  const roomCards = rooms.map(room => {
    const roomBookings = allBookingsToday.filter(booking => booking.room === room);
    const visibleBooking = bookingsToday.find(booking => booking.room === room && booking.status === "booked");
    return `<div class="room-card"><div class="room-card-top"><h3>${room}</h3><span class="room-state ${roomBookings.length ? "busy" : ""}">${roomBookings.length ? `${roomBookings.length}건 예약` : "예약 가능"}</span></div><p>${roomBookings.length ? `${visibleBooking ? `${visibleBooking.start} · ${escapeHtml(visibleBooking.person)}` : "오늘 예약이 있습니다."}` : "오늘 예약이 없습니다."}</p><div class="room-timeline">${Array.from({ length: 12 }, (_, i) => `<span class="${roomBookings.some(booking => Number(booking.start.slice(0, 2)) <= i + 9 && Number(booking.start.slice(0, 2)) + booking.hours > i + 9) ? "busy-slot" : ""}" style="flex:1"></span>`).join("")}</div></div>`;
  }).join("");
  const list = bookingsToday.sort((a, b) => a.start.localeCompare(b.start)).map(booking => `<div class="booking-row"><div class="booking-time">${booking.start}</div><div class="booking-copy"><strong>${escapeHtml(booking.person)} <span class="muted">· ${escapeHtml(booking.room)}</span></strong><small>${booking.hours}시간 이용 · ${escapeHtml(booking.role)}</small></div><div>${booking.status === "booked" && (viewingRole === "owner" || viewingRole === "manager") ? `<button class="button small danger" data-action="noshow" data-id="${booking.id}">노쇼 처리</button>` : statusPill(booking.status)}</div></div>`).join("");
  const actions = `<button class="button" data-action="display">▣ 현황 디스플레이</button><button class="button primary" data-action="book-room">＋ 예약 등록</button>`;
  return `${heading("연습실 예약", "공간 예약과 이용 현황을 한눈에 확인하세요.", actions)}
    <div class="notice warning"><strong>예약 한도</strong> · 입시반 하루 최대 4시간, 취미반 하루 최대 2시간까지 예약할 수 있습니다. 노쇼 ${state.settings.noShowLimit}회 누적 시 예약이 자동 제한됩니다.</div>
    <div class="room-grid">${roomCards}</div>
    <div class="booking-layout"><section class="panel"><div class="panel-head"><div><div class="panel-title">오늘의 예약 현황</div><div class="panel-caption">${fullDate()}</div></div><span class="muted" style="font-size:9px">${bookingsToday.length}건</span></div><div class="booking-list">${list || `<div class="empty-state">등록된 예약이 없습니다.</div>`}</div></section>
    <section class="panel"><div class="panel-head"><div><div class="panel-title">예약 운영 규칙</div><div class="panel-caption">학원 운영에 맞게 설정할 수 있어요</div></div></div><div class="setting-card"><div class="setting-row"><span>입시반 일일 예약 한도</span><strong>4시간</strong></div><div class="setting-row"><span>취미반 일일 예약 한도</span><strong>2시간</strong></div><div class="setting-row"><span>노쇼 이용 제한 기준</span><strong>${state.settings.noShowLimit}회</strong></div><div class="setting-row"><span>강사 고정 레슨실 배정</span><strong>운영 중</strong></div><button class="button small" data-page="settings">설정 변경</button></div></section></div>`;
}

function payrollFor(teacherName) {
  const teaching = state.lessons.filter(lesson => lesson.teacher === teacherName && lesson.status === "present" && lesson.date.startsWith(monthKey)).length;
  const teacher = state.teachers.find(item => item.name === teacherName);
  return { count: teaching, base: teaching * Number(teacher?.rate || state.settings.lessonRate), adjustment: Number(teacher?.adjustment || 0) };
}

function renderTeachers() {
  const teacherRows = state.teachers.map(teacher => {
    const payroll = payrollFor(teacher.name);
    const showAll = viewingRole !== "teacher" || teacher.name === "박서연";
    if (!showAll) return "";
    return `<tr><td><strong>${escapeHtml(teacher.name)}</strong></td><td>${escapeHtml(teacher.subject)}</td><td>${escapeHtml(teacher.phone)}</td><td>${payroll.count}회</td><td>${money(teacher.rate)}</td><td><strong>${money(payroll.base + payroll.adjustment)}</strong></td><td>${viewingRole !== "teacher" ? `<button class="button small" data-action="adjust-pay" data-id="${teacher.id}">급여 조정</button>` : "내 급여"}</td></tr>`;
  }).join("");
  const total = state.teachers.reduce((sum, teacher) => {
    if (viewingRole === "teacher" && teacher.name !== "박서연") return sum;
    const p = payrollFor(teacher.name); return sum + p.base + p.adjustment;
  }, 0);
  return `${heading(viewingRole === "teacher" ? "내 수업 · 급여" : "강사 · 급여", "출석 기록을 바탕으로 수업 횟수와 급여를 자동 계산합니다.", viewingRole === "teacher" ? "" : `<button class="button" data-action="export-payroll">↓ 급여명세서 엑셀</button><button class="button primary" data-action="add-teacher">＋ 강사 등록</button>`)}
    <div class="notice"><strong>실시간 급여 계산</strong> · 출석 완료된 수업에 강사별 회당 급여를 적용합니다. 원장님은 조정 내역을 추가할 수 있으며, 엑셀 파일은 급여명세서 제출용으로 다운로드됩니다.</div>
    <div class="student-summary">${stat("등록 강사", viewingRole === "teacher" ? 1 : state.teachers.length, "명", "활동 중인 강사", "♧", "green")}${stat("이번 달 레슨", state.lessons.filter(item => item.status === "present" && item.date.startsWith(monthKey) && (viewingRole !== "teacher" || item.teacher === "박서연")).length, "회", "출석 완료 기준", "▦", "orange")}${stat("예상 급여 합계", money(total), "", "조정 금액 포함", "₩", "pink")}</div>
    <section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">강사별 급여 정산</div><div class="panel-caption">${monthKey.replace("-", "년 ")}월 · 출석 수업 자동 집계</div></div></div>
    <table class="data-table"><thead><tr><th>강사</th><th>담당 분야</th><th>연락처</th><th>출석 수업</th><th>회당 급여</th><th>예상 급여</th><th>관리</th></tr></thead><tbody>${teacherRows}</tbody></table><div class="table-footer"><span>※ 실제 급여 확정 전 출결과 조정 내역을 검토해주세요.</span><span>조정 급여는 산출 내역에 별도 표시됩니다.</span></div></section>`;
}

function renderAccounting() {
  const transactions = state.transactions.filter(item => item.date.startsWith(monthKey)).sort((a, b) => b.date.localeCompare(a.date));
  const income = transactions.filter(item => item.kind === "수입").reduce((sum, item) => sum + Number(item.amount), 0);
  const expense = transactions.filter(item => item.kind === "지출").reduce((sum, item) => sum + Number(item.amount), 0);
  const rows = transactions.map(item => `<tr><td>${item.date}</td><td>${item.kind === "수입" ? `<span class="status paid">수입</span>` : `<span class="status due">지출</span>`}</td><td>${escapeHtml(item.category)}</td><td><strong>${escapeHtml(item.detail)}</strong></td><td>${item.recurring ? `<span class="status leave">매월 반복</span>` : `<span class="muted">일회성</span>`}</td><td style="color:${item.kind === "수입" ? "#229879" : "#dc6874"};font-weight:700">${item.kind === "수입" ? "+" : "-"}${money(item.amount)}</td><td><button class="button small danger" data-action="delete-transaction" data-id="${item.id}">삭제</button></td></tr>`).join("");
  return `${heading("수입 · 지출", "고정 수입과 지출을 포함한 학원 회계 내역을 관리하세요.", `<button class="button" data-action="generate-recurring">↻ 정기 내역 반영</button><button class="button primary" data-action="add-transaction">＋ 내역 추가</button>`)}
    <div class="student-summary">${stat("이번 달 수입", money(income), "", `${transactions.filter(item => item.kind === "수입").length}건 기록`, "↗", "green")}${stat("이번 달 지출", money(expense), "", `${transactions.filter(item => item.kind === "지출").length}건 기록`, "↘", "pink")}${stat("운영 손익", money(income - expense), "", "수입 - 지출", "₩", "orange")}</div>
    <section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">회계 내역</div><div class="panel-caption">${monthKey.replace("-", "년 ")}월 수입 · 지출 상세</div></div></div>
    <table class="data-table"><thead><tr><th>일자</th><th>구분</th><th>항목</th><th>내용</th><th>유형</th><th>금액</th><th>관리</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="empty-state">이번 달 회계 내역이 없습니다.</div></td></tr>`}</tbody></table><div class="table-footer"><span>정기 내역은 월 1회 중복 없이 생성됩니다.</span><span>총 ${transactions.length}건</span></div></section>`;
}

function renderSettings() {
  return `${heading("운영 설정", "학원 운영 방식에 맞춰 권한과 예약 정책을 관리하세요.", `<button class="button primary" data-action="save-settings">변경사항 저장</button>`)}
    <div class="section-grid two">
      <section class="panel setting-card"><h3>권한별 접근 안내</h3><p>원장, 관리자, 강사, 원생 역할에 따라 메뉴 접근 권한을 분리합니다.</p><div class="setting-row"><span>원장</span><strong>전체 운영 · 정산 · 설정</strong></div><div class="setting-row"><span>관리자</span><strong>원생 · 출결 · 회계 관리</strong></div><div class="setting-row"><span>강사</span><strong>수업 출결 · 연습실 · 내 급여</strong></div><div class="setting-row"><span>원생</span><strong>내 수강 현황 · 연습실 예약</strong></div><div class="form-hint">상단의 권한 선택 메뉴로 화면별 접근을 미리 확인할 수 있습니다.</div></section>
      <section class="panel setting-card"><h3>연습실 · 예약 정책</h3><p>노쇼 횟수가 기준에 도달하면 원생의 예약 등록이 제한됩니다.</p><div class="setting-row"><span>노쇼 예약 제한 기준</span><label><input class="setting-input" id="noShowLimit" type="number" min="1" max="10" value="${state.settings.noShowLimit}"> 회</label></div><div class="setting-row"><span>입시반 일일 예약 한도</span><strong>4시간</strong></div><div class="setting-row"><span>취미반 일일 예약 한도</span><strong>2시간</strong></div><div class="setting-row"><span>강사 고정 레슨실</span><strong>평일 · 요일별 배정</strong></div></section>
      <section class="panel setting-card"><h3>급여 · 고정 레슨실 설정</h3><p>강사별 회당 급여를 지정하고, 반복 배정 요일과 고정 레슨실을 설정합니다.</p>${state.teachers.map(teacher => `<div class="setting-row"><span>${escapeHtml(teacher.name)} · 급여</span><label><input class="setting-input teacher-rate" data-id="${teacher.id}" type="number" min="0" step="1000" value="${teacher.rate}"> 원/회</label></div><div class="setting-row"><span>${escapeHtml(teacher.name)} · 고정 레슨실</span><select class="filter-select teacher-room" data-id="${teacher.id}">${["레슨실 A", "레슨실 B", "레슨실 C"].map(room => `<option ${teacher.fixedRoom === room ? "selected" : ""}>${room}</option>`).join("")}</select></div><div class="setting-row"><span>상시 배정 요일</span><span>${["월", "화", "수", "목", "금"].map((day, index) => `<label style="margin-left:5px"><input class="teacher-day" data-id="${teacher.id}" type="checkbox" value="${index + 1}" ${teacher.fixedDays?.includes(index + 1) ? "checked" : ""}>${day}</label>`).join("")}</span></div>`).join("")}</section>
      <section class="panel setting-card"><h3>정기 회계 내역</h3><p>매월 정해진 날짜에 반복 입력할 수 있는 고정 수입·지출 예시입니다.</p><div class="setting-row"><span>학원 월 임대료</span><strong>지출 · 매월 2일</strong></div><div class="setting-row"><span>건물 관리비</span><strong>지출 · 매월 3일</strong></div><div class="setting-row"><span>연습실 대여</span><strong>수입 · 매월 5일</strong></div><div class="setting-row"><span>전기·수도·인터넷</span><strong>지출 · 매월 6일</strong></div></section>
    </div>`;
}

function renderUsers() {
  const roleNames = { owner: "원장", manager: "관리자", teacher: "강사", student: "원생" };
  const rows = state.users.map(user => {
    const allowedPages = (rolePages[user.role] || []).filter(page => page !== "users");
    const permissions = allowedPages.map(page => pageNames[page]).join(" · ");
    const canEdit = viewingRole === "owner" || user.role !== "owner";
    return `<tr>
      <td><strong>${escapeHtml(user.name)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td><span class="status ${user.role === "owner" || user.role === "manager" ? "active" : "leave"}">${roleNames[user.role] || "미지정"}</span></td>
      <td><span class="status ${user.active ? "active" : "blocked"}">${user.active ? "사용 중" : "사용 중지"}</span></td>
      <td class="user-permissions">${escapeHtml(permissions || "허용된 메뉴 없음")}</td>
      <td>${canEdit ? `<button class="button small" data-action="edit-user" data-id="${user.id}">권한 수정</button> <button class="button small ${user.active ? "danger" : ""}" data-action="toggle-user" data-id="${user.id}">${user.active ? "중지" : "활성화"}</button>` : `<span class="muted">원장 전용</span>`}</td>
    </tr>`;
  }).join("");
  return `${heading("사용자 관리", "계정에 역할을 지정해 메뉴 보기 권한을 부여하고 관리하세요.", `<button class="button primary" data-action="add-user">＋ 사용자 추가</button>`)}
    <div class="notice warning"><strong>데모 권한 관리</strong> · 여기서 지정하는 계정과 역할은 이 브라우저에만 저장됩니다. 실제 초대 메일, 로그인 및 서버 측 접근 제어는 연결되어 있지 않습니다.</div>
    <section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">계정 및 보기 권한</div><div class="panel-caption">역할을 선택하면 아래 메뉴 접근 범위가 적용됩니다. 총 ${state.users.length}명</div></div></div>
    <table class="data-table"><thead><tr><th>사용자</th><th>이메일</th><th>역할</th><th>계정 상태</th><th>허용 메뉴</th><th>관리</th></tr></thead><tbody>${rows || `<tr><td colspan="6"><div class="empty-state">등록된 사용자가 없습니다.</div></td></tr>`}</tbody></table>
    <div class="table-footer"><span>원장·관리자만 사용자 권한을 관리할 수 있습니다.</span><span>역할별 권한 안내는 <button class="text-button" data-page="settings">운영 설정</button>에서 확인하세요.</span></div></section>`;
}

function userModal(user = null) {
  if (viewingRole !== "owner" && viewingRole !== "manager") { toast("사용자 관리는 원장 또는 관리자 권한이 필요합니다."); return; }
  if (user?.role === "owner" && viewingRole !== "owner") { toast("원장 계정은 원장만 관리할 수 있습니다."); return; }
  const roleOptions = [["manager", "관리자"], ["teacher", "강사"], ["student", "원생"]];
  if (viewingRole === "owner") roleOptions.unshift(["owner", "원장"]);
  const initialRole = user?.role === "owner" && viewingRole !== "owner" ? "manager" : user?.role || "student";
  showModal(user ? "사용자 권한 수정" : "사용자 추가", `<div class="notice">역할별로 학원 메뉴의 보기 권한이 적용됩니다. 이 데모에서는 초대 메일이나 실제 로그인을 보내지 않습니다.</div><div class="form-grid">${field("이름", "name", "text", user?.name || "", 'required maxlength="40"')}${field("이메일", "email", "email", user?.email || "", 'required maxlength="120"')}${selectField("역할 · 보기 권한", "role", roleOptions.map(([value, label]) => [value, label]), initialRole)}</div>`, user ? "권한 저장" : "사용자 추가", form => {
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const role = String(form.get("role"));
    if (!name || !email || !rolePages[role]) { toast("이름, 이메일, 권한을 확인해주세요."); return; }
    if (viewingRole !== "owner" && role === "owner") { toast("원장 권한은 원장만 부여할 수 있습니다."); return; }
    if (state.users.some(item => item.email.toLowerCase() === email && item.id !== user?.id)) { toast("이미 등록된 이메일입니다."); return; }
    if (user) {
      user.name = name;
      user.email = email;
      user.role = role;
    } else {
      state.users.push({ id: Date.now(), name, email, role, active: true });
    }
    persist(); closeModal(); render(); toast(user ? "사용자 권한을 저장했습니다." : "사용자를 추가했습니다.");
  });
}

function toast(message) {
  const root = document.getElementById("toastRoot");
  const item = document.createElement("div");
  item.className = "toast success"; item.textContent = message; root.appendChild(item);
  setTimeout(() => item.remove(), 3000);
}

function showModal(title, body, submitLabel, onSubmit) {
  const root = document.getElementById("modalRoot");
  root.innerHTML = `<div class="modal-backdrop"><form class="modal" id="modalForm"><div class="modal-head"><h2>${title}</h2><button class="modal-close" type="button" data-action="close-modal" aria-label="닫기">×</button></div><div class="modal-body">${body}</div><div class="modal-foot"><button class="button" type="button" data-action="close-modal">취소</button><button class="button primary" type="submit">${submitLabel}</button></div></form></div>`;
  root.querySelector(".modal-backdrop").addEventListener("click", event => { if (event.target.classList.contains("modal-backdrop")) closeModal(); });
  root.querySelector("#modalForm").addEventListener("submit", event => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); });
}
function closeModal() { document.getElementById("modalRoot").innerHTML = ""; }
function field(label, name, type = "text", value = "", extra = "") {
  return `<div class="form-field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" ${extra} required></div>`;
}
function selectField(label, name, options, value = "") {
  return `<div class="form-field"><label for="${name}">${label}</label><select id="${name}" name="${name}" required>${options.map(([key, text]) => `<option value="${escapeHtml(key)}" ${key === value ? "selected" : ""}>${escapeHtml(text)}</option>`).join("")}</select></div>`;
}

function addLessonModal() {
  const studentOptions = state.students.map(student => [student.id, `${student.name} · ${student.teacher}`]);
  const teacherOptions = state.teachers.map(teacher => [teacher.name, teacher.name]);
  const defaultTeacher = state.teachers[0];
  const selectedDay = new Date(`${selectedDate}T12:00:00`).getDay();
  const defaultRoom = defaultTeacher.fixedDays?.includes(selectedDay) ? defaultTeacher.fixedRoom : "레슨실 A";
  showModal("수업 일정 추가", `<div class="form-grid">${field("수업 날짜", "date", "date", selectedDate)}${field("시작 시간", "time", "time", "13:00")}${selectField("원생", "studentId", studentOptions)}${selectField("담당 강사", "teacher", teacherOptions, defaultTeacher.name)}${selectField("수업 유형", "type", [["입시 보컬", "입시 보컬"], ["취미 보컬", "취미 보컬"], ["작곡 레슨", "작곡 레슨"]])}${selectField("강의실", "room", [["레슨실 A", "레슨실 A"], ["레슨실 B", "레슨실 B"], ["레슨실 C", "레슨실 C"]], defaultRoom)}</div><p class="form-hint">선택한 강사의 요일별 고정 레슨실을 우선 배정합니다.</p>`, "일정 추가", form => {
    state.lessons.push({ id: Date.now(), date: form.get("date"), time: form.get("time"), studentId: Number(form.get("studentId")), teacher: form.get("teacher"), type: form.get("type"), room: form.get("room"), status: "planned" });
    persist(); closeModal(); render(); toast("수업 일정을 추가했습니다.");
  });
  const form = document.getElementById("modalForm");
  const updateAssignedRoom = () => {
    const teacher = state.teachers.find(item => item.name === form.elements.teacher.value);
    const day = new Date(`${form.elements.date.value}T12:00:00`).getDay();
    if (teacher?.fixedDays?.includes(day)) form.elements.room.value = teacher.fixedRoom;
  };
  form.elements.teacher.addEventListener("change", updateAssignedRoom);
  form.elements.date.addEventListener("change", updateAssignedRoom);
}
function addStudentModal() {
  showModal("원생 등록", `<div class="form-grid">${field("원생 이름", "name")}${field("연락처", "phone", "tel")}${field("보호자 이름 (본인 수강은 '본인')", "guardian", "text", "본인")}${field("보호자 연락처", "guardianPhone", "tel")}${selectField("수강반", "level", [["입시반", "입시반"], ["취미반", "취미반"]])}${selectField("담당 강사", "teacher", state.teachers.map(teacher => [teacher.name, teacher.name]))}${field("월 수강료", "monthlyFee", "number", "300000", 'min="0"')}${field("결제 수강권 횟수", "granted", "number", "8", 'min="1"')}</div>`, "원생 등록", form => {
    state.students.push({ id: Date.now(), name: form.get("name"), phone: form.get("phone"), guardian: form.get("guardian"), guardianPhone: form.get("guardianPhone"), level: form.get("level"), teacher: form.get("teacher"), monthlyFee: Number(form.get("monthlyFee")), balance: 0, granted: Number(form.get("granted")), due: Number(form.get("monthlyFee")), noShows: 0 });
    persist(); closeModal(); render(); toast("원생을 등록했습니다. 수강료 납부 상태를 확인해주세요.");
  });
}
function addTeacherModal() {
  showModal("강사 등록", `<div class="form-grid">${field("강사 이름", "name")}${field("연락처", "phone", "tel")}${field("담당 분야", "subject")}${field("회당 급여", "rate", "number", "30000", 'min="0" step="1000"')}</div>`, "강사 등록", form => {
    state.teachers.push({ id: Date.now(), name: form.get("name"), phone: form.get("phone"), subject: form.get("subject"), rate: Number(form.get("rate")), adjustment: 0 });
    persist(); closeModal(); render(); toast("강사를 등록했습니다.");
  });
}
function paymentModal(student) {
  showModal(`${escapeHtml(student.name)} 수납 등록`, `<div class="notice">미납 금액 <strong>${money(student.due || student.monthlyFee)}</strong> · 수납 완료 시 수강권 횟수가 자동 충전됩니다.</div><div class="form-grid">${field("수납 금액", "amount", "number", student.due || student.monthlyFee, 'min="1"')}${field("충전할 레슨 횟수", "lessons", "number", "8", 'min="1"')}${selectField("결제 수단", "method", [["카드", "카드"], ["계좌이체", "계좌이체"], ["현금", "현금"], ["간편결제", "간편결제"]])}</div>`, "수납 등록", form => {
    const amount = Number(form.get("amount"));
    student.due = Math.max(0, student.due - amount);
    student.granted = lessonCount(student.id) + remaining(student) + Number(form.get("lessons"));
    student.balance = remaining(student);
    state.transactions.push({ id: Date.now(), date: todayKey, kind: "수입", category: "수강료", detail: `${student.name} 수강료 (${form.get("method")})`, amount, recurring: false });
    state.activity.unshift({ text: `<strong>${escapeHtml(student.name)}</strong> 학생의 수강료 수납이 등록되었어요.`, time: "방금", color: "green" });
    persist(); closeModal(); render(); toast(`${student.name} 학생의 수납과 수강권을 등록했습니다.`);
  });
}
function reminderModal(targetStudents) {
  const choices = targetStudents.map(student => `<label class="setting-row"><span><strong>${escapeHtml(student.name)}</strong> · 미납 ${money(student.due)}</span><select class="filter-select" name="contact-${student.id}"><option value="guardian">${escapeHtml(student.guardian || "보호자")}에게</option><option value="self">본인에게</option></select></label>`).join("");
  showModal("수강료 납부 알림톡", `<div class="notice warning"><strong>데모 미리보기</strong> · 현재는 발송 연동 전이라 알림톡이 실제 전송되지 않습니다. 발송 대상과 연락처를 확인해보세요.</div><div class="form-field"><label>발송 대상 (${targetStudents.length}명)</label><div>${choices || "발송 대상이 없습니다."}</div></div><div class="form-field" style="margin-top:12px"><label>알림 내용 미리보기</label><textarea readonly>안녕하세요, 보이스온 실용음악학원입니다. 이번 달 수강료 납부를 확인 부탁드립니다. 납부 내역에 문의가 있으시면 학원으로 연락 주세요.</textarea></div>`, "데모 발송 확인", () => {
    closeModal(); toast(`${targetStudents.length}명 알림 발송을 시뮬레이션했습니다. 실제 발송은 알림톡 연동 후 가능합니다.`);
  });
}
function bookingModal() {
  const people = viewingRole === "student" ? [["이지우", "이지우 (입시반)"]] : [
    ...state.students.map(student => [student.name, `${student.name} (${student.level})`]),
    ...state.teachers.map(teacher => [`강사 ${teacher.name}`, `강사 ${teacher.name}`])
  ];
  showModal("연습실 예약", `<div class="form-grid">${field("예약 날짜", "date", "date", todayKey)}${field("시작 시간", "start", "time", "15:00")}${selectField("예약자", "person", people)}${selectField("연습실", "room", [["연습실 1", "연습실 1"], ["연습실 2", "연습실 2"], ["연습실 3", "연습실 3"]])}${selectField("이용 시간", "hours", [["1", "1시간"], ["2", "2시간"], ["3", "3시간"], ["4", "4시간"]])}<div class="form-hint" style="align-self:end">입시반 4시간 · 취미반 2시간/일 예약 한도<br>동일 시간대 중복 예약은 제한됩니다.</div></div>`, "예약 확정", form => {
    const person = String(form.get("person"));
    const student = state.students.find(item => item.name === person);
    const hours = Number(form.get("hours"));
    const role = student ? "원생" : "강사";
    if (student) {
      if (student.noShows >= state.settings.noShowLimit) { toast(`${student.name} 학생은 노쇼 누적으로 예약이 제한되어 있습니다.`); return; }
      const dailyHours = state.bookings.filter(item => item.date === form.get("date") && item.person === person && item.status === "booked").reduce((sum, item) => sum + item.hours, 0);
      const limit = student.level === "입시반" ? 4 : 2;
      if (dailyHours + hours > limit) { toast(`${student.level} 예약 한도는 하루 ${limit}시간입니다.`); return; }
    }
    const startHour = Number(String(form.get("start")).slice(0, 2));
    const overlaps = state.bookings.some(item => item.date === form.get("date") && item.room === form.get("room") && item.status === "booked" && startHour < Number(item.start.slice(0, 2)) + item.hours && Number(item.start.slice(0, 2)) < startHour + hours);
    if (overlaps) { toast("해당 시간에 이미 예약이 있습니다. 시간을 변경해주세요."); return; }
    state.bookings.push({ id: Date.now(), date: form.get("date"), start: form.get("start"), hours, room: form.get("room"), person, role, status: "booked" });
    persist(); closeModal(); render(); toast("연습실 예약을 등록했습니다.");
  });
}
function transactionModal() {
  showModal("회계 내역 추가", `<div class="form-grid">${selectField("구분", "kind", [["수입", "수입"], ["지출", "지출"]])}${selectField("항목", "category", [["수강료", "수강료"], ["연습실 대여", "연습실 대여"], ["임대료", "임대료"], ["관리비", "관리비"], ["공과금", "공과금"], ["강사 급여", "강사 급여"], ["기타", "기타"]])}${field("일자", "date", "date", todayKey)}${field("금액", "amount", "number", "", 'min="1"')}${field("내용", "detail", "text", "", 'class="full"')}${selectField("반복 설정", "recurring", [["no", "일회성"], ["yes", "매월 반복"]])}</div>`, "내역 추가", form => {
    const transaction = { id: Date.now(), date: form.get("date"), kind: form.get("kind"), category: form.get("category"), detail: form.get("detail"), amount: Number(form.get("amount")), recurring: form.get("recurring") === "yes" };
    state.transactions.push(transaction);
    if (transaction.recurring) state.recurringTemplate = [...(state.recurringTemplate || []), { ...transaction, id: Date.now() + 1, date: "", recurring: true }];
    persist(); closeModal(); render(); toast("회계 내역을 추가했습니다.");
  });
}
function adjustPayModal(teacher) {
  showModal(`${escapeHtml(teacher.name)} 급여 조정`, `<div class="notice">출석 기반 계산 급여 ${money(payrollFor(teacher.name).base)} · 현재 조정 ${money(teacher.adjustment)}</div><div class="form-grid">${field("조정 금액 (차감은 음수)", "adjustment", "number", teacher.adjustment, 'step="1000"')}</div><p class="form-hint">조정 사유는 급여 내역서에 함께 기록됩니다.</p>`, "급여 저장", form => {
    teacher.adjustment = Number(form.get("adjustment")); persist(); closeModal(); render(); toast(`${teacher.name} 강사의 급여 조정 내용을 저장했습니다.`);
  });
}
function lessonFeedbackModal(lesson, readOnly = false) {
  const student = studentById(lesson.studentId);
  const feedback = lesson.feedback || {};
  const title = `${escapeHtml(student?.name || "원생")} · ${readOnly ? "수업 피드백" : "피드백 작성"}`;
  const fields = readOnly
    ? `<div class="feedback-detail"><span>집중 영역</span><strong>${escapeHtml(feedback.focusArea || "종합")}</strong></div>
      <div class="feedback-detail"><span>오늘 잘한 점</span><p>${escapeHtml(feedback.strengths || "기록 없음")}</p></div>
      <div class="feedback-detail"><span>다음에 보완할 점</span><p>${escapeHtml(feedback.focus || "기록 없음")}</p></div>
      <div class="feedback-detail"><span>다음 연습 과제</span><p>${escapeHtml(feedback.homework || "기록 없음")}</p></div>
      <div class="form-hint">작성 강사: ${escapeHtml(feedback.teacher || lesson.teacher)} · 수정일: ${escapeHtml(feedback.updatedAt || lesson.date)}</div>`
    : `<div class="notice">출석 완료된 1:1 레슨의 학습 내용을 기록합니다. 원생은 본인 계정에서 이 피드백을 확인할 수 있습니다.</div>
      <div class="form-grid">
        ${selectField("집중 영역", "focusArea", [["종합", "종합"], ["호흡", "호흡"], ["발성", "발성"], ["음정", "음정"], ["리듬", "리듬"], ["발음", "발음"], ["표현력", "표현력"]], feedback.focusArea || "종합")}
        <div class="form-field"><label>수업</label><input value="${escapeHtml(fullDate(lesson.date))} · ${escapeHtml(lesson.time)} · ${escapeHtml(lesson.type)}" disabled></div>
        <div class="form-field full"><label for="feedbackStrengths">오늘 잘한 점</label><textarea id="feedbackStrengths" name="strengths" maxlength="1000" placeholder="오늘 원생이 잘 해낸 부분을 구체적으로 적어주세요." required>${escapeHtml(feedback.strengths || "")}</textarea></div>
        <div class="form-field full"><label for="feedbackFocus">다음에 보완할 점</label><textarea id="feedbackFocus" name="focus" maxlength="1000" placeholder="다음 레슨에서 집중할 부분을 적어주세요." required>${escapeHtml(feedback.focus || "")}</textarea></div>
        <div class="form-field full"><label for="feedbackHomework">다음 연습 과제</label><textarea id="feedbackHomework" name="homework" maxlength="1000" placeholder="집에서 연습할 방법이나 분량을 적어주세요." required>${escapeHtml(feedback.homework || "")}</textarea></div>
      </div>`;
  showModal(title, fields, readOnly ? "닫기" : (lesson.feedback ? "피드백 수정" : "피드백 저장"), form => {
    if (readOnly) { closeModal(); return; }
    lesson.feedback = {
      focusArea: form.get("focusArea"),
      strengths: String(form.get("strengths")).trim(),
      focus: String(form.get("focus")).trim(),
      homework: String(form.get("homework")).trim(),
      teacher: lesson.teacher,
      updatedAt: todayKey
    };
    persist(); closeModal(); render(); toast(`${student?.name || "원생"} 학생의 레슨 피드백을 저장했습니다.`);
  });
  if (readOnly) {
    const submitButton = document.querySelector("#modalForm [type='submit']");
    submitButton.classList.remove("primary");
  }
}

function markAttendance(id) {
  const lesson = state.lessons.find(item => item.id === Number(id));
  if (!lesson || lesson.status !== "planned") return;
  const student = studentById(lesson.studentId);
  if (student && remaining(student) <= 0) {
    if (!confirm(`${student.name} 학생의 잔여 레슨이 없습니다. 출석 처리하고 수강료 미납으로 표시할까요?`)) return;
    student.due = Math.max(student.due, student.monthlyFee);
  }
  lesson.status = "present";
  state.activity.unshift({ text: `<strong>${escapeHtml(student?.name || "원생")}</strong> 학생의 출석이 기록되었어요.`, time: "방금", color: "green" });
  persist(); render(); toast("출석 처리 완료 · 잔여 횟수와 강사 급여를 업데이트했습니다.");
}
function exportPayroll() {
  const rows = [["정산월", "강사명", "담당분야", "출석수업", "회당급여", "수업급여", "조정금액", "지급예정액"]];
  state.teachers.forEach(teacher => {
    const payroll = payrollFor(teacher.name);
    rows.push([monthKey, teacher.name, teacher.subject, payroll.count, teacher.rate, payroll.base, payroll.adjustment, payroll.base + payroll.adjustment]);
  });
  const csv = "\uFEFF" + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = `보컬플로우_급여명세서_${monthKey}.csv`; anchor.click(); URL.revokeObjectURL(url);
  toast("급여명세서를 엑셀 호환 CSV 파일로 다운로드했습니다.");
}
function markNoShow(id) {
  const booking = state.bookings.find(item => item.id === Number(id));
  if (!booking || booking.status !== "booked") return;
  if (!confirm(`${booking.person}의 예약을 노쇼로 기록할까요?`)) return;
  booking.status = "noshow";
  const student = state.students.find(item => item.name === booking.person);
  if (student) student.noShows += 1;
  persist(); render();
  if (student && student.noShows >= state.settings.noShowLimit) toast(`${student.name} 학생이 노쇼 ${student.noShows}회로 예약 제한 기준에 도달했습니다.`);
  else toast("노쇼 기록을 저장했습니다.");
}
function generateRecurring() {
  if (state.settings.lastRecurringMonth === monthKey) { toast("이번 달 정기 내역은 이미 반영했습니다."); return; }
  const templates = state.recurringTemplate || [...new Map(state.transactions.filter(item => item.recurring).map(item => [item.detail, item])).values()];
  const current = new Date(`${monthKey}-01T12:00:00`);
  const entries = templates.map((item, index) => ({ ...item, id: Date.now() + index, date: `${monthKey}-${String(new Date(current.getFullYear(), current.getMonth(), Math.min(Number(String(item.date).slice(-2)) || index + 2, 28)).getDate()).padStart(2, "0")}` }));
  state.transactions.push(...entries); state.settings.lastRecurringMonth = monthKey; persist(); render(); toast(`${entries.length}건의 정기 회계 내역을 반영했습니다.`);
}
function displayRooms() {
  const rooms = ["연습실 1", "연습실 2", "연습실 3", "레슨실 A", "레슨실 B", "레슨실 C"];
  const bookings = state.bookings.filter(item => item.date === todayKey && item.status === "booked");
  const roomCards = rooms.map(room => {
    const booking = bookings.find(item => item.room === room && Number(item.start.slice(0, 2)) <= today.getHours() && Number(item.start.slice(0, 2)) + item.hours > today.getHours());
    return `<article class="display-room ${booking ? "occupied" : "free"}"><h2>${room}</h2><span>${booking ? "● 이용 중" : "● 이용 가능"}</span><div class="occupant">${booking ? escapeHtml(booking.person) : "예약 가능"}</div><p>${booking ? `${booking.start}부터 ${booking.hours}시간 예약` : "관리 데스크에서 예약하세요."}</p></article>`;
  }).join("");
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>보컬플로우 | 연습실 현황</title><link rel="stylesheet" href="${location.href.replace(/[^/]*$/, "styles.css")}"></head><body><main class="display-page"><header class="display-top"><a class="brand" href="#"><span class="brand-mark"><span></span><span></span><span></span></span><span class="brand-copy"><strong>vocalflow</strong><small>MUSIC STUDIO · ROOM STATUS</small></span></a><time class="display-clock" id="clock"></time></header><section class="display-room-grid">${roomCards}</section><button class="display-back" onclick="window.close()">창 닫기</button></main><script>function tick(){document.getElementById('clock').textContent=new Date().toLocaleString('ko-KR',{weekday:'long',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});}tick();setInterval(tick,30000);</script></body></html>`;
  const win = window.open("", "_blank");
  if (!win) { toast("팝업이 차단되어 있습니다. 브라우저에서 팝업을 허용해주세요."); return; }
  win.document.open(); win.document.write(html); win.document.close();
}

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    event.preventDefault();
    if (!rolePages[viewingRole].includes(pageButton.dataset.page)) { toast("현재 권한으로는 이 메뉴를 이용할 수 없습니다."); return; }
    currentPage = pageButton.dataset.page; render(); document.getElementById("sidebar").classList.remove("open"); return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "close-modal") closeModal();
  else if (action === "add-lesson") addLessonModal();
  else if (action === "attendance") markAttendance(id);
  else if (action === "edit-feedback") {
    const lesson = state.lessons.find(item => item.id === Number(id));
    if (lesson?.status === "present" && viewingRole !== "student") lessonFeedbackModal(lesson);
  }
  else if (action === "view-feedback") {
    const lesson = state.lessons.find(item => item.id === Number(id));
    if (lesson?.feedback) lessonFeedbackModal(lesson, true);
  }
  else if (action === "add-student") addStudentModal();
  else if (action === "add-teacher") addTeacherModal();
  else if (action === "payment") { const student = studentById(id); if (student) paymentModal(student); }
  else if (action === "remind-all") reminderModal(state.students.filter(student => student.due > 0));
  else if (action === "remind-student") { const student = studentById(id); if (student) reminderModal([student]); }
  else if (action === "book-room") bookingModal();
  else if (action === "noshow") markNoShow(id);
  else if (action === "add-transaction") transactionModal();
  else if (action === "delete-transaction") {
    const transaction = state.transactions.find(item => item.id === Number(id));
    if (transaction && confirm(`${transaction.detail} 내역을 삭제할까요?`)) { state.transactions = state.transactions.filter(item => item.id !== Number(id)); persist(); render(); toast("회계 내역을 삭제했습니다."); }
  }
  else if (action === "adjust-pay") { const teacher = state.teachers.find(item => item.id === Number(id)); if (teacher) adjustPayModal(teacher); }
  else if (action === "export-payroll") exportPayroll();
  else if (action === "generate-recurring") generateRecurring();
  else if (action === "display") displayRooms();
  else if (action === "add-user") userModal();
  else if (action === "edit-user") {
    if (viewingRole !== "owner" && viewingRole !== "manager") { toast("사용자 관리는 원장 또는 관리자 권한이 필요합니다."); return; }
    const user = state.users.find(item => item.id === Number(id));
    if (user) userModal(user);
  }
  else if (action === "toggle-user") {
    if (viewingRole !== "owner" && viewingRole !== "manager") { toast("사용자 관리는 원장 또는 관리자 권한이 필요합니다."); return; }
    const user = state.users.find(item => item.id === Number(id));
    if (!user) return;
    if (user.role === "owner" && viewingRole !== "owner") { toast("원장 계정은 원장만 관리할 수 있습니다."); return; }
    if (user.role === "owner" && user.active && state.users.filter(item => item.role === "owner" && item.active).length === 1) { toast("활성 상태의 원장 계정은 최소 1개 필요합니다."); return; }
    user.active = !user.active;
    persist(); render(); toast(`${user.name} 계정을 ${user.active ? "활성화" : "중지"}했습니다.`);
  }
  else if (action === "save-settings") {
    const limit = Number(document.getElementById("noShowLimit").value);
    if (limit < 1 || limit > 10) { toast("노쇼 제한 기준은 1~10회 사이로 설정해주세요."); return; }
    state.settings.noShowLimit = limit;
    document.querySelectorAll(".teacher-rate").forEach(input => { const teacher = state.teachers.find(item => item.id === Number(input.dataset.id)); if (teacher) teacher.rate = Math.max(0, Number(input.value)); });
    document.querySelectorAll(".teacher-room").forEach(input => { const teacher = state.teachers.find(item => item.id === Number(input.dataset.id)); if (teacher) teacher.fixedRoom = input.value; });
    state.teachers.forEach(teacher => {
      teacher.fixedDays = Array.from(document.querySelectorAll(`.teacher-day[data-id="${teacher.id}"]:checked`), input => Number(input.value));
    });
    persist(); render(); toast("운영 설정을 저장했습니다.");
  }
  else if (action === "guide") toast("좌측 메뉴에서 수업, 수납, 예약 기능을 확인해보세요.");
  else if (action === "reset-demo") {
    if (!confirm("이 브라우저에 저장된 예시 변경 내용을 지우고 초기 데모 데이터로 되돌릴까요?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      state = structuredClone(seed);
      persist();
      render();
      toast("데모 데이터를 초기 상태로 되돌렸습니다.");
    } catch (error) {
      console.error("데모 데이터를 초기화하지 못했습니다.", error);
      toast("데모 데이터를 초기화하지 못했습니다.");
    }
  }
});

document.addEventListener("change", event => {
  if (event.target.id === "roleSelect") {
    viewingRole = event.target.value; localStorage.setItem("vocalflow-role", viewingRole); render();
  }
  if (event.target.id === "scheduleDate") { selectedDate = event.target.value || todayKey; render(); }
});
document.addEventListener("input", event => {
  if (event.target.id === "studentSearch") {
    const cursor = event.target.selectionStart;
    studentSearch = event.target.value;
    render();
    const input = document.getElementById("studentSearch");
    if (input) { input.focus(); input.setSelectionRange(cursor, cursor); }
  }
});
document.getElementById("roleSelect").value = viewingRole;
document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
render();
