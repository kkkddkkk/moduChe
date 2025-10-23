import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import SectionBox from "../Course/SectionBox";

export default function ClubHeader({ hasHeader, clubData }) {
  if (!hasHeader) return <SectionBox label="헤더 정보" />;

  const { name, founder, location, schedule, tags } = clubData;

  return (
    <SectionBox>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5, height: "100%" }}>
        <Stack spacing={0.5}>
          <Typography variant="h5" fontWeight="bold">{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            개설자: <b>{founder}</b>
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" pt={1}>
            <Typography variant="body2" color="text.secondary" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
              <MapPin size={16} /> {location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={16} /> {schedule}
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* 태그 */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            주요 활동 태그
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} variant="outlined" size="small" />
            ))}
          </Stack>
        </Box>

        <Divider />

        <Typography variant="body2" color="text.secondary" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          <Users size={16} /> 함께하는 즐거움!
        </Typography>
      </Box>
    </SectionBox>
  );
}
