import { Divider, Typography } from '@mui/material';
import React from 'react';

type headingProps = {
  headingText?: string;
  headingStyle?: React.CSSProperties;
  isLine?: boolean;
  divStyle?: React.CSSProperties;
  dividerStyle?: React.CSSProperties;
  isReadyMade?: boolean;
  marginBottom?: string | number;
};

const TitleHeaderComponent = ({
  headingText,
  headingStyle,
  isLine = true,
  divStyle,
  isReadyMade,
  marginBottom = 3,
  dividerStyle,
}: headingProps) => {
  return (
    <div style={{ ...divStyle,display:'inline-block' }}>
      <Typography
        sx={{
          fontSize: 25,
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: 1,
          ...headingStyle,
        }}
      >
        {headingText}
      </Typography>
      {isLine && (
        <Divider
          sx={{
            backgroundColor: isReadyMade ? '#FF151B' : '#FF742F',
            width: '100%',
            paddingTop: '2px',
            borderRadius: 3,
            marginBottom: marginBottom,
            ...dividerStyle,
          }}
        />
      )}
    </div>
  );
};

export default TitleHeaderComponent;
