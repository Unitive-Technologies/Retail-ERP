import { Typography, Box } from '@mui/material';

const total = 524;
const avgPerDay = 152;
const newCustomerPercent = 0.55;

const COLOR_NEW = '#4A3AFF';
const COLOR_RETURN = '#7A1B2F';

const CustomerStatistics = () => {
  const size = 230;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const startAngle = -120;
  const endAngle = 120;
  const range = endAngle - startAngle;

  function describeArc(
    cx: number,
    cy: number,
    r: number,
    a1: number,
    a2: number
  ) {
    const start = polarToCart(cx, cy, r, a1);
    const end = polarToCart(cx, cy, r, a2);
    const large = a2 - a1 <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, large, 1, end.x, end.y].join(
      ' '
    );
  }

  function polarToCart(cx: number, cy: number, r: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  const pointerPercent = 0.5;
  const pointerDeg = startAngle + range * pointerPercent;
  const pointerRadius = radius;
  const pointerPos = polarToCart(center, center, pointerRadius, pointerDeg);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'white',
        borderRadius: '10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography fontWeight={700} fontSize={18} mb={15} sx={{ color: '#222' }}>
        Customer Statistics
      </Typography>
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height={size / 1.4}
        width="100%"
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <svg
            width={size}
            height={size / 1.2}
            style={{ overflow: 'visible', display: 'block' }}
          >
            <path
              d={describeArc(
                center,
                center,
                radius,
                startAngle,
                startAngle + range * newCustomerPercent
              )}
              stroke={COLOR_NEW}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={describeArc(
                center,
                center,
                radius,
                startAngle + range * newCustomerPercent,
                endAngle
              )}
              stroke={COLOR_RETURN}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            <circle
              cx={pointerPos.x}
              cy={pointerPos.y}
              r={6}
              fill={COLOR_NEW}
            />
            <circle
              cx={pointerPos.x}
              cy={pointerPos.y}
              r={12}
              fill="#fff"
              stroke={COLOR_NEW}
              strokeWidth={4}
            />
          </svg>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: pointerPos.y - 55,
            left: pointerPos.x - 40,
            bgcolor: '#2C2543',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1.5,
            minWidth: 60,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 18,
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {total}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: pointerPos.y - 20,
            left: pointerPos.x - 18,
            width: 18,
            height: 2,
            bgcolor: '#2C2543',
            zIndex: 5,
            borderRadius: 1,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: `${size}px`,
          }}
        >
          <Typography
            fontSize={16}
            fontWeight={500}
            color="#888"
            lineHeight={1.4}
            mb={0.5}
          >
            Avg. Customer Per Day
          </Typography>
          <Typography
            fontWeight={700}
            fontSize={20}
            color="#FF6B35"
            lineHeight={1}
          >
            {avgPerDay}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Box display="flex" alignItems="center" mr={4}>
          <Box
            sx={{
              width: 18,
              height: 18,
              bgcolor: COLOR_NEW,
              borderRadius: '50%',
              mr: 1,
            }}
          ></Box>
          <Typography fontSize={14} color="#757575">
            New Customer
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: 18,
              height: 18,
              bgcolor: COLOR_RETURN,
              borderRadius: '50%',
              mr: 1,
            }}
          ></Box>
          <Typography fontSize={14} color="#757575">
            Returning Customer
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default CustomerStatistics;
