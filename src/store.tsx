import { createContext, ReactNode, useContext, useState } from "react";

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
const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

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
