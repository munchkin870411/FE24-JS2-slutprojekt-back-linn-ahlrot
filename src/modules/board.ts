// This module provides functions to manage a scrum board with assignments and team members.
// It handles data persistence through a JSON file and provides CRUD operations
// for assignments and members.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { Assignment, Role, ScrumData, Member } from "./types.js";
import { AppError } from "./errorHandler.js";

// File helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../../src/data.json");

const readData = (): ScrumData => {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
};

// Writes scrum data to the JSON file
const writeData = (data: ScrumData) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
};

// Retrieves the current board data
export const getBoard = () => {
  const { assignments, members } = readData();
  return {
    members,
    assignments,
  };
};

// Adds a new member to the board
export const addMember = (name: string, roles: Role[]): Member => {
  const data = readData();
  const newMember: Member = { id: uuidv4(), name, roles };
  data.members.push(newMember);
  writeData(data);
  return newMember;
};

// Adds a new assignment to the board
export const addAssignment = (
  title: string,
  description: string,
  category: Role
): Assignment => {
  const data = readData();
  const newAssignment: Assignment = {
    id: uuidv4(),
    title,
    description,
    category,
    status: "new",
    assigned: null,
    timestamp: new Date().toISOString(),
  };
  data.assignments.push(newAssignment);
  writeData(data);
  return newAssignment;
};

// Assigns a task to a member
export const assignTask = (assignmentId: string, memberId: string): void => {
  const data = readData();
  const assignment = data.assignments.find((a) => a.id === assignmentId);
  const member = data.members.find((m) => m.id === memberId);

  if (!assignment || !member) {
    throw new AppError("Assignment or member not found", 404);
  }
  if (!member.roles.includes(assignment.category)) {
    throw new AppError(
      "Member does not have the required role for this assignment",
      400
    );
  }

  assignment.assigned = member.id;
  assignment.status = "in progress";
  writeData(data);
};

// Marks an assignment as done
export const markAsDone = (assignmentId: string): void => {
  const data = readData();
  const assignment = data.assignments.find((a) => a.id === assignmentId);

  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  if (assignment.status !== "in progress") {
    throw new AppError(
      "Only in-progress assignments can be marked as done",
      400
    );
  }

  assignment.status = "done";
  writeData(data);
};

// Removes a done task from the board
export const removeDoneTask = (assignmentId: string): void => {
  const data = readData();
  const index = data.assignments.findIndex((a) => a.id === assignmentId);

  if (index === -1) {
    throw new AppError("Assignment not found", 404);
  }

  if (data.assignments[index].status !== "done") {
    throw new AppError("Only completed assignments can be removed", 400);
  }

  data.assignments.splice(index, 1);
  writeData(data);
};
