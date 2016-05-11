const i18now = require('..');

var en = {
    hello: 'Hello',
};

var es = {
    hello: 'Hola'
};

// Extend es dictionary
Object.setPrototypeOf(es, en);

var t = {
    en: i18now({
        dict: en,
    }),
    es: i18now({
        dict: es,
    }),
};

en.greeting = 'Hello {{ name }}'

t.es.greeting({name: 'User'}); // -> Hello User
