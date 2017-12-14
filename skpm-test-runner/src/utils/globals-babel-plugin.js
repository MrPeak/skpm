export default function({ types: t }) {
  let alreadyInjected = false
  return {
    visitor: {
      ExpressionStatement(path) {
        const { expression } = path.node
        if (t.isCallExpression(expression)) {
          const { callee } = expression
          if (
            t.isIdentifier(callee, { name: 'test' }) &&
            !path.scope.hasBinding('test')
          ) {
            if (!alreadyInjected) {
              alreadyInjected = true
              path.insertBefore(
                t.variableDeclaration('var', [
                  t.variableDeclarator(
                    t.identifier('__skpm_tests__'),
                    t.objectExpression([])
                  ),
                ])
              )

              path.insertBefore(
                t.functionDeclaration(
                  t.identifier('test'),
                  [t.identifier('description'), t.identifier('fn')],
                  t.blockStatement([
                    t.expressionStatement(
                      t.assignmentExpression(
                        '=',
                        t.memberExpression(
                          t.identifier('__skpm_tests__'),
                          t.identifier('description'),
                          true
                        ),
                        t.identifier('fn')
                      )
                    ),
                  ])
                )
              )
              path.insertBefore(
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.identifier('module.exports.tests'),
                    t.identifier('__skpm_tests__')
                  )
                )
              )
            }
          }
        }
      },
    },
  }
}
