export function mapHeaderToProps(header, desc) {
  return {
    titleText: header.title ?? "Untitled Course",
    bylineName: header.bylineName ?? "Instructor",
    bylineOrg: header.bylineOrg ?? "Organization",

    periodStart: header.periodStart ?? null,
    periodEnd: header.periodEnd ?? null,
    scheduleLine: header.scheduleLine ?? "Schedule",

    sessions: header.sessions ?? [],
    datesBySession: header.datesBySession ?? {},
    defaultSessionId: header.defaultSessionId ?? null,

    tags: header.tags ?? [],
    facility: header.facility ?? null,

    thumbnailUrl: header.thumbnailUrl ?? null,
    maxParticipants: header.maxParticipants ?? 0,
    format: header.format ?? null,
    status: header.status ?? null,

    // 위치 한 줄
    locationText:
      desc?.addressLine ??
      header.facility?.facilityAddress ??
      header.facility?.facilityName ??
      "장소 정보 없음",
  };
}
