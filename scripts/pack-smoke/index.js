import { createWfmApiClient } from 'wfm-api'

const client = createWfmApiClient({
  language: 'zh-hans',
  fetcher: async () => ({
    status: 200,
    ok: true,
    json: async () => ({
      apiVersion: '0.25.0',
      data: [{ id: '1', slug: 'forma' }],
      error: null,
    }),
    text: async () => '',
  }),
})

const items = await client.items.list()

if (!Array.isArray(items) || items.length !== 1 || items[0]?.slug !== 'forma') {
  console.error('pack smoke failed:', items)
  process.exit(1)
}

console.log('pack smoke ok:', items)
