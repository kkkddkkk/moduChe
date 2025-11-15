// 동아리 소개 기본 양식 (HTML 문자열 형태)
const communityTemplate = `
  <p style="color: #888; font-style: italic;">
    ※ 본 양식은 예시 가이드입니다. 자유롭게 삭제, 수정하여 동호회를 표현해주세요.
  </p>
  <br/>

  <h2><strong>동호회 소개</strong></h2>
  <p class="ql-indent-1">
    <strong>[동호회 이름]</strong>에 오신 것을 환영합니다!<br/>저희는 <strong>[활동 주제]</strong>를 사랑하는 사람들이 모여 함께 즐겁게 활동하는 커뮤니티입니다.
  </p>

  <br/>

  <h2><strong>접근성 및 지원 안내</strong></h2>
  <ul>
    <li>장소: [장소명 및 접근성 안내 – 예: 휠체어 접근 가능]</li>
    <li>보조 인력: [보조 인력/자원봉사자 상시 대기 여부]</li>
    <li>운동 강도: [저강도 / 중강도 / 고강도 등 선택]</li>
    <li>참여 방식: [개별 참여 / 보호자 동반 참여 가능]</li>
  </ul>

  <br/>

  <h2><strong>주요 활동 내용</strong></h2>
  <ul>
    <li>주요 활동 내용 (1)</li>
    <li>주요 활동 내용 (2)</li>
    <li>주요 활동 내용 (3)</li>
  </ul>

  <br/>

  <h2><strong>이런 분들께 추천해요</strong></h2>
  <ul>
    <li>추천 대상 (1)</li>
    <li>추천 대상 (2)</li>
    <li>추천 대상 (3)</li>
  </ul>

  <br/>

  <h2><strong>준비물</strong></h2>
  <ul>
    <li>준비물 (1)</li>
    <li>준비물 (2)</li>
    <li>준비물 (3)</li>
  </ul>

  <br/>
  <h2><strong>가입 안내</strong></h2>
  <p class="ql-indent-1">
    우측 상단의 <strong>"동호회 가입"</strong> 버튼을 눌러 신청해주세요.<br/>가입 승인 후 단체 채팅방으로 초대드립니다.
  </p>

  <br/>

  <h2><strong>문의 및 연락처</strong></h2>
  <p class="ql-indent-1">
    궁금한 사항이 있거나, 개별적인 조정이 필요한 경우 아래 연락처로 문의해주세요.<br/><strong>[이메일 / 연락처 / SNS 링크 등]</strong>
  </p>
`;
export default communityTemplate;