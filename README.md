# Bondly

## Specification Deliverable

### Elevator pitch

Imagine an app that keeps your relationship fresh and fun, no matter how far apart you are. Bondly is a platform where couples answer daily questions to deepen their bond and track meaningful milestones together. With real-time chat and progress tracking, couples can stay connected, share memories, and grow their relationship every day in a simple, fun way.

### Key features

1. Daily Questions: Couples receive a new relationship-building question every day.
2. Progress Tracking: Users can see their history of answered questions
3. Real-Time Chat: A messaging system lets couples stay connected, allowing them to chat and share thoughts in real-time.
4. Account Creation & Login: Users can create and securely log in to their accounts.
   
### Technologies

- **HTML**: Creates the basic structure of the user interface.
- **CSS**: Styles the app to make it visually appealing and responsive on different devices.
- **JavaScript**: Adds interactivity, like updating questions and handling chat messages in real-time.
- **React**: Builds the app as a single-page application with reusable components and handles routing.
- **Web Service**: Uses a public API to fetch additional questions and provides endpoints for saving and retrieving user data.
- **Authentication**: Allows users to securely create accounts, log in, and access their unique profiles.
- **Database Data**: Stores user responses, chat history, and progress for retrieval and display.
- **WebSocket Data**: Enables real-time chat and updates progress instantly as users interact with the app.

### Design

![ ](https://github.com/cy928/startup/blob/main/design-with-color.jpg)

## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

- [x] **HTML pages** - Four HTML pages that represent the ability to login, answer questions, view the progress, and chat.
- [x] **Links** - The login page links to the daily question page. A navigation bar on each page allows users to navigate between Home (login), Daily Question, Progress, and Chat.
- [x] **Text** - Each daily question, the progress, and the chat recordis is represented by a textual description.
- [x] **Images** - I added image on the login page(🫶🏻), browser tab, and the the background of the header.
- [x] **DB/Login** - Input box and submit button for login. The progress pages retrieve user-specific data from the database.
- [x] **Placeholder for 3rd party service calls** - Placeholder for future integration of an external API that could provide inspirational relationship question to enhance user engagement.
- [x] **WebSocket** - Real-time chat updates instantly show new messages in the chat page as they are sent.
