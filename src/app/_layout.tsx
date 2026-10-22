import { Stack } from "expo-router";
import { StoreProvider } from "../store";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Projects" }} />
        <Stack.Screen name="project/[id]" options={{ title: "Project" }} />
      </Stack>
    </StoreProvider>
  );
}
