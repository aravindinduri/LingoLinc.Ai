import { Button, styled } from '@mui/material';

const PathStep = styled(Button)<{ completed: boolean }>(({ theme, completed }) => ({
  backgroundColor: completed ? theme.palette.success.main : theme.palette.grey[300],
  color: theme.palette.common.white,
  margin: '10px 0',
  '&:hover': {
    backgroundColor: completed ? theme.palette.success.dark : theme.palette.grey[400],
  },
}));

export default PathStep;
