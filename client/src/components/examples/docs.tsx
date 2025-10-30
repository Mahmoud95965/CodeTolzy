import Docs from "../../pages/docs";
import { ThemeProvider } from "@/lib/theme-provider";

export default function DocsExample() {
  return (
    <ThemeProvider>
      <Docs />
    </ThemeProvider>
  );
}
