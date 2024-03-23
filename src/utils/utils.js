import { isUndefined } from "./validations";

export function range(start, end = start, step = 1) {
    try {
        if (end === start) start = 0;

        const length = Math.ceil((end - start) / step);
        const result = new Array(length).fill(NaN);

        let value = start;

        return result.map(function (_, index) {
            return start + step * index;
        });
    } catch (error) {
        throw new Error(
            `Error in ${getFunctionName(range)}(...) with arguments ${JSON.stringify({
                start,
                end,
                step,
            })}`,
        );
    }
}

export function randomRange(min, max = min) {
    if (min === max) min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice(list) {
    const size = list.length;
    return list[randomRange(0, size - 1)];
}

function getFunctionName(_function) {
    return _function.toString().match(/^function .*(?=\()/);
}

function getFunctionSignature(_function) {
    return _function.toString().match(/^function .*\)/);
}
