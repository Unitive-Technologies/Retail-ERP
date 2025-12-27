import React from 'react';
import { TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ColumnTableCell = styled(TableCell)(() => ({
  textOverflow: 'ellipsis',
  fontSize: '13.5px',
  fontWeight: 600,
  fontFamily: 'Roboto-Regular',
  whiteSpace: 'nowrap',
  padding: '10px 5px',
  textAlign: 'left',
  color: '#000000'
}));

interface ResizableHeaderProps {
  colKey: string;
  label: React.ReactNode;
  width: number;
  onMouseDown: (col: string, e: React.MouseEvent) => void;
}

const ResizableHeader: React.FC<ResizableHeaderProps> = React.memo(
  ({ colKey, label, width, onMouseDown }) => (
    <ColumnTableCell
      sx={{
        width,
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'Poppins-Regular',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {label}
      <div
        onMouseDown={(e) => onMouseDown(colKey, e)}
        style={{
          position: 'absolute',
          right: 0,
          top: 20,
          height: '25%',
          width: '2px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'col-resize',
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = '#11294C';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = 'transparent';
        }}
      />
    </ColumnTableCell>
  )
);

ResizableHeader.displayName = 'ResizableHeader';

export default ResizableHeader;