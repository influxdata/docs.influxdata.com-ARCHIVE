'use strict';

const path = require('path');

const latestVersions = {
  'influxdb': 'v1.2',
  'telegraf': 'v1.8',
  'chronograf': 'v1.5',
  'kapacitor': 'v1.3',
  'enterprise_influxdb': 'v1.3',
  'enterprise_kapacitor': 'v1.5',
  };

const archiveDomain = 'https://archive.docs.influxdata.com'

exports.handler = (event, context, callback) => {

  function permanantRedirect(condition, newUri) {
    if (condition) {
      return callback(null, {
        status: '301',
          statusDescription: 'Moved Permanently',
          headers: {
            'location': [{
              key: 'Location',
              value: newUri,
            }],
            'cache-control': [{
              key: 'Cache-Control',
              value: "max-age=3600"
            }],
          },
      });
    }
  }

  const { request } = event.Records[0].cf;
  const parsedPath = path.parse(request.uri);
  const indexPath = 'index.html';
  const validExtensions = {
      '.html': true,
      '.css': true,
      '.js': true,
      '.xml': true,
      '.png': true,
      '.gif': true,
      '.jpg': true,
      '.ico': true,
      '.svg': true,
      '.csv': true,
      '.txt': true,
      '.lp': true,
      '.json': true,
      '.rb': true,
      '.eot': true,
      '.ttf': true,
      '.woff': true,
      '.woff2': true,
      '.otf': true,
      '.zip': true,
      '.tar': true,
      '.gz': true,
      '.map': true,
    };

  // Remove index.html from path
  permanantRedirect(request.uri.endsWith('index.html'), request.uri.substr(0, request.uri.length - indexPath.length));

  // If file has a valid extension, return the request unchanged
  if (validExtensions[parsedPath.ext]) {
    callback(null, request);
  }

  ////////////////////// START PRODUCT-SPECIFIC REDIRECTS //////////////////////

  ////////////////////////// Latest version redirects //////////////////////////
  permanantRedirect(/\/influxdb\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['influxdb']}`));
  permanantRedirect(/\/telegraf\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['telegraf']}`));
  permanantRedirect(/\/chronograf\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['chronograf']}`));
  permanantRedirect(/\/kapacitor\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['kapacitor']}`));
  permanantRedirect(/\/enterprise_influxdb\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['enterprise_influxdb']}`));
  permanantRedirect(/\/enterprise_kapacitor\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['enterprise_kapacitor']}`));

  ///////////////////// Redirect non-existent landing pages ////////////////////
  permanantRedirect(/(\/influxdb\/v0\.[6-8]\/)(?:introduction\/|api\/|ui\/|advanced_topics\/|future\/|clustering\/|guides\/|client_libraries\/|)/.test(request.uri), request.uri.replace(/(\/influxdb\/v0\.[6-8]\/).*/, `$1`));

  /////////////////////// END PRODUCT-SPECIFIC REDIRECTS ///////////////////////

  // Redirect to the a trailing slash
  permanantRedirect(!request.uri.endsWith('/'), `${archiveDomain}${request.uri}/`);

  // Use index.html if the path doesn't have an extension
  // or if the version number is parsed as an extension.
  let newUri;

  if (parsedPath.ext === '' || /\.\d{1,}/.test(parsedPath.ext)) {
    newUri = path.join(parsedPath.dir, parsedPath.base, indexPath);
  } else {
    newUri = request.uri;
  }

  // Replace the received URI with the URI that includes the index page
  request.uri = newUri;

  // Return to CloudFront
  // request.uri = request.uri + indexPath;
  callback(null, request);
};
