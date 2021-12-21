import express from 'express'
import cache from 'memory-cache'
import isValidIBANNumber from './ibanValidation'


const router = express.Router()


router.get('/balance', (req, res) => {
    let balance = cache.get('balance')
    return res.status(200).json(balance)
})


router.get('/bank/:iban', (req, res) => {
    const { iban } = req.params
    let valid = isValidIBANNumber(iban) === 1 ? true : false
    return res.status(200).json(valid)
})


router.post('/transfer/:iban', (req, res) => {
    const { iban } = req.params

    if (!iban) return

    if (isValidIBANNumber(iban) === 1) {
        const { amount } = req.body
        let balance = cache.get('balance')

        let newBlance = parseInt(balance) - parseInt(amount)
        cache.put('balance', newBlance);


        return res.status(200).json(cache.get('balance'))
    }
})






export default router