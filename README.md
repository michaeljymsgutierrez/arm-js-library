<p align="center" style="margin-bottom:10px;">
  <a href="https://www.npmjs.com/package/arm-js-library">
    <img src="./assets/arm-js-logo.png" alt="arm-js-logo" height="200" width="143.7" />
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

<p align="center">
  <a href="https://arm-js-library-docs.vercel.app/docs">
    <img src="https://img.shields.io/badge/docs-full_documentation-blue" alt="docs-badge-logo" />
  </a>
  <a href="https://arm-js-library-docs.vercel.app/docs/api-reference">
    <img src="https://img.shields.io/badge/api-reference-blue" alt="api-reference-badge-logo" />
  </a>
  <a href="https://arm-js-library-docs.vercel.app/docs/guides/request-functions">
    <img src="https://img.shields.io/badge/guides-live_examples-blue" alt="guides-badge-logo" />
  </a>
</p>

<p align="center">
  <b>ARM (API Resource Manager)</b> is a lightweight, MobX-powered API resource manager for JavaScript.<br />
  It organizes fetched data into reactive collections, deduplicates in-flight requests automatically,<br />
  and gives every record a consistent <code>get</code>/<code>set</code>/<code>save</code>/<code>reload</code>/<code>destroyRecord</code> API - no more hand-rolled loading/error state.
</p>

```bash
npm install arm-js-library --save
```

---

## Quick example

```javascript
import { observer } from 'mobx-react'
import { ARM } from '@/components/providers/arm-config-provider' // your own module - see Getting Started

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

See the [Getting Started guide](https://arm-js-library-docs.vercel.app/docs/getting-started) for full setup (NextJS and non-NextJS), and the [guides](https://arm-js-library-docs.vercel.app/docs/guides/request-functions) to see every method running against a real API.

## Credits

| Contributor | Role |
| --- | --- |
| [Axl Asuncion](https://www.facebook.com/skpcls) | Designed the original ARM JS logo |
| [Luigi Cruz](https://github.com/luigircruz) | Early feedback on features and bugs |
| [Dickson Palomeras](https://github.com/DicksonPal) | Early feedback on features and bugs |

## License

This project is licensed under the [MIT](https://github.com/michaeljymsgutierrez/arm-js-library/blob/main/LICENSE.md) License.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide before submitting any changes.
