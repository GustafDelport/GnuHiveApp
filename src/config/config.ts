export interface NavItem {
  name: string;
  path: string;
  childItems?: NavItem[];
  id: string;
  allowDropDown?: boolean;
  onlyShowWhenUserHasNoOrg?: boolean;
}

const SideMenuItem: NavItem[] = []
