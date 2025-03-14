# Scrum Board API

A simple RESTful API for managing Scrum boards with team members and assignments, built with TypeScript and Express.js.

## Features
- Retrieve board data
- Add team members with roles
- Create and assign tasks
- Mark tasks as done and remove them
- Error handling and validation

## Technology Stack
- **Node.js** (runtime)
- **Express.js** (framework)
- **TypeScript** (type safety)
- **express-validator** (input validation)
- **UUID** (unique IDs)
- **JSON file storage** (data persistence)

## Installation

1. Clone the repository:
   ```sh
   git clone <https://github.com/munchkin870411/FE24-JS2-slutprojekt-back-linn-ahlrot>
   cd scrum-board-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run dev
   ```
   Runs on port **3000** by default.

## API Endpoints

### Board
- `GET /api/board` - Fetch board data.

### Team Members
- `POST /api/members` - Add a team member.
  ```json
  {
    "name": "Jane Smith",
    "roles": ["ux", "frontend"]
  }
  ```

### Assignments
- `POST /api/assignments` - Create a task.
  ```json
  {
    "title": "Implement navbar",
    "description": "Create a responsive navbar",
    "category": "frontend"
  }
  ```
- `POST /api/assignments/assign` - Assign a task.
- `PATCH /api/assignments/:id/done` - Mark as done.
- `DELETE /api/assignments/:id` - Remove a task.

## Error Handling & Validation
- **Global error handling** for structured responses.
- **Validation** with `express-validator` to ensure correct input.

## Future Enhancements
- Database integration
- Authentication & authorization
- Pagination & filtering
- Test suite with Jest

## License
MIT License.

---
Built for efficient Scrum-based task management.

