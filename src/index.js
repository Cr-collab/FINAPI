const express = require('express')

const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(express.json())

const customers = []
/**
 *  cpf - string
 *  name - string
 *  id - uuid
 *  statement - []
 */
app.post('/account', (request, response) => {
  const { cpf, name } = request.body

  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf)
  // vai verificar se algum cpf que esta vindo post ja existe no nosso array
  // se ecistir vai retornar true se não vai retornar false
  // some -> vai faze uma busca baseada na condição que eu passar para ele

  if (customerAlreadyExists) {
    // se o cpf ja existir ele vai fazer retornar um erro e vai evitar que outras coisas aconteca
    return response.status(400).json({ error: 'Customer already Exists!' })
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  })

  console.log(customers)

  return response.status(201).send()
})

app.listen(3333, () => console.log('Api Monstra do FinApi 🚗🚗🚗'))
