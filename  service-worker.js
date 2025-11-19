// اسم ذاكرة التخزين المؤقت (Cache)
const CACHE_NAME = 'filmy-cache-v1';

// قائمة بالملفات التي يجب تخزينها مؤقتاً عند تثبيت التطبيق
const urlsToCache = [
    './movie_app.html',
    './manifest.json',
    // يجب إضافة رابط ملف CSS الخاص بـ Tailwind إذا لم يكن مُحملاً من CDN، لكن في حالتنا هو CDN
    // يمكن إضافة أي صور أو خطوط رئيسية هنا
];

// 1. مرحلة التثبيت (Install): تخزين الملفات الأساسية
self.addEventListener('install', event => {
    console.log('Service Worker: مرحلة التثبيت');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: تخزين الملفات الأساسية');
                return cache.addAll(urlsToCache);
            })
    );
});

// 2. مرحلة الجلب (Fetch): تقديم الملفات المخزنة بدلاً من الشبكة
self.addEventListener('fetch', event => {
    // محاولة جلب الملف من ذاكرة التخزين أولاً
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجدنا الملف في الذاكرة المؤقتة، نستخدمه
                if (response) {
                    return response;
                }
                // وإلا، نطلب الملف من الشبكة
                return fetch(event.request);
            })
    );
});

// 3. مرحلة التفعيل (Activate): إزالة أي إصدارات قديمة من الذاكرة المؤقتة
self.addEventListener('activate', event => {
    console.log('Service Worker: مرحلة التفعيل');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // حذف الكاش القديم
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

