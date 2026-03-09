import { aio } from 'btch-downloader';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'غير مسموح بهذا الطلب' });
    
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'فين الرابط يا لوسيفر؟' });

    try {
        // نستخدم المكتبة المجانية لتحليل وسحب الفيديو من أي منصة
        const result = await aio(url);

        let title = "تم الاستخراج بواسطة لوسيفر 😈";
        let thumbnail = "https://placehold.co/600x400/151515/ff003c?text=Lucifer+Tools";
        let links = [];

        // تنسيق البيانات اللي راجعة من المكتبة عشان الواجهة تفهمها
        if (typeof result === 'object' && result !== null) {
            title = result.title || title;
            thumbnail = result.thumbnail || result.cover || thumbnail;
            
            if (result.url) {
                links.push({ quality: 'عالية (تحميل مباشر)', url: result.url, extension: 'mp4' });
            } else if (result.medias && Array.isArray(result.medias)) {
                links = result.medias.map(m => ({
                    quality: m.quality || 'عالية',
                    url: m.url || m.link,
                    extension: m.extension || 'mp4'
                }));
            } else if (Array.isArray(result)) {
                links = result.map((item, i) => ({
                    quality: item.quality || `رابط ${i+1}`,
                    url: typeof item === 'string' ? item : (item.url || item.link),
                    extension: 'mp4'
                })).filter(l => l.url);
            }
        } else if (typeof result === 'string') {
            links.push({ quality: 'عالية', url: result, extension: 'mp4' });
        }

        if (links.length > 0) {
             return res.status(200).json({ title, thumbnail, links });
        } else {
             return res.status(400).json({ error: "الفيديو ده إما برايفت أو المنصة غير مدعومة حالياً." });
        }

    } catch (error) {
        console.error("Lucifer Server Error:", error);
        
        // 🚀 خطة طوارئ: لو المكتبة فشلت في تيك توك، هنستخدم الـ API المفتوح الخاص بيه فوراً
        if (url.includes('tiktok.com')) {
            try {
                const apiRes = await fetch('https://www.tikwm.com/api/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ url: url, hd: '1' })
                });
                const data = await apiRes.json();
                if (data.code === 0) {
                    return res.status(200).json({
                        title: data.data.title || "تيك توك لوسيفر 😈",
                        thumbnail: data.data.cover,
                        links: [
                            { quality: "فيديو HD (بدون علامة)", url: data.data.play, extension: "mp4" },
                            { quality: "صوت فقط", url: data.data.music, extension: "mp3" }
                        ]
                    });
                }
            } catch (e) { /* تجاهل أخطاء الطوارئ */ }
        }
        
        res.status(500).json({ error: "السيرفر واجه مشكلة في تحليل الرابط ده." });
    }
}
