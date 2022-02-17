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

// middleware
function verifyIfExistsCpf(request, response, next) {
  const { cpf } = request.headers

  const customer = customers.find(customer => customer.cpf === cpf)

  if (!customer)
    return response.status(400).json({ error: 'Customer not Found' })

  request.customer = customer
  // para repassar um valor para o a nossa rota
  next()
}

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

// formas de voce utilizar o middleweres
// entre a rota e reuisição caso o midllawares seja só para um rota
// e utilizando app.use(middlawares) qunado é para todas ad rotas

app.get('/statement', verifyIfExistsCpf, (request, response) => {
  const { customer } = request

  return response.json(customer.statement)
})

app.listen(3333)
