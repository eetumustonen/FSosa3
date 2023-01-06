require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
  if(req.method === "POST"){
    return JSON.stringify(req.body)
  } else {
    return null
  }
})

app.use(morgan(':method :url :status :res[content-length]  - :response-time ms :body'))

app.get('/info',  (request, respond) => {
  Person.count({}, (err, count) => {
    const date = new Date()
    respond.send(`<p>Phonebook has info for ${count} people<br>${date}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(result => {
      if(result){
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!body.name || !body.number){
    console.log("name and/or number is missing")
    return response.status(400).json({
        error: 'name and/or number is missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.content,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedperson => {
      response.json(updatedperson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})