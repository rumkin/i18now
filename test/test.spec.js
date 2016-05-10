const assert = require('assert');
const i18now = require('..');

describe('i18now', () => {
    it('Should translate message', () => {
        var t = i18now({
            dict: {
                hello: 'Hello',
                helloUser: 'Hello {{ user }}'
            }
        });

        assert.equal(t.hello(), 'Hello', 'Hello equals hello');
        assert.equal(t.hello(), 'Hello', 'Hello equals hello from cache');
        assert.equal(t.helloUser({user: 'User'}), 'Hello User', 'Hello {{user}} equals Hello User');
    });

    it('Should not to translate unexisted message', () => {
        var t = i18now({
            dict: {}
        });

        assert.equal('hello' in t, false, 'hello rule is in translator');
        assert.equal(t.hello(), '', 'hello rule is in translator');
    });

    it('Should search message in dicionary', () => {
        var t = i18now({
            dict: {
                hello: 'Hello',
                helloUser: 'Hello {{ user }}'
            }
        });

        assert.equal('hello' in t, true, 'hello rule is in translator');
    });

    it('Should use substitution', () => {
        var t = i18now({
            dict: {
                hello: 'Hello',
                helloUser: '{{# hello }} {{ user }}'
            }
        });

        assert.equal(t.helloUser({user: 'User'}), 'Hello User', 'Substitution works fine');
    });

    it('Should use parser cache', () => {
        var t = i18now({
            dict: {
                hello: 'Hello',
            },
            cache: true
        });

        assert.equal(t.hello(), 'Hello', 'Cache works fine');
        assert.equal(t.hello(), 'Hello', 'Cache works fine');
    });
});
