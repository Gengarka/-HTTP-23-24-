let controller = null;

async function searchProducts(query) {
    if (controller) controller.abort();
    controller = new AbortController();

    try {
        console.log(`Поиск: "${query}"`);
        const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=5`,{
         signal: controller.signal
        });
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        console.log(`Результат "${query}":`, data.products.map(p => p.title));
    } catch (err) {
        if (err.name !== 'AbortError') console.error(`Ошибка "${query}":`, err.message);
    }
}


function debounce(fn, ms = 600) {
    let timer;
    return (...args) => {
        clearRimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

const debounced = debounce(searchProducts, 700);

debounced("phone");
setTimeout(() => debounced("smart"), 200);
setTimeout(() => debounced("laptop"), 400);
setTimeout(() => debounced("headphones"), 1200);
