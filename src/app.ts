import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'

const app = express()


// Middlewares
app.use(express.json())
app.use(cors())


// Endpoints
app.get('/', (req, res) => {
    console.log(req.ip, 'visited')
    res.send('Hello')
})

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`[+] Error occured: ${err?.message || err}`)
    res.status(400).send('Something went wrong...')
})


export default app