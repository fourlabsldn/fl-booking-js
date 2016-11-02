// List all available tasks

const src = 'src';
const dest = 'dist';
const build = 'build';
const path = require('path');

// This is just a random number, so that we try not to pollute the global
// namespace too much.
const schedulerGlobalName = 'sdl1478015358318';

const organiser = require('gulp-organiser');
organiser.registerAll('./gulp-tasks', {
  'transpile-to-es5': {
    controller: {
      src: path.join(src, 'controller.js'),
      dest: build,
    },
    scheduler: {
      src: path.join(src, 'scheduler.js'),
      dest: build,
      config: {
        moduleName: schedulerGlobalName,
      },
    },
  },
  replace: {
    'timekit-booking': {
      src: 'lib/timekit-booking/dist/booking.js',
      dest: build,
      pattern: /var\s+timekit\s+=[^;]+/,
      replacement: `var timekit = window["${schedulerGlobalName}"]`,
      outputName: 'modified-booking.js',
    },
    controller: {
      src: 'build/controller.js',
      dest: build,
      pattern: '$$ scheduler id $$',
      replacement: schedulerGlobalName,
      outputName: 'modified-controller.js',
    },
  },
  'link-dependencies': {
    dest: 'lib',
  },
  concat: {
    src: ['build/scheduler.js', 'build/modified-booking.js', 'build/modified-main.js'],
    dest,
    fileName: 'fl-booking.js',
  },
  build: {
    src: './',
    tasks: ['link-dependencies', 'transpile-to-es5', 'replace', 'concat'],
  },
});
