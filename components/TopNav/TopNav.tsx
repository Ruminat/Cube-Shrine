"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Flex, Heading, IconButton } from "@radix-ui/themes";
import { useAppTheme } from "@/components/AppTheme/AppThemeProvider";
import { Container } from "@/components/UI/Container/Container";
import styles from "./TopNav.module.scss";

export function TopNav() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <header className={styles.header}>
      <Container>
        <Flex align="center" justify="between" className={styles.row}>
          <Heading size="5">Cube Shrine</Heading>
          <IconButton
            type="button"
            variant="soft"
            highContrast
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Flex>
      </Container>
    </header>
  );
}
