---
title: Creating Websites
---

## Creating Websites with Markdown

To make it easier to create your own sites, we automatically convert Markdown files to HTML. Markdown is a simple markup language that is easy to learn. You can find a guide to Markdown [here](https://www.markdownguide.org/basic-syntax/).

To create a new page, create a new file in the `public` directory. The file extension should be `.md`.

`index.md`
```mdx
# Hello, World!
**This is my first _website_!**

<h1>You can also use HTML in Markdown files!</h1>
<script>alert("and JavaScript!")</script>
```

These are currently converted to HTML using a default theme, but we plan to add support for custom themes in the future.

## Static Site Generators

For more advanced sites, we've also installed a few static site generators. More information about them can be found [here](/wiki/static-site-generators). This is useful if you want to create a blog or a site with multiple pages, there are also many themes available online.

## HTML, CSS, and JavaScript

You can also create your site using raw HTML, CSS, and JavaScript. Honestly, ChatGPT is probably better the best way to learn how to do this, but here's a quick example of a simple site:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello, World!</title>
    <style>
        body {
            background-color: #000000;
            color: #ffffff;
        }
    </style>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first website!</p>
  </body>
</html>
```

## Where to put your files

Some examples of how to name your files:

```
Name                URL
public/index.md     https://<username>.dawdle.space/
public/about.md     https://<username>.dawdle.space/about
public/foo/bar.md   https://<username>.dawdle.space/foo/bar
public/cat.jpg      https://<username>.dawdle.space/cat.jpg
public/test.html    https://<username>.dawdle.space/test.html
public/test.html    https://<username>.dawdle.space/test
```

## Supported file types

To prevent abuse, we only allow certain file types to be uploaded. Contact staff if you need a file type added to this list.

* Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`
* Markup: `.md`, `.html`, `.htm`
* Other:  `.css`, `.js`, `.json`, `.txt`, `.mp3`, `.oog`, `woff`, `woff2`

Everything else will be served as either `text/plain` (for text files) or ignored (for everything else).

<!-- 
## Inspiration

We've compiled a small list of some fun sites you could take inspiration from:
 -->
