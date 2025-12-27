import { useAdminInfo } from '@hooks/useAdminInfo';
import { Typography } from '@mui/material';
import React from 'react';

interface Props {
  component: React.ElementType;
  permissionId: number;
}
const PermissionRoute: React.FC<Props> = ({
  component: Component,
  permissionId,
}) => {
  const { userDetails } = useAdminInfo();

  if (userDetails?.permissions?.includes(permissionId)) {
    return <Component />;
  } else {
    return <Typography variant="h3"> Access Denied!</Typography>;
  }
};

export default PermissionRoute;
