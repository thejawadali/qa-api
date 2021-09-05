import traverse from "traverse"
import sanitizer from "sanitizer"
import { has, isArray } from "lodash"

export default function mongooseSanitize (schema, options: any = {
}) {
  options = options || {
  }
  options.include = has(options, "include") && isArray(options.include) ? options.include : []
  options.skip = has(options, "skip") && isArray(options.skip) ? options.skip : []

  schema.pre("save", function (next) {
    const doc = JSON.parse(JSON.stringify(this._doc))

    if (options.include.length < 1) {
      // Sanitize every field by default:
      options.include = Object.keys(this._doc)
    }

    // Sanitize every node in tree:
    const sanitized = traverse(doc).map(function (node) {

      if (typeof node === "string") {
        const sanitizedNode = sanitizer.sanitize(sanitizer.escape(node))
        this.update(sanitizedNode)
        // this.update(node)
      }
    })

    // Exclude skipped nodes:
    options.include.forEach(function (node) {
      // Sanitize field unless explicitly excluded:
      if (options.skip.indexOf(node) < 0) {
        this[node] = sanitized[node]
      }
    }, this)

    next()
  })
}
