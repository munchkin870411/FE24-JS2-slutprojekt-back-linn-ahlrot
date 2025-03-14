// Types
export type Status = "new" | "in progress" | "done";
export type Role = "ux" | "dev frontend" | "dev backend";
export type Category = Role;

export type Member = {
  id: string;
  name: string;
  roles: Role[];
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  assigned: string | null;
  timestamp: string;
};

export type ScrumData = {
  members: Member[];
  assignments: Assignment[];
};
