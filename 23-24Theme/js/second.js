async function fetchWithTimeout(url, timeoutMs = 4000) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
        console.log(`Запрос: ${url}(таймаут ${timeoutMs}мс)`);
        const res = await fetch(url, {signal: ctrl.signal});
        clearTimeout(id);
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        console.log('Успех:', data.products?.[0]?.title || data);
    } catch (err) {
        clearTimeout(id);
        if (err.name === 'AbortError') {
            console.error(`Таймаут ${timeout}мс`);
        } else {
            console.error('Ошибка:', err.message)
        }
    }
}

fetchWithTimeout('https://dummyjson.com/products?delay=2000&limit=2', 5000);
fetchWithTimeout('https://dummyjson.com/products?delay=6000&limit=2', 3000);