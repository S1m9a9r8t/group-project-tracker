import { Stack } from "expo-router";
import { StoreProvider } from "../store";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Projects" }} />
        <Stack.Screen name="project/[id]" options={{ title: "Project" }} />
        <Stack.Screen name="behind/[id]" options={{ title: "Who's behind" }} />
      </Stack>
    </StoreProvider>
  );
}
