# Statinamic

The best place to learn more about how Statinamic works is the [official documentation](http://moox.io/statinamic).

If you want the some specific pointers, here is how you can get started with helping out on `postcss.com`.

## Content

The content of the website is automatically generated from the Markdown (`.md`) files in the `content` folder. To add a new page to the website, you add a Markdown file with YAML front matter to said folder.

### YAML front matter

YAML front matter is a way to specify some meta information about the content of the file. It has to come as the first thing of the file, and it has to be seperated by three dashes (`---`) before and after the front matter. This is what the front matter for an "About Us" page might look like:


```Markdown
---
title: About Us
layout: post
---
```

This will tell Statinamic that the title of the page should be "About Us", and that it should render the contents of the file with the layout called `post`.

## Code

The entire code for the website is situated in the `web_modules` folder. In said folder, you'll find all the React components that make up `postcss.com`. (See [`react.md`](react.md) for more information about components)
