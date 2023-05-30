import { extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  components: {
    Text: {
      variants: {
        title: () => ({
          fontWeight: "bold",
          fontSize: "xl",
        }),
      },
    },
    Button: {
      variants: {
        logo: () => ({
          background: "transparent",
        }),
        solid3: () => ({
          color: "rgba(4,5,25,1)",
          background: "transparent",
          borderRadius: "lg",
          transition: "0.3s",
          border: `2px solid rgba(4,5,25,1)`,
          _hover: {
            background: "#384cac",
          },
          _focus: {
            background: "#384cac",
          },
          _active: {
            background: "#384cac",
          },
        }),
        solid2: () => ({
          color: "white",
          background: "none",
          borderRadius: "xl",
          transition: "0.3s",
          py: 6,
          _hover: {
            color: "#384cac",
          },
          _focus: {
            color: "#384cac",
          },
          _active: {
            color: "#384cac",
          },
        }),
      },
    },
  },
  initialColorMode: "dark",
});
