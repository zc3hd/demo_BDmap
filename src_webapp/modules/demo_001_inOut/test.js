var all_data = [
  // 
  {
    id: 1,
    // 标识为楼
    key: 1,
    name: "ID-1楼",
    point: {
      lng: 116.331452,
      lat: 40.005517,
    },
    num: 5,
    alarmNum: 2,
    floor: [
      // 
      {
        name: 'floor_1',
        id: 1,
        user: [
          // 
          {
            id: 3,
            name: "user_1",
            point: {
              lng: 30,
              lat: 30,
            },
            // 报警
            flag: 2,
          },
          // 
          {
            id: 3,
            name: "user_2",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
        ]
      },
      // 
      {
        name: 'floor_2',
        id: 2,
        user: [
          // 
          {
            id: 3,
            name: "user_2",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
        ]
      },
      // 
      {
        name: 'floor_3',
        id: 3,
        user: [
          // 
          {
            id: 3,
            name: "user_2",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_2",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
        ]
      },
    ]
  },
  // 
  {
    id: 2,
    key: 1,
    name: "ID-2楼",
    point: {
      lng: 116.338452,
      lat: 40.006517,
    },
    num: 10,
    alarmNum: 3,
    floor: [
      // 
      {
        name: 'floor_1',
        id: 1,
        user: [
          // 
          {
            id: 3,
            name: "user_1",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_2",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_3",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_4",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
        ]
      },
      // 
      {
        name: 'floor_2',
        id: 2,
        user: [
          // 
          {
            id: 3,
            name: "user_5",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_6",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_7",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_8",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
        ]
      },
      // 
      {
        name: 'floor_3',
        id: 3,
        user: [
          // 
          {
            id: 3,
            name: "user_9",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
          // 
          {
            id: 3,
            name: "user_10",
            point: {
              lng: 50,
              lat: 40,
            },
            // 报警状态
            flag: 1,
          },
        ]
      },
    ]
  },
  // ======================================================
  // 
  {
    id: 3,
    name: "user_1",
    key: 0,
    point: {
      lng: 116.335452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
      lat: 40.007517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
    },
    // 报警状态
    flag: 1,

    // 室内外标识
    pos_key:'in',
  },
  // 
  {
    id: 4,
    key: 0,
    name: "user_2",
    point: {
      lng: 116.331452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
      lat: 40.001517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
    },
    flag: 2,
    pos_key:'in',
  },
  // 
  {
    id: 5,
    key: 0,
    name: "user_3",
    point: {
      lng: 116.335452 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
      lat: 40.004517 + 0.001 * (Math.random() > 0.5 ? Math.random() : -Math.random()),
    },
    flag: 0,

    pos_key:'out',
  }
];
