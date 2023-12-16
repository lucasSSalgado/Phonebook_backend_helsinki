const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('post', function (req, res) { 
    if (req.method === 'POST') {
        return JSON.stringify(req.body) 
    }
    return 
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(data)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personData = data.find(p => p.id === id)
    if (personData) {
        res.json(personData)
        return 
    } 
    res.status(404).json({ message: 'obj not found'} )
})
app.get('/info', (req, res) => {
    const html =
     `  <p>Phonebook has info for ${data.length} people</p>
        <p>${new Date()}</p>
     `
    res.send(html)
})
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({ 
            error: 'content missing' 
        })
    }
    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'content missing' 
        })
    }
    if (checkIfNameExists(body.name)) {
        return res.status(400).json({ error: 'name must be unique' } )
    }

    const id = Math.floor(Math.random() * 10000000 )
    const newPersor = {
        id: id,
        name: body.name,
        number: body.number
    }
    data.push(newPersor)
    res.status(201).json(newPersor)
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    data = data.filter(p => p.id !== id)

    res.status(204).json( {message: 'object deleted'} )
})

const checkIfNameExists = (name) => {
    const exists = data.find(p => p.name === name)
    if (exists) return true
    return false
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`start server on port ${PORT}`)
})