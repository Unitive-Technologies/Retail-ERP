export interface RouterLinkProps {
  id: any;
  title: string;
  Icon?: any;
  path?: string;
  children?: RouterLinkProps[];
  permissionId?: number;
  IconActive?: any;
  isPlusIcon?: boolean;
  plusIconPath?: any;
  whiteIcon?: any;
  isParent?: boolean;
}
