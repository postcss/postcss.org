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
      <footer className={ styles.root }>
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

As you can see on line 4, we `import` a CSS file into the `styles` variable, and then give the footer a class name of `styles.root`. Lets have a look at the `index.css` file!

### `index.css`

This is the `index.css` file of our `Footer` component:

```CSS
/* Footer/index.css */

.root {
  background-color: blue;
  text-align: center;
}
```

Our footer will have a blue background and will show the text aligned to the center!

> Note: That's CSS Modules in full glory, see the [official documentation](https://github.com/css-modules/css-modules) for more information)

## Conventions

Each of the components within our website follow a set of conventions. The tools we use are powerful and can be used in numerous ways. Therefore, to ensure consistency across the components, we recommend only using them in the following ways.

### CSS processors

We use [`postcss-cssnext`](http://cssnext.io/). You can use any of [its features](http://cssnext.io/features/) within a component. We advise that you:

* Only use _direct nesting_, and only for the following:
  * Pseudo elements e.g. `&::after {}`.
  * Pseudo classes e.g. `&:hover {}`.
* Uses `rem` units for spacing.

It is possible to [compose selectors with CSS Modules](https://github.com/css-modules/css-modules#composition). However, do _not_ [compose class names from other CSS Modules](https://github.com/css-modules/css-modules#dependencies) as dependencies make it more difficult to [managed side effects](http://philipwalton.com/articles/side-effects-in-css/) in CSS.

There are [many ways to extend styles](http://philipwalton.com/articles/extending-styles/), but composing selectors is our preferred way of extending styles within a component.

### Class naming

Please try to keep the naming of classes consistent across components:

* Use `inner` rather than `wrapper` if an extra element is needed.
* Use `title`, `subTitle` and `body` (rather than `heading` and `content`) to delineate the main content.
* Use `items` for collections.
* Use `item` for elements within a collection.
* Use `media` for images and video.
* Use `<sub component name>` to wrap sub components.

```js
return (
  <section className={ styles.root }>
    <div className={ styles.inner }>
      <h1 className={ styles.title }>{ "title" }</h1>
      <h2 className={ styles.subTitle }>{ "subTitle" }</h2>
      <p className={ styles.body }>{ "body" }</p>
      <div className={ styles.avatar }>
        <avatar/>
      </div>
      <ul className={ styles.items }>
        <li className={ styles.item }><img className={ styles.itemMedia } src=""></li>
        <li className={ styles.item }><a className={ styles.itemLink } href="">""</a></li>
      </ul>
    </div>
  </section>
)
```

### Approach to device independence

We follow the mobile-first design approach i.e. _designing_ and _building_ for the most restrictive environment first:

* The smallest screen (e.g. a smartphone screen)
* The lowest resolution screen (e.g. a low-end smartphone screen)
* The coarsest interaction methods (e.g. a finger touching a screen)
* The slowest connection (e.g. EDGE network on a train)

And then enhancing—but only when necessary—when the environment becomes more permitting e.g. as the screen size increases.

Complementary to mobile-first design is content-out design, which stipulates that the layout of a component should adapt to the requirements of its own content (rather than adapting at some predetermined canvas size).

### A more elaborate sample

Lets have a look at another sample; `Social` is a component for displaying two social network links side-by-side.

The render part of the React code would be:

```js
return (
  <aside className={ styles.root } role="complementary">
    <ul className={ styles.items }>
      <li className={ styles.item }>
        <a
          className={ styles.itemLinkTwitter }
          href="https://twitter.com/postcss"
        >
          { "Twitter" }
        </a>
      </li>
      <li className={ styles.item }>
        <a
          className={ styles.itemLinkGithub }
          href="https://github.com/postcss/postcss"
        >
          { "Github" }
        </a>
      </li>
    </ul>
  </aside>
)
```

And the (abridged but annotated) `index.css` file of our `Social` component:

```css
/**
 * This first group of rulesets is used to style the component when
 * viewed in a restrictive environment e.g. on a small screen. This foundation
 * can then be built on as the environment becomes more permitting.
 */

/* The `.root` class is applied to the outer most element of the component.
 * Here we are setting the background color to 68% transparent black using
 * the `color()` function, which will be processed by `postcss-cssnext`. */
.root {
  background-color: color(black a(68%));
}

/*
 * `.items` is a descendant within the component. Descendants are not nested
 * within the CSS to ensure a consistently low specificity. This,
 * in turn, ensures the cascade behaves consistently within the component.
 *
 * This ruleset makes use of `rem` units. Any necessary fallbacks will be
 * provided by `postcss-cssnext`.
 *
 * It also uses three flex box features, which will have any necessary vendor
 * prefixes added by Autoprefixer.
 */
.items {
  align-items: center;
  height: 3rem;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
}

/*
 * `.item` is another descendant. For the sake of consistency and for good diffs,
 * all pseudo elements and classes are directly nested irregardless of whether
 * the parent rule contains any selectors or not.
 */
.item {
  &:not(:last-child) {
    margin-right: 1.5rem;
  }
}

/*
 * `.itemLink` provides the base styles for the two subsequent rulesets.
 */
.itemLink {
  background: no-repeat 0 center;
  padding-left: 1.25rem;
  text-decoration: none;

  /* Another directly nested pseudo class */
  &:hover {
    text-decoration: underline;
  }
}

/*
 * The following two rulesets make use of the the custom declaration "composes",
 * which is used here to extend the `.itemLink` styles. Each ruleset is building
 * upon the `.itemLink` styles by adding an appropriate icon.
 */
.itemLinkTwitter {
  composes: itemLink;
  background-image: url("./twitter.svg");
}

.itemLinkGithub {
  composes: itemLink;
  background-image: url("./github.svg");
}

/**
 * The content within this component dictates that the component can adapted
 * when the viewport size is greater than 580px. This value is specific to this
 * component and is not based a some predetermined canvas size.
 *
 * The cascade is then used to extend the `.root` class and any of its
 * descendants. Remember that globally-scoped cascading should be
 * avoided, but the cascade can be used within a confines of a component.
 *
 * This media query makes uses the `>` media feature syntax, which will be
 * processed by `postcss-cssnext`.
 */
@media (width > 580px) {

  /*
   * We are only adapting the layout in this instance. Here we are removing
   * the component from the document flow and absolutely positioning
   * it at the top of the document once the viewport is large enough.
   */
  .root {
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  /*
   * ... and also justifying the items to the right hand side of the component.
   */
  .items {
    justify-content: flex-end;
  }
}
```
