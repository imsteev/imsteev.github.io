### personal-website

This project was bootstrapped with create-react-app:
```js
npx create-react-app personal-website
```

The project was then ejected to add a custom webpack plugin, `html-webpack-inline-source-plugin`. This purposely avoids code splitting the React app since Github Pages serves the site which expects just one `index.html` file to live in the repository.
