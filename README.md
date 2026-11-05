<p align="center" style="margin-bottom:10px;">
  <a href="https://www.npmjs.com/package/arm-js-library">
    <img src="https://assets-omega-neon.vercel.app/images/arm-js-title-logo.png" alt="arm-js-logo" height="200" width="143.7" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/michaeljymsgutierrez/arm-js-library/actions/workflows/ci-cd.yml">
    <img src="https://github.com/michaeljymsgutierrez/arm-js-library/actions/workflows/ci-cd.yml/badge.svg" alt="cicd-badge-logo" />
  </a>
  <a href="https://www.npmjs.com/package/arm-js-library">
    <img src="https://img.shields.io/npm/v/arm-js-library" alt="npm-badge-logo" />
  </a>
  <a href="https://github.com/michaeljymsgutierrez/arm-js-library?tab=MIT-1-ov-file">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="license-badge-logo" />
  </a>
</p>

**ARM (API Resource Manager)** is a lightweight, MobX-powered API resource manager for JavaScript - reactive collections, request deduplication, and JSON:API-friendly data normalization, with a consistent `get`/`set`/`save`/`reload`/`destroyRecord` API on every record.

```bash
npm install arm-js-library --save
```

<!-- TODO: replace with the real Vercel URL once the project is deployed -->
📖 **[Full documentation](https://arm-js-library.vercel.app/docs)** · 🔧 **[API reference](https://arm-js-library.vercel.app/docs/api-reference)** · 🎮 **[Guides](https://arm-js-library.vercel.app/docs/guides/request-functions)**

## Quick example

```javascript
import { observer } from 'mobx-react'
import { ARM } from '@/components/providers/arm-config-provider'

const App = observer(() => {
  const { isLoading, data: address } = ARM.findRecord('addresses', 2519858, { include: 'user' })

  if (isLoading) return <span>Loading...</span>

  return (
    <input
      value={address.get('attributes.address1')}
      onChange={(event) => address.set('attributes.address1', event.target.value)}
      onBlur={() => address.save()}
    />
  )
})
```

See the [Getting Started guide](https://arm-js-library.vercel.app/docs/getting-started) for full setup (NextJS and non-NextJS), and the [guides](https://arm-js-library.vercel.app/docs/guides/request-functions) to see every method running against a real API.

## Credits

- **[Axl Asuncion](https://www.facebook.com/skpcls)** - Original logo/design creator
- **[Luigi Cruz](https://github.com/luigircruz)** - Features and bugs feedback
- **[Dickson Palomeras](https://github.com/DicksonPal)** - Features and bugs feedback

## License

This project is licensed under the [MIT](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/LICENSE.md) License.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide before submitting any changes.
