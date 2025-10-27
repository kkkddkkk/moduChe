import { Typography, TextField, MenuItem } from "@mui/material";

export const CourseRegisterFields = ({ form, onChange }) => (
  <>
    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
      시설명
    </Typography>
    <TextField
      name="facility"
      fullWidth
      required
      sx={{ mb: 2 }}
      placeholder="예: 모두의 체육관"
      value={form.facility}
      onChange={onChange}
    />

    <Typography variant="subtitle1" sx={{ mb: 1 }}>
      최대 참가 인원
    </Typography>
    <TextField
      name="maxParticipants"
      type="number"
      fullWidth
      required
      sx={{ mb: 2 }}
      placeholder="예: 20"
      value={form.maxParticipants}
      onChange={onChange}
    />

    <Typography variant="subtitle1" sx={{ mb: 1 }}>
      수업 형태
    </Typography>
    <TextField
      select
      name="format"
      fullWidth
      value={form.format}
      onChange={onChange}
      sx={{ mb: 3 }}
    >
      <MenuItem value="OFFLINE">오프라인</MenuItem>
      <MenuItem value="ONLINE">온라인</MenuItem>
      <MenuItem value="MIXED">혼합</MenuItem>
    </TextField>
  </>
);