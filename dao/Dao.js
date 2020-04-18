class Dao {
    constructor() {
        if (typeof $storage === 'undefined') {
            globalThis.$storage = new Map();
            globalThis.$storage.prototype.put = (k, v) => $storage.set(k, v);
        }
    }

    save(key, value) {
        $storage.put(encodeURIComponent(key), value);
    }

    get(key) {
        return $storage.get(encodeURIComponent(key));
    }

    delete(key) {
        const old = $storage.get(encodeURIComponent(key));
        $storage.put(encodeURIComponent(key), null);
        return old;
    }

}

module.exports = Dao
