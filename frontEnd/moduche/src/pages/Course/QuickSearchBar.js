import React, { useState } from "react";
import {
  Grid,
  Box,
  Stack,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import { Search } from "lucide-react";
import Paper from "../../component/common/Paper";
import { OneAlignedButton } from "../../component/common/Button";

export default function QuickSearchBar() {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [when, setWhen] = useState({ from: "", to: "" });

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container spacing={2} alignItems="center">
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
            placeholder="예) 강남구, ○○스포츠센터"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              fullWidth
              size="medium"
              label="시작일"
              type="date"
              value={when.from}
              onChange={(e) => setWhen((p) => ({ ...p, from: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              size="medium"
              label="종료일"
              type="date"
              value={when.to}
              onChange={(e) => setWhen((p) => ({ ...p, to: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Box textAlign="right">
            <OneAlignedButton
              size="large"
              buttonSx={{ width: { xs: "100%", sm: "auto" }, minWidth: 160 }}
            >
              검색
            </OneAlignedButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
