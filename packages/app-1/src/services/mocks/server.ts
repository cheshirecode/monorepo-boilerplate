import { createServer, hasMany, Model, Request, Response } from 'miragejs';

export function seeds(server: Server) {

}

export function makeServer(config: ServerConfig = {}): Server {
  const { environment = 'test', ...conf } = config;
  return createServer<Models, Factories>({
    ...conf,
    environment,

    models: {

    },

    seeds(server) {
      seeds(server);
    },

    routes() {
      // specifically for testing fetch code
      const testHandler = (s: AppSchema, r: Request) => ({
        headers: r.requestHeaders,
        body: r.requestBody,
        params: r.params,
        queryParams: r.queryParams
      });
      this.get('/test', testHandler);
      this.post('/test', testHandler);
      this.put('/test', testHandler);
      this.delete('/delete', testHandler);
      this.get('/test/:foo', testHandler);
      this.post('/test/:foo', testHandler);
      this.put('/test/:foo', testHandler);
      this.delete('/delete/:foo', testHandler);
    }
  });
}
