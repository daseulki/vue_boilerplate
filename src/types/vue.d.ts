import { ComponentCustomProperties } from 'vue'
import { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { Filters } from '../plugin/filters'
import { Obj } from '@popperjs/core'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: Filters
    $route: RouteLocationNormalizedLoaded
    $router: Router
  }
}


// declare module '*.vue' {
//   import { DefineComponent } from 'vue'
//   const component: DefineComponent<object, object, any>
//   export default component
// }

export { }  // Important! See note.