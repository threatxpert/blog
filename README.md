# Threat Expert Blog Backend

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure MySQL:**
   - Create a database named `threatexpert` in your MySQL server.
   - Update the username/password in `index.js` if needed.

3. **Run the server:**
   ```sh
   npm run dev
   ```
   The API will be available at `http://localhost:4000/api/posts`

## API Endpoints
- `GET /api/posts` — List all blog posts
- `GET /api/posts/:id` — Get a single post
- `POST /api/posts` — Create a new post
- `PUT /api/posts/:id` — Update a post
- `DELETE /api/posts/:id` — Delete a post

## Notes
- Uses Sequelize ORM for MySQL
- CORS enabled for frontend integration 