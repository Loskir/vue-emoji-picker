export default {
  data() {
    return {
      emojiPicker: {
        left: 0,
        top: 0,
        show: false,
        onEmoji: () => {},
        currentButton: -1,
        hideTimeout: setTimeout(() => {}, 0),
      },
    }
  },
  provide() {
    const ctx = {
      emojiPicker_show: () => {
        this.emojiPicker.show = true
      },
      emojiPicker_hide: () => {
        this.emojiPicker.show = false
      },
      emojiPicker_setPosition: (left, top) => {
        this.emojiPicker.left = left
        this.emojiPicker.top = top
      },
      emojiPicker_isShown: () => this.emojiPicker.show,
      emojiPicker_getCurrentButton: () => this.emojiPicker.currentButton,
      emojiPicker_setCurrentButton: (id) => {
        this.emojiPicker.currentButton = id
      },
      emojiPicker_getBoundingClientRect: () => {
        return this.$refs.emojiPicker.getBoundingClientRect()
      },
      emojiPicker_setOnEmoji: (f) => {
        this.emojiPicker.onEmoji = f
      },
      emojiPicker_setHideTimeout: (ms) => {
        this.emojiPicker.hideTimeout = setTimeout(() => ctx.emojiPicker_hide(), ms)
      },
      emojiPicker_clearHideTimeout: () => {
        clearTimeout(this.emojiPicker.hideTimeout)
      },
    }
    return ctx
  },
}
