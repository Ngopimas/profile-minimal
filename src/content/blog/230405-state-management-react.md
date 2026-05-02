---
author: Romain C.
pubDatetime: 2023-04-05T13:00:00Z
title: "State Management in React: Context API vs. Redux"
featured: false
draft: false
tags: ["react", "state-management", "context-api", "redux", "javascript"]
description: "When to reach for Context API and when Redux still makes sense"
---

I used to reach for Redux in every React project. These days I almost never do. The Context API covers most of what I need, and the rest is usually simpler than people think.

## Context API

The Context API is built into React. You create a context, wrap your tree in a provider, and any component down the tree can read from it without prop drilling.

```javascript
// filepath: src/context/ThemeContext.js
import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

Using it in a component is straightforward:

```javascript
// filepath: src/components/App.js
import React, { useContext } from "react";
import { ThemeContext, ThemeProvider } from "../context/ThemeContext";

const ThemedComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      <p>The current theme is {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <ThemedComponent />
  </ThemeProvider>
);

export default App;
```

Context works well for things like themes, user sessions, or language preferences. Data that does not change often and gets read by many components at different depths.

## Redux

Redux gives you a single store, predictable updates through actions and reducers, and middleware for side effects. It is more boilerplate than Context, but the structure pays off when state logic gets complex.

```javascript
// filepath: src/store/store.js
import { createStore } from "redux";

const initialState = {
  theme: "light",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
```

Hooking it into a component:

```javascript
// filepath: src/components/App.js
import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "../store/store";

const ThemedComponent = () => {
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  return (
    <div
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      <p>The current theme is {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <ThemedComponent />
  </Provider>
);

export default App;
```

## Which one to use

I reach for Context when the state is simple and the consumers are scattered across the component tree. I reach for Redux when I need time-travel debugging, predictable state flow across many features, or middleware for async logic.

For most projects I have worked on recently, Context plus `useReducer` covers 90% of what Redux used to do. The remaining 10% is usually worth the Redux boilerplate, but only when the app has grown large enough that debugging state becomes painful.
