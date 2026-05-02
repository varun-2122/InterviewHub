"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Layout theme provider wrapper utilizing next-themes
export function ThemeWrapper({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default ThemeWrapper;
