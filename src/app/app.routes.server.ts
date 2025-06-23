// import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//   {
//     path: '**',
//     renderMode: RenderMode.Prerender
//   }
// ];
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'profile', renderMode: RenderMode.Prerender },
  { path: 'product', renderMode: RenderMode.Prerender },
  { path: 'product/create', renderMode: RenderMode.Prerender },

  // ❌ ไม่ใส่ product/:id เพราะมี dynamic param
  // ✅ fallback ใช้ SSR runtime สำหรับ route อื่น ๆ
  { path: '**', renderMode: RenderMode.Server },
];
