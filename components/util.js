async function load(key, loader) {
    const encodeKey = encodeURIComponent(key);
    console.log('get storage: key=', key);
    let value = $storage.get(encodeKey);
    if (value) {
        return value;
    }
    value = await loader(key);
    return save(key, value);
}

function save(key, value) {
    console.log('put storage: key=', key);
    key = encodeURIComponent(key);
    $storage.put(key, value);
    return value;
}

module.exports = {load, save}
