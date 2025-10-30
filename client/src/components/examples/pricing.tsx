import Pricing from "../../pages/pricing";
import { ThemeProvider } from "@/lib/theme-provider";

export default function PricingExample() {
  return (
    <ThemeProvider>
      <Pricing />
    </ThemeProvider>
  );
}
