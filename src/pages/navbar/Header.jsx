import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, Portal } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { toaster } from "@/components/ui/toaster";
import { baseApi } from "@/app/api/baseApi";
import { useDispatch } from "react-redux";
import {
  removeToken,
  removeUserRole,
  removeUser,
} from "@/utils/localStorageMethods";

const Header = ({ isOpen, setIsOpen }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    removeToken();
    removeUserRole();
    removeUser();
    dispatch(baseApi.util.resetApiState());
    toaster.create({
      type: "success",
      title: "Signed out",
      description: "You have been signed out successfully.",
      closable: true,
      duration: 5000,
    });
    navigate("/login");
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.topHeader} style={{ zIndex: 999 }}>
      <div className={`${styles.leftSection} block md:hidden`}>
        <img src={logo} alt="logo" className={styles.logo} />
      </div>

      <Button
        display={{ base: "block", md: "none" }}
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars color="rgba(91, 120, 124, 1)" />
      </Button>

      <div className={styles.rightSection} ref={dropdownRef}>
        {/* <div className={styles.avatarWrapper} onClick={() => setOpen(!open)}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/219/219986.png"
            alt="User Avatar"
            className={styles.avatar}
          />
        </div>

        {open && (
          <div className={styles.dropdown}>
            <ul>
              <li onClick={() => navigate("/profile")}>👤 Profile</li>
              <li onClick={handleSignOut}>🚪 Sign Out</li>
            </ul>
          </div>
        )} */}
        <Menu.Root positioning={{ placement: "bottom" }}>
          <Menu.Trigger rounded="full">
            <Avatar.Root size="sm">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219986.png"
                alt="User Avatar"
                className={styles.avatar}
              />
            </Avatar.Root>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item onClick={() => navigate("/profile")}>
                  👤 Profile
                </Menu.Item>
                <Menu.Item onClick={handleSignOut}>🚪 Sign Out</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </div>
    </div>
  );
};

export default Header;
