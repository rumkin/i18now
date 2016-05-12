const i18now = require('..');

// Create EN dictionary
var en = {
    hello: 'Hello',
};

// Create ES dictionary
var es = {
    hello: 'Hola'
};

// Extend ES dict
Object.setPrototypeOf(es, en);

var t = {
    en: i18now({
        dict: en,
    }),
    es: i18now({
        dict: es,
    }),
};

// Bind rule to EN dict.
en.greeting = '{{# hello }} {{ name }}';

// Use greeting message.
t.en.greeting({name: 'User'}); // -> Hello User
t.es.greeting({name: 'User'}); // -> Hola User
