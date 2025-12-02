import type { MiddlewareHandler } from 'astro';

/**
 * Middleware untuk menangani redirect setelah POST request
 * Mengubah redirect menjadi 303 (See Other) yang memaksa method GET
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  
  // Jika response adalah redirect dan request method adalah POST, ubah menjadi 303 (GET redirect)
  if (response.status >= 300 && response.status < 400 && context.request.method === 'POST') {
    const location = response.headers.get('location');
    if (location) {
      return new Response(null, {
        status: 303,
        headers: {
          'Location': location,
        },
      });
    }
  }
  
  return response;
};

