import {
  CardMedia,
  Typography,
  IconButton,
  useTheme,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MUHButtonComponent from './MUHButtonComponent';
import Grid from '@mui/material/Grid2';

interface NewsCardProps {
  image: string;
  title: string;
  date: string;
  description: string;
  category: string;
  handleClickOpen: (e: any) => void;
  handleReadMoreClick?: any;
  moreIcon?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  image,
  title,
  date,
  description,
  category,
  handleClickOpen,
  handleReadMoreClick,
  moreIcon = true,
}) => {
  const theme = useTheme();
  return (
    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
      <Card
        sx={{
          height: 420,
          boxShadow: '0px 0px 8px 0px #00000040',
          padding: 2,
          display: 'inline-flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardMedia component="img" height="180" image={image} alt={title} />
        <CardContent sx={{ padding: '16px 0px 16px 0px' }}>
          <Grid
            container
            justifyContent={'space-between'}
            alignItems={'center'}
            size={12}
          >
            <Grid size={'grow'}>
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  fontFamily: theme.fontFamily.inter,
                  fontWeight: theme.fontWeight.mediumBold,
                  fontSize: theme.MetricsSizes.small_x3,
                }}
              >
                {title}
              </Typography>
              <Grid size={12}>
                <Typography
                  style={{
                    fontFamily: theme.fontFamily.inter,
                    fontWeight: theme.fontWeight.mediumBold,
                    fontSize: theme.MetricsSizes.tiny_xx,
                    color: '#00000099',
                  }}
                >
                  {date}
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid size={'auto'}>
              <IconButton sx={{ cursor: 'pointer' }} onClick={handleClickOpen}>
                <MoreVertIcon />
              </IconButton> */}
            <Grid size={'auto'}>
              {moreIcon && handleClickOpen && (
                <IconButton
                  sx={{ cursor: 'pointer' }}
                  onClick={handleClickOpen}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
          <Grid size={12}>
            <div
              dangerouslySetInnerHTML={{
                __html: description || '<p>No content available</p>',
              }}
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
                marginTop: 8,
                textAlign: 'justify',
                fontSize: theme.MetricsSizes.small_x3,
              }}
            ></div>
            {/* <Typography
              style={{
                fontFamily: theme.fontFamily.inter,
                fontWeight: theme.fontWeight.regular,
                fontSize: theme.MetricsSizes.small_x3,
              }}
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
                mt: 1,
                textAlign: 'justify',
              }}
            >
              {description}
            </Typography> */}
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            display: 'inline-flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Grid>
            <Typography
              style={{
                fontFamily: theme.fontFamily.inter,
                fontWeight: theme.fontWeight.mediumBold,
                fontSize: theme.MetricsSizes.small_x3,
                color: theme.Colors.primary,
              }}
            >
              {category}
            </Typography>
          </Grid>
          <Grid>
            <MUHButtonComponent
              buttonText={'Read More'}
              btnWidth={109}
              btnHeight={28}
              buttonStyle={{
                fontFamily: theme.fontFamily.inter,
                fontWeight: theme.fontWeight.medium,
                fontSize: theme.MetricsSizes.small,
                backgroundColor: theme.Colors.primary,
              }}
              onClick={handleReadMoreClick}
            />
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default NewsCard;
