const { chromium } = require('playwright');
const notifier = require('node-notifier');

(async () => {
  const url = 'https://fullticket.com/tickets/es/evento?idEvento=21';

  // Abrir el navegador
  const browser = await chromium.launch({ headless: true }); 
  const page = await browser.newPage();

  console.log('Iniciando monitoreo del botón...');
  while (true) {
    try {
      // Navegar a la página
      await page.goto(url);

      // Buscar el botón por su clase
      const button = await page.$('a.buyButton');

      if (button) {
        // Verificar si el botón está habilitado (no tiene clase "disabled")
        const className = await button.getAttribute('class');
        const isDisabled = className.includes('disabled');

        if (!isDisabled) {
          console.log('¡El botón está habilitado para comprar entradas!');
          notifier.notify({
            title: '¡Botón habilitado!',
            message: 'El botón para comprar entradas ya está disponible.',
          });
          break; // Finaliza el monitoreo
        } else {
          //console.log('El botón aún está deshabilitado. Próxima consulta en 15 minutos...')
          console.log(`El botón aún está deshabilitado. Próxima consulta en 15 minutos... Horario: ${new Date().toLocaleString()}`);
        }
      } else {
        console.log('No se encontró el botón en la página.');
      }
    } catch (error) {
      console.error('Error al consultar la página:', error.message);
    }

    // Esperar 15 minutos (900000 ms) antes de la siguiente consulta
    await new Promise((resolve) => setTimeout(resolve, 900000));
  }

  await browser.close();
})();

