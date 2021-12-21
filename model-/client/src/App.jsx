import React, { useEffect, useState } from 'react';
import axios from 'axios'
import ReactCountryFlag from "react-country-flag"
import { SiVerizon } from 'react-icons/si'
import { BiErrorCircle } from 'react-icons/bi'
import { BsQuestionLg } from 'react-icons/bs'
import { PieChart } from 'react-minimal-pie-chart';
import Swal from 'sweetalert2'
import { FaRegMoneyBillAlt } from 'react-icons/fa'

function App() {

  const [balance, setBalance] = useState(0)
  const [iban, setIban] = useState('')
  const [iso, setIso] = useState('')
  const [toTransfer, setToTransfer] = useState(0)
  const [noTransfer, setNoTransfer] = useState(false)
  const [invalidAmount, setInvalidAmount] = useState(false)

  const [loading, setLoading] = useState(false)
  const [valid, isValid] = useState('')

  const api = 'http://localhost:2400/api/v1'

  useEffect(() => {

    const getBalance = async () => {
      const { data } = await axios.get(`${api}/balance`)
      setBalance(data)
    }
    getBalance()




  }, [])

  const validateIban = async (param) => {
    param.replace(/\s/g, "").toLowerCase()

    if (param.length > 19) {
      const { data } = await axios.get(`${api}/bank/${param}`)
      isValid(() => data ? 'valid' : 'invalid')
    }
    //return isValid('')
  }

  const handleIban = async (value) => {
    let ib = value.toUpperCase()
    ib = ib.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
    setIban(ib)
    setIso(value.substring(0, 2))

    validateIban(value)

  }


  const handleTransfer = async () => {
    if (valid === 'invalid') return setNoTransfer(true)

    if (!toTransfer) setInvalidAmount(true)
    if (iban.length < 10) return isValid('invalid')

    if (balance < toTransfer) {
      setInvalidAmount(true)
      Swal.fire(
        'Error',
        'The amout must be lower then your balance',
        'error'
      )
      return
    }


    setInvalidAmount(false)
    setLoading(true)
    let newIban = iban.replace(/\s/g, "").toLowerCase()

    const { data } = await axios.post(`${api}/transfer/${newIban}`, {
      amount: toTransfer
    })


    Swal.fire(
      'Good job!',
      'The amount has been transferred successfully',
      'success'
    )

    setLoading(false)
    setBalance(data)
    setToTransfer(0)



  }

  const clear = () => {
    setToTransfer(0)
    setIban('')
  }


  useEffect(() => {

    iban.length === 0 && isValid('')

  }, [iban])
  useEffect(() => {

    iso.length === 0 && setIso('')

  }, [iso])






  return (
    <div className="px-3 w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className='p-5 rounded-md relative bg-white shadow-md w-full sm:w-96 border'>
        <span className='text-white absolute -top-6 right-0 font-medium'>Balance : {balance} </span>
        <div className='w-full flex flex-col space-y-2 items-start'>
          <span className='font-bold'>IBAN</span>
          <div className='relative w-full'>
            <input

              onPaste={({ clipboardData }) => handleIban(clipboardData)}
              onChange={({ target }) => handleIban(target.value)}
              value={iban}
              type="text"
              className={`w-full h-full focus:ring-2 ring-indigo-400 ring-opacity-50 duration-300 w-full border border-gray-400 rounded px-2 py-1.5 outline-none ${valid === 'valid' ? 'ring-2 ring-green-400' : valid === 'invalid' && 'ring-2 ring-red-400'}`}
            />
            <span className='absolute top-2 right-3'>
              {
                valid === 'valid' ? <SiVerizon color='green' /> : valid === 'invalid' ? <BiErrorCircle color='red' /> : <BsQuestionLg color='gray' />
              }
            </span>
          </div>
          <div className='w-full flex items-center justify-between'>
            <div className="flex items-center space-x-3">
              <ReactCountryFlag countryCode={iso} svg />
              <span className='text-sm font-medium text-gray-500'></span>
            </div>
          </div>
        </div>
        <div className='mt-5'>
          <div className='flex flex-col space-y-1'>
            <span className='font-bold'>Amount</span>
            <div className='flex items-center justify-between'>
              <div className='flex items-center w-7/12 border border-gray-400'>
                <span className='bg-indigo-400 text-gray-100 py-1 px-2' >AED</span>
                <input
                  value={toTransfer}
                  onChange={({ target }) => setToTransfer(target.value)}
                  type="text"
                  className={`focus:ring-2 ring-indigo-400 ring-opacity-50 ${invalidAmount && 'ring-2 ring-red-400'} duration-300 w-full px-2 py-1 text-right border-0 outline-none`}
                />
              </div>
              <PieChart
                className='w-24'
                background='rgb(79, 70, 229)'
                totalValue={balance}
                data={[
                  { title: 'One', value: toTransfer, color: '#c7d2fe' },
                ]}
              />
            </div>
          </div>
        </div>
        <div className='mt-12 w-full flex items-center justify-between'>
          <button onClick={clear} className='font-medium text-gray-500'>Cancel</button>
          <div className='flex flex-col space-y-2'>
            <button onClick={handleTransfer} className='flex items-center justify-center space-x-2 font-medium bg-indigo-500 text-gray-100 hover:bg-indigo-600 duration-300 rounded w-32 h-8'>
              <span>
                {
                  !loading ? 'Transfer' : 'Transfering...'
                }
              </span>
              <FaRegMoneyBillAlt />
            </button>
            {
              noTransfer && <span className='text-red-600 text-sm font-medium'>IBAN is incorrect</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
