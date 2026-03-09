const tabs = document.querySelectorAll('.tab-btn');
const input = document.getElementById('urlInput');
const btn = document.getElementById('downloadBtn');
const status = document.getElementById('status');
const results = document.getElementById('results');

// تشغيل التابات
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const platform = tab.getAttribute('data-platform');
        input.placeholder = platform === 'all' ? "ضع الرابط هنا..." : `ضع رابط ${platform} هنا...`;
    });
});

btn.addEventListener('click', async () => {
    const url = input.value.trim();
    if (!url) return alert("فين الرابط يا لوسيفر؟");

    status.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await res.json();
        if (data.links) {
            document.getElementById('resImg').src = data.thumbnail;
            document.getElementById('resTitle').innerText = data.title;
            const grid = document.getElementById('linksGrid');
            grid.innerHTML = data.links.map(l => 
                `<a href="${l.url}" class="dl-btn" target="_blank"><i class="fas fa-download"></i> ${l.quality}</a>`
            ).join('');
            results.classList.remove('hidden');
        } else {
            alert("خطأ: " + (data.error || "مقدرناش نسحب الرابط ده"));
        }
    } catch (e) {
        alert("السيرفر واقع أو فيه مشكلة في الشبكة");
    } finally {
        status.classList.add('hidden');
    }
});
