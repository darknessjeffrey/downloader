const tabs = document.querySelectorAll('.tab-btn');
const input = document.getElementById('urlInput');
const btn = document.getElementById('downloadBtn');
const status = document.getElementById('status');
const results = document.getElementById('results');

// تشغيل الأقسام (Tabs)
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const platform = tab.getAttribute('data-platform');
        input.placeholder = platform === 'all' 
            ? "ضع الرابط هنا (أي منصة)..." 
            : `ضع رابط ${platform} هنا...`;
    });
});

// تشغيل زرار التحميل
btn.addEventListener('click', async () => {
    const url = input.value.trim();
    
    if (!url.startsWith('http')) {
        return alert("يا صاحبي حط رابط صحيح بيبدأ بـ http أو https!");
    }

    // تأمين الزرار لمنع الضغط المتكرر
    btn.disabled = true;
    btn.innerText = "جاري الاختراق... ⚡";
    status.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await res.json();
        
        if (res.ok && data.links && data.links.length > 0) {
            document.getElementById('resImg').src = data.thumbnail;
            document.getElementById('resTitle').innerText = data.title;
            
            const grid = document.getElementById('linksGrid');
            grid.innerHTML = data.links.map(link => 
                `<a href="${link.url}" class="dl-btn" target="_blank">
                    <i class="fas fa-download"></i> تحميل ${link.quality} (${link.extension.toUpperCase()})
                </a>`
            ).join('');
            
            results.classList.remove('hidden');
        } else {
            alert("خطأ: " + (data.error || "مقدرناش نسحب الرابط ده"));
        }
    } catch (e) {
        alert("فيه مشكلة في الاتصال بالسيرفر!");
    } finally {
        btn.disabled = false;
        btn.innerText = "استخراج";
        status.classList.add('hidden');
    }
});
