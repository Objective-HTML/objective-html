const sum = require('./sum.js');
const array = [5, 10, 2];
let iterator = 0;
while (iterator < array.length) {
    sum.print(array[iterator]);
    iterator++;
}