module.exports = function prepareStackTrace(stackTrace) {
  let stack = stackTrace.split('\n')
  stack = stack.map(s => s.replace(/\sg/, ''))

  stack = stack.map(entry => {
    let line = null
    let column = null
    let file = null
    let [fn, ...filePath] = entry.split('@')
    filePath = filePath.join('@')

    if (fn.indexOf('/Users/') === 0) {
      // actually we didn't have a fn so just put it back in the filePath
      filePath = `${fn}@${filePath}`
      fn = null
    }

    if (filePath) {
      ;[filePath, line, column] = filePath.split(':')
      file = filePath.split('/')
      file = file[file.length - 1]
    } else {
      ;[filePath, line, column] = entry.split(':')
      fn = null
      file = filePath.split('/')
      file = file[file.length - 1]
    }
    return {
      fn,
      file,
      filePath,
      line,
      column,
    }
  })

  return stack
}
