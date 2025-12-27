import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { CloseIcon } from '@assets/Images/AdminImages';

type Props = ChipProps & {
  style?: React.CSSProperties;
  label: string;
  size?: string;
  color?: string;
  variant?: string;
  clickable?: boolean;
  onClick?: () => void;
  onClose?: () => void;
};
const ChipComponent = (props: Props) => {
  const {
    style,
    label,
    clickable = true,
    size = 'medium',
    color,
    variant = 'outlined',
    onClick,
    onClose,
    ...rest
  } = props;

  return (
    <Chip
      color={color}
      clickable={clickable}
      size={size}
      label={label}
      variant={variant}
      style={style}
      onClick={onClick}
      onDelete={onClose}
      deleteIcon={onClose ? <CloseIcon /> : undefined}
      {...rest}
    />
  );
};
export default ChipComponent;
