// src/api/coursemappers/courseMapper.js

// 🔹 요일 비트마스크 → "월수금"
const dowMaskToKorean = (mask) => {
  if (!mask) return "";
  const labels = ["월", "화", "수", "목", "금", "토", "일"];
  const m = String(mask).padEnd(7, "0");
  let out = "";
  for (let i = 0; i < 7; i++) {
    if (m[i] === "1") out += labels[i];
  }
  return out;
};

// 🔹 interval 숫자 → "매주"/"격주"/"매월"
const intervalToText = (interval) => {
  if (!interval || interval === 1) return "매주";
  if (interval === 2) return "격주";
  if (interval === 4) return "매월";
  return "매주";
};

const formatDate = (iso) => (iso ? iso.replaceAll("-", ".") : null);

// 🔹 위치 문자열 만들기
const buildLocationText = (header, desc) => {
  // 1순위: 강좌용 활동 위치 (외부 체육관 등)
  const activityName = header.activityPlaceName;
  const activityAddr = header.activityAddress;
  const activityDetail = header.activityAddressDetail;

  // facility 객체 + flat 필드 둘 다 케어
  const facility = header.facility ?? null;

  const facilityName =
    header.facilityName ?? facility?.name ?? facility?.facilityName ?? null;

  const facilityAddress =
    header.facilityAddress ??
    facility?.addressLine ??
    facility?.facilityAddress ??
    facility?.address ??
    null;

  // desc에 따로 주소 라인 있으면 이것도 후보
  const descAddressLine = desc?.addressLine ?? null;

  // 활동장소 우선
  if (activityName || activityAddr || activityDetail) {
    const parts = [];
    if (activityName) parts.push(activityName);
    if (activityAddr) parts.push(activityAddr);
    if (activityDetail) parts.push(activityDetail);
    return parts.join(" · ");
  }

  // 그다음 desc 주소
  if (descAddressLine) return descAddressLine;

  // 마지막으로 시설 정보
  if (facilityName || facilityAddress) {
    return [facilityName, facilityAddress].filter(Boolean).join(" · ");
  }

  return "장소 정보 없음";
};

// 🔹 운영 주기 문자열 만들기
const buildScheduleLine = (header, sessions) => {
  // 1순위: 서버에서 이미 만들어준 scheduleLine
  if (header.scheduleLine && header.scheduleLine.trim()) {
    return header.scheduleLine;
  }

  // 2순위: 우리가 저장해 둔 operationSchedule (예: "매주 화목 19:00~21:00")
  if (header.operationSchedule && header.operationSchedule.trim()) {
    return header.operationSchedule;
  }

  // 3순위: 세션 데이터를 기반으로 조합
  if (!sessions || sessions.length === 0) return null;

  const s = sessions[0]; // 대표 세션 하나만 잡아서

  const freq = intervalToText(s.interval);
  const days = dowMaskToKorean(s.dowMask);
  const time = s.startTime && s.endTime ? `${s.startTime} ~ ${s.endTime}` : "";

  const parts = [freq, days, time].filter(Boolean);
  return parts.join(" ");
};

export function mapHeaderToProps(header, desc) {
  if (!header) return null;

  // ====== 1) 세션 / 날짜 ======
  const rawSessions = header.sessions ?? [];
  const datesBySession = header.datesBySession ?? {};

  // 필요시 세션 표준화 (필드 이름 섞여 있어도 방어)
  const sessions = rawSessions.map((s, idx) => ({
    id: s.sessionId ?? s.id ?? String(idx + 1),
    startDate: s.startDate ?? null,
    endDate: s.endDate ?? null,
    startTime: s.startTime ?? null,
    endTime: s.endTime ?? null,
    interval: s.interval ?? 1,
    dowMask: s.dowMask ?? "0000000",
    remaining: s.remaining ?? 0,
    // dates가 세션 안에 있다면 이것도 보존
    dates: Array.isArray(s.dates) ? s.dates : undefined,
  }));

  const normalizedDatesBySession = {};
  sessions.forEach((s) => {
    // 1순위: header.datesBySession
    if (Array.isArray(datesBySession[s.id])) {
      normalizedDatesBySession[s.id] = datesBySession[s.id];
    } else if (Array.isArray(s.dates)) {
      // 2순위: 세션 내부 dates
      normalizedDatesBySession[s.id] = s.dates;
    } else {
      normalizedDatesBySession[s.id] = [];
    }
  });

  const defaultSessionId = header.defaultSessionId || sessions[0]?.id || null;
  const defaultDate =
    header.defaultDate ||
    (defaultSessionId && normalizedDatesBySession[defaultSessionId]?.[0]) ||
    null;

  // ====== 2) 태그 ======
  const headerTags = header.tags ?? [];
  const descTags = desc?.tagNames ?? desc?.tags ?? [];
  const tags = Array.from(
    new Set([
      ...headerTags.map((t) => (typeof t === "string" ? t : t?.name ?? "")),
      ...descTags.map((t) => (typeof t === "string" ? t : t?.name ?? "")),
    ])
  ).filter(Boolean);

  // ====== 3) 위치 / 기간 / 주기 ======
  const locationText = buildLocationText(header, desc);

  const periodStart =
    header.periodStart ||
    (sessions[0]?.startDate ? formatDate(sessions[0].startDate) : null);
  const periodEnd =
    header.periodEnd ||
    (sessions[0]?.endDate ? formatDate(sessions[0].endDate) : null);

  const scheduleLine = buildScheduleLine(header, sessions);

  // ====== 4) 바이라인 (강사 / 기관) ======
  const facility = header.facility ?? null;
  const facilityName =
    header.facilityName ?? facility?.name ?? facility?.facilityName ?? null;

  const bylineName =
    header.bylineName || header.instructorName || header.creatorName || null;

  const bylineOrg = header.bylineOrg || facilityName || null;

  // ====== 5) 최종 ui 객체 ======
  return {
    // 상단 헤더 카드
    titleText: header.title ?? "Untitled Course",
    bylineName: bylineName ?? "Instructor",
    bylineOrg: bylineOrg ?? "Organization",

    periodStart,
    periodEnd,
    scheduleLine,

    // 세션 / 날짜
    sessions,
    datesBySession: normalizedDatesBySession,
    defaultSessionId,
    defaultDate,

    // 태그
    tags,

    // 위치
    locationText,

    // 기타 데이터
    facility,
    thumbnailUrl: header.thumbnailUrl ?? null,
    maxParticipants: header.maxParticipants ?? 0,
    format: header.format ?? null,
    status: header.status ?? null,
  };
}
