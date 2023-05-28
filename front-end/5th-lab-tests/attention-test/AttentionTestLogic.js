const words = ["яблоко", "банан", "апельсин", "мандарин", "лимон", "груша", "абрикос", "смородина", "клубника",
    "малина", "арбуз", "дыня", "тыква", "морковь", "капуста", "брокколи", "помидор", "огурец", "свекла", "лук"];


function shuffleString(str) {
    // Разбиваем строку на массив слов
    const words = str.split(" ");

    // Для каждого слова в массиве
    const shuffledWords = words.map(word => {
        // Если слово короче 4 символов, то не перемешиваем его
        if (word.length <= 3) {
            return word;
        }

        // Иначе, меняем местами случайные 1-2 символа в слове
        const chars = word.split("");
        const numCharsToChange = Math.min(2, Math.floor(Math.random() * (word.length - 1)) + 1);
        for (let i = 0; i < numCharsToChange; i++) {
            let index1 = Math.floor(Math.random() * (word.length - 1));
            let index2 = Math.floor(Math.random() * (word.length - 1));
            while (index2 === index1) {
                index2 = Math.floor(Math.random() * (word.length - 1));
                [chars[index1], chars[index2]] = [chars[index2], chars[index1]];
            }
        }
        return chars.join("");
    });

    // Соединяем перемешанные слова в строку
    return shuffledWords.join(" ");
}

function getRandomStrings(strings, count = 5) {
    // Если в списке меньше строк, чем нужно вернуть, то возвращаем весь список
    if (strings.length <= count) {
        return strings;
    }

    // Копируем список, чтобы не изменять оригинальный
    const copy = [...strings];

    // Выбираем count уникальных элементов из скопированного списка
    const uniqueStrings = new Set();
    while (uniqueStrings.size < count) {
        const randomIndex = Math.floor(Math.random() * copy.length);
        uniqueStrings.add(copy[randomIndex]);
    }

    return Array.from(uniqueStrings);
}

function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const example = "aboba";

module.exports = { words, shuffleString, getRandomStrings, getRandomColor, example }