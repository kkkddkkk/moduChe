import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const RegisterFormBase = ({
  form,
  onChange,
  onImageUpload,
  onSubmit,
  extraFields, 
  title,
}) => {
  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {title}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={onSubmit}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            제목
          </Typography>
          <TextField
            name="name"
            fullWidth
            required
            sx={{ mb: 2 }}
            placeholder="예: 아침 체조 모임"
            value={form.name}
            onChange={onChange}
          />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            설명
          </Typography>
          <TextField
            name="description"
            fullWidth
            multiline
            minRows={3}
            required
            sx={{ mb: 2 }}
            placeholder="활동 내용 또는 강의 내용을 간단히 적어주세요."
            value={form.description}
            onChange={onChange}
          />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            대표 이미지
          </Typography>
          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            이미지 업로드
            <input type="file" hidden accept="image/*" onChange={onImageUpload} />
          </Button>

          {form.image && (
            <Typography variant="body2" color="text.secondary">
              업로드된 파일: {form.image.name}
            </Typography>
          )}

          {/* type별 전용 필드 삽입 구간~! */}
          {extraFields}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => window.history.back()}>
              취소
            </Button>
            <Button type="submit" variant="contained">
              등록 요청 보내기
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterFormBase;