// src/component/community/CourseRegisterFields.jsx

import {
  Autocomplete,
  Box,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  alpha,
} from "@mui/material";
import { CalendarCheck, ClipboardList, Receipt } from "lucide-react";
import { SubTitle } from "../common/Text";
import { RegisterTitle } from "./RegisterTitle";
import CustomTextField from "../common/CustomTextField";
import Paper from "../common/Paper";
import { useEffect, useState } from "react";

// 🔥 회원가입 때 쓰던 시설 검색 API 재사용
import { getFacilityList } from "../../api/accountAPI/signInAPI";

export const CourseRegisterFields = ({
  form,
  setForm,
  onChange,
  facility,
  setFacility,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  // ✅ 시설 자동완성용 상태
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState("");

  // 🔍 시설명 검색 → 백엔드에서 목록 가져오기
  useEffect(() => {
    if (search.length < 2) {
      setFacilities([]);
      return;
    }

    const fetch = async () => {
      try {
        const res = await getFacilityList(search); // 회원가입에서 쓰던 거 그대로
        setFacilities(res.data);
      } catch (e) {
        console.error("시설 목록 조회 실패:", e);
      }
    };

    fetch();
  }, [search]);

  return (
    <>
      {/* 기본 정보 */}
      <Grid size={isMobile || isTablet ? 12 : 6} sx={{ mb: 2 }}>
        <SubTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 2,
          }}
        >
          <ClipboardList color={theme.palette.primary.main} />
          기본 정보
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
          {/* 강좌명 */}
          <Grid size={12} sx={{ mb: 3 }}>
            <RegisterTitle title={"강좌명"} />
            <CustomTextField
              data={form.name || ""}
              setData={(value) =>
                setForm((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
              placeholder="예: Adaptive Pilates — Core Strength for All"
              padding={10}
            />
          </Grid>

          {/* 강사명 (지금은 백엔드에 안 보내지만 UI는 유지) */}
          <Grid size={12} sx={{ mb: 3 }}>
            <RegisterTitle title={"강사명"} />
            <CustomTextField
              data={form.instructor || ""}
              setData={(value) =>
                setForm((prev) => ({
                  ...prev,
                  instructor: value,
                }))
              }
              placeholder="예: Jamie Park"
              padding={10}
            />
          </Grid>

          {/* 강좌 종목 (화면용) */}
          <Grid size={12} sx={{ mb: 3 }}>
            <RegisterTitle title={"강좌 종목"} />
            <CustomTextField
              data={form.courseTypeName || ""}
              setData={(value) =>
                setForm((prev) => ({
                  ...prev,
                  courseTypeName: value,
                }))
              }
              placeholder={"예: 요가, 수영, 농구, 배드민턴"}
              padding={10}
            />
          </Grid>

          {/* ✅ 시설명 선택 (Autocomplete) */}
          <Grid size={12} sx={{ mb: 3 }}>
            <RegisterTitle title={"시설명"} />
            <Autocomplete
              options={facilities}
              getOptionLabel={(option) => option.name?.toString() || ""}
              value={facility || null}
              onChange={(event, newValue) => {
                setFacility(newValue || null);

                setForm((prev) => ({
                  ...prev,
                  facilityId: newValue ? newValue.id : null, // 🔥 PK
                  facilityName: newValue ? newValue.name : "",
                  address: newValue ? newValue.loca : "",
                }));
              }}
              renderOption={(props, option, { index }) => (
                <li {...props} key={index}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>{option.name}</Typography>
                    <Tooltip title={option.loca} arrow placement="right">
                      <Typography>
                        {option.loca && option.loca.length > 15
                          ? option.loca.substring(0, 15) + "..."
                          : option.loca}
                      </Typography>
                    </Tooltip>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="시설명을 입력해서 검색"
                  variant="standard"
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
              isOptionEqualToValue={(option, val) => option.id === val?.id}
              noOptionsText="등록되지 않은 시설입니다."
            />
          </Grid>

          {/* 최대 참가 인원 */}
          <Grid size={12}>
            <RegisterTitle title={"최대 참가 인원"} />
            <TextField
              name="maxParticipants"
              type="number"
              fullWidth
              placeholder="예: 10"
              value={form.maxParticipants || ""}
              onChange={onChange}
            />
          </Grid>
        </Paper>
      </Grid>

      {/* 운영 일정 */}
      <Grid size={isMobile || isTablet ? 12 : 6}>
        <SubTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 2,
          }}
        >
          <CalendarCheck color={theme.palette.primary.main} />
          운영 일정
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
          {/* 위치 – 시설 선택하면 자동 채워짐 (읽기 전용) */}
          <Grid container size={12} sx={{ mb: 4.5 }}>
            <RegisterTitle title={"활동 위치"} />
            <CustomTextField
              data={form.address || ""}
              setData={() => {}}
              placeholder="시설 선택 시 주소가 자동으로 입력됩니다."
              padding={10}
              disabled
            />
          </Grid>

          {/* 기간 */}
          <Grid container sx={{ mb: 4.5 }}>
            <Grid item size={6}>
              <RegisterTitle title={"시작일"} />
              <TextField
                type="date"
                name="startDate"
                value={form.startDate || ""}
                onChange={onChange}
              />
            </Grid>
            <Grid item size={6}>
              <RegisterTitle title={"종료일"} />
              <TextField
                type="date"
                name="endDate"
                value={form.endDate || ""}
                onChange={onChange}
              />
            </Grid>
          </Grid>

          {/* 운영 주기 */}
          <Grid item size={12} sx={{ mb: 2.4 }}>
            <RegisterTitle title={"운영 주기"} />
            <CustomTextField
              data={form.scheduleInfo || ""}
              setData={(value) =>
                setForm((prev) => ({
                  ...prev,
                  scheduleInfo: value,
                }))
              }
              placeholder="예: Weekly • Tue/Thu • 8 Sessions / 4 Weeks"
              padding={10}
            />
          </Grid>
        </Paper>
      </Grid>

      {/* 수강료 및 세션 */}
      <Grid size={12} sx={{ mt: 2 }}>
        <SubTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 2,
          }}
        >
          <Receipt color={theme.palette.primary.main} />
          수강료 및 세션
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
          <Grid container size={12}>
            <Grid item size={5.5}>
              {/* 수강료 */}
              <RegisterTitle title={"수강료"} sx={{ mt: 3 }} />
              <TextField
                name="price"
                type="number"
                fullWidth
                placeholder="예: 120000"
                value={form.price || ""}
                onChange={onChange}
                sx={{ mb: 3 }}
              />

              {/* 환불 정책 */}
              <RegisterTitle title={"환불 정책"} />
              <CustomTextField
                data={form.refundPolicy || ""}
                setData={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    refundPolicy: value,
                  }))
                }
                placeholder="예: 첫 수업 24시간 전 100% 환불"
              />
            </Grid>

            <Grid item size={1} />

            {/* 세션 구성 */}
            <Grid item size={5.5}>
              <RegisterTitle title={"세션 구성"} />
              <CustomTextField
                data={form.sessionInfo || ""}
                setData={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    sessionInfo: value,
                  }))
                }
                placeholder="예: Block A (Nov 1–30) / Session 1: Nov 07 19:00"
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};
