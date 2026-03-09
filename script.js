// 1. تعريف العناصر
const tabs = document.querySelectorAll('.tab-btn');
const urlInput = document.getElementById('urlInput');
const mainBtn = document.getElementById('mainBtn');
const loader = document.getElementById('loader');
const resultBox = document.getElementById('resultBox');

// 2. منطق تبديل الأقسام (Tabs)
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // إزالة اللون الأحمر من كل الزراير
        tabs.forEach(t => t.classList.remove('active'));
        // إضافة اللون الأحمر للزرار اللي ضغطت عليه
        tab.classList.add('active');

        // تغيير الكلام اللي جوه مربع النص حسب المنصة
        const platform = tab.getAttribute('data-platform');
        updatePlaceholder(platform);
    });
});

function updatePlaceholder(platform) {
    switch(platform) {
        case 'tiktok': urlInput.placeholder = "حط رابط فيديو تيك توك هنا..."; break;
        case 'instagram': urlInput.placeholder = "حط رابط ريلز أو ستوري انستجرام..."; break;
        case 'youtube': urlInput.placeholder = "حط رابط فيديو يوتيوب..."; break;
        case 'facebook': urlInput.placeholder = "حط رابط فيديو أو ريلز فيسبوك..."; break;
        default: urlInput.placeholder = "ضع الرابط هنا (أي منصة)...";
    }
}

// 3. منطق زرار التحميل الأساسي
mainBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if(!url) return alert('يا جيفري.. حط الرابط الأول! 😂');

    loader.classList.remove('hidden');
    resultBox.classList.add('hidden');

    try {
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await res.json();
        
        if (data.links && data.links.length > 0) {
            displayResults(data);
        } else {
            alert('السيرفر مش عارف يوصل للفيديو ده، اتأكد إنه عام (Public)');
        }
    } catch (e) {
        alert('فيه مشكلة في السيرفر.. جرب كمان شوية');
    } finally {
        loader.classList.add('hidden');
    }
});

function displayResults(data) {
    document.getElementById('resTitle').innerText = data.title;
    document.getElementById('resThumb').src = data.thumbnail;
    
    const linksGrid = document.getElementById('downloadLinks');
    linksGrid.innerHTML = ''; 

    data.links.forEach(link => {
        const btn = document.createElement('a');
        btn.className = 'dl-button';
        btn.href = link.url;
        btn.target = '_blank';
        btn.innerHTML = `<i class="fas fa-download"></i> تحميل ${link.quality || 'بجودة عالية'}`;
        linksGrid.appendChild(btn);
    });

    resultBox.classList.remove('hidden');
}