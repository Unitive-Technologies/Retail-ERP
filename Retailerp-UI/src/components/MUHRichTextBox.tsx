import ReactQuill, { Quill } from 'react-quill';
import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import 'react-quill/dist/quill.snow.css';

const ListItem = Quill.import('formats/list/item');
class CustomListItem extends ListItem {
  static create(value: any) {
    let node = super.create(value);
    node.style.listStyleType = 'none';
    node.style.marginLeft = '0px';
    node.classList.add('custom-tick-list');
    return node;
  }
}

Quill.register(CustomListItem, true);

const EditorRoot = styled('div')<any>(({ theme, ...props }) => ({
  '.ql-editor': {
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },

  '.ql-editor::-webkit-scrollbar': {
    display: 'none',
  },

  '& .ql-container': {
    fontSize: props.fontSizeValue || '16px',
    fontWeight: theme.fontWeight.medium,
    fontFamily: 'Switzer',
    height: props.heightValue || 'auto',
    width: '100%',
  },
  '& .ql-toolbar.ql-snow': {
    display: props.displayValue || '',
    border: 'none',
  },
  '& .ql-container.ql-snow': {
    border: props.borderSize || '0px solid #ACADAD',
    boxShadow: 'none',
  },
  '& .ql-editor': {
    padding: props.paddingValue || '10px',
    color: props.textColor || 'black',
    overflowY: props.scrollYNeeded ? 'scroll' : 'hidden',
  },
  '& .ql-editor ul': {
    listStyleType: 'none',
  },
  '.ql-editor .custom-tick-list': {
    listStyleType: 'none',
    position: 'relative',
  },
  '.ql-editor ul': {
    paddingLeft: '0',
    marginLeft: '0',
  },
  '.ql-editor ul li': {
    paddingTop: '5px',
  },
  '.ql-editor .custom-tick-list::before': {
    content: '"🗸"',
    fontSize: '14px',
    fontWeight: 'medium',
    color: 'white',
    position: 'absolute',
    left: '0.5',
    top: '55%',
    transform: 'translateY(-45%)',
    width: '15px',
    height: '15px',
    backgroundColor: theme.Colors.primary,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const MUHRichTextBox = ({
  onChange,
  value,
  modules,
  readOnly,
  displayToolBar,
  borderSize,
  heightValue,
  paddingValue,
  labelName,
  textColor,
  valueStyle,
  fontSizeValue,
  scrollYNeeded,
  isCustomIcon = true,
}: {
  onChange?: (content: string) => void;
  value: any;
  modules?: any;
  readOnly?: boolean;
  displayToolBar?: string;
  borderSize?: string;
  heightValue?: string;
  paddingValue?: string;
  labelName?: string;
  textColor?: string;
  valueStyle?: React.CSSProperties;
  fontSizeValue?: string;
  scrollYNeeded?: boolean;
  isCustomIcon?: boolean;
}) => {
  const theme = useTheme();

  const formattedValue = isCustomIcon
    ? value.startsWith('<ul>')
      ? value
      : `<ul><li>${value}</li></ul>`
    : value;

  return (
    <EditorRoot
      style={{ ...valueStyle }}
      displayValue={displayToolBar}
      borderSize={borderSize}
      heightValue={heightValue}
      paddingValue={paddingValue}
      textColor={textColor}
      fontSizeValue={fontSizeValue}
      scrollYNeeded={scrollYNeeded}
    >
      {labelName && (
        <label style={{ color: theme.palette.primary.main, fontSize: 14 }}>
          {labelName}
        </label>
      )}
      <ReactQuill
        key={JSON.stringify(modules)}
        onChange={onChange}
        value={formattedValue}
        modules={modules}
        readOnly={readOnly}
      />
    </EditorRoot>
  );
};

export default MUHRichTextBox;
