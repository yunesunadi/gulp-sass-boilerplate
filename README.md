# Gulp Sass Boilerplate

A frontend boilerplate uses [a modern css reset](https://piccalil.li/blog/a-modern-css-reset/) and adheres to [Sass Guidelines 7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern) which allows you to use custom mixins (media-query, pseudo) and functions (color, weight, rem, em).

## Features

#### Development Tasks

-   Sass Task - It reads every sass file in "src/sass" folder no matter how many nested directories exist, sets sourcemaps, detects errors and writes output files in "dist/css" directory.

-   JavaScript Task - It uses browserify and babelify to support ES modules and writes output files in "dist/js" directory.

-   Image Task - It reads every png, jpg, gif and svg images in "src/assets/images" folder no matter how many nested directories exist and writes output files in "dist/assets/images" directory.

-   Cache Bust Task - It prevents browser from caching.

-   BrowserSync Task - It provides local development live server on port 8080 and tunnels the server through [a public url](https://my-private-site.loca.lt/) to be able to view on any devices.

-   Watch Task - It watches any html, sass and javascript file changes, and reloads the browser if any changes occur.

#### Production Tasks

-   Sass Task - It reads every sass file in "src/sass" folder no matter how many nested directories exist, adds vendor prefixes, minifies files and writes output files in "dist/css" directory.

-   JavaScript Task - It uses browserify and babelify to support ES modules, minifies files and writes output files in "dist/js" directory.

-   Image Clean Task - It removes files and folders in "dist/assets/images".

-   Image Task - It reads every png, jpg, gif and svg images in "src/assets/images" folder no matter how many nested directories exist, minifies images and writes output files in "dist/assets/images" directory.

-   Cache Bust Task - It prevents browser from caching.

## Installation

Install the gulp command line globally on your machine by running:

```
npm install --global gulp-cli
```

Clone repository into your project and navigate into it by running:

```
git clone https://github.com/yunesunadi/gulp-sass-boilerplate.git my-project
cd my-project
```

Install dependencies by running:

```
npm install
```

You can start a local development sever by running:

```
gulp
```

For production build, you can run this command.

```
gulp build
```
