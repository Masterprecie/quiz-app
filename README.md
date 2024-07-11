# Quiz Game Application

## Description

This is a quiz game application where an admin can create and manage quizzes, and users can participate in these quizzes to test their knowledge. The application supports multiple-choice questions and tracks the quiz history of each user.

## Features

- Admin can create, update, and delete quizzes.
- Users can participate in quizzes.
- Each quiz consists of multiple-choice questions.
- Tracks user quiz history.
- Pagination support for quiz history.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Masterprecie/quiz-app.git
   ```
2. Navigate to the project directory:
   ```sh
   cd quiz-game
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables (create a `.env` file):
   ```env
   MONGODB_URI=your_database_connection_string
   PORT=your_port_number
   AUTH_KEY=your_auth_key
   ```
5. Start the application:
   ```sh
   npm run dev
   ```

## Usage

### Admin

- **Create a Quiz**: Admin can create a new quiz by sending a POST request to `/quiz` with the quiz details.
- **get all Quizzes**: Admin can get all existing quiz by sending a GET request to `/quiz/:page/:limit`
- **get single Quiz**: Admin can get a quiz by sending a GET request to `/quiz-by-id/:id`
- **Update a Quiz**: Admin can update an existing quiz by sending a PUT request to `/quiz/:id` with the updated details.
- **Delete a Quiz**: Admin can delete a quiz by sending a DELETE request to `/quiz/:id`.

### Users

- **Participate in a Quiz**: Users can participate in a quiz by sending a GET request to `/quiz/:questionNumber`.
- **Answer in a Quiz**: Users can answer a quiz by sending a POST request to `/answer-a-question`.
- **Mark Quiz**: Users can manrk quiz by sending a POST request to `/mark-quiz`.
- **View Quiz History**: Users can view their quiz history by sending a GET request to `/quiz-history`.

## API Endpoints

- `POST /quiz`: Create a new quiz (Admin only).
- `PUT /quiz/:id`: Update an existing quiz (Admin only).
- `DELETE /quiz/:id`: Delete a quiz (Admin only).
- `GET /quiz/:questionNumber`: Get details of a specific quiz (Users).
- `GET /answer-a-question`: Answer a quiz (Users).
- `GET /mark-quiz`: Mark quiz (Users).
- `GET /quiz-history`: Get the quiz history of the logged-in user (Users).

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.
