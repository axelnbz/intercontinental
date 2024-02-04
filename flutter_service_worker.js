'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "d84d385be562f81dbd622be0a5a6ddbc",
"index.html": "23b319ec30c023c8c9b1bd2ea9fff91f",
"/": "23b319ec30c023c8c9b1bd2ea9fff91f",
"main.dart.js": "6fc81205177ff13fb3261135d471059f",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "b2e41e353a69943a3c5eaa2c72ee9428",
"icons/Icon-192.png": "bb688834cee170bc34773575ca033667",
"icons/Icon-maskable-192.png": "e78c7881d8cb6b592a9dbc69bf18aebb",
"icons/Icon-maskable-512.png": "eb3d66f121953e33bf7d7c47a9910bbb",
"icons/Icon-512.png": "c99fc478f16f4f495b970b6a4f27646f",
"manifest.json": "1bab8915b746b3357eee17bca897e432",
"assets/images/INSTAGRAM.png": "380ff7a8b5b3e03cf545dcfc962dbfef",
"assets/images/FLECHA.png": "d993f65bc2bc540434db0f9d8c3cee98",
"assets/images/IMAGEN_INICIO.png": "6137aa08135ebbecf656ab3ae200a541",
"assets/images/INT.png": "e4b83d67c155cdb54c96e5cc7993981d",
"assets/images/C1.png": "d843fad9e9682f6581e3538fd13fd54f",
"assets/images/REVIEW2.png": "778231dcdc6a2d6c97ec523ce592c329",
"assets/images/REVIEW3.png": "ec1b918166a65225e2cad08334f737e6",
"assets/images/C2.png": "2320f06cd8aa165f19a88c28ebdfae30",
"assets/images/REVIEW1.png": "842eefd75f32573e8f65a15b2257bcd4",
"assets/images/C3.png": "99df8d8c42b6d666f4c26473b5f09ca7",
"assets/images/google.png": "69b3bd79d4f1458af98a1c19ca0acde4",
"assets/images/FACEBOOK.png": "3d6f803a2ba16d6ad5fbda9469d6023c",
"assets/images/REVIEW4.png": "4d5c0a9d2967fb69d55242136c195ff0",
"assets/images/REVIEW5.png": "495b4f9d38e607945e7d73f804637486",
"assets/images/REVIEW7.png": "6e68bee49180d2d473f67a74155d6fc2",
"assets/images/REVIEW6.png": "7ed9b9e6313f6c58fbaab7bd0e99965b",
"assets/AssetManifest.json": "dbf68b32cdd54abdb768241f41f8053b",
"assets/NOTICES": "4f445a4efa9589d95a8687b9f1a1846f",
"assets/FontManifest.json": "c009364ba1f6e22fb11d454c27419645",
"assets/AssetManifest.bin.json": "1c0504dd418ed66b5688710e1f82e23c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "c67770777d6793f6a27f38672b08c328",
"assets/fonts/Poiret/PoiretOne-Regular.ttf": "8d15f9c0d468e1de889e81fae1087b61",
"assets/fonts/Charlevoix/CharlevoixPro-Light.otf": "20e1ef964ef6376a88a6c046c55b9625",
"assets/fonts/Charlevoix/CharlevoixPro-Regular.otf": "3ff9908135279884f3dab14ffc4033af",
"assets/fonts/Charlevoix/CharlevoixPro-Bold.otf": "2105fe3ebd48d53741a083f2c430e88d",
"assets/fonts/MaterialIcons-Regular.otf": "42e6703bcd5d166e51b0d407b674e320",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
