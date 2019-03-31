const Airtable = require('airtable')

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLEAPIKEY
})

const base = Airtable.base(process.env.AIRTABLEBASE)

module.exports = base
