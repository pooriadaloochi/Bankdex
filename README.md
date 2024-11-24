![Cryptocurrency Exchange Platform - Baseapp](https://github.com/openware/meta/raw/main/images/github_baseapp.png)

<h3 align="center">
<a href="https://www.openware.com/sdk/docs.html#baseapp">Guide</a> <span>&vert;</span> 
<a href="https://www.openware.com/sdk/api.html">API Docs</a> <span>&vert;</span> 
<a href="https://www.openware.com/">Consulting</a> <span>&vert;</span> 
<a href="https://t.me/peatio">Community</a>
</h3>
<h6 align="center">Component part of <a href="https://github.com/openware/opendax">OpenDAX Trading Platform</a></h6>

---

# OpenDAX BaseApp UI
## User Interface for Trading and Wallets Management

React application to build a trading platform interface for use with OpenDAX: https://github.com/openware/opendax

You can see an example of a live application running at: https://www.openfinex.io/
If you need customization from the experts contact us: https://www.openware.com/

## Overview

The **Openware Base App** is a comprehensive platform that aims to provide a scalable foundation for cryptocurrency trading, finance management, and decentralized finance (DeFi) services. It includes integration with **Web3**, **Capacitor** for mobile support, and other essential tools to help you build a secure and feature-rich application.

## Features

- **Cryptocurrency Integration**: Supports various cryptocurrencies, including Bitcoin Cash and Ethereum, using **ethers.js** and **bitcoincashjs**.
- **Mobile Support**: Utilizes **Ionic** and **Capacitor** to enable hybrid mobile applications for both Android and iOS.
- **Decentralized Integration**: Web3 support using **@web3-react/core** and **@web3-react/injected-connector** for decentralized wallet interactions.
- **Multi-language Support**: Internationalization using **react-intl** and **FormatJS** libraries.
- **Redux State Management**: State management using **Redux** and side effects handled by **Redux Saga**.
- **Real-time Updates**: Real-time data updates using **WebSocket (ws)**.
- **Advanced UI**: Built using **React** and **Bootstrap** with rich components for seamless user experiences, plus integration with **recharts** for data visualization.

## Technologies Used

- **Frontend**:
  - [React.js](https://reactjs.org/): JavaScript library for building user interfaces.
  - **Bootstrap** & **React-Bootstrap**: For responsive UI components.
  - [Ionic](https://ionicframework.com/): Frontend framework to support hybrid mobile development.
  - [Capacitor](https://capacitorjs.com/): Cross-platform runtime for hybrid mobile apps.
  - **Web3-React**: Library for Ethereum wallet connections and blockchain interactions.
  - **Redux & Redux Saga**: For state management and side-effect handling.
  - **React-Intl** & **FormatJS**: For internationalization and supporting multiple languages.
  - **Recharts**: Library used for creating visual data charts.

- **Mobile Development**:
  - **Capacitor**: To build cross-platform mobile apps that work on both Android and iOS devices.

- **Security**:
  - **Sentry**: For error tracking and monitoring.
  - **JavaScript Obfuscator**: For code protection and obfuscation.

- **Styling & Linting**:
  - **Sass**: For writing maintainable and modular CSS.
  - **Stylelint**: To maintain consistent styling practices.
  - **PostCSS**: For transforming CSS with JavaScript plugins.

- **Testing**:
  - **Jest** & **React Testing Library**: For unit tests.
  - **Cypress**: For end-to-end integration testing.
  - **Sinon**: Mocking framework for testing.

## Getting Started

To get started with the **Openware Base App**, follow the instructions below.

### Prerequisites

- **Node.js** (v14 or above) and **npm** or **yarn** should be installed.
- **Ionic CLI** installed globally for Capacitor support.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pooriadaloochi/openware-base-app.git
   ```
2. Navigate to the project folder:
   ```bash
   cd openware-base-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Project

To run the development server:
```bash
npm start
# or
yarn start
```
The application should be available at `http://localhost:3000`.

### Building for Production

To create an optimized production build:
```bash
npm run build
# or
yarn build
```

### Running the Mobile Application

To add Android or iOS platforms and run the mobile version of the app:

1. **Add Android/iOS**:
   ```bash
   npx cap add android
   npx cap add ios
   ```
2. **Build the Web App**:
   ```bash
   npm run build
   # or
   yarn build
   ```
3. **Sync with Capacitor**:
   ```bash
   npx cap sync
   ```
4. **Run on a Device/Emulator**:
   ```bash
   npx cap open android
   npx cap open ios
   ```

## Folder Structure

- **/src/components**: Reusable UI components used throughout the application.
- **/src/pages**: Pages representing different routes of the application.
- **/src/store**: Redux store configuration and sagas for state management.
- **/mocks**: Mock APIs and WebSockets for testing during development.
- **/styles**: Sass and PostCSS files for styling.
- **/mobile**: Mobile platform-specific folders generated by Capacitor.

## Contributing

Contributions are welcome! If you have suggestions for new features or improvements, feel free to open an issue or submit a pull request.

## Scripts

- **Start**: Runs the application in development mode.
  ```bash
  npm start
  # or
  yarn start
  ```
- **Build**: Creates an optimized production build.
  ```bash
  npm run build
  # or
  yarn build
  ```
- **Test**: Runs unit tests using Jest.
  ```bash
  npm test
  # or
  yarn test
  ```
- **Test Coverage**: Collects test coverage information.
  ```bash
  npm run test:coverage
  ```
- **Mobile Add**: Adds Android or iOS platforms.
  ```bash
  npx cap add android
  npx cap add ios
  ```

## Licensing

This code is open for private modification and for use in customer demonstrations to raise capital. However, you cannot use it for a live platform without obtaining a commercial license from us.

If you need a commercial license, please contact us at hello@openware.com.

## Partners

If you would like to fork and modify this UI to create a BaseApp theme, we are happy to set up a partnership program and sell your work under a revenue-sharing model.

Made with love from Paris and Kiev.

## Contact

Feel free to reach out if you have any questions or want to collaborate:
- **LinkedIn**: [linkedin.com/in/pooriadaloochi](https://linkedin.com/in/pooriadaloochi)
- **Email**: pooriadaloochi@gmail.com

## License

This project is open source and available under the [MIT License](./LICENSE).

---

Thank you for exploring the Openware Base App! We appreciate your interest and look forward to your contributions.
