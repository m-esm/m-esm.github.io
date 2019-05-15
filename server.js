/// <reference path="serendip.d.ts" />

() => {
  class server {
    /**
     * 
     * @param {modules} modules 
     */
    constructor(modules) {
      this.modules = modules;
    }

    async start() {


    }

    /**
     * 
     * @param {req} req 
     * @param {res} res 
     * @param {{data : any; model : any}} inputs 
     */
    async onRequest(req, res, inputs) {

      return {
        data: {
          req: {
            ip: req.ip(),
            useragent: req.useragent(),
            host: req.headers.host,
            url: req.url,
            query: req.query,
            body: req.body,
            method: req.method
          }
        }
      }
    }

  }

  return server;

}