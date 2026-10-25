import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export type Project = {
  id: string;
  name: string;
};

export type Member = {
  id: string;
  name: string;
  projectId: string;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string; // format: YYYY-MM-DD
  done: boolean;
  projectId: string;
  assignedMemberId: string;
};

type StoreType = {
  projects: Project[];
  members: Member[];
  tasks: Task[];
  addProject: (name: string) => void;
  addMember: (name: string, projectId: string) => void;
  addTask: (
    title: string,
    dueDate: string,
    projectId: string,
    assignedMemberId: string,
  ) => void;
  toggleTask: (taskId: string) => void;
};

const STORAGE_KEY = "group-project-tracker-data";

const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 1. Load saved data once, when the app starts
  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setProjects(data.projects ?? []);
          setMembers(data.members ?? []);
          setTasks(data.tasks ?? []);
        }
      } catch (e) {
        console.log("Could not load saved data", e);
      }
      setLoaded(true);
    }
    load();
  }, []);

  // 2. Save every time the data changes (but only after loading finished)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ projects, members, tasks }),
    ).catch((e) => console.log("Could not save data", e));
  }, [projects, members, tasks, loaded]);

  function addProject(name: string) {
    const newProject: Project = { id: Date.now().toString(), name };
    setProjects([...projects, newProject]);
  }

  function addMember(name: string, projectId: string) {
    const newMember: Member = { id: Date.now().toString(), name, projectId };
    setMembers([...members, newMember]);
  }

  function addTask(
    title: string,
    dueDate: string,
    projectId: string,
    assignedMemberId: string,
  ) {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate,
      done: false,
      projectId,
      assignedMemberId,
    };
    setTasks([...tasks, newTask]);
  }

  function toggleTask(taskId: string) {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  }

  // Wait for saved data before showing any screen, so lists don't flash empty
  if (!loaded) return null;

  return (
    <StoreContext.Provider
      value={{
        projects,
        members,
        tasks,
        addProject,
        addMember,
        addTask,
        toggleTask,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
