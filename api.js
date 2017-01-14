var GIoTTOApi = require('../giotto-api');

var api = new GIoTTOApi({
  clientId: 'TIHynZ283Jb8HC57VQKuAZjPOBfnLusQRZQEUV8u',
  clientSecret: 'dkfWsRz2uu6IrM7dR4ObC05SaXVBvm5lE7U66BsLt9IoCZ31WL',
  hostname: 'bd-exp.andrew.cmu.edu',
  protocol: 'https',
  mlProtocol: 'http',
  email: 'matus@cs.au.dk',
  mqUsername: 'giotto',
  mqPassword: 'giotto'
});

module.exports = api;
