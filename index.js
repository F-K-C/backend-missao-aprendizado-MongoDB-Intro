const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const dbUrl = 'mongodb+srv://admin:khdaodoi3432987h@cluster0.4eooi5f.mongodb.net'
const dbName = 'mongodb-intro-e-implementacao'

async function main() {
    const client = new MongoClient(dbUrl)
    console.log('Conectando ao banco de dados....')
    await client.connect()
    console.log('Banco de dados conectado com sucesso!')

    const db = client.db(dbName)
    const collection = db.collection('personagem')

    const app = express()

    app.get('/', function (req, res) {
        res.send('Hello World')
    })

    const lista = ['Java', 'Kotlin', 'Android']

    // Endpoint Readl all (GET) /personagem
    app.get('/personagem', async function (req, res) {
        const itens = await collection.find().toArray()
        res.send(itens)
    })

    //EndPoint Read By ID
    app.get('/personagem/:id', async function (req, res) {
        const id = req.params.id
        const item = await collection.findOne({ _id: new ObjectId(id) })

        if (!item) {
            return res.status(404).send('Item não encontrado.')
        }

        res.send(item)
    })
    app.use(express.json())

    // Endpoint Create [Post]
    app.post('/personagem', function (req, res) {
        const body = req.body

        const novoItem = body.nome

        if (!novoItem) {
            return res.status(400).send('Corpo da requisição deve conter a propriedade `nome`.')
        }

        if (lista.includes(novoItem)) {
            return res.status(409).send('Esse item já existe na lista.')
        }

        lista.push(novoItem)

        res.status(201).send('Item adicionado com sucesso: ' + novoItem)
    })


    app.put('/personagem/:id', function (req, res) {
        const id = req.params.id

        if (!lista[id - 1]) {
            return res.status(404).send('Item não encontrado.')
        }

        const body = req.body
        const novoItem = body.nome

        if (!novoItem) {
            return res.status(400).send('Corpo da requisição deve contar a propriedade `nome`.')
        }

        if (lista.includes(novoItem)) {
            return res.status(409).send('Esse item já existe na lista.')
        }


        lista[id - 1] = novoItem
        res.send('Item atualizado com sucesso: ' + id + ' - ' + novoItem)
    })

    app.delete('/personagem/:id', function (req, res) {
        const id = req.params.id

        if (!lista[id - 1]) {
            return res.status(404).send('Item não encontrado.')
        }

        delete lista[id - 1]
        res.send('Item removido com sucesso: ' + id)
    })

    app.listen(3000)
}

main()