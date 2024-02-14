'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

type UserTabsProps = {
  isAdmin: boolean;
};

const UserTabs: React.FC<UserTabsProps> = ({ isAdmin }) => {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link href={'/profile'} passHref>
        <a className={path === '/profile' ? 'active' : ''}>Profile</a>
      </Link>
      {isAdmin && (
        <>
          <Link href={'/categories'} passHref>
            <a className={path === '/categories' ? 'active' : ''}>Categories</a>
          </Link>
          <Link href={'/menu-items'} passHref>
            <a className={path.includes('menu-items') ? 'active' : ''}>Menu Items</a>
          </Link>
          <Link href={'/users'} passHref>
            <a className={path.includes('/users') ? 'active' : ''}>Users</a>
          </Link>
        </>
      )}
      <Link href={'/orders'} passHref>
        <a className={path === '/orders' ? 'active' : ''}>Orders</a>
      </Link>
    </div>
  );
};

export default UserTabs;
