async function fetchWithRetry(url, retries = 3, delay = 800) {

     // цикл попыток от 1 до максимального количества
    for (let i = 1; i <= retries; i++) {
        try {
            console.log(`Попытка ${i}/${retries}`);

            // выполняем fetch запрос
            const res = await fetch(url);

            // проверяем статус ответа
            if (!res.ok) {

                // если ошибка сервера статус >= 500 и это не последняя попытка
                if (res.status >= 500 && I < retries) {
                    console.warn(`Сервер ${res.status}, ждём ${delay * i}мс`);

                    // ждем с увеличивающейся задержкой
                    await new Promise(r => setTimeout(r, delay * i));
                    continue;
                }

                // если ошибка клиента 4xx или последняя попытка - выбрасываем ошибку
                throw new Error(res.status);
            }

            // успешный ответ - парсим JSON
            const data = await res.json();
            console.log('Успех на попытке', i);
            return data;
        } catch(err) {

            // обработка ошибок при выполнении запроса
            if (i === retries) {

                // если это была последняя попытка - все провалилось
                console.error('Все попытки провалились:', err.message);
                throw err; // пробрасываем ошибку дальше
            }
            // если есть еще попытки - ждем и продолжаем
            console.warn(`Ппопытка ${i} ошибка:`, err.message, 'retry');

             // ждем с увеличивающейся задержкой
            await new Promise(r => setTimeout(r, delay * i));
        }
    }
}

// тестирование функции с намеренной опечаткой в URL
fetchWithRetry('htpps://dummyjson.com/products?delay=1500&limit=3')
.then(d => console.log('Получено продуктов:', d.products.length))
.catch(e => console.error('Финал:', e));