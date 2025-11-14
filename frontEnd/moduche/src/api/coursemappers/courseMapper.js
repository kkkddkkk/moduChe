/** 서버 응답 → CourseHeader 컴포넌트 props로 변환 */
export const mapHeaderToProps = (data) => {
  const sessions = (data.sessions || []).map((s) => ({
    id: s.id,
    label: s.label,
    remaining: s.remaining ?? undefined,
  }));

  return {
    titleText: data.title,
    bylineName: data.bylineName,
    bylineOrg: data.bylineOrg,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    scheduleLine: data.scheduleLine,
    tags: data.tags || [],
    locationText: data?.facility?.addressLine || undefined,

    sessions,
    datesBySession: data.datesBySession || {},
    defaultSessionId: data.defaultSessionId || "",
    defaultDate: data.defaultDate || "",
  };
};
