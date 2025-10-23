import { Box, Drawer, Portal, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { FaThLarge, FaPlusCircle, FaCarAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import {
  FaCar,
  FaCarOn,
  FaCartPlus,
  FaDatabase,
  FaEnvelope,
  FaGears,
  FaRegClipboard,
  FaShop,
  FaUser,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa6";
import { X } from "lucide-react";

const sideBarMenu = [
  {
    label: "Dashboard",
    route: "/",
    icon: <FaThLarge className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "Vendor Profile",
    route: "/profile",
    icon: <FaUser className={styles.icon} />,
    subMenu: null,
  },
  {
    label: "My Cars",
    route: "",
    icon: <FaCar className={styles.icon} />,
    subMenu: [
      {
        label: "All Cars",
        route: "/cars",
        icon: <FaCar className={styles.icon} />,
      },
      {
        label: "Add Car",
        route: "/cars/create",
        icon: <FaCarAlt className={styles.icon} />,
      },
    ],
  },
  {
    label: "Bookings",
    route: "/bookings",
    icon: <FaRegClipboard className={styles.icon} />,
    subMenu: null,
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const currentPath = location.pathname;

  useEffect(() => {
    sideBarMenu.forEach((item) => {
      if (item.subMenu) {
        // If any submenu matches current path (even nested like /admins/123/edit)
        const hasMatch = item.subMenu.some((sub) =>
          currentPath.startsWith(sub.route)
        );
        if (hasMatch) {
          setOpenMenu(item.label);
        }
      } else if (item.route) {
        if (item.route === "/" && currentPath === "/") {
          // ✅ Dashboard only active on exact "/"
          setOpenMenu(null);
        } else if (item.route !== "/" && currentPath.startsWith(item.route)) {
          // ✅ Vendors, Car Listings, etc. highlight even for nested paths
          setOpenMenu(null);
        }
      }
    });
  }, [currentPath]);

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      setOpenMenu(openMenu === item.label ? null : item.label);
    } else if (item.route) {
      setOpenMenu(null);
      navigate(item.route);
      onClose(false);
    }
  };

  const renderMenu = (isMobile = false) => (
    <nav
      className={`${styles.menu} max-h-[80vh] overflow-auto scrollbar-thin
         scrollbar-thumb-gray-400
         scrollbar-thumb-rounded-full
         hover:scrollbar-thumb-gray-500
         scrollbar-track-gray-100`}
    >
      <ul>
        {sideBarMenu.map((item) => {
          const isActive =
            (item.route === "/" && currentPath === "/") ||
            (item.route &&
              item.route !== "/" &&
              currentPath.startsWith(item.route)) ||
            (item.subMenu &&
              item.subMenu.some((sub) => currentPath.startsWith(sub.route)));

          return (
            <li key={item.label}>
              {/* Parent Menu */}
              <div
                onClick={() => handleMenuClick(item)}
                className={`${styles.menuHeader} ${
                  isActive ? styles.active : ""
                }`}
              >
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    {item.icon}
                    <span>{item.label}</span>
                  </Flex>
                  {item.subMenu &&
                    (openMenu === item.label ? (
                      <FaChevronDown size={12} />
                    ) : (
                      <FaChevronRight size={12} />
                    ))}
                </Flex>
              </div>

              {/* Submenu */}
              {item.subMenu && (
                <ul
                  className={`${styles.subMenu} ${
                    openMenu === item.label ? styles.open : ""
                  }`}
                >
                  {item.subMenu.map((sub) => {
                    const subActive = currentPath.startsWith(sub.route);
                    return (
                      <li
                        key={sub.label}
                        onClick={() => {
                          navigate(sub.route);
                          if (isMobile) onClose(false);
                        }}
                        className={`${styles.subMenuItem} ${
                          subActive ? styles.active : ""
                        }`}
                      >
                        <Flex alignItems="center" gap="5px" p="6px 25px">
                          {sub.icon}
                          {sub.label}
                        </Flex>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        className={styles.sidebar}
        display={{ base: "none", md: "block" }}
        pt="8px"
      >
        <div className="py-[8px] border-b border-[#eeeaea]">
          <img src={logo} alt="logo" className={styles.logo} />
        </div>
        {renderMenu(false)}
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Drawer.Root
        placement="start"
        open={isOpen}
        onOpenChange={(e) => onClose(e.open)}
        closeOnInteractOutside={false}
        zIndex={9999}
      >
        <Portal>
          <Drawer.Backdrop zIndex="9999" />
          <Drawer.Positioner zIndex="9999">
            <Drawer.Content w="259px">
              <Drawer.Body p="0px" overflowX="hidden">
                <aside className={`${styles.sidebar} overflow-x-hidden`}>
                  <button
                    className="absolute left-full top-[9px] bg-[linear-gradient(90deg,rgba(91,120,124,1)0%,rgba(137,180,188,1)35%)] rounded-r-full p-[12px] mr-[5px] mt-[5px]"
                    onClick={() => onClose(false)}
                  >
                    <X size="20px" color="#fff" />
                  </button>
                  <div className="py-[14px]">
                    <img src={logo} alt="logo" className={styles.logo} />
                  </div>
                  <div className="max-h-[80vh] overflow-auto">
                    {renderMenu(true)}
                  </div>
                </aside>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default Sidebar;
