import { ARM } from './index.js'

const Model = () => {
  const addresses = ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    {
      alias: 'customerAddresses',
      override: {
        headers: {
          'X-Client-Platform': 'Web',
        },
      },
    }
  )

  return addresses
}

export default Model
