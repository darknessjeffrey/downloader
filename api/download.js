export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    
    const { url } = req.body;
    const API_KEY = process.env.RAPIDAPI_KEY;

    // فحص: هل فيرسيل شايف المفتاح أصلاً؟
    if (!API_KEY) {
        return res.status(400).json({ error: "السيرفر مش لاقي الـ API_KEY! اتأكد إنك حطيته في Vercel وعملت Redeploy." });
    }

    try {
        const apiRes = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
                'x-rapidapi-key': API_KEY
            },
            body: JSON.stringify({ url: url })
        });

        const data = await apiRes.json();

        // حالة 1: الـ API شغال بس رفض الطلب (ممكن الرصيد خلص أو الرابط غلط)
        if (!apiRes.ok) {
            return res.status(400).json({ error: `الـ API رفض الطلب وقال: ${JSON.stringify(data)}` });
        }

        // حالة 2: الـ API نجح بس مفيش روابط رجعت
        if (!data.medias && !data.links && !data.url) {
            return res.status(400).json({ error: `البيانات رجعت فاضية من الـ API: ${JSON.stringify(data)}` });
        }

        // حالة 3: نجاح! ننسق البيانات
        const medias = data.medias || data.links || [{ url: data.url, quality: 'عالية' }];
        return res.status(200).json({
            title: data.title || "تم الاستخراج 😈",
            thumbnail: data.thumbnail || data.cover || "https://placehold.co/600",
            links: medias.map(m => ({
                quality: m.quality || m.type || 'تحميل',
                url: m.url || m.link,
                extension: m.extension || 'mp4'
            }))
        });

    } catch (error) {
        // لو السيرفر نفسه وقع
        return res.status(500).json({ error: `مشكلة في كود السيرفر نفسه: ${error.message}` });
    }
}
