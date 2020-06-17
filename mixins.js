export const emojiGetCodePoints = {
  methods: {
    emojiGetCodePoints(str) {
      // thanks https://github.com/shinnn/code-points.js/blob/master/src/source.js

      let result = []

      let index = 0
      while (index < str.length) {
        let point = (str.charAt(index) + str.charAt(index + 1)).codePointAt(0)

        if (point > 0xffff) {
          index += 2
        } else {
          index += 1
        }

        result.push(point)
      }

      return result
    },
  },
}

export const emojiGetName = {
  mixins: [
    emojiGetCodePoints,
  ],
  methods: {
    emojiGetName(m) {
      return this.emojiGetCodePoints(m).map((v) => v.toString(16)).join('-')
    },
  },
}


export const emojiGetChars = {
  mixins: [
    emojiGetCodePoints,
  ],
  methods: {
    emojiGetChars(str) {
      return this.emojiGetCodePoints(str).map((v) => String.fromCodePoint(v))
    },
  },
}
