export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'غير مسموح بهذا النوع من الطلبات' });
    
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'فين الرابط يا لوسيفر؟' });

    // بنسحب المفتاح من خزنة فيرسيل بأمان
    const API_KEY = process.env.RAPIDAPI_KEY; 
    const API_HOST = 'social-download-all-in-one.p.rapidapi.com';

    if (!API_KEY) {
        return res.status(500).json({ error: "خطأ: لم يتم إعداد مفتاح API في الخادم." });
    }

    // إعدادات الطلب زي ما هي موجودة في الصورة بتاعتك بالظبط
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': API_HOST,
            'x-rapidapi-key': API_KEY
        },
        body: JSON.stringify({ url: url })
    };

    try {
        const apiRes = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', options);
        const data = await apiRes.json();

        // الـ API ده عادة بيرجع البيانات جوه مصفوفة اسمها medias
        if (data && (data.medias || data.links || data.url)) {
            // بنوحد شكل الرد عشان الواجهة تفهمه بسهولة
            const medias = data.medias || data.links || [{ url: data.url, quality: 'عالية' }];
            
            return res.status(200).json({
                title: data.title || "تم الاستخراج بواسطة لوسيفر 😈",
                thumbnail: data.thumbnail || data.cover || "https://placehold.co/600x400/151515/ff003c?text=Lucifer+Tools",
                links: medias.map(media => ({
                    quality: media.quality || media.type || 'تحميل',
                    url: media.url || media.link,
                    extension: media.extension || 'mp4'
                }))
            });
        }
        
        return res.status(400).json({ error: "عذراً، الرابط محمي أو غير مدعوم." });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "الخوادم ترفض الاتصال حالياً." });
    }
}
