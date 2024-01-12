---
title: Creating Websites
---

## HTML, CSS, and JavaScript

To create a Website, you need to learn some basics of HTML. Don't worry, for a simple site, it's easy as copying and pasting some text.
New users automatically get a folder called `public` in their home directory. This folder is accessible from the internet at `https://<username>.dawdle.space/`.
To get started, you should have a file called `public/index.html` with a simple HTML page you can use as a starting point for you to edit. You can also put other files in this folder, like images, CSS, and JavaScript files or create subfolders to organize your site.

HTML is a markup language, which means you can use tags to define the structure of your page. For example, to create a heading, you can use the `<h1>` tag:

```html
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

This will create a page with a heading that says "Hello World!". You can also use other tags like `<p>` for paragraphs, `<a>` for links, `<img>` for images, and many more. You can find a list of all tags [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element). To learn more about this, a chat bot like ChatGPT is probably the best way to go, but you can also find many tutorials online or look at the source code of websites you like. We encourage using simple HTML, CSS and JavaScript for your site, but you can also any framework you like, like React, Vue, or Angular.

## Static Site Generators

In case you want to create a more advanced site like a blog or a site with multiple pages, you can use a static site generator. A static site generator is a program that takes your files, processes them, and creates a static website that you can upload to your server. Often times, there are many themes available that you can use to customize the look of your site without having to write any HTML or CSS yourself.

We've already installed a few on the server. More information about them can be found [here](/wiki/static-site-generators).

## Where to put your files

Some examples of how to name your files:

```
Name                  URL
public/index.html     https://<username>.dawdle.space/
public/about.html     https://<username>.dawdle.space/about
public/about.html     https://<username>.dawdle.space/about.html (Also works)
public/foo/index.html https://<username>.dawdle.space/foo
public/cat.jpg        https://<username>.dawdle.space/cat.jpg
public/404.html       https://<username>.dawdle.space/anything/that/doesnt/exist
```
