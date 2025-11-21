import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Book,
  BookOpen,
  Building,
  Heart,
  IdCard,
  User,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const individualList = [
  {
    key: 'account',
    label: '계정 관리',
    icon: <IdCard />,
    path: '/myPage/account',
  },
  {
    key: 'disability',
    label: '개인정보 관리',
    icon: <Heart />,
    path: '/myPage/health',
  },
  {
    key: 'course',
    label: '이용 중인 강좌 관리',
    icon: <Book />,
    path: '/myPage/course',
  },
  {
    key: 'community',
    label: '이용 중인 동호회 관리',
    icon: <Users />,
    path: '/myPage/communityI',
  },
];

export const facilityList = [
  {
    key: 'account',
    label: '계정 관리',
    icon: <IdCard />,
    path: '/myPage/account',
  },
  {
    key: 'facility',
    label: '기관 관리',
    icon: <Building />,
    path: '/myPage/facility',
  },
  {
    key: 'course',
    label: '강좌 관리',
    icon: <BookOpen />,
    path: '/myPage/course',
  },
  {
    key: 'community',
    label: '동아리 관리',
    icon: <Users />,
    path: '/myPage/communityF',
  },
];

export const MeunTemplate = ({
  key,
  label,
  icon,
  path,
  selected,
  available = true,
}) => {
  const navigate = useNavigate();
  return (
    <ListItemButton
      key={key}
      selected={selected}
      onClick={() => navigate(path)}
      sx={{
        py: 1.1,
        borderRadius: 1.5,
        mx: 1,
        mb: 0.5,
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiSvgIcon-root': {
            color: 'primary.contrastText',
          },
          '&:hover': {
            backgroundColor: 'primary.main',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color:
            selected && available ? 'primary.contrastText' : 'text.secondary',
        }}
      >
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: '0.9rem',
          fontWeight: 600,
        }}
      />
    </ListItemButton>
  );
};
