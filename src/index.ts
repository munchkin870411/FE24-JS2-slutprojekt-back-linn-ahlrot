// Scrum Board API Server

// This file sets up an Express server that provides RESTful API endpoints
// for managing a scrum board application. The API allows clients to:

// - Retrieve the current state of the board
// - Add new team members with specific roles
// - Create new assignments with titles, descriptions, and categories
// - Assign tasks to team members with matching roles
// - Mark assignments as completed
// - Remove completed assignments from the board

// The server uses the board module functions to interact with the data and saves in
// a JSON file.

import express, { Request, Response } from "express";
import cors from "cors";
import { body, param, validationResult } from "express-validator";
import {
  getBoard,
  addMember,
  addAssignment,
  assignTask,
  markAsDone,
  removeDoneTask,
} from "./modules/board.js";
import {
  catchError,
  notFoundHandler,
  globalErrorHandler,
  AppError,
} from "./modules/errorHandler.js";
import { Role } from "./modules/types.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Valid roles for validation
const validRoles: Role[] = ["ux", "dev frontend", "dev backend"];

// Simple validation function to use inline
const validateInput = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

app.use(express.json());
app.use(cors());

app.get(
  "/api/board",
  catchError(async (req: Request, res: Response) => {
    res.json(getBoard());
  })
);

app.post(
  "/api/members",
  [
    // Inline validations
    body("name").notEmpty().withMessage("Member name is required"),
    body("roles")
      .isArray({ min: 1 })
      .withMessage("At least one role is required"),
    body("roles.*").isIn(validRoles).withMessage("Invalid role"),
    // Process validation results
    (req: Request, res: Response, next: Function) =>
      validateInput(req, res, next),
  ],
  catchError(async (req: Request, res: Response) => {
    const { name, roles } = req.body;
    const member = addMember(name, roles);
    res.json(member);
  })
);

app.post(
  "/api/assignments",
  [
    // Inline validations
    body("title").notEmpty().withMessage("Assignment title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").isIn(validRoles).withMessage("Invalid category"),
    // Process validation results
    (req: Request, res: Response, next: Function) =>
      validateInput(req, res, next),
  ],
  catchError(async (req: Request, res: Response) => {
    const { title, description, category } = req.body;
    const assignment = addAssignment(title, description, category);
    res.json(assignment);
  })
);

app.post(
  "/api/assignments/assign",
  [
    // Inline validations
    body("assignmentId").notEmpty().withMessage("Assignment ID is required"),
    body("memberId").notEmpty().withMessage("Member ID is required"),
    // Process validation results
    (req: Request, res: Response, next: Function) =>
      validateInput(req, res, next),
  ],
  catchError(async (req: Request, res: Response) => {
    const { assignmentId, memberId } = req.body;
    assignTask(assignmentId, memberId);
    res.json({ success: true });
  })
);

app.patch(
  "/api/assignments/:id/done",
  [
    // Inline validations
    param("id").notEmpty().withMessage("ID is required"),
    // Process validation results
    (req: Request, res: Response, next: Function) =>
      validateInput(req, res, next),
  ],
  catchError(async (req: Request, res: Response) => {
    markAsDone(req.params.id);
    res.json({ success: true });
  })
);

app.delete(
  "/api/assignments/:id",
  [
    // Inline validations
    param("id").notEmpty().withMessage("ID is required"),
    // Process validation results
    (req: Request, res: Response, next: Function) =>
      validateInput(req, res, next),
  ],
  catchError(async (req: Request, res: Response) => {
    removeDoneTask(req.params.id);
    res.json({ success: true });
  })
);

app.all("*", notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
