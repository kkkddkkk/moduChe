// src/component/common/QuickSearchBar.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search } from "lucide-react";
import { OneAlignedButton } from "../common/Button";
import { searchBoard } from "../../api/searchAPI"; // 공통 검색 API

export default function QuickSearchBar({
  boardType = "COURSE", // "COURSE" | "COMMUNITY"
  onResult,
  defaultSize = 20,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isCourse = boardType === "COURSE";

  const [keywordInput, setKeywordInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** 문자열에서 #태그 분리 */
  const buildKeywordAndTags = (raw) => {
    const text = (raw ?? "").trim();
    if (!text) return { keyword: null, tags: [] };

    const words = text
      .split(/\s+/)
      .map((w) => w.trim())
      .filter(Boolean);

    const tags = words
      .filter((w) => w.startsWith("#"))
      .map((w) => w.replace(/^#+/, ""));

    const keyword = words
      .filter((w) => !w.startsWith("#"))
      .join(" ")
      .trim();

    return { keyword: keyword || null, tags };
  };

  /** 🔍 실제 검색 실행 */
  const handleSearch = async () => {
    setError("");
    const { keyword, tags } = buildKeywordAndTags(keywordInput);

    const payload = {
      boardType,
      keyword,
      tags: tags.length ? tags : null,
      location: null, // 커뮤니티/강좌 둘 다 현재 location 검색 없음
      startDate: isCourse && startDate ? startDate : null,
      endDate: isCourse && endDate ? endDate : null,
      sortBy: "LATEST",
      onlyUpcoming: null, // 지금은 안 씀
      page: 0,
      size: defaultSize,
    };

    try {
      setLoading(true);
      const res = await searchBoard(payload);
      const data = res.data;

      if (onResult) {
        onResult(data.items ?? [], data.total ?? 0, payload, data);
      }
    } catch (err) {
      console.error("QuickSearch 검색 실패:", err);
      setError("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 엔터키로도 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={0.5}
      sx={{ width: "100%" }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 960,
          px: 2,
          py: 1.5,
          borderRadius: 9999,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? 1 : 2,
          }}
        >
          {/* 로고 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mr: isMobile ? 0 : 1,
            }}
          >
            <Box
              component="img"
              src="/logo/MODUCHE_LOGO.png"
              alt="모두의체육관"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "contain",
                boxShadow: 1,
              }}
            />
          </Box>

          {/* 중앙: 무엇을 (공통) */}
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              variant="standard"
              label={
                boardType === "COURSE"
                  ? "무엇을 (강좌/태그)"
                  : "무엇을 (게시글/태그)"
              }
              placeholder={
                boardType === "COURSE"
                  ? "예) 요가, 명상, #휠체어"
                  : "예) 친목, 번개, #농구"
              }
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* 오른쪽: 강좌일 때만 날짜 필터 */}
          {isCourse && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  gap: isMobile ? 1 : 2,
                  flexShrink: 0,
                }}
              >
                <TextField
                  label="시작일"
                  type="date"
                  variant="standard"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 140 }}
                />

                <TextField
                  label="종료일"
                  type="date"
                  variant="standard"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 140 }}
                />
              </Box>
            </>
          )}

          {/* 검색 버튼 */}
          <Box
            sx={{
              ml: isMobile ? 0 : 1,
              mt: isMobile ? 1 : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <OneAlignedButton
              onClick={handleSearch}
              disabled={loading}
              buttonSx={{
                borderRadius: "9999px",
                px: 2.4,
                py: 1,
                minWidth: 0,
              }}
            >
              <Search size={18} />
            </OneAlignedButton>
          </Box>
        </Box>
      </Paper>

      {/* 에러/로딩 표시 */}
      {loading && (
        <Typography variant="caption" color="text.secondary">
          검색 중…
        </Typography>
      )}
      {error && (
        <Typography variant="caption" color="error.main">
          {error}
        </Typography>
      )}
    </Box>
  );
}
