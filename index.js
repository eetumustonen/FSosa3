const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
    }
]

app.get('/info', (request, respond) => {
  const numOfPeople = persons.length
  const date = new Date()
  respond.send(`<p>Phonebook has info for ${numOfPeople} people<br>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if(person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  const randId = Math.floor(Math.random() * 99999)
  console.log(randId)

  if(!body.name || !body.number){
    return response.status(400).json({
        error: 'name and/or number is missing'
    })
  }

  const names = persons.map(p => p.name)
  const nameIsInUse = names.includes(body.name)
  if(nameIsInUse){
    return response.status(400).json({
        error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: randId
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})