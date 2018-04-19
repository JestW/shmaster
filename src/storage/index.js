import Basil from 'basil.js'

const options = {
  // Namespace. Namespace your Basil stored data
  // default: 'b45i1'
  namespace: 'shenghong',

  // storages. Specify all Basil supported storages and priority order
  // default: `['local', 'cookie', 'session', 'memory']`
  storages: ['cookie', 'local', 'session'],

  // expireDays. Default number of days before cookies expiration
  // default: 365
  expireDays: 31
}

const basil = new Basil(options)

export default basil
