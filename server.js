#!/usr/bin/env node
var opts = require('optimist')
           .usage('Web Socket proxy for the Embedly API')
           .options({
             'help': {
               'describe': 'Display this message',
               'alias': 'h'
             },
             'port': {
               'describe': 'Port to listen on',
               'alias': 'p',
               'default': process.env.PORT || 80
             },
             'key': {
               'describe': 'Embedly key',
               'alias': 'k',
               'default': process.env.EMBEDLY_KEY
             },
             'email': {
               'describe': 'Contact email address for User-Agent string.',
               'default': process.env.WEBMASTER_EMAIL
             },
             'timeout': {
               'describe': 'Timeout in ms on requests.',
               'default': process.env.EMBEDLY_TIMEOUT || 10000
             }
           });

var argv = opts.argv;

if (argv.help) {
  opts.showHelp(console.log);
  process.exit(0);
} else if (!argv.email) {
  console.error('Please specify your contact address via --email or the WEBMASTER_EMAIL env variable.')
  opts.showHelp(console.error);
  process.exit(1);
}

var express = require('express');
var app = express.createServer(express.logger());

app.listen(argv.port);
app.use(express.static(__dirname + '/htdocs'));

require('./embedly-socket').socket({
  key: argv.key,
  email: argv.email,
  timeout: argv.timeout,
  server: app
});

