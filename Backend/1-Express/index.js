import express from 'express'
const app = express()

let bookStore = [
  {
    id: 1,
    name: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 400,
  },
  {
    id: 2,
    name: 'Book 2',
    author: 'Author 2',
    price: 400,
  },
  {
    id: 3,
    name: 'Book 3',
    author: 'Author 3',
    price: 400,
  },
]
app.use(express.json()) //parser to parse json to js object
app.get('/books', (req, res) => {
  res.send(bookStore)
  console.log('all books are sent')
})

app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const book = bookStore.find((book) => book.id === id)
  res.send(book)
  console.log('books are sent')
})
app.post('/books', (req, res) => {
  const book = req.body
  console.log(book)
  bookStore.push(book)
  res.send('Succesfully added the book')
})

app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const book = req.body
  const index = bookStore.findIndex((book) => book.id === id)
  bookStore[index] = book
  res.send('Succesfully updated the book')
})
app.patch('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const update = req.body
  const index = bookStore.findIndex((book) => book.id === id)
  if (index !== -1) {
    bookStore[index] = { ...bookStore[index], ...update } //  merge old + new
    res.send('Successfully patched the book')
  } else {
    res.status(404).send('Book not found')
  }
})
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  bookStore = bookStore.filter((book) => book.id !== id)
  res.send('Succesfully deleted the book with id ' + id)
  console.log('book deleted with id ' + id)
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
