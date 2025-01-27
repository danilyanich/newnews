'uses strict';

const storage = {
    data: {},
    order: [],
    tags: {}
};

const updateTags = {
    add: (id, tags) => {
        tags.forEach(tag => {
            if (storage.tags[tag])
                storage.tags[tag].push(id);
            else storage.tags[tag] = [id];
        });
    },
    remove: (id, tags) => {
        tags.forEach(tag => {
            if (storage.tags[tag]) {
                let index = storage.tags[tag].indexOf(id);
                storage.tags[tag].splice(index, 1);
            }
        });
    }
};

storage.push = (id, article) => {
    storage.data[id] = article;
    if (!storage.order.includes(id))
        storage.order.unshift(id);
    else updateTags.remove(id, article.tags);
    updateTags.add(id, article.tags);
};

storage.remove = (id) => {
    let article = storage.data[id];
    if (!article) return false;
    storage.order.remove(id);
    updateTags.remove(id, article.tags);
    delete storage.data[id];
    return true;
};

const addExample = () => {
    storage.push('1489693022074', {
        image: 'https://storage.googleapis.com/material-design/publish/material_v_11/assets/0Bx4BSt6jniD7Y1huOXVQdlFPMmM/materialdesign_introduction.png',
        title: 'Material design',
        summary: 'We challenged ourselves to create a visual language for our users that synthesizes the classic principles of good design with the innovation and possibility of technology and science. This is material design. This spec is a living document that will be updated as we continue to develop the tenets and specifics of material design.',
        createdAt: new Date(1489693022074),
        author: 'Google',
        content: 'content',
        tags: ['google', 'challenge', 'language']
    });
    storage.push('1489693022075', {
        image: 'https://storage.googleapis.com/material-design/publish/material_v_11/assets/0Bx4BSt6jniD7QTA5cHFBUlV3RTA/materialdesign_goals_language.png',
        title: 'Goals',
        summary: 'Create a visual language that synthesizes classic principles of good design with the innovation and possibility of technology and science.',
        createdAt: new Date(),
        author: 'Google',
        content: 'Develop a single underlying system that allows for a unified experience across platforms and device sizes. Mobile precepts are fundamental, but touch, voice, mouse, and keyboard are all ﬁrst-class input methods.',
        tags: ['material', 'google', 'guide']
    });
    storage.push('1489693022076', {
        image: 'https://storage.googleapis.com/material-design/publish/material_v_11/assets/0Bx4BSt6jniD7VG9DQVluOFJ4Tnc/materialdesign_principles_metaphor.png',
        title: 'Material is the metaphor',
        summary: 'A material metaphor is the unifying theory of a rationalized space and a system of motion. The material is grounded in tactile reality, inspired by the study of paper and ink, yet technologically advanced and open to imagination and magic.',
        createdAt: new Date(),
        author: 'Google',
        content: 'Surfaces and edges of the material provide visual cues that are grounded in reality. The use of familiar tactile attributes helps users quickly understand affordances. Yet the flexibility of the material creates new affordances that supercede those in the physical world, without breaking the rules of physics. The fundamentals of light, surface, and movement are key to conveying how objects move, interact, and exist in space and in relation to each other. Realistic lighting shows seams, divides space, and indicates moving parts.',
        tags: ['principles', 'google', 'material', 'design']
    });
    storage.push('1489693022077', {
        image: null,
        title: 'Motion provides meaning',
        summary: 'Motion respects and reinforces the user as the prime mover. Primary user actions are inflection points that initiate motion, transforming the whole design.',
        createdAt: new Date(),
        author: 'Google',
        content: 'All action takes place in a single environment. Objects are presented to the user without breaking the continuity of experience even as they transform and reorganize. Motion is meaningful and appropriate, serving to focus attention and maintain continuity. Feedback is subtle yet clear. Transitions are efﬁcient yet coherent.',
        tags: ['motion', 'concept']
    });
    storage.push('1489693022078', {
        image: 'https://storage.googleapis.com/material-design/publish/material_v_11/assets/0Bx4BSt6jniD7NndTQW9VZTlZV2s/materialdesign_principles_bold.png',
        title: 'Bold, graphic, intentional',
        summary: 'An emphasis on user actions makes core functionality immediately apparent and provides waypoints for the user.',
        createdAt: new Date(),
        author: 'Google',
        content: 'The foundational elements of print-based design – typography, grids, space, scale, color, and use of imagery – guide visual treatments. These elements do far more than please the eye. They create hierarchy, meaning, and focus. Deliberate color choices, edge-to-edge imagery, large-scale typography, and intentional white space create a bold and graphic interface that immerse the user in the experience.',
        tags: ['intentional']
    });
    storage.push('1489693022079', {
        image: 'https://storage.googleapis.com/material-design/publish/material_v_11/assets/0BybB4JO78tNpRlY1eHJ4LTh4ZjQ/01-duration-and-easing.png',
        title: 'Duration & easing',
        summary: 'Material in motion is responsive and natural. Use these easing curves and duration patterns to create smooth and consistent motion.',
        createdAt: new Date(),
        author: 'Google',
        content: 'When elements move between positions or states, the movement should be fast enough that it doesn\'t cause waiting, but slow enough that the transition can be understood. Keep transitions short as users will see them frequently.',
        tags: ['speed', 'balance', 'easing']
    });
};
addExample();

const getMultiple = (config) =>
    new Promise((resolve, reject) => {
        if (!config)
            reject(new Error('undefined config!'));
        else {
            let slice = storage.order.slice();
            resolve(slice);
        }
    })
    .then(slice => {
        config.offset = +config.offset || 0;
        config.count = +config.count || 10;
        if (config.all) {
            config.offset = 0;
            config.count = storage.order.length;
        }
        return slice;
    })
    .then(slice => {
        if (config.author) {
            return slice.filter((id) => {
                return storage.data[id].author === config.author;
            });
        }
        return slice;
    })
    .then(slice => {
        if (config.tags) {
            config.tags = JSON.parse(config.tags);
            return slice.filter((id) => {
                return config.tags.some(tag => {
                    if (storage.tags[tag] && storage.tags[tag].includes(id))
                        return true;
                    return false;
                });
            });
        }
        return slice;
    })
    .then(slice => {
        if (config.date) {
            return slice.filter((id) => {
                return storage.data[id].createdAt >= config.date;
            });
        }
        return slice;
    })
    .then(slice => {
        let pairs = slice.slice(config.offset, config.offset + config.count)
            .map(id => {
                return {
                    id: id,
                    article: storage.data[id]
                };
            });
        return {
            pairs: pairs,
            lastQueryLength: slice.length
        };
    });

const getById = (id) =>
    new Promise((resolve, reject) => {
        let article = storage.data[id];
        if (article) resolve(article);
        else reject(new Error(`no article with id=${id}`));
    });

const validator = {
    title: x => x && typeof (x) === 'string' && x.length < 100,
    summary: x => x && typeof (x) === 'string' && x.length < 200,
    createdAt: x => x && x instanceof Date && x !== 'Invalid date',
    author: x => x && typeof (x) === 'string',
    content: x => x && typeof (x) === 'string'
};

const isValid = (id, obj) => {
    if (!obj) return false;
    if (id && typeof (id) === 'string') {
        return !Object.keys(validator).some(check => {
            if (!validator[check](obj[check]))
                return true;
            return false;
        });
    }
    return false;
};

const add = (id, obj) =>
    new Promise((resolve, reject) => {
        let edited = Object.assign(storage.data[id] || {}, obj);
        if (isValid(id, edited)) {
            storage.push(id, edited);
            resolve(id, edited);
        } else
            reject(new Error(`invalid article ${id}`));
    });

const remove = (id) =>
    Promise.resolve(id)
    .then(_id => {
        if (!storage.remove(_id))
            throw new Error('no article, so not removed!');
    });

module.exports = {
    getMultiple: getMultiple,
    getById: getById,
    add: add,
    remove: remove
};
