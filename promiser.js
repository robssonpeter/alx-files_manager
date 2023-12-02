const {promisify} = require('util');
const counterGreeter = (name, delay) => {
    setTimeout(() => {
        console.log(`Hello there ${name} you've waited for ${delay} seconds`);
    }, delay*1000)
    return 8;
}

//counterGreeter('peter', 3);
const modGreeter = promisify(counterGreeter);

console.log(modGreeter('James', 2))