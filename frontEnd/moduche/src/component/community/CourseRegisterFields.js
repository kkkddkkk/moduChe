// src/component/community/CourseRegisterFields.jsx

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import { SubTitle } from "../common/Text";
import Paper from "../common/Paper";
import CustomTextField from "../common/CustomTextField";
import { RegisterTitle } from "../community/RegisterTitle";
import SearchMap from "../main/MapSearch"; // 주소 검색 컴포넌트 (파일 이름에 맞게 조정)
import { useEffect, useState } from "react";

export const CourseRegisterFields = ({ form, setForm, onChange, facility }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  // ====== 운영 주기(정기/비정기) 및 요일/주기 선택 로컬 상태 ======
  const [scheduleType, setScheduleType] = useState(form.scheduleType ?? "정기");
  const [selectedDays, setSelectedDays] = useState(form.selectedDays ?? []);
  const [selectedWeeks, setSelectedWeeks] = useState(form.selectedWeeks ?? []);

  // 최초 한 번 form 값으로 동기화
  useEffect(() => {
    setScheduleType(form.scheduleType ?? "정기");
    setSelectedDays(form.selectedDays ?? []);
    setSelectedWeeks(form.selectedWeeks ?? []);
  }, [form]);

  // 정기/비정기 선택
  const handleScheduleTypeChange = (e) => {
    const value = e.target.value;
    setScheduleType(value);
    setForm((prev) => {
      const next = { ...prev, scheduleType: value };
      if (value === "정기") {
        // 정기로 바꾸면 customDate 초기화
        next.customDate = "";
      } else {
        // 비정기면 요일/주기 초기화
        next.selectedDays = [];
        next.selectedWeeks = [];
        next.weekFrequency = "매주";
      }
      return next;
    });
  };

  const handleWeekToggle = (week) => {
    const next = selectedWeeks.includes(week)
      ? selectedWeeks.filter((w) => w !== week)
      : [...selectedWeeks, week];
    setSelectedWeeks(next);
    setForm((prev) => ({ ...prev, selectedWeeks: next }));
  };

  const handleDayToggle = (day) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(next);
    setForm((prev) => ({ ...prev, selectedDays: next }));
  };

  const handleWeekFrequency = (value) => {
    setForm((prev) => ({ ...prev, weekFrequency: value }));
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <>
      {/* ================== 1. 시설 정보 블럭 (읽기 전용) ================== */}
      <Grid size={isMobile || isTablet ? 12 : 6}>
        <SubTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 2,
          }}
        >
          시설 정보
        </SubTitle>
        <Paper
          sx={{
            p: 3,
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              width: 4,
              height: "100%",
              borderRadius: `100px 0 0 100px`,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {/* 시설명 */}
          <Grid size={12} sx={{ mb: 2 }}>
            <RegisterTitle title="시설명" />
            <CustomTextField
              data={form.facilityName || facility?.facilityName || ""}
              setData={() => {}}
              disabled={true}
              padding={10}
            />
          </Grid>

          {/* 시설 주소 */}
          <Grid size={12}>
            <RegisterTitle title="시설 주소" />
            <CustomTextField
              data={form.facilityAddress || facility?.facilityAddress || ""}
              setData={() => {}}
              disabled={true}
              padding={10}
            />
          </Grid>
        </Paper>
      </Grid>

      {/* ================== 2. 실제 활동 위치 (주소검색 사용) ================== */}
      <Grid size={isMobile || isTablet ? 12 : 6}>
        <SubTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 2,
          }}
        >
          실제 활동 위치
        </SubTitle>
        <Paper
          sx={{
            p: 3,
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              width: 4,
              height: "100%",
              borderRadius: `100px 0 0 100px`,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {/* 활동 장소 이름 */}
          <Grid size={12} sx={{ mb: 2 }}>
            <RegisterTitle title="활동 장소 이름" />
            <CustomTextField
              data={form.activityPlaceName || ""}
              setData={(v) =>
                setForm((prev) => ({ ...prev, activityPlaceName: v }))
              }
              placeholder="예: ○○ 체육관, ○○ 복지관 등"
              padding={10}
            />
          </Grid>

          {/* 주소 검색 */}
          <Grid container size={12} sx={{ mb: 1 }}>
            <RegisterTitle title="활동 주소" />
            <SearchMap
              loca={form.activityAddress || ""}
              setLoca={(addr) =>
                setForm((prev) => ({ ...prev, activityAddress: addr }))
              }
              lat={form.activityGeoLat}
              setLat={(lat) =>
                setForm((prev) => ({ ...prev, activityGeoLat: lat }))
              }
              lng={form.activityGeoLng}
              setLng={(lng) =>
                setForm((prev) => ({ ...prev, activityGeoLng: lng }))
              }
              disabled={false}
            />
          </Grid>

          {/* 상세 주소 */}
          <Grid size={12}>
            <CustomTextField
              data={form.activityAddressDetail || ""}
              setData={(v) =>
                setForm((prev) => ({ ...prev, activityAddressDetail: v }))
              }
              placeholder="상세 주소를 입력해주세요"
              padding={10}
            />
          </Grid>
        </Paper>
      </Grid>

      {/* ================== 3. 운영 / 세션 설정 블럭 (기존 로직 복구) ================== */}
      <Grid size={12} sx={{ mt: 3 }}>
        <SubTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 2,
          }}
        >
          운영 정보
        </SubTitle>
        <Paper
          sx={{
            p: 3,
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              width: 4,
              height: "100%",
              borderRadius: `100px 0 0 100px`,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {/* 최대 인원, 포맷, 타입 등 기존 필드가 있었다면 여기 붙이면 됨 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <RegisterTitle title="최대 모집 인원" />
              <TextField
                name="maxParticipants"
                type="number"
                fullWidth
                placeholder="1"
                value={form.maxParticipants || ""}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RegisterTitle title="진행 방식" />
              <TextField
                name="format"
                fullWidth
                placeholder="OFFLINE / ONLINE / HYBRID"
                value={form.format || "OFFLINE"}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RegisterTitle title="강좌 타입 코드" />
              <TextField
                name="courseType"
                fullWidth
                placeholder="예: BBALL, SWIM ..."
                value={form.courseType || ""}
                onChange={onChange}
              />
            </Grid>
          </Grid>

          {/* === 활동 주기 (정기 / 비정기) === */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RegisterTitle title="활동 주기" />
            </Grid>

            {/* 정기/비정기 라디오 */}
            <Grid item xs={12}>
              <FormControl>
                <RadioGroup
                  row
                  value={scheduleType}
                  onChange={handleScheduleTypeChange}
                >
                  <FormControlLabel
                    value="정기"
                    control={<Radio />}
                    label="정기"
                  />
                  <FormControlLabel
                    value="비정기"
                    control={<Radio />}
                    label="비정기"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* 정기일 때: 매주/격주/매월 + 요일 선택 */}
            {scheduleType === "정기" && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: theme.palette.text.secondary }}
                  >
                    주기 선택
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {["매주", "격주", "매월"].map((w) => (
                      <Button
                        key={w}
                        size="small"
                        variant={
                          form.weekFrequency === w ? "contained" : "outlined"
                        }
                        onClick={() => handleWeekFrequency(w)}
                      >
                        {w}
                      </Button>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: theme.palette.text.secondary }}
                  >
                    요일 선택
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                      <Button
                        key={d}
                        size="small"
                        variant={
                          selectedDays.includes(d) ? "contained" : "outlined"
                        }
                        onClick={() => handleDayToggle(d)}
                      >
                        {d}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </>
            )}

            {/* 비정기일 때: 설명 텍스트 */}
            {scheduleType === "비정기" && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: theme.palette.text.secondary }}
                >
                  활동 일정 설명
                </Typography>
                <CustomTextField
                  data={form.operationSchedule || ""}
                  setData={(v) =>
                    setForm((prev) => ({ ...prev, operationSchedule: v }))
                  }
                  placeholder="예: 5월 5일, 8월 중 3회 등"
                  padding={10}
                />
              </Grid>
            )}
          </Grid>

          {/* === 세션 기간 / 시간 === */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <RegisterTitle title="세션 시작일" />
              <TextField
                name="sessionStartDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.sessionStartDate || ""}
                onChange={onChange}
                inputProps={{ min: todayStr }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <RegisterTitle title="세션 종료일" />
              <TextField
                name="sessionEndDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.sessionEndDate || ""}
                onChange={onChange}
                inputProps={{ min: todayStr }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <RegisterTitle title="시작 시간" />
              <TextField
                name="sessionStartTime"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.sessionStartTime || ""}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <RegisterTitle title="종료 시간" />
              <TextField
                name="sessionEndTime"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.sessionEndTime || ""}
                onChange={onChange}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};
