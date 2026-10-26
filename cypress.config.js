const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: false,
    screenshotOnRunFailure: true,
    // O demoqa carrega muitos anúncios de terceiros: além de deixarem a página lenta,
    // eles sobrepõem elementos (ex.: botão Submit). Bloqueá-los torna os testes estáveis.
    blockHosts: [
      '*.googlesyndication.com',
      '*.doubleclick.net',
      '*.googletagservices.com',
      '*.googletagmanager.com',
      '*.google-analytics.com',
      '*.adsafeprotected.com',
      '*.amazon-adsystem.com',
      '*.criteo.com',
      '*.criteo.net',
      '*.pubmatic.com',
      '*.rubiconproject.com',
      '*.adnxs.com',
      '*.casalemedia.com',
      '*.openx.net',
      '*.taboola.com',
      '*.moatads.com',
    ],
    // No Cypress 16 os valores lidos pelo preprocessor do Cucumber ficam em `expose` (antes `env`)
    expose: {
      // Cenários @bug documentam defeitos conhecidos do demoqa e ficam fora da execução padrão
      tags: 'not @bug',
    },
    retries: {
      runMode: 1,
      openMode: 0,
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});
