module.exports = i18now;

/**
 * @type  i18nowOptions
 * @prop {Object} dict Object with messages as properties.
 * @prop {Bool} cache Use parsing cache.
 * @prop {Object} compiler Message compiler interface instance.
 */

/**
 * Create new translator.
 * @param  {18nowOptions} Translator options.
 * @return {Proxy} Proxy where each property is a translator function.
 */
function i18now({dict, cache = true, compiler}) {
    var _cache = {};

    function translator(name) {
        if (cache && name in _cache) {
            return _cache[name];
        }

        var t = function(params) {
            return compiler.compile(dict[name])(params, {
                templates: dict
            });
        };

        cache && (_cache[name] = t);

        return t;
    }

    if (! compiler) {
        compiler = new Compiler({cache});
    }

    return new Proxy(dict, {
        has(target, prop) {
            return prop in dict;
        },
        get(target, prop) {
            if (!(prop in target)) {
                return function(){ return ''; };
            }

            return translator(prop);
        }
    });
}

/**
 * Basic compiler.
 *
 * @param {Object} options Options object. Has only cache option.
 */
function Compiler({cache = true}) {
    this._cache = {};
    this.cache = cache;
}

i18now.Compiler = Compiler;

Compiler.prototype.vre = /\{\{\s*([^}}]+?)\s*\}\}/;
Compiler.prototype.sre = /\{\{#\s*([^}}]+?)\s*\}\}/;
Compiler.prototype.vsre = /\{\{##\s*([^}}]+?)\s*\}\}/;

/**
 * Parse string and return list of tokens.
 * @param  {string} string String to parse.
 * @return {object[]}        List of tokens.
 */
Compiler.prototype.parse = function (string){
    var result = [];
    var i = 0;
    var vre = this.vre;
    var sre = this.sre;
    var vsre = this.vsre;
    var initial = string;
    var match, type;

    while(string.length) {
        if (match = string.match(vsre)) {
            type = 'varsub';
        } else if (match = string.match(sre)) {
            type = 'sub';
        } else if (match = string.match(vre)) {
            type = 'var';
        } else {
            break;
        }

        if (match.index > 0) {
            result.push({
                type: 'string',
                value: string.slice(0, match.index),
                start: i,
                end: i + match.index,
            });

            i += match.index;
        }

        result.push({
            type,
            value: match[1],
            start: i,
            end: i + match[0].length,
        });

        i += match.length;
        string = string.slice(match.index + match[0].length);
    }


    if (string.length) {
        result.push({
            type: 'string',
            value: string,
            start: i,
            end: i + string.length,
        });
    }

    if (this.cache) {
        this._cache[initial] = result;
    }

    return result;
};

Compiler.prototype.compile = function (str){
    if (this.cache && str in this._cache) {
        return this._cache[str];
    }

    var tokens = this.parse(str);

    return this._cache[str] = (locals, {templates}) => {
        return tokens.map(tok => {
            if (tok.type === 'string') {
                return tok.value;
            } else if (tok.type === 'var') {
                return locals[tok.value] || '';
            } else if (tok.type === 'sub') {
                return this.compile(templates[tok.value])(locals, {templates});
            } else if (tok.type === 'varsub') {
                return this.compile(templates[locals[tok.value]])(locals, {templates});
            }
        }).join('');
    };
};
