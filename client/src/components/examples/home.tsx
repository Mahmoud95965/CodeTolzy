import Home from "../../pages/home";
import { ThemeProvider } from "@/lib/theme-provider";

export default function HomeExample() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}
