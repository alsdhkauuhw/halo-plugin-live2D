import { definePlugin } from '@halo-dev/console-shared'
import HomeView from './views/HomeView.vue'
import Live2DView from './views/Live2DView.vue'
import { IconPlug } from '@halo-dev/components'
import { markRaw } from 'vue'

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: 'Root',
      route: {
        path: '/live2d',
        name: 'Live2D',
        component: Live2DView,
        meta: {
          title: 'Live2D',
          searchable: true,
          menu: {
            name: 'Live2D',
            group: '插件',
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
    {
      parentName: 'Root',
      route: {
        path: '/example',
        name: 'Example',
        component: HomeView,
        meta: {
          title: '示例页面',
          searchable: true,
          menu: {
            name: '示例页面',
            group: '示例分组',
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  extensionPoints: {},
})
