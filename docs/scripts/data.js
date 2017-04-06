'uses strict';

const data = (() => {

    const storage = {
        data: {},
        order: [],
        tags: {}
    }

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
                if (storage.tags[tag])
                    storage.tags[tag].remove(id);
            });
        }
    }


    storage.push = (id, article) => {
        storage.data[id] = article;
        if (!storage.order.includes(id))
            storage.order.push(id);
        else updateTags.remove(id, article.tags);
        updateTags.add(id, article.tags);
    };

    storage.remove = (id) => {
        let article = storage.data[id];
        storage.order.remove(id);
        updateTags.remove(id, article.tags);
        delete storage.data[id];
    };

    const addExample = () => {

        storage.push('1489693022074', {
            image: '/home/danilyanich/Pictures/Плюхи/cg/paul-chadeisson-testspeed-0153b2-01.jpg',
            title: 'Material design',
            summary: 'We challenged ourselves to create a visual language for our users that synthesizes the classic principles of good design with the innovation and possibility of technology and science. This is material design. This spec is a living document that will be updated as we continue to develop the tenets and specifics of material design.',
            createdAt: new Date(1489693022074),
            author: 'Google',
            content: 'content',
            tags: ['google', 'challenge', 'language']
        });

        storage.push('1489693022075', {
            image: '/home/danilyanich/Pictures/Плюхи/cg/andreas-rocha-winterlights01.jpg',
            title: 'Goals',
            summary: 'Create a visual language that synthesizes classic principles of good design with the innovation and possibility of technology and science.',
            createdAt: new Date(),
            author: 'Google',
            content: 'Develop a single underlying system that allows for a unified experience across platforms and device sizes. Mobile precepts are fundamental, but touch, voice, mouse, and keyboard are all ﬁrst-class input methods.',
            tags: ['material', 'google', 'guide']
        });

        storage.push('1489693022076', {
            image: '/home/danilyanich/Pictures/Плюхи/elitefon.ru_17543.jpg',
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
            author: 'Google ',
            content: 'All action takes place in a single environment. Objects are presented to the user without breaking the continuity of experience even as they transform and reorganize. Motion is meaningful and appropriate, serving to focus attention and maintain continuity. Feedback is subtle yet clear. Transitions are efﬁcient yet coherent.',
            tags: ['motion', 'concept']
        });

        storage.push('1489693022078', {
            image: '/home/danilyanich/Pictures/Плюхи/material/14-77.jpg',
            title: 'Bold, graphic, intentional',
            summary: 'An emphasis on user actions makes core functionality immediately apparent and provides waypoints for the user.',
            createdAt: new Date(),
            author: 'Google ',
            content: 'The foundational elements of print-based design – typography, grids, space, scale, color, and use of imagery – guide visual treatments. These elements do far more than please the eye. They create hierarchy, meaning, and focus. Deliberate color choices, edge-to-edge imagery, large-scale typography, and intentional white space create a bold and graphic interface that immerse the user in the experience.',
            tags: ['intentional']
        });

    }

    let lastQueryLength = 0;

    const getMultiple = (pages, filter) => {
        pages = pages || new Object();
        pages.offset = pages.offset || 0;
        pages.count =  pages.count || 10;
        if (pages.all) {
            pages.offset = 0;
            pages.count = storage.order.length;
        }
        let slice = storage.order.slice();
        if (filter) {
            if (filter.author) {
                slice = slice.filter(function (id) {
                    return storage.data[id].author === filter.author;
                });
            }
            if (filter.tags) {
                slice = slice.filter(function (id) {
                    for (let tag in filter.tags) {
                        if (storage.tags[tag].includes(id))
                            return true;
                    }
                    return false;
                });
            }
            if (filter.date) {
                slice = slice.filter(function (article) {
                    return storage.data[id].createdAt >= filter.date;
                });
            }
        }
        lastQueryLength = slice.length;
        return slice.slice(pages.offset, pages.offset + pages.count).map(id => {
            return {
                id: id,
                article: storage.data[id]
            }
        });
    }

    const getById = (id) => {
        return storage.data[id];
    }

    const validator = {
        title: x => x && typeof(x) === 'string' && x.length < 100,
        summary: x => x && typeof(x) === 'string' && x.length < 200,
        createdAt: x => x && x instanceof Date && x != 'Invalid date',
        author: x => x && typeof(x) === 'string',
        content: x => x && typeof(x) === 'string',
    }

    const isValid = (id, obj) => {
        if (!obj) return false;
        if (id && typeof(id) === 'string') {
            for (let check in validator)
                if (!validator[check](obj[check]))
                    return false;
            return true;
        }
        return false;
    }

    const add = (id, obj) => {
        if (!isValid(id, obj))
            return false;
        storage.push(id, obj);
        return true;
    }

    const edit = (id, obj) => {
        let article = deepCopy(storage.data[id]);
        if (article) {
            let edited = Object.assign(article, obj);
            if (isValid(edited)) {
                storage.push(id, edited);
                return true;
            }
        }
        return false;
    }

    const remove = storage.remove;

    const getByIndex = (index) => {
        return storage.data[storage.order[index]];
    }

    const size = () => {
        return storage.order.length;
    }

    return {
        getMultiple: getMultiple,
        getById: getById,
        getByIndex: getByIndex,
        isValid: isValid,
        add: add,
        edit: edit,
        remove: remove,
        example: addExample,
        size: size,
        lastQueryLength: () => lastQueryLength
    };

})();
