// QuickSearchTopDrawer.jsx
import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Drawer,
  Stack,
  IconButton,
} from "@mui/material";
import { Search, MapPin, Users, X } from "lucide-react";
import { OneAlignedButton } from "../../component/common/Button";
import Paper from "../../component/common/Paper";

/** ✅ 한 줄 전체 클릭으로 네이티브 날짜 피커 열기 */
function ClickableDateField({
  label,
  value,
  onChange,
  width,
  onActivate,
  fullWidth,
}) {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (inputRef.current?.showPicker) inputRef.current.showPicker();
    else inputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : width,
        flexShrink: 0,
        cursor: "text",
      }}
      onClick={(e) => {
        e.stopPropagation(); // 부모(Paper/Drawer) 클릭과 충돌 방지
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
        inputRef={inputRef}
        InputLabelProps={{ shrink: true }}
        // 밑줄 제거 원하면:
        // InputProps={{ disableUnderline: true }}
        // sx={{ "& .MuiInput-underline:before, & .MuiInput-underline:after": { borderBottom: "none" } }}
      />
    </Box>
  );
}

export default function QuickSearchTopDrawer() {
  const [open, setOpen] = useState(false);
  const [ignoreOpen, setIgnoreOpen] = useState(false);

  // 폼 상태
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [who, setWho] = useState("");
  const [when, setWhen] = useState({ from: "", to: "" });

  const logoSrc = "/logo/MODUCHE_LOGO.png";
  const APPBAR_H_MOBILE = 56; // xs
  const APPBAR_H_DESKTOP = 64;

  // ✅ 검색 버튼에서: 전파 차단 + 즉시 재오픈 방지 플래그
  const handleSearch = (e) => {
    e?.stopPropagation?.();
    setIgnoreOpen(true);
    setOpen(false);
    setTimeout(() => setIgnoreOpen(false), 220); // 드로어 close 트랜지션 길이에 맞춰 조정
    console.log({ what, where, who, ...when });
  };

  // ✅ 백드롭/ESC로 닫힐 때도 재오픈 방지 플래그 사용
  const handleClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      setOpen(false);
      setIgnoreOpen(true);
      setTimeout(() => setIgnoreOpen(false), 220);
    }
  };

  return (
    <>
      {/* ===== 1) 상단 압축 바 ===== */}
      <Box display="flex" justifyContent="center">
        <Paper
          onClick={() => {
            if (!open && !ignoreOpen) setOpen(true);
          }}
          sx={{
            width: "100%",
            maxWidth: 820,
            px: 2,
            py: 1.25,
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            boxShadow: 3,
            transition: "all .2s",
            cursor: "pointer",
            "&:hover": { boxShadow: 6, transform: "translateY(-1px)" },
          }}
        >
          {/* 왼쪽: 로고 + 입력 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* 로고 */}
            <Box
              component="img"
              src={logoSrc}
              alt="Everyone's Gym"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                objectFit: "contain",
                boxShadow: 1,
                flexShrink: 0,
              }}
            />

            {/* 무엇을 */}
            <Box sx={{ flex: "0 1 240px", maxWidth: 320, minWidth: 180 }}>
              <TextField
                fullWidth
                variant="standard"
                label="무엇을 (강좌/태그)"
                placeholder="예) 요가, 명상, 초급"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                onFocus={() => setOpen(true)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* 시작일 — 전체 클릭 오픈 */}
            <ClickableDateField
              label="시작일"
              value={when.from}
              onChange={(v) => setWhen((p) => ({ ...p, from: v }))}
              onActivate={() => setOpen(true)}
              width={160}
            />

            {/* 종료일 — 전체 클릭 오픈 */}
            <ClickableDateField
              label="종료일"
              value={when.to}
              onChange={(v) => setWhen((p) => ({ ...p, to: v }))}
              onActivate={() => setOpen(true)}
              width={160}
            />
          </Box>

          {/* 오른쪽: 검색 버튼 */}
          <Box sx={{ ml: "auto", flexShrink: 0 }}>
            <OneAlignedButton
              onMouseDown={(e) => e.stopPropagation()} // 클릭 시작부터 차단
              onClick={handleSearch}
              buttonSx={{ borderRadius: 9999, px: 2.2, py: 0.8, minWidth: 0 }}
            >
              <Search size={18} />
            </OneAlignedButton>
          </Box>
        </Paper>
      </Box>

      {/* ===== 2) 상단 Drawer (글래스모피즘, 헤더만 차지) ===== */}
      <Drawer
        anchor="top"
        open={open}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          backdrop: {
            sx: {
              mt: { xs: `${APPBAR_H_MOBILE}px`, sm: `${APPBAR_H_DESKTOP}px` },
              background: "rgba(15,23,42,.45)",
              backdropFilter: "blur(4px)",
            },
            onMouseDown: (e) => e.stopPropagation(),
            onClick: (e) => handleClose(e, "backdropClick"),
          },
        }}
        PaperProps={{
          sx: {
            top: { xs: APPBAR_H_MOBILE, sm: APPBAR_H_DESKTOP },
            height: { xs: 340, md: 280 },
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
            zIndex: (theme) => theme.zIndex.modal + 1,
            borderRadius: 0,
          },
        }}
      >
        {/* Drawer 컨텐츠 */}
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1.5, md: 2 } }}>
          <Box
            sx={{
              mt: 1.5,
              p: { xs: 2, md: 3 },
              borderRadius: 6,
              background:
                "linear-gradient( to bottom right, rgba(255,255,255,.65), rgba(255,255,255,.35) )",
              border: "1px solid rgba(255,255,255,.45)",
              boxShadow: "0 20px 60px rgba(0,0,0,.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
              <IconButton onClick={() => setOpen(false)} size="small">
                <X size={18} />
              </IconButton>
            </Stack>

            {/* 펼쳐진 검색 폼 */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="medium"
                  label="무엇을 (강좌/태그)"
                  placeholder="예) 요가, 명상, 초급"
                  value={what}
                  onChange={(e) => setWhat(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="medium"
                  label="어디서 (지역/센터)"
                  placeholder="예) 서울, 경기도 수원"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="medium"
                  label="누가 (장애)"
                  placeholder="예) 시각, 청각, 지체"
                  value={who}
                  onChange={(e) => setWho(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Users size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* ✅ 날짜: 전체 영역 클릭으로 피커 오픈 */}
              <Grid item xs={12} md={6}>
                <ClickableDateField
                  label="시작일"
                  value={when.from}
                  onChange={(v) => setWhen((p) => ({ ...p, from: v }))}
                  onActivate={() => {}}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ClickableDateField
                  label="종료일"
                  value={when.to}
                  onChange={(v) => setWhen((p) => ({ ...p, to: v }))}
                  onActivate={() => {}}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} textAlign="center" sx={{ mt: 0.5 }}>
                <OneAlignedButton
                  size="large"
                  onMouseDown={(e) => e.stopPropagation()} // 전파 차단
                  onClick={handleSearch} // 전파 차단 + ignoreOpen 포함
                  buttonSx={{
                    px: 4,
                    py: 1.1,
                    borderRadius: 9999,
                    minWidth: 220,
                  }}
                >
                  검색
                </OneAlignedButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
