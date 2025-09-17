import Joi from 'joi'

const MessageDataSchema = Joi.object({
    room: Joi.string().min(3).max(20).required(),
    message: Joi.string().min(1).max(80).required()
})

export async function validateMessageData(data: Object) {
    try {
        return await MessageDataSchema.validateAsync(data, { abortEarly: true, stripUnknown: true })
    }
    catch(err: any){
        console.log(`Validation error: ${err.message}`) // testing purposes
        return false
    }
}



const UsernameSchema = Joi.string().regex(/^[a-zA-Z0-9]+$/).required()

export async function validateUsername(username: string) {
    try{
        return await UsernameSchema.validateAsync(username, { abortEarly: true, stripUnknown: true })
    }
    catch(err){
        console.log(`VALIDATION ERROR: ${err}`)
        return false
    }
} 