export function stringMapper(init, _map) {
    let mappings = Object.entries(_map);
    return mappings.reduce(function (aggregate, [src, dest]) {
        return aggregate.replace(new RegExp(src, "g"), dest);
    }, init);
}

function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
