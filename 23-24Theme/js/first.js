// переменная для отмены предыдущего запроса при новом поиске
let controller = null;

async function searchProducts(query) {
     // если есть предыдущий запрос, отменяем его
    if (controller) controller.abort();
     // создаем новый контроллер для текущего запроса
    controller = new AbortController();

    try {
        console.log(`Поиск: "${query}"`);

        // выполняем запрос к API с переданным поисковым запросом
        // limit=5 ограничивает количество результатов до 5
        // encodeURIComponent экранирует специальные символы в запросе
        const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=5`,{
         signal: controller.signal
        });
        // проверяем успешность ответа
        if (!res.ok) throw new Error(res.status);
        
        // парсим JSON ответ
        const data = await res.json();

        // выводим в консоль названия найденных товаров
        console.log(`Результат "${query}":`, data.products.map(p => p.title));
    } catch (err) {
        // игнорируем ошибки отмены запроса (это нормальное поведение)
        // выводим другие ошибки в консоль
        if (err.name !== 'AbortError') console.error(`Ошибка "${query}":`, err.message);
    }
}


function debounce(fn, ms = 600) {
    let timer; // переменная для хранения идентификатора таймера
    return (...args) => {
        clearRimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// создаем debounced версию функции searchProducts с задержкой 700мс
const debounced = debounce(searchProducts, 700);

// 1. вызов с "phone" - запланирован через 700мс
debounced("phone");

// 2. через 200мс вызов с "smart" - отменяет предыдущий запланированный вызов
// и планирует новый через 700мс 
setTimeout(() => debounced("smart"), 200);

// 3. через 400мс вызов с "laptop" - отменяет предыдущий вызов "smart"
// и планирует новый через 700мс 
setTimeout(() => debounced("laptop"), 400);

// 4. через 1200мс вызов с "headphones", этот вызов создаст новый таймер на 1900мс
setTimeout(() => debounced("headphones"), 1200);
