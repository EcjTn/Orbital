import Joi from 'joi'

const MessageDataSchema = Joi.object({
    room: Joi.string().min(3).max(20).required(),
    message: Joi.string().min(1).max(80).required()
})

export async function validateMessageData(data: Object) {
    try {
        const value = await MessageDataSchema.validateAsync(data, {
            abortEarly: true,
            stripUnknown: true
        })
        return value
    }
    catch(err: any){
        console.log(`Validation error: ${err.message}`) // testing purposes
        return false
    }
}