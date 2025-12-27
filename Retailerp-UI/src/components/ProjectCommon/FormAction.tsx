import Grid from '@mui/material/Grid2';
import { ButtonComponent } from '..';
import { useTheme } from '@mui/material';

type Props = {
  handleCreate: () => void;
  handleCancel: () => void;
  firstBtntxt?: string;
  secondBtntx?: string;
  disableCreate?: boolean;
  btnWidth?: number;
};

const FormAction = ({
  handleCreate,
  handleCancel,
  firstBtntxt,
  secondBtntx,
  disableCreate,
  btnWidth = 120,
}: Props) => {
  const theme = useTheme();

  return (
    <Grid
      container
      mt={4}
      justifyContent="center"
      alignItems={'center'}
      gap={2}
    >
      <ButtonComponent
        buttonText={firstBtntxt || 'Save'}
        btnWidth={btnWidth}
        btnHeight={35}
        buttonFontSize={14}
        buttonFontWeight={500}
        onClick={() => handleCreate()}
        bgColor={theme.Colors.primary}
        btnBorderRadius={2}
        disabled={!!disableCreate}
      />
      <ButtonComponent
        buttonText={secondBtntx || 'Cancel'}
        btnWidth={120}
        buttonFontSize={14}
        buttonFontWeight={500}
        btnHeight={35}
        buttonTextColor={theme.Colors.primary}
        bgColor={theme.Colors.whitePrimary}
        onClick={() => handleCancel()}
        border={`1px solid ${theme.Colors.primary}`}
        btnBorderRadius={2}
      />
    </Grid>
  );
};

export default FormAction;
