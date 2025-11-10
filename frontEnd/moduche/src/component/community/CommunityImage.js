import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CommunityImage = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        이미지 없음
      </Box>
    );
  }

  const handlePrev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden" }}>
      {/* 이미지 */}
      <Box
        component="img"
        src={images[index]}
        alt={`club-image-${index}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 3,
        }}
      />

      {/* 좌우 화살표 */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </>
      )}

      {/* 점점점 인디케이터 */}
      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 0.8,
          }}
        >
          {images.map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: i === index ? "white" : "rgba(255,255,255,0.5)",
                transition: "0.2s",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommunityImage;