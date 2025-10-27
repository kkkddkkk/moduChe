import { Box, useTheme } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom';

const Slides = ({ datas, width, aspectRatio, isBanner }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box width={isBanner ? '100%' : width}>
      <Carousel
        showArrows={true}
        showStatus={true}
        showIndicators={true}
        centerMode={false}
        infiniteLoop={true}
        showThumbs={false}
        useKeyboardArrows={true}
        autoPlay={true}
        stopOnHover={true}
        swipeable={false}
        dynamicHeight={false}
        emulateTouch={true}
        selectedItem={0}
        interval={3000}
        transitionTime={500}
        swipeScrollTolerance={5}
        animationHandler={'slide'}
      >
        {datas.map((data, idx) => {
          return (
            <Box
              key={idx}
              sx={{
                width: '100%',
                aspectRatio: isBanner ? '2/1' : aspectRatio,
                overflow: 'hidden', // 이미지 잘림 방지
                backgroundColor: theme.palette.background.default,
                cursor: isBanner ? 'pointer' : 'auto',
              }}
              onClick={() => {
                if (!isBanner) return;
                navigate(data.url);
              }}
            >
              <Box
                component="img"
                src={data.src ? data.src : data}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: aspectRatio ? 'contain' : 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
            </Box>
          );
        })}
      </Carousel>
    </Box>
  );
};
export default Slides;
