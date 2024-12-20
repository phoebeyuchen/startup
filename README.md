# Bondly

## Specification Deliverable

### Elevator pitch

Imagine an app that keeps your relationship fresh and fun, no matter how far apart you are. Bondly is a platform where couples answer daily questions to deepen their bond and track meaningful milestones together. With progress tracking, couples can stay connected, share memories, and grow their relationship every day in a simple, fun way.

### Key features

1. Daily Questions: Couples receive a new relationship-building question every day.
2. Progress Tracking: Users can see their history of answered questions
3. Account Creation & Login: Users can create and securely log in to their accounts.
   
### Technologies

- **HTML**: Creates the basic structure of the user interface.
- **CSS**: Styles the app to make it visually appealing and responsive on different devices.
- **JavaScript**: Adds interactivity, like updating questions in real time.
- **React**: Builds the app as a single-page application with reusable components and handles routing.
- **Web Service**: Uses a public API to fetch additional questions and provides endpoints for saving and retrieving user data.
- **Authentication**: Allows users to securely create accounts, log in, and access their unique profiles.
- **Database Data**: Stores user responses and progress for retrieval and display.
- **WebSocket Data**: Enables updates to progress instantly as users interact with the app.

### Design
![ ](https://github.com/cy928/startup/blob/main/design-with-color.jpg)

## HTML deliverable

For this deliverable, I built out the structure of my application using HTML.

- [x] **HTML pages** - Four HTML pages that represent the ability to log in, answer questions, and view the progress.
- [x] **Links** - The login page links to the daily question page. A navigation bar on each page allows users to navigate between Home (login), Daily Question, and Progress.
- [x] **Text** - Each daily question and the progress is represented by a textual description.
- [x] **Images** - I added an image in the login page(🫶🏻 is an image tag), browser tab, and the background of the header.
- [x] **DB/Login** - Input box and submit button for login. The progress pages retrieve user-specific data from the database.
- [x] **Placeholder for 3rd party service calls** - Placeholder in the daily question page for future integration of an external API that could provide inspirational relationship questions to enhance user engagement.
- [x] **WebSocket** - Progress updates instantly show answers on the progress page as they are saved.

## CSS deliverable

For this deliverable, I properly styled the application into its final appearance.

- [x] **Header, footer, and main content body** - Styled these main parts of the app and added hover effects on each page.
- [x] **Navigation elements** -  Removed the underlines and added a hover effect.
- [x] **Responsive to window resizing** - Made sure the app looks good on all screen sizes and devices.
- [x] **Application elements** - Used nice colors and spacing to make everything clear and easy to see.
- [x] **Application text content** - Used different fonts to make it more organized.
- [x] **Application images** - Added small icons for each page.

## React deliverable

For this deliverable, I used React to make the application work for a single user. I also added placeholders for future technology.

- [x] **Bundled and transpiled** - done!
- [x] **Components** - Login, Home, Question, and Progress are all components with mocks for login and data storage.
   - [x] **login** - When you press the login or create button it takes you to the home page.
   - [x] **database** - Displayed the progress. Currently, this is stored and retrieved from local storage, but it will be replaced with the database data later.
   - [x] **WebSocket** - The progress component uses the local state for answers. This will be replaced with WebSocket.
   - [x] **application logic** - Login state controls access to protected routes. Questions can be answered and viewed on the progress page.
- [x] **Router** - Routing between all components with protected routes after login.
- [x] **Hooks** - Used useState for component state and useContext for sharing answer data between components.

## Service deliverable

For this deliverable, I added backend endpoints that support my application's features.

- [x] **Node.js/Express HTTP service** - done!
- [x] **Static middleware for frontend** - done!
- [x] **Calls to third-party endpoints** - Integrated with the Ninjas quotes API to fetch daily relationship questions.
- [x] **Backend service endpoints** - Created endpoints for:
  - Authentication (login, create account, logout)
  - Questions (fetch the daily question)
  - Answers (get all answers, post new answer, update answer)
- [x] **Frontend calls service endpoints** - The frontend calls the backend using the fetch function for:
  - User authentication
  - Fetching and submitting daily question answers
  - Getting history for answers
- [x] **Data persistence** - Currently storing users, and answers in server memory. Will be replaced with a database in the future deliverable.

## DB/Login deliverable

For this deliverable, I connected the application to a MongoDB database and added user authentication.

- [x] **MongoDB Atlas database created** - Done! Created a new database on MongoDB Atlas.
- [x] **Stores data in MongoDB** - Now saving all users, answers, and questions in MongoDB instead of server memory.
- [x] **User registration** - When you create a new account, it saves your information in the database.
- [x] **Existing user** - When you log in again, it will find your data and show your previous answers.
- [x] **Use MongoDB to store credentials** - Safely stores usernames and encrypted passwords.
- [x] **Restricts functionality** - You can't see questions, or answers until you log in. The backend checks if you're logged in before showing any data.

## WebSocket deliverable

For this deliverable, I used WebSocket to enable real-time updates to progress between partners.

- [x] **Backend listens for WebSocket connection** - done!
- [x] **Frontend makes WebSocket connection** - done!
- [x] **Data sent over WebSocket connection** - done!
- [x] **WebSocket data displayed** - When partners save answers, they appear instantly in both users' progress windows.
- [x] **All visible elements are working** - done!
