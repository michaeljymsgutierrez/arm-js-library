const addresses = [
  {
    id: 2519858,
    type: 'addresses',
    attributes: {
      address1: 'Paseo de Roxas, Makati, Metro Manila, Philippines',
      address2: 'Unit 100, 10th Floor',
      city: 'Makati',
      'post-code': '1225',
      landmark: 'Near Ayala Triangle Gardens',
      kind: 'home',
      label: 'Zuellig Building',
      latitude: '14.557843',
      longitude: '121.026661',
      'created-at': '2024-10-14T05:50:45.942Z',
      'updated-at': '2024-10-14T05:50:45.942Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2519858/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2519858/area',
        },
        data: {
          type: 'areas',
          id: 219,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2519858',
    },
  },
  {
    id: 2518368,
    type: 'addresses',
    attributes: {
      address1: 'Anabu Hills Test 4',
      address2: 'Anabu Hills Test 4, Phase 2 Block 5',
      city: 'Imus',
      'post-code': '4103',
      landmark: 'Anabu Hills Test 4',
      kind: 'home',
      label: 'Anabu Hills Test 4',
      latitude: '14.394261',
      longitude: '120.940783',
      'created-at': '2024-10-10T10:13:51.202Z',
      'updated-at': '2024-10-10T10:13:51.202Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2518368/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2518368/area',
        },
        data: {
          type: 'areas',
          id: 166,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2518368',
    },
  },
  {
    id: 2518365,
    type: 'addresses',
    attributes: {
      address1: 'Anabu Hills Test 1',
      address2: 'Anabu Hills Test 1, Unit B',
      city: 'Imus',
      'post-code': '001',
      landmark: 'Anabu Hills Test 1',
      kind: 'home',
      label: 'Anabu Hills Test 1',
      latitude: '14.394261',
      longitude: '120.940783',
      'created-at': '2024-10-10T09:52:09.882Z',
      'updated-at': '2024-10-10T09:55:14.541Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2518365/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2518365/area',
        },
        data: {
          type: 'areas',
          id: 166,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2518365',
    },
  },
  {
    id: 2517816,
    type: 'addresses',
    attributes: {
      address1: 'Anabu Hills Test 2',
      address2: 'Anabu Hills Test 2, Door 3',
      city: 'Imus',
      'post-code': '002',
      landmark: 'Anabu Hills Test 2',
      kind: 'home',
      label: 'Anabu Hills Test 2',
      latitude: '14.394261',
      longitude: '120.940783',
      'created-at': '2024-10-09T06:58:49.066Z',
      'updated-at': '2024-10-10T09:55:20.523Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2517816/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2517816/area',
        },
        data: {
          type: 'areas',
          id: 166,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2517816',
    },
  },
  {
    id: 2515557,
    type: 'addresses',
    attributes: {
      address1: 'Anabu Hills  Test 3',
      address2: 'Anabu Hills  Test 3, Ground Floor',
      city: 'Imus',
      'post-code': '003',
      landmark: 'Anabu Hills  Test 3',
      kind: 'home',
      label: 'Anabu Hills  Test 3',
      latitude: '14.394261',
      longitude: '120.940783',
      'created-at': '2024-10-04T05:17:44.603Z',
      'updated-at': '2024-10-10T09:55:26.282Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2515557/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2515557/area',
        },
        data: {
          type: 'areas',
          id: 166,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2515557',
    },
  },
  {
    id: 2513872,
    type: 'addresses',
    attributes: {
      address1: 'Boni Avenue, Mandaluyong, Metro Manila, Philippines',
      address2: 'Testers, Second Floor',
      city: 'Mandaluyong',
      'post-code': '1203',
      landmark: 'Test Landmark',
      kind: 'home',
      label: 'Jollibee',
      latitude: '14.576825',
      longitude: '121.035038',
      'created-at': '2024-09-30T17:32:22.746Z',
      'updated-at': '2024-10-02T08:43:08.513Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513872/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513872/area',
        },
        data: {
          type: 'areas',
          id: 2196,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2513872',
    },
  },
  {
    id: 2513871,
    type: 'addresses',
    attributes: {
      address1: 'Metro Manila, Philippines',
      address2: 'Apartment 4D',
      city: 'Makati',
      'post-code': '1212',
      landmark: 'Near Guadalupe MRT Station',
      kind: 'home',
      label: 'Guadalupe Viejo',
      latitude: '14.564421',
      longitude: '121.040677',
      'created-at': '2024-09-30T17:31:50.790Z',
      'updated-at': '2024-09-30T17:31:50.790Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513871/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513871/area',
        },
        data: {
          type: 'areas',
          id: 212,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2513871',
    },
  },
  {
    id: 2513870,
    type: 'addresses',
    attributes: {
      address1: 'Rockwell Drive, Makati, Metro Manila, Philippines',
      address2: 'Unit 201, South Tower',
      city: 'Makati',
      'post-code': '1200',
      landmark: 'Across Rockwell Tent',
      kind: 'home',
      label: 'Power Plant Mall',
      latitude: '14.564648',
      longitude: '121.036435',
      'created-at': '2024-09-30T17:31:33.283Z',
      'updated-at': '2024-09-30T17:31:33.283Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513870/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513870/area',
        },
        data: {
          type: 'areas',
          id: 213,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2513870',
    },
  },
  {
    id: 2513869,
    type: 'addresses',
    attributes: {
      address1: 'San Andres Bukid, Manila, Metro Manila, Philippines',
      address2: 'Block 5 Lot 12',
      city: 'Manila',
      'post-code': '1017',
      landmark: 'Near the Barangay Hall',
      kind: 'home',
      label: 'Rd 14',
      latitude: '14.578487',
      longitude: '121.00397',
      'created-at': '2024-09-30T17:30:47.199Z',
      'updated-at': '2024-09-30T17:30:47.199Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513869/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513869/area',
        },
        data: {
          type: 'areas',
          id: 44,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2513869',
    },
  },
  {
    id: 2513868,
    type: 'addresses',
    attributes: {
      address1: 'Rockwell Drive, Makati, Metro Manila, Philippines',
      address2: '18th Floor, Unit C',
      city: 'Makati',
      'post-code': '1200',
      landmark: 'Beside The Proscenium',
      kind: 'home',
      label: '8 Rockwell',
      latitude: '14.563576',
      longitude: '121.036663',
      'created-at': '2024-09-30T17:30:22.221Z',
      'updated-at': '2024-09-30T17:30:22.221Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513868/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513868/area',
        },
        data: {
          type: 'areas',
          id: 213,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2513868',
    },
  },
  {
    id: 2513867,
    type: 'addresses',
    attributes: {
      address1: 'Mandaluyong, Metro Manila, Philippines',
      address2: 'House 12',
      city: 'Mandaluyong',
      'post-code': '1550',
      landmark: 'Near the park entrance',
      kind: 'home',
      label: '12 Katarungan',
      latitude: '14.575371',
      longitude: '121.034935',
      'created-at': '2024-09-30T17:29:58.339Z',
      'updated-at': '2024-09-30T17:29:58.339Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513867/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513867/area',
        },
        data: {
          type: 'areas',
          id: 2196,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2513867',
    },
  },
  {
    id: 2513866,
    type: 'addresses',
    attributes: {
      address1: 'P. Guanzon, Poblacion, Makati, Metro Manila, Philippines',
      address2: 'Unit 502',
      city: 'Makati',
      'post-code': '1210',
      landmark: 'Near Poblacion Park',
      kind: 'home',
      label: 'Avalu Residences',
      latitude: '14.565891',
      longitude: '121.030606',
      'created-at': '2024-09-30T17:29:42.008Z',
      'updated-at': '2024-09-30T17:29:42.008Z',
    },
    relationships: {
      user: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513866/user',
        },
        data: {
          type: 'users',
          id: 12980860,
        },
      },
      area: {
        links: {
          related:
            'https://api.arm-js-library.com/api/v1/addresses/2513866/area',
        },
        data: {
          type: 'areas',
          id: 213,
        },
      },
    },
    links: {
      self: 'https://api.arm-js-library.com/api/v1/addresses/2513866',
    },
  },
]

export default addresses
