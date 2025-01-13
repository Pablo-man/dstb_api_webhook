const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

// Configurar el puerto y body parser
const PORT = 3000;
app.use(bodyParser.json());

// Clave secreta para verificar el webhook
const GITHUB_SECRET = '1234';

// Middleware para verificar la firma del webhook
function verifySignature(req, res, next) {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);

    // Calcular la firma usando la clave secreta
    const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    // Comparar la firma enviada con la calculada
    if (signature !== digest) {
        return res.status(400).send('Firma no válida');
    }
    next();
}

// Endpoint para recibir el webhook
app.post('/webhook', verifySignature, (req, res) => {
    console.log('Webhook recibido:', req.body);

    // Procesar el evento, por ejemplo, cuando haya un push
    if (req.body.ref === 'refs/heads/main') {
        console.log('¡Se ha hecho un push en la rama principal!');
    }

    res.status(200).send('Recibido');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Webhook escuchando en http://localhost:${PORT}`);
});
