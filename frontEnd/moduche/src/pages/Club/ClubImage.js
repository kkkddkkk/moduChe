import { Box } from "@mui/material";

export default function ClubImage({ hasImage, src, alt = "club" }) {
  if (!hasImage) return null;
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        bgcolor: "grey.100",
        boxShadow: 1,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </Box>
  );
}
