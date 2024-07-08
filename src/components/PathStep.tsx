import { styled, Button } from '@mui/material';

interface PathStepProps {
  completed: boolean;
}

export const PathStep = styled(Button)<PathStepProps>(({ theme, completed }) => ({
  backgroundColor: completed ? theme.palette.success.main : theme.palette.grey[300],
  color: theme.palette.common.white,
  margin: '10px 0',
  '&:hover': {
    backgroundColor: completed ? theme.palette.success.dark : theme.palette.grey[500],
  },
}));
