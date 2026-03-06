async function fetchWithTimeout(url, timeoutMs = 4000) {

    // создаем контроллер для возможности отмены запроса
    const ctrl = new AbortController();

     // устанавливаем таймер, который прервет запрос через timeoutMs миллисекунд
    const id = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
        console.log(`Запрос: ${url}(таймаут ${timeoutMs}мс)`);
         // выполняем fetch запрос с привязкой к сигналу контроллера
        const res = await fetch(url, {signal: ctrl.signal});
        clearTimeout(id);
        // проверяем статус ответа
        if (!res.ok) throw new Error(res.status);

        // парсим JSON ответ
        const data = await res.json();

         // выводим результат в консоль
        // если есть products, показываем первый товар, иначе весь ответ
        console.log('Успех:', data.products?.[0]?.title || data);
    } catch (err) {
        clearTimeout(id);

        // Проверяем тип ошибки
        if (err.name === 'AbortError') {
            console.error(`Таймаут ${timeout}мс`);
        } else {

            // Другие ошибки (сеть, статус ответа, парсинг JSON и т.д.)
            console.error('Ошибка:', err.message)
        }
    }
}

// тест 1 запрос с таймаутом 5000мс, сервер задерживает ответ на 2000мс
fetchWithTimeout('https://dummyjson.com/products?delay=2000&limit=2', 5000);

// тест 2 запрос с таймаутом 3000мс, сервер задерживает ответ на 6000мс
fetchWithTimeout('https://dummyjson.com/products?delay=6000&limit=2', 3000);