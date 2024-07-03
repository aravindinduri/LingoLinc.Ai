"use client"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


interface GetStartedButtonProps {
  onClick: () => void;
}

const GetStartedButton: React.FC<GetStartedButtonProps> = ({ onClick }) => {
  return (
    <Stack spacing={2} direction="row">
      <Button
            onClick={onClick}

       variant="outlined">Get Started</Button>
    </Stack>
  );
};

export default GetStartedButton;
