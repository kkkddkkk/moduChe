import { Box, Chip, Stack, Typography } from "@mui/material";
import { MapPin } from "lucide-react";

export default function MetaRow({ tags = [], address = "" }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      {/* Tags */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tags.map((t) => (
          <Chip key={t} label={t} size="small" variant="outlined" />
        ))}
      </Box>

      {/* Address */}
      <Stack direction="row" spacing={1} alignItems="center">
        <MapPin size={18} />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {address}
        </Typography>
      </Stack>
    </Stack>
  );
}
