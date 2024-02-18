# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


Understanding useUserSession and UserSessionProvider

useUserSession Hook
When invoking useUserSession(), you access the context provided by UserSessionProvider, rather than creating a new instance. This hook serves as a bridge to the UserSessionContext, allowing components within the provider's scope to access the userSession state and the updateUserSession function. It's similar to utilizing an Environment Object in SwiftUI, facilitating shared state access across the component tree.

Role of UserSessionProvider
Incorporating UserSessionProvider in your component tree, especially at a high level (e.g., in your index.js), is crucial for several reasons:

Scope of Availability: Wrapping your app with UserSessionProvider defines the boundary within which userSession state is accessible. This ensures that any child component can tap into the userSession state and update functionality without prop drilling.
Context Propagation: The provider propagates its context throughout the component tree, enabling a seamless and efficient way for child components to access and manipulate the user session state.
Centralized State Management: By centralizing the user session state management within UserSessionProvider, the application benefits from simplified state updates and maintenance, promoting scalability and maintainability.
Usage of UserSessionProvider as a Component
UserSessionProvider is essentially a React component that leverages the Context API to pass down userSession and updateUserSession. It acts as a wrapper for its children, providing them with access to the user session context.

Necessity of UserSessionProvider in index.js
While not mandatory, placing UserSessionProvider in the index.js file ensures global availability of the user session state across your application. This is particularly useful for state that is universally relevant, such as user session information. For more localized state needs, UserSessionProvider can be included further down the component tree.

// index.js example
import { UserSessionProvider } from "./Utils/userSessionContext";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserSessionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserSessionProvider>
  </React.StrictMode>
);

by adhering to this structure, your application benefits from a coherent and effective state management strategy, ensuring that components can access and update the user session state as needed.
