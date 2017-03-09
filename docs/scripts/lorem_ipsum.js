
var loremIpsum = (function() {
    var words = ['lorem',
                                        'ipsum',
                                        'dolor',
                                        'sit',
                                        'amet',
                                        'consectetur',
                                        'adipiscing',
                                        'elit',
                                        'curabitur',
                                        'vel',
                                        'hendrerit',
                                        'libero',
                                        'eleifend',
                                        'blandit',
                                        'nunc',
                                        'ornare',
                                        'odio',
                                        'ut',
                                        'orci',
                                        'gravida',
                                        'imperdiet',
                                        'nullam',
                                        'purus',
                                        'lacinia',
                                        'a',
                                        'pretium',
                                        'quis',
                                        'congue',
                                        'praesent',
                                        'sagittis',
                                        'laoreet',
                                        'auctor',
                                        'mauris',
                                        'non',
                                        'velit',
                                        'eros',
                                        'dictum',
                                        'proin',
                                        'accumsan',
                                        'sapien',
                                        'nec',
                                        'massa',
                                        'volutpat',
                                        'venenatis',
                                        'sed',
                                        'eu',
                                        'molestie',
                                        'lacus',
                                        'quisque',
                                        'porttitor',
                                        'ligula',
                                        'dui',
                                        'mollis',
                                        'tempus',
                                        'at',
                                        'magna',
                                        'vestibulum',
                                        'turpis',
                                        'ac',
                                        'diam',
                                        'tincidunt',
                                        'id',
                                        'condimentum',
                                        'enim',
                                        'sodales',
                                        'in',
                                        'hac',
                                        'habitasse',
                                        'platea',
                                        'dictumst',
                                        'aenean',
                                        'neque',
                                        'fusce',
                                        'augue',
                                        'leo',
                                        'eget',
                                        'semper',
                                        'mattis',
                                        'tortor',
                                        'scelerisque',
                                        'nulla',
                                        'interdum',
                                        'tellus',
                                        'malesuada',
                                        'rhoncus',
                                        'porta',
                                        'sem',
                                        'aliquet',
                                        'et',
                                        'nam',
                                        'suspendisse',
                                        'potenti',
                                        'vivamus',
                                        'luctus',
                                        'fringilla',
                                        'erat',
                                        'donec',
                                        'justo',
                                        'vehicula',
                                        'ultricies',
                                        'varius',
                                        'ante',
                                        'primis',
                                        'faucibus',
                                        'ultrices',
                                        'posuere',
                                        'cubilia',
                                        'curae',
                                        'etiam',
                                        'cursus',
                                        'aliquam',
                                        'quam',
                                        'dapibus',
                                        'nisl',
                                        'feugiat',
                                        'egestas',
                                        'class',
                                        'aptent',
                                        'taciti',
                                        'sociosqu',
                                        'ad',
                                        'litora',
                                        'torquent',
                                        'per',
                                        'conubia',
                                        'nostra',
                                        'inceptos',
                                        'himenaeos',
                                        'phasellus',
                                        'nibh',
                                        'pulvinar',
                                        'vitae',
                                        'urna',
                                        'iaculis',
                                        'lobortis',
                                        'nisi',
                                        'viverra',
                                        'arcu',
                                        'morbi',
                                        'pellentesque',
                                        'metus',
                                        'commodo',
                                        'ut',
                                        'facilisis',
                                        'felis',
                                        'tristique',
                                        'ullamcorper',
                                        'placerat',
                                        'aenean',
                                        'convallis',
                                        'sollicitudin',
                                        'integer',
                                        'rutrum',
                                        'duis',
                                        'est',
                                        'etiam',
                                        'bibendum',
                                        'donec',
                                        'pharetra',
                                        'vulputate',
                                        'maecenas',
                                        'mi',
                                        'fermentum',
                                        'consequat',
                                        'suscipit',
                                        'aliquam',
                                        'habitant',
                                        'senectus',
                                        'netus',
                                        'fames',
                                        'quisque',
                                        'euismod',
                                        'curabitur',
                                        'lectus',
                                        'elementum',
                                        'tempor',
                                        'risus',
                                        'cras'
                                    ];

    var generate = function(len, bound, config) {

        var extracted = [];

        bound = bound || words.length;
        config = config || {
            dots: true,
            capital: true
        }

        if (len == 1) {
            var word = Math.floor(Math.random() * bound);
            return words[word].charAt(0).toUpperCase() + words[word].slice(1)
        }

        var wordsCount = 0;

        while (wordsCount < len) {
            var sentence = Math.floor(Math.random()*5) + 4;
            var word = Math.floor(Math.random() * bound);
            if (config.capital)
                extracted[wordsCount] = words[word].charAt(0).toUpperCase() + words[word].slice(1);
            else
                extracted[wordsCount] = words[word];
            for (var i = 1; i < sentence; i++) {
                wordsCount++;
                if(wordsCount >= len)
                    break;
                word = Math.floor(Math.random() * bound);
                extracted[wordsCount] = words[word];
            }
            if (config.dots && wordsCount < len)
                extracted[wordsCount] += '.';
            wordsCount++;
        }
        if (config.dots && wordsCount >= len)
            return extracted.join(' ') + '.';
        return extracted.join(' ');
    }

    var randomDate = function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    return {
        generate: generate,
        randomDate: randomDate
    };
})();

(function() {
    var lorems = document.getElementsByClassName('lorem-ipsum');
    for (var i = 0; i < lorems.length; i++) {
        len = lorems[i].getAttribute('lorem-ipsum-len');
        if (!len) len =  Math.random()*100 + 2;
        if (len <= 5) var config = {dots: false, capital: true};
        lorems[i].innerHTML = loremIpsum.generate(len, null, config || null);
        config = null;
    }
})();
