import { createContext, ReactNode, useContext, useState } from "react";

export type Project = {
  id: string;
  name: string;
};

export type Member = {
  id: string;
  name: string;
  projectId: string; // links the member to a project
};

type StoreType = {
  projects: Project[];
  members: Member[];
  addProject: (name: string) => void;
  addMember: (name: string, projectId: string) => void;
};

const StoreContext = createContext<StoreType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  function addProject(name: string) {
    const newProject: Project = { id: Date.now().toString(), name };
    setProjects([...projects, newProject]);
  }

  function addMember(name: string, projectId: string) {
    const newMember: Member = { id: Date.now().toString(), name, projectId };
    setMembers([...members, newMember]);
  }

  return (
    <StoreContext.Provider value={{ projects, members, addProject, addMember }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
