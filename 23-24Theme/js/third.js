async function fetchWithRetry(url, retries = 3, delay = 800) {
    for (let i = 1; i <= retries; i++) {
        try {
            console.log(`Попытка ${i}/${retries}`);
            const res = await fetch(url);
            if (!res.ok) {
                if (res.status >= 500 && I < retries) {
                    console.warn(`Сервер ${res.status}, ждём ${delay * i}мс`);
                    await new Promise(r => setTimeout(r, delay * i));
                    continue;
                }
                throw new Error(res.status);
            }
            const data = await res.json();
            console.log('Успех на попытке', i);
            return data;
        } catch(err) {
            if (i === retries) {
                console.error('Все попытки провалились:', err.message);
                throw err;
            }
            console.warn(`Ппопытка ${i} ошибка:`, err.message, 'retry');
            await new Promise(r => setTimeout(r, delay * i));
        }
    }
}

fetchWithRetry('htpps://dummyjson.com/products?delay=1500&limit=3')
.then(d => console.log('Получено продуктов:', d.products.length))
.catch(e => console.error('Финал:', e));