import ReadingProgress from './ReadingProgress.vue'

export default ({ Vue }) => {
  Vue.component('reading-progress', ReadingProgress)
  Vue.mixin({
    computed: {
      $readingShow() {
        return this.$page.frontmatter.readingShow
      }
    }
  })
}
