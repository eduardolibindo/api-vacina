const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch({ headless: true, ignoreDefaultArgs: ['--disable-extensions'] });
    const page = await browser.newPage();
    await page.goto('https://vacina.saude.rs.gov.br/');
    

    const pageContent = await page.evaluate(() => {
        return {
            cidade: document.querySelector("#Modal431060 > div > div > div.modal-header > h5").innerHTML,
            body: document.querySelector("#Modal431060 > div > div > div.modal-body").innerHTML,

            distribuicao: document.querySelector("#t431060tabModalDistribuidas").innerHTML,
            gruposVacinaveis: document.querySelector("#t431060tabModalGrupo").innerHTML,
            faixaEtaria: document.querySelector("#t431060tabModalFaixaEtaria").innerHTML
        };
    });

    console.log('pageContent:', pageContent);
    await browser.close();
    
    res.send(
        '<html lang="pt-br">' +

            '<head>' +
                '<title>SES/RS - Imunização Covid-19/RS</title>' +
                '<meta name="description" content="Monitoramento da Imunização Covid-19 / RS">' +
                '<meta charset="utf-8">' +
                '<meta name="viewport" content="width=device-width, initial-scale=1">' +
                '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">' +
            '</head>' +

            '<body>'+

                '<div class="modal fade show" tabindex="-1" role="dialog" aria-labelledby="ModalLabel431060" wfd-invisible="true" aria-modal="true" style="padding-right: 17px; display: block;">' +
                    '<div class="modal-dialog modal-lg" role="document">' +
                        '<div class="modal-content">' +
                            '<div class="modal-header">' +
                                '<h5 class="modal-title text-center">' +
                                    pageContent.cidade +
                                '</h5>' +
                            '</div>' +
                            pageContent.body +
                            pageContent.gruposVacinaveis +
                            pageContent.faixaEtaria +
                        '</div>' +
                    '</div>' +
                '</div>' +

            '</body>' +
        '</html>'
        
    );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`
        Servidor subiu com sucesso!
        acesse em http://localhost:${port}
    `);
});