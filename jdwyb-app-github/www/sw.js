// 接单无忧宝 - Service Worker
const CACHE_NAME = 'jdwyb-v1';
const urlsToCache = [
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

// 安装时缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存核心资源');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('缓存失败:', err))
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求，优先使用缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 命中缓存则返回缓存
        if (response) {
          return response;
        }
        // 否则发起网络请求
        return fetch(event.request)
          .then(response => {
            // 只缓存成功的GET请求
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
              return response;
            }
            // 克隆响应（响应流只能读取一次）
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(() => {
            // 网络失败时返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// 后台同步（用于离线时提交的数据）
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// 推送通知
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '您有新的消息',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect fill="%232563eb" width="192" height="192" rx="40"/%3E%3Ctext x="96" y="120" font-size="80" text-anchor="middle" fill="white"%3E📱%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"%3E%3Crect fill="%232563eb" width="72" height="72" rx="16"/%3E%3C/svg%3E',
    vibrate: [100, 50, 100],
    data: {
      url: '/index.html'
    },
    actions: [
      {
        action: 'open',
        title: '打开应用'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('接单无忧宝', options)
  );
});

// 点击通知
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
