import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Modal, Slide } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import Layout from './Layout';

export const NormalModal = ({ open, close, title, children }) => {
  return (
    <Dialog open={open} onClose={close} fullWidth
      slotProps={{
        paper: {
          sx: {
            minHeight: "50vh",
            borderRadius: 3,
          },
        },
      }}>
      <DialogTitle align='center' sx={{ padding: 3 }}>{title}</DialogTitle>
      <DialogActions>
        <IconButton
          aria-label="close"
          onClick={close}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
};

export const SlideModal = ({ open, close, title, children, position, height = "40", width = "30" }) => {
  const slideDirection = (position) => {
    switch (position) {
      case "right": return "left";
      case "left": return "right";
      case "top": return "down";
      case "bottom": return "up";
    }
  }
  return (
    <Modal open={open} onClose={close} >
      <Slide direction={slideDirection(position)} in={open} mountOnEnter unmountOnExit>
        <Box sx={{
          height: position === "left" || position === "right" ? "100vh" : `${height}vh`,
          width: position === "left" || position === "right" ? `${width}vw` : "100vw",
          position: "fixed",
          left: position === "left" ? 0 : "",
          right: position === "right" ? 0 : "",
          top: position === "top" ? 0 : "",
          bottom: position === "bottom" ? 0 : "",
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "-moz-initial",
          alignItems: "center",
          flexDirection: "column",
          flexWrap: "wrap",
          // maxWidth: position === "left" || position === "right" ? "500px" : "none"
        }}>
          <Layout space={2} padding={2}>
            <Grid size={12} margin={position === "left" || position === "right" ? "5% 0" : "3% 0"} display={"flex"} justifyContent={"center"}>
              {title}
            </Grid>
            <Grid size={12}>
              <Layout>
                {children}
              </Layout>
            </Grid>
          </Layout>

        </Box>
      </Slide>
    </Modal>
  )
};