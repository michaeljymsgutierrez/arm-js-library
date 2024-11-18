const users = [
  {
    id: 12980860,
    type: 'users',
    attributes: {
      'profile-id': 5529719,
      'profile-type': 'CustomerProfile',
      'time-zone': 'Singapore',
      'time-zone-iana-olson': 'Asia/Singapore',
      'time-zone-utc-offset': '+08:00',
      'created-at': '2024-01-08T17:07:38.986Z',
      'updated-at': '2024-08-08T10:47:01.320Z',
    },
    relationships: {
      profile: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/users/12980860/customer-profile',
        },
        data: {
          type: 'customer-profiles',
          id: 5529719,
        },
      },
      area: {
        links: {
          related: 'https://api.arm-js-library.com/api/v1/users/12980860/area',
        },
        data: {
          type: 'areas',
          id: 166,
        },
      },
      'last-completed-job-order': {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/users/12980860/last-completed-job-order',
        },
        data: null,
      },
      'last-active-job-order': {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/users/12980860/last-active-job-order',
        },
        data: null,
      },
      items: {
        links: {
          related: 'https://api.arm-js-library.com/api/v1/users/12980860/items',
        },
        data: [
          {
            type: 'items',
            id: 163048228,
          },
          {
            type: 'items',
            id: 161076874,
          },
        ],
      },
      addresses: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/users/12980860/addresses',
        },
        data: [
          {
            type: 'addresses',
            id: 2513872,
          },
          {
            type: 'addresses',
            id: 2519858,
          },
          {
            type: 'addresses',
            id: 2518368,
          },
          {
            type: 'addresses',
            id: 2518365,
          },
          {
            type: 'addresses',
            id: 2517816,
          },
          {
            type: 'addresses',
            id: 2515557,
          },
          {
            type: 'addresses',
            id: 2513871,
          },
          {
            type: 'addresses',
            id: 2513870,
          },
          {
            type: 'addresses',
            id: 2513869,
          },
          {
            type: 'addresses',
            id: 2513868,
          },
          {
            type: 'addresses',
            id: 2513867,
          },
          {
            type: 'addresses',
            id: 2513866,
          },
        ],
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/users/12980860',
    },
  },
]

export default users
