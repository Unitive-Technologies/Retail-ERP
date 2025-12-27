import { Link } from 'react-router-dom';
import { Avatar, Grid2, Typography, useTheme, Tooltip } from '@mui/material';
import { isValidURL } from '@utils/form-util';

type Props = {
  avatarImg?: string;
  title?: string | number;
  subTitle?: string;
  renderComponent?: () => JSX.Element;
  avatarClassNameStyles?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  isBadgeEnable?: boolean;
  listStyle?: React.CSSProperties;
  isLink?: string;
  state?: any;
  underLine?: boolean;
};

const MUHListItemCell = (props: Props) => {
  const {
    avatarImg,
    subTitle,
    title,
    renderComponent,
    avatarClassNameStyles,
    titleStyle,
    listStyle,
    isLink,
    underLine = true,
    state,
  } = props;
  const theme = useTheme();

  return (
    <Grid2
      container
      alignItems="center"
      sx={{
        height: '100%',
        ...listStyle,
      }}
    >
      {avatarImg && (
        <Grid2 size="auto" sx={{ marginRight: theme.Spacing.tiny_xx }}>
          <Avatar
            src={isValidURL(avatarImg) ? avatarImg : undefined}
            sx={{ height: 34, width: 34, ...avatarClassNameStyles }}
          >
            {!isValidURL(avatarImg) && avatarImg?.charAt(0).toUpperCase()}
          </Avatar>
        </Grid2>
      )}
      <Grid2 size="grow">
        <Grid2
          container
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {isLink ? (
            <Link
              to={isLink}
              state={state}
              style={{
                color: theme.Colors.primary,
                fontSize: theme.MetricsSizes.small_xx,
                fontWeight: theme.fontWeight.regular,
                textDecoration: underLine ? 'underline' : 'none',
              }}
            >
              <Tooltip title={title || ''} arrow>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    ...titleStyle,
                  }}
                >
                  {title}
                </Typography>
              </Tooltip>
            </Link>
          ) : (
            <Tooltip title={title || ''} arrow>
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  ...titleStyle,
                }}
              >
                {title}
              </Typography>
            </Tooltip>
          )}
        </Grid2>

        {subTitle && (
          <Tooltip title={subTitle || ''} arrow>
            <Typography
              sx={{
                color: theme.Colors.graySecondary,
                fontSize: theme.MetricsSizes.small_xx,
                fontWeight: theme.fontWeight.regular,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {subTitle}
            </Typography>
          </Tooltip>
        )}
        {renderComponent && renderComponent()}
      </Grid2>
    </Grid2>
  );
};

export default MUHListItemCell;
