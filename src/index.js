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

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount
    } else {
      return acc - operation.amount
    }
  }, 0)

  return balance
}

//criando conta
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

// pegando os nosso extrato
app.get('/statement', verifyIfExistsCpf, (request, response) => {
  const { customer } = request

  return response.json(customer.statement)
})

// deposito
app.post('/deposit', verifyIfExistsCpf, (request, response) => {
  const { descprition, amount } = request.body

  const { customer } = request

  const statementOperation = {
    descprition,
    amount,
    createdAt: new Date(),
    type: 'credit'
  }

  customer.statement.push(statementOperation)

  console.log(customer.statement)

  return response.status(201).send()
})

// Saque

app.post('/withdraw', verifyIfExistsCpf, (request, response) => {
  const { amount, descprition } = request.body

  const { customer } = request

  const balance = getBalance(customer.statement)
  if (balance < amount) {
    return response.status(400).json({ error: 'Insufficient funds!' })
  }

  const statementOperation = {
    descprition,
    amount,
    createdAt: new Date(),
    type: 'debit'
  }

  console.log(statementOperation)

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

app.get('/statement/date', verifyIfExistsCpf, (request, response) => {
  const { customer } = request

  const { date } = request.query

  const dateFormat = new Date(date + ' 00:00')

  console.log(dateFormat, 'sajcfbhasdbfhbashfbh')

  const statement = customer.statement.filter(
    statement =>
      statement.createdAt.toDateString() === new Date(dateFormat).toDateString()
  )

  return response.json(statement)
})

app.put('/account', verifyIfExistsCpf, (request, response) => {
  const { name } = request.body
  const { customer } = request

  customer.name = name

  return response.status(201).send()
})

app.get('/account', verifyIfExistsCpf, (request, response) => {
  const { customer } = request

  return response.json(customer)
})
app.listen(3333)
