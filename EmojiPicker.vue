<template>
  <transition name="fade">
    <div
      class="emoji-picker-wrapper"
      @click.stop
      :style="{left: left+'px', top: top+'px'}"
      @mouseenter="emojiPicker_clearHideTimeout"
      @mouseleave="emojiPicker_setHideTimeout(500)">
      <div class="bridge1"/>
      <!--      <div class="bridge2"/>-->
      <div
        ref="picker"
        class="emoji-picker">
        <template v-for="item in list">
          <template v-if="item.type === 'header'">
            <!--            <div style="height: 24.4px"/>-->
            <h5>{{ item.content }}</h5>
          </template>
          <template v-else-if="item.type === 'emojis'">
            <div
              class="emoji-row-wrapper"
              v-observe-visibility="visibilityChanged">
              <div class="emoji-row">
                <span
                  class="emoji-wrapper"
                  v-for="{emoji, emojiName, charsName} in item.row"
                  :key="emojiName"
                  @click="handleEmoji({emoji, emojiName})"
                  :title="emojiName">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="
                    class="emoji"
                    :data-name="charsName"
                    :data-emoji="emoji"
                    :alt="emoji">
                  </span>
              </div>
            </div>
          </template>
        </template>
      </div>
      <!--<div
        v-for="(emojiGroup, category) in emojis"
        :key="category"
        class="category">
        <h5>{{ category }}</h5>
        <div class="emojis">
        <span
          class="emoji-wrapper"
          v-for="(emoji, emojiName) in emojiGroup"
          :key="emojiName"
          @click="handleEmoji({emoji, emojiName})"
          :title="emojiName">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="
            class="emoji"
            :data-name="emojiGetName(emoji)"
            :data-emoji="emoji"
            :alt="emoji">
          </span>
        </div>
      </div>-->
    </div>
  </transition>
</template>

<script>
  import emojis from './data'
  import {emojiGetName} from './mixins'

  import 'intersection-observer' // polyfill
  import {ObserveVisibility} from 'vue-observe-visibility'

  export default {
    name: 'EmojiPicker',
    mixins: [
      emojiGetName,
    ],
    directives: {
      'observe-visibility': ObserveVisibility,
    },
    props: {
      left: {
        type: Number,
        default: 0,
      },
      top: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        favourites: [],
      }
    },
    methods: {
      handleEmoji({emoji, emojiName}) {
        if (!this.favourites) {
          this.favourites = []
        }
        const fav = this.favourites.find(v => v.emoji === emoji)
        if (!fav) {
          this.favourites.push({
            emoji,
            emojiName,
            count: 1,
          })
        } else {
          fav.count++
        }

        this.$emit('emoji', emoji)
      },
      getBoundingClientRect() {
        return this.$refs.picker.getBoundingClientRect()
      },
      visibilityChanged(isVisible, entry) {
        if (!isVisible) {
          entry.target.classList.remove('shown')
        } else {
          entry.target.classList.add('shown')
        }
      },
    },
    computed: {
      emojis() {
        const favourites = (this.favourites || [])
          .slice()
          .sort((a, b) => a.count <= b.count ? 1 : -1)
          .slice(0, 8)
        if (favourites.length === 0) {
          return emojis
        }
        return {
          'Favourites': favourites.reduce((a, v) => ({...a, [v.emojiName]: v.emoji}), {}),
          ...emojis,
        }
      },
      list() {
        const emojis = this.emojis

        const categories = Object.keys(emojis)

        let id = 0
        let list = []
        let offset = 0

        for (let category of categories) {
          list.push({
            id: id++,
            type: 'header',
            content: category,
            offset,
          })
          offset += 24.4

          let currentRow = []
          for (let emojiName of Object.keys(emojis[category])) {
            currentRow.push({
              emojiName,
              emoji: emojis[category][emojiName],
              charsName: this.emojiGetName(emojis[category][emojiName]),
            })

            if (currentRow.length === 8) {
              list.push({
                id: id++,
                type: 'emojis',
                row: currentRow,
                offset,
              })
              offset += 32

              currentRow = []
            }
          }
          if (currentRow.length > 0) {
            list.push({
              id: id++,
              type: 'emojis',
              row: currentRow,
              offset,
            })
            offset += 32
          }

          /*`<span
           class="emoji-wrapper"
           v-for="(emoji, emojiName) in emojiGroup"
           :key="emojiName"
           @click="handleEmoji({emoji, emojiName})"
           :title="emojiName">
           <img
           src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII="
           class="emoji"
           :data-name="emojiGetName(emoji)"
           :data-emoji="emoji"
           :alt="emoji">
           </span>`*/
        }

        return list
      },
    },
    watch: {
      favourites: {
        handler(v) {
          localStorage.setItem('emoji-picker__favourites', JSON.stringify(v))
        },
        deep: true,
      },
    },
    mounted() {
      const lsData = localStorage.getItem('emoji-picker__favourites')
      if (!lsData) {
        this.favourites = []
        return
      }
      try {
        this.favourites = JSON.parse(lsData)
      } catch (error) {
        console.verbose('Unable to parse favourites from local storage')
      }
      if (!this.favourites) {
        this.favourites = []
      }
    },
    inject: [
      'emojiPicker_setHideTimeout',
      'emojiPicker_clearHideTimeout',
    ],
  }
</script>

<style scoped lang="stylus">
  @import "~@loskir/emoji-sprite-stylesheet/emoji.css"
  @import "~@loskir/emoji-sprite-stylesheet/emoji0.css"

  .emoji-picker-wrapper
    position: absolute
    z-index: 10000
    box-sizing: border-box

  .bridge1
    position absolute
    height 20px
    width 45px
    top -15px
    right 20px

  .emoji-picker
    overflow-y: scroll
    padding: 10px 15px
    width 261px
    height: 20rem

    border: 1px solid #ebeef5
    border-radius: 0.5rem
    background: #fff
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1)


    .category:first-child h5
      margin-top 0

    h5
      margin 0
      padding 5px 0
      color #999999
      font-size 12px
      cursor default
      font-weight 500

    .emoji-row-wrapper
      position relative
      height 32px

      &.shown .emoji-row
        display block

    .emoji-row
      position absolute
      top 0
      left 0
      transition .5s
      display none

      &:after
        content " "
        flex auto

      .emoji-wrapper
        display inline-flex
        padding 6px
        cursor pointer
        border-radius 5px
        user-select none

        &:first-child
          margin-left -6px

        &:last-child
          margin-right -6px

        &:hover
          background #ececec
          cursor pointer

        width 20px
        height 20px

        .emoji
          --emoji-size 20px
</style>
