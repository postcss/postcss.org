# React

React is a fast and nice to use user interface rendering library by Facebook. It works with so called "components", which are small, reusable and modular parts of our website. Lets have a look what a sample `Footer` component might look like:

## Components

Components generally adhere to this folder structure:

```
Footer/
├── index.css
└── index.js
```

Each component has to have an `index.js` file, it might have an `index.css` file if it has associated styling and it can also have other assets in there (e.g. images).

### `index.js`

The `index.js` file is the React code that renders the component. Our `Footer`s `index.js` file might look something like this:

```JS
// Footer/index.js

import React, { Component } from "react"
import styles from "./index.css"

export default class Footer extends Component {
  render() {
    return (
      <footer className={ styles.footer }>
        Copyright 2016 Your Name
      </footer>
    )
  }
}
```

By using this component from another component, this is the HTML output we get in the DOM:

```HTML
<footer class="generated_unique_classname">
  Copyright 2016 Your Name
</footer>
```

> Note: For a great intro to React and its ecosystem, check out this [React How-To](https://github.com/petehunt/react-howto) by @petehunt!

As you can see on line 4, we `import` a CSS file into the `styles` variable, and then give the footer a class name of `styles.footer`. Lets have a look at the `index.css` file!

### `index.css`

This is the `index.css` file of our `Footer` component:

```CSS
/* Footer/index.css */

.footer {
  background-color: blue;
  text-align: center;
}
```

Our footer will have a blue background and will show the text aligned to the center!

> Note: That's CSS Modules in full glory, see the [official documentation](https://github.com/css-modules/css-modules) for more information)
