# Contributors' Guide

This document is intended to be a short guide on how to contribute to this project. Don't be scared though, if you have trouble understanding how you should do something, it's better to do it the way you originally intended than not to do it at all. When you've contributed something, we'll work together from there and walk you through the process. If in doubt, don't hesitate to ask me questions via email ([see my profile](https://github.com/jussi-kalliokoski)).

## Filing issues

While just telling all you know about a bug you encountered is all you need to do to make a pull request, you will make it easier for us to reproduce, fix the bug and have test coverage for that issue in the future if you can create a test that shows how the code malfunctions. Read the sections "[Forking](#forking)" and "[Contributing Tests](#contributing tests)" for more information.

## Forking / Merging / Ownership

In order to contribute code or tests, you're going to have to fork the project on [GitHub](https://github.com). When your fork is ready to be merged, send a pull request or a patch and it will be reviewed.

If you're new to forking GitHub projects, see [this guide](http://help.github.com/forking/) or ask.

Oh, and by submitting a pull request you acknowledge that thereafter you or your employer have no copyright nor license claim to the code you submitted, and all rights are handed to the project maintainer, yadda yadda, thank you. :)

## Development Environment

To get started, you'll need:

 * A terminal.
 * [node.js](http://nodejs.org)
 * [grunt.js](http://gruntjs.com/)
 * [CoffeeScript](http://coffeescript.org/) (The library is written in vanilla JS, but the tests are CS)
 * [A good posture](http://news.ycombinator.com/item?id=1228782)

In your terminal, head to the repo and type:

```
$ npm install
```

You're good to go!

### Windows

Yeah, sorry, the testing, documentation generation and everything might not work quite right on Windows for now. Feel free to fix that though.

## Contributing Tests

You like tests? Good! So do we. Tests make sure that business applications relying on this code don't transfer millions of dollars to the wrong accounts, so someone should pay you even for reading this section this far (that someone can't be us, sorry, at least not until someone pays us first)!

The tests are written in CoffeeScript, using Mocha and should.js. If you're not a CoffeeScript guru, that's fine, they're tests and what they do matter more than how they look. There are no style requirements whatsoever for the tests, but obviously we won't say no if you make pretty tests. If in doubt, the existing tests give a pretty good idea.

There are essentially two rules for submitting tests:

 * They must pass, unless there's a bug that prevents them from passing, and you should refer to that bug/issue in your pull request.
 * There's actually only one rule.

## Contributing Code

Code, good! We can always use more features, at least until we run out of Math to cover.

The code is written in vanilla JS, but adheres to the [Stupid JS Style Guide](https://github.com/jussi-kalliokoski/stupid.js), so check it out.

The best way to get a pull request merged:
 * It lints. (grunt --config Gruntfile.js)
 * Tests pass. (npm test)
 * For new features, new tests and documentation are added
