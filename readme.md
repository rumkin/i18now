# i18now

Internationalization library based on Proxy object with subtemplates
and variable templates substitutions:

**100%** Code coverage.

# Installation

```bash
npm i i18now
```

# Usage

Create dictionary

```javascript
var t = i18now({
    dict: {
        // Regular message
        hello: 'Hello',
        // Template with substitution and subtemplate
        greeting: '{{# hello }} {{ name }}!',
        // Template with variable templates
        gender: '{{## gender }}',
        m: 'male',
        f: 'female',
    },
    cache: true
});

t.greeting({name: 'User'}); // => "Hello User"
t.gender({gender: 'm'}); // => "male"
t.gender({gender: 'f'}); // => "female"
```

Multiple dictionaries usage see in [repository](https://github.com/rumkin/i18now)
examples directory.


## Custom expression compiler

i18now allow to use custom message compiler. It should accepts string and return
function which accepts two arguments: locals and options. Options contains
`templates` property and actually it's a dict itself.

Call of abstract compiler will look like so:

```
compiler.compile(str)(locals, {templates});
```
