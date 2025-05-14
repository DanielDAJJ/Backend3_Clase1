import express from 'express';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || 'no hay secreto';

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hola perros');
});
app.get('/secreto', (req, res) => {
    res.send(`El secreto es: ${SECRET}`);
});
app.get('/child', (req, res) => {
    const childPath = resolve(__dirname, './child.js');
    console.log(childPath);
    const child = fork(childPath);
    child.on('message', (msg) => {
        //console.log('Mensaje del hijo:', msg);
        res.send(`se recibio el mensaje: ${msg}`);
    });
    child.on('error', (error) => {
        console.error('Error en el hijo:', error);
        return res.status(500).send('Error en el hijo');
    });
    child.on('exit', (code) => {
        console.log(`El hijo ha salido con el código ${code}`);
    });
});

app.listen(PORT,()=>{
    console.log(`Servidor en linea en http://localhost:${PORT}`);
});