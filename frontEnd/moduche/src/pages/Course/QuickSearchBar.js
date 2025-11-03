// QuickSearchAirbnb_WidthAnim.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search, MapPin, Users, X } from "lucide-react";
import { OneAlignedButton } from "../../component/common/Button";

/**
 * ✅ 한 줄 전체 클릭으로 네이티브 날짜 피커 오픈되는 필드
 *  - 크롬/엣지: inputRef.showPicker() 사용
 *  - 기타 브라우저: focus() 폴백
 */
function ClickableDateField({ label, value, onChange, onActivate, width }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <Box
      sx={{ width, flexShrink: 0, cursor: "text" }}
      onClick={(e) => {
        e.stopPropagation(); // 부모 Paper의 확장 클릭과 충돌 방지
        onActivate?.();
        openPicker();
      }}
      onMouseDown={(e) => {
        // 클릭 즉시 피커가 뜨도록 기본 포커스/선택 동작 차단
        e.preventDefault();
      }}
    >
      <TextField
        fullWidth
        variant="standard"
        label={label}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputRef={inputRef}
        // 모바일에서 키보드 대신 네이티브 피커만 쓰고 싶다면 주석 해제
        // inputProps={{ readOnly: true }}
        onFocus={onActivate}
      />
    </Box>
  );
}

export default function QuickSearchAirbnb_WidthAnim() {
  const [expanded, setExpanded] = useState(false);
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [who, setWho] = useState("");
  const [when, setWhen] = useState({ from: "", to: "" });
  const rootRef = useRef(null);

  // ===== Layout constants =====
  const LOGO_W = 64; // 로고 슬롯 폭
  const SLOT = 260; // 무엇을/어디서/누가 동일 폭
  const DATE_SLOT = 160; // 시작/종료 폭
  const GAP = 12; // 요소 간 간격
  const SIDE_PAD = 16; // Paper 좌우 패딩

  // 펼칠 영역(어디서+누가) 목표 폭
  const EXPAND_W = SLOT + GAP + 1 + GAP + SLOT;

  // 바깥 클릭 시 접기
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setExpanded(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearch = () => {
    console.log({ what, where, who, ...when });
    // setExpanded(false); // 검색 후 자동 접기 원하면 주석 해제
  };

  // 세로 구분선 (1px 고정)
  const Sep = () => (
    <Box
      sx={{
        width: "1px",
        height: 40,
        bgcolor: "divider",
        mx: `${GAP / 2}px`,
        flexShrink: 0,
      }}
    />
  );

  return (
    <Box display="flex" justifyContent="center">
      <Paper
        ref={rootRef}
        onClick={() => setExpanded(true)}
        sx={{
          width: "100%",
          maxWidth: expanded ? 820 + EXPAND_W + 140 : 820,
          px: `${SIDE_PAD}px`,
          py: 1.25,
          borderRadius: 9999,
          boxShadow: expanded ? 8 : 2,
          transition:
            "max-width .26s ease, box-shadow .24s ease, transform .24s ease",
          cursor: "pointer",
          "&:focus-within": { boxShadow: 8, transform: "translateY(-1px)" },
          overflow: "hidden", // 내부 잔상 잘림
          bgcolor: "rgba(255,255,255,.92)",
        }}
      >
        {/* 한 줄 고정 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: `${GAP}px`,
            flexWrap: "nowrap",
            minWidth: 0,
            bgcolor: "transparent",
          }}
        >
          {/* 로고 슬롯 */}
          <Box
            sx={{
              width: `${LOGO_W}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/logo/MODUCHE_LOGO.png"
              alt="모두의체육관"
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                objectFit: "contain",
                boxShadow: 1,
              }}
            />
          </Box>

          {/* 무엇을 — 고정폭 */}
          <Box sx={{ width: `${SLOT}px`, flexShrink: 0 }}>
            <TextField
              fullWidth
              variant="standard"
              label="무엇을 (강좌/태그)"
              placeholder="예) 요가, 명상, 초급"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              onFocus={() => setExpanded(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Sep />

          {/* 시작일 — 필드 전체 클릭으로 피커 오픈 */}
          <ClickableDateField
            label="시작일"
            value={when.from}
            onChange={(v) => setWhen((p) => ({ ...p, from: v }))}
            onActivate={() => setExpanded(true)}
            width={`${DATE_SLOT}px`}
          />

          <Sep />

          {/* 종료일 — 필드 전체 클릭으로 피커 오픈 */}
          <ClickableDateField
            label="종료일"
            value={when.to}
            onChange={(v) => setWhen((p) => ({ ...p, to: v }))}
            onActivate={() => setExpanded(true)}
            width={`${DATE_SLOT}px`}
          />

          {/* 펼쳐지는 그룹: 어디서 + 누가 */}
          <Box
            sx={{
              transform: expanded ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform .26s ease, opacity .12s ease",
              opacity: expanded ? 1 : 0,

              // 합성/잔상 방지
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              contain: "paint",
              isolation: "isolate",

              bgcolor: "transparent",
              background: "transparent",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              flexShrink: 0,

              width: `${SLOT * 2 + GAP * 2 + 2}px`,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Sep />

            {/* 어디서 */}
            <Box sx={{ width: `${SLOT}px`, flexShrink: 0 }}>
              <TextField
                fullWidth
                variant="standard"
                label="어디서 (지역/센터)"
                placeholder="예) 서울, 경기도 수원"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                InputProps={{
                  disableUnderline: true, // ← 밑줄 완전 비활성화
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={16} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  // 표준 밑줄의 before/after 라인 제거 (혹시 남는 경우 대비)
                  "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                    borderBottom: "none !important",
                  },
                  // 인풋 포커스 아웃라인 제거
                  "& .MuiInputBase-input:focus": { outline: "none" },
                  // 자동완성 배경/라인 제거 (크롬)
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                    WebkitTextFillColor: "inherit",
                    transition: "background-color 9999s ease-out 0s",
                  },
                  // 배경 투명 유지
                  "& .MuiInputBase-root, & .MuiInputBase-input": {
                    backgroundColor: "transparent",
                  },
                }}
              />
            </Box>

            <Sep />

            {/* 누가 */}
            <Box sx={{ width: `${SLOT}px`, flexShrink: 0 }}>
              <TextField
                fullWidth
                variant="standard"
                label="누가 (장애)"
                placeholder="예) 시각, 청각, 지체"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                InputProps={{
                  disableUnderline: true, // ← 밑줄 완전 비활성화
                  startAdornment: (
                    <InputAdornment position="start">
                      <Users size={16} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                    borderBottom: "none !important",
                  },
                  "& .MuiInputBase-input:focus": { outline: "none" },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                    WebkitTextFillColor: "inherit",
                    transition: "background-color 9999s ease-out 0s",
                  },
                  "& .MuiInputBase-root, & .MuiInputBase-input": {
                    backgroundColor: "transparent",
                  },
                }}
              />
            </Box>
          </Box>

          {/* 우측 버튼 */}
          <Box
            sx={{
              ml: "auto",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <OneAlignedButton
              onClick={(e) => {
                e.stopPropagation();
                handleSearch();
              }}
              buttonSx={{ borderRadius: "9999px", px: 2.4, py: 1, minWidth: 0 }}
            >
              <Search size={18} />
            </OneAlignedButton>

            {expanded && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
              >
                <X size={18} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
