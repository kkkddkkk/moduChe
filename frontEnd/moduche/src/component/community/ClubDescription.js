import { Box, Typography } from "@mui/material";
import SectionBox from "../../pages/Course/SectionBox";
import MetaRow from "../../pages/Course/MetaRow";

export default function ClubDescription({ hasDetail, title, content, tags, address}) {
    return (
        <SectionBox label="동호회 상세 내용" sx={{ flexGrow: 1 }}>
            {hasDetail && (
                <Box
                    sx={{
                        p: 3,
                        "& h6": { mt: 3, mb: 1.5 },
                        "& p": { mb: 1.5 },
                    }}
                >
                    <MetaRow tags={tags} address={address} />
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </Box>
            )}
        </SectionBox>
    );
}
