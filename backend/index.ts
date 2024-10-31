import Fastify from 'fastify'
import cors from '@fastify/cors'
import fileUpload from "fastify-file-upload"
import issuesRoutes from './src/issues/controller/issues-routes'


// Import the framework and instantiate it
const fastify = Fastify({
  // logger: true
})

fastify.register(cors, {
  origin: true
})
fastify.register(fileUpload)

// Declare a route
fastify.register(issuesRoutes);


// Run the server!
const start = async() => {
  try {
    await fastify.listen({ port: 8080 })
    console.log("------------- Listening on port 8080 -------------")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()