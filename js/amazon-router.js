/**
 * Izaline Book Collection — Smart Amazon Marketplace Geo-Router
 * Automatically maps Kindle and Paperback links to the visitor's local Amazon store
 * based on browser language, system locale, and timezone.
 */
(function () {
  'use strict';

  var DEFAULT_ASIN = 'B0HRJF6DF4';

  function resolveMarketplace() {
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    var tz = '';
    try {
      if (window.Intl && Intl.DateTimeFormat) {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      }
    } catch (e) {}

    // Denmark, Germany, Austria, Switzerland -> amazon.de
    // (Denmark officially uses amazon.de with Danish/English UI and free shipping over €39)
    if (
      lang.startsWith('da') ||
      tz.indexOf('Copenhagen') !== -1 ||
      lang.startsWith('de') ||
      tz.indexOf('Berlin') !== -1 ||
      tz.indexOf('Vienna') !== -1 ||
      tz.indexOf('Zurich') !== -1
    ) {
      return { domain: 'amazon.de', label: 'Amazon.de (Denmark & EU)' };
    }

    // Sweden -> amazon.se
    if (lang.startsWith('sv') || tz.indexOf('Stockholm') !== -1) {
      return { domain: 'amazon.se', label: 'Amazon.se' };
    }

    // United Kingdom & Ireland -> amazon.co.uk
    if (
      lang === 'en-gb' ||
      lang.indexOf('gb') !== -1 ||
      tz.indexOf('London') !== -1 ||
      tz.indexOf('Dublin') !== -1
    ) {
      return { domain: 'amazon.co.uk', label: 'Amazon.co.uk' };
    }

    // France & Belgium -> amazon.fr
    if (
      lang.startsWith('fr') ||
      tz.indexOf('Paris') !== -1 ||
      tz.indexOf('Brussels') !== -1
    ) {
      return { domain: 'amazon.fr', label: 'Amazon.fr' };
    }

    // Netherlands -> amazon.nl
    if (lang.startsWith('nl') || tz.indexOf('Amsterdam') !== -1) {
      return { domain: 'amazon.nl', label: 'Amazon.nl' };
    }

    // Italy -> amazon.it
    if (lang.startsWith('it') || tz.indexOf('Rome') !== -1) {
      return { domain: 'amazon.it', label: 'Amazon.it' };
    }

    // Spain -> amazon.es
    if (lang.startsWith('es') || tz.indexOf('Madrid') !== -1) {
      return { domain: 'amazon.es', label: 'Amazon.es' };
    }

    // Poland -> amazon.pl
    if (lang.startsWith('pl') || tz.indexOf('Warsaw') !== -1) {
      return { domain: 'amazon.pl', label: 'Amazon.pl' };
    }

    // Canada -> amazon.ca
    if (
      lang.indexOf('ca') !== -1 ||
      tz.indexOf('Toronto') !== -1 ||
      tz.indexOf('Vancouver') !== -1 ||
      tz.indexOf('Montreal') !== -1
    ) {
      return { domain: 'amazon.ca', label: 'Amazon.ca' };
    }

    // Australia & New Zealand -> amazon.com.au
    if (
      lang.indexOf('au') !== -1 ||
      tz.indexOf('Sydney') !== -1 ||
      tz.indexOf('Melbourne') !== -1 ||
      tz.indexOf('Auckland') !== -1
    ) {
      return { domain: 'amazon.com.au', label: 'Amazon.com.au' };
    }

    // Japan -> amazon.co.jp
    if (lang.startsWith('ja') || tz.indexOf('Tokyo') !== -1) {
      return { domain: 'amazon.co.jp', label: 'Amazon.co.jp' };
    }

    // Brazil -> amazon.com.br
    if (lang.startsWith('pt') || tz.indexOf('Sao_Paulo') !== -1) {
      return { domain: 'amazon.com.br', label: 'Amazon.com.br' };
    }

    // Mexico -> amazon.com.mx
    if (tz.indexOf('Mexico_City') !== -1) {
      return { domain: 'amazon.com.mx', label: 'Amazon.com.mx' };
    }

    // India -> amazon.in
    if (tz.indexOf('Calcutta') !== -1 || tz.indexOf('Kolkata') !== -1) {
      return { domain: 'amazon.in', label: 'Amazon.in' };
    }

    // Default US / International -> amazon.com
    return { domain: 'amazon.com', label: 'Amazon.com' };
  }

  function initSmartAmazonLinks() {
    var market = resolveMarketplace();
    var links = document.querySelectorAll('[data-amazon-asin]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var asin = link.getAttribute('data-amazon-asin') || DEFAULT_ASIN;
      link.href = 'https://www.' + market.domain + '/dp/' + asin;
      link.title = 'Opens on ' + market.label + ' (' + market.domain + ')';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartAmazonLinks);
  } else {
    initSmartAmazonLinks();
  }

  // Export helper globally if needed
  window.IzalineAmazon = {
    resolveMarketplace: resolveMarketplace,
    getStoreUrl: function (asin) {
      var m = resolveMarketplace();
      return 'https://www.' + m.domain + '/dp/' + (asin || DEFAULT_ASIN);
    }
  };
})();
