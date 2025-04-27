import { error, parseArith }  from './tiny-ts-parser.ts'

type Type =
  | { tag: "Boolean" }
  | { tag: "Number" }

type Term =
  | { tag: "true" }
  | { tag: "false" }
  | { tag: "if", cond: Term, thn: Term, els: Term }
  | { tag: "number", n: number }
  | { tag: "add", left: Term, right: Term }

export function typecheck(t: Term): Type {
  switch (t.tag) {
    case "true":
      return { tag: "Boolean" }
    case "false":
      return { tag: "Boolean" }
    case "if": {
      // Check the condition type
      // 条件式が boolean かどうか
      const condTy = typecheck(t.cond)
      if (condTy.tag !== "Boolean") error("boolean expected", t.cond)
      // 条件演算子の返す方が一致しているか
      const thnTy = typecheck(t.thn)
      const elsTy = typecheck(t.els)
      if (thnTy.tag !== elsTy.tag) {
        error("then and else have different types", t)
      }
      return thnTy
    }
    case "number":
      return { tag: "Number" }
    case "add": {
      // Check the types of the left and right operands
      const leftTy = typecheck(t.left)
      if (leftTy.tag !== "Number") error("number expected", t.left)
      const rightTy = typecheck(t.right)
      if (rightTy.tag !== "Number") error("number expected", t.right)
      return { tag: "Number" }
    }
  }
}

console.log(typecheck(parseArith("1 + 2")))
