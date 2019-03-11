'use strict';

const express = require('express');

const app = express();

app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;
    const c = (+a + +b);
    //Actually solution
    //const numA = parseFloat(a)
    //const numB = parseFloat(b)
    //const c = numA + numB

    if(!a) {
        return res.status(400).send('Please provide a number for a')
    }
    if(!b) {
        return res.status(400).send('Please provide a number for b')
    }
    //const sum = `The sum of ${numA} and ${numB} is ${c}`
    const sum = `The sum of ${a} and ${b} is ${c}`;

    res.status(200).send(sum);
})

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = req.query.shift;

    if(!text) {
        return res.status(400).send('text is required');
    }
    if(!shift) {
        return res.status(400).send('shift is required');
    }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res
            .status(400)
            .send('shift must be a number');
    }

    const base = 'A'.charCodeAt(0);

    const cipher = text
        .toUpperCase()
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);

            if(code < base || code > (base + 26)) {
                return char;
            }

            let diff = code - base;
            diff = diff + numShift;

            diff = diff % 26;

            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join('');
        
        res.status(200).send(cipher);
})

app.get('/lotto', (req, res) => {
    const numbers = req.query.numbers;

    if(!numbers) {
        return res.status(400).send('numbers is required');
    }

    if(!Array.isArray(numbers)) {
        return res.status.send('numbers must be an array');
    }

    const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
    
    if(guesses.length != 6) {
        return res.status(400).send('numbers must contain 6 integers between 1 and 20');
    }

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

    const winningNumbers = [];
    for(let i = 0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1); 
    }

    let diff = winningNumbers.filter(n => !guesses.includes(n));

    let responseText;

    switch(diff.length) {
        case 0:
            responseText = 'Wow! Unbelievable! You could have won the mega millions!';
            break;
        case 1:
            responseText = 'Congratulations! You won $100!';
            break;
        case 2:
            responseText = 'Congrats, you win a free ticket!';
            break;
        default:
            responseText = 'Better luck next time....';
    }

    res.send(responseText);
})

app.listen(8000, () => {
    console.log('Express server is listening to port 8000!')
})