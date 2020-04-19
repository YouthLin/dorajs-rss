class Dao {
    constructor() {
    }

    save(key, value) {
        $storage.put(encodeURIComponent(key), value);
    }

    get(key) {
        return $storage.get(encodeURIComponent(key));
    }

    delete(key) {
        const old = $storage.get(encodeURIComponent(key));
        $storage.remove(encodeURIComponent(key));
        return old;
    }

}

module.exports = Dao
