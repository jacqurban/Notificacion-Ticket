const { chromium } = require('playwright');
const notifier = require('node-notifier');

(async () => {
  const url = 'https://www.ticketek.com.ar/pica-pica/auditorio-angel-bustelo';

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Iniciando monitoreo del botón...');

  while (true) {
    try {
      await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });

      // Esperar a que el botón esté en la página (hasta 60 segundos)
      await page.waitForSelector('a:has-text("Comprar")', { timeout: 60000 });

      const button = await page.$('a:has-text("Comprar")');
      if (button) {
        const className = await button.getAttribute('class');
        const isDisabled = className.includes('disabled'); // Si tiene "disabled" está deshabilitado

        if (!isDisabled) {
          console.log('¡El botón está habilitado para comprar entradas!');
          notifier.notify({
            title: '¡Botón habilitado!',
            message: 'El botón para comprar entradas ya está disponible.',
          });
          break;
        } else {
          console.log(`El botón aún está deshabilitado. Próxima consulta en 15 minutos... ${new Date().toLocaleString()}`);
        }
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }

    // Esperar 15 minutos
    await new Promise(resolve => setTimeout(resolve, 900000));
  }

  await browser.close();
})();
