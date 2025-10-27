import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";

const JoinModalComponent = ({ open, onClose, clubName }) => {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    intro: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("가입 신청:", form);
    alert(`${clubName} 가입 신청이 전송되었습니다.`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{clubName} 가입 신청</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          아래 내용을 작성하여 동아리 가입을 신청해주세요.
        </Typography>

        <TextField
          name="name"
          label="이름"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          name="contact"
          label="연락처"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.contact}
          onChange={handleChange}
        />
        <TextField
          name="intro"
          label="한 줄 자기소개"
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.intro}
          onChange={handleChange}
        />
        <TextField
          name="reason"
          label="가입 동기"
          multiline
          minRows={3}
          fullWidth
          required
          value={form.reason}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>
          신청하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinModalComponent;
