import { Typography, TextField } from "@mui/material";

export const CommunityRegisterFields = ({ form, onChange }) => (
  <>
    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
      설립자 이름
    </Typography>
    <TextField
      name="founder"
      fullWidth
      required
      sx={{ mb: 2 }}
      placeholder="홍길동"
      value={form.founder}
      onChange={onChange}
    />

    <Typography variant="subtitle1" sx={{ mb: 1 }}>
      설립 목적 / 활동 취지
    </Typography>
    <TextField
      name="purpose"
      fullWidth
      multiline
      minRows={3}
      required
      sx={{ mb: 3 }}
      placeholder="예: 지역 주민 간 교류 및 건강 증진을 위해"
      value={form.purpose}
      onChange={onChange}
    />
  </>
);