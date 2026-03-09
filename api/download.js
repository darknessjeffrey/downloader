export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { url } = req.body;
    
    try {
        // 1. معالجة روابط تيك توك (باستخدام محرك TikWM المستقر)
        if (url.includes('tiktok.com')) {
            const apiRes = await fetch('https://www.tikwm.com/api/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ url: url, hd: '1' })
            });
            const data = await apiRes.json();

            if (data.code === 0) {
                return res.status(200).json({
                    title: data.data.title,
                    thumbnail: data.data.cover,
                    links: [
                        { quality: "فيديو HD (بدون علامة)", url: data.data.play },
                        { quality: "صوت فقط (MP3)", url: data.data.music }
                    ]
                });
            }
            return res.status(400).json({ error: "الفيديو خاص أو محذوف" });
        } 
        
        // 2. معالجة باقي المنصات (يوتيوب، انستا، فيس بوك) باستخدام محرك Cobalt الجبار
        else {
            const apiRes = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            const data = await apiRes.json();

            // Cobalt بيرجع الرابط المباشر في المتغير data.url
            if (data && data.url) {
                return res.status(200).json({
                    title: "تم الاستخراج بواسطة لوسيفر 😈",
                    thumbnail: "https://placehold.co/600x400/151515/ff003c?text=Lucifer+Tools",
                    links: [
                        { quality: "تحميل الفيديو", url: data.url }
                    ]
                });
            }
            
            return res.status(400).json({ error: "مش قادرين نسحب الفيديو ده، ممكن يكون Private أو محمي" });
        }

    } catch (error) {
        // السطر ده هيخليك تشوف الخطأ بالتفصيل في لوحة تحكم فيرسيل
        console.error("Lucifer Server Error:", error);
        res.status(500).json({ error: "الخوادم الوسيطة ترفض الاتصال حالياً.. جرب مرة أخرى." });
    }
}
