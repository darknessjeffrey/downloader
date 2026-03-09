export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { url } = req.body;
    
    try {
        // بنستخدم API خارجي قوي وشامل لكل المنصات
        const apiRes = await fetch(`https://api.boxentriq.com/social/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        const data = await apiRes.json();

        // لو الـ API رجع روابط، بنعرضها
        if (data && data.links) {
            return res.status(200).json({
                title: data.title || "Lucifer Video",
                thumbnail: data.thumbnail || "https://placehold.co/600x400/000/ff003c?text=Lucifer+Tools",
                links: data.links // دي مصفوفة فيها الجودات والروابط
            });
        }
        
        res.status(400).json({ error: "فشل استخراج البيانات" });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ في السيرفر" });
    }
}
