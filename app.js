import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.static('public'))

app.get('/', (req,res) =>{
    res.sendFile('/templates/login/login.html', { root: path.join(__dirname, 'public') })
})
app.get('/register', (req,res) =>{
    res.sendFile('/templates/login/cadastro.html', { root: path.join(__dirname, 'public') })
})
app.get('/home', (req,res) =>{
    res.sendFile('/templates/home/home.html', { root: path.join(__dirname, 'public') })
})
app.get('/book', (req,res) =>{
    res.sendFile('/templates/book/book.html', { root: path.join(__dirname, 'public') })
})
app.listen(3000, () => console.log(' *http://localhost:3000!'));