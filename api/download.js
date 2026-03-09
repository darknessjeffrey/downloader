export default async function handler(req, res) {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'الرابط مفقود' });

    try {
        // نستخدم API شامل يدعم كل المنصات (FB, IG, YT, TikTok)
        // ملاحظة: الروابط دي بتتغير، يفضل دايماً استخدام RapidAPI لو عايز استقرار 100%
        const response = await fetch(`https://api.boxentriq.com/social/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        // تنسيق البيانات لترجع للمتصفح بشكل موحد
        res.status(200).json({
            title: data.title || 'فيديو من لوسيفر',
            thumbnail: data.thumbnail || '',
            links: data.links || [] // مصفوفة فيها كل الجودات المتاحة
        });

    } catch (error) {
        res.status(500).json({ error: 'فشل في الاتصال بالسيرفر' });
    }
}