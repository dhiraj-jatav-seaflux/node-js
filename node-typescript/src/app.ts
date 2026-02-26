import express from 'express'
import todosRoutes from "./routes/todos.js"

const app = express();

app.use(express.urlencoded({extended:false}))
app.use(express.static('public'));
app.use(express.json())

app.use(todosRoutes)

app.listen(3000,()=>{
    console.log('Server is running')
})