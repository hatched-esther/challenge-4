// Now that you are expected to handle unexpected (user) input...
// you don't need to specify the different types this function expects.
//
// `unknown` tells the TS compiler not to assume anything about the input

export const stringify = (input: unknown): string => {
   if (typeof input === 'undefined')
    return '"undefined"'
  if (input == null) 
   return '"null"'
  else if (typeof input === 'string')
    return '"' + input.replace(/"|\n/g, (x:string) =>  x === '"' ? '\\"' :'\\n') + '"'
  else if (typeof input === 'number') {
    if (input === Number.POSITIVE_INFINITY || input === Number.NEGATIVE_INFINITY) throw new Error("Input unsafe")
    return String(input)
  }
  else if (typeof input === "bigint")
    throw new Error("Input unsafe")
  else if (typeof input === 'boolean')
    return input ? 'true' : 'false'
  else if (input instanceof Object && Array.isArray(input))
    return '[' + input.reduce<string[]>((acc, v) => {
      if (v === undefined)
        return [...acc, 'null']
      else
        return [...acc, stringify(v)]
    }, []).join(',') + ']'
  else if (input instanceof Object && input.constructor === Object)
    return '{' + Object.keys(input).reduce<string[]>((acc, k: keyof ValidJSONObject) => {
      if ((input as ValidJSONObject)[k] === undefined)
        return acc
      else
        return [...acc, stringify(k) + ':' + stringify((input as ValidJSONObject)[k])]
    }, []).join(',') + '}'
   else if (input instanceof Date || input instanceof Map || input instanceof Set || input instanceof Function || input instanceof RegExp ) 
    throw new Error("Input unsafe");
  else
    return '{}'
};

/*
- What is the difference between unknown and any?
    - Both types are top types yet,`unknown` is much less permissible than `any`.`Unknown` types require to narrow down your type definitions in order
     to perform most operations in it, while `any` does not require any form of checking in order to perform operations onto it.  You can only assign 
     `unknown` values to other `unknown` values or to `any` values. Any assignment of an `unknown` type to another type that not `unknown` or `any` will 
     error out. This forces us to perform a type check before doing arbitrary operations on an `unknown` value. This way we know that the operation we 
     are trying to perform will only happen if the `unknown` value is  of a known value. 

- What are Record, A and B in Record<A, B>?
    - Parameterized types. A and B are to Record, what C and D are to `function foo (C,D)`. 

- Can you give an example of a place where Generics would help the TypeScript type-checker (and therefore you)? 
    - The main reason to use Generics is to use types, classes, or interfaces as parameters. This way you can reuse code for different types of input.
      An example where this is useful is when defining a relationship between input and output parameter types. In a function definition, using Generics 
      allows you to make sure that input and output use the same type even if their I/O's are different. `function foo <T>(input: T[]): T { … }` 
*/

interface JsonArray extends Array<string | number | boolean | Date | ValidJSONObject | JsonArray> { }
interface ValidJSONObject {
	[x: string]: string | number | boolean | Date | JsonArray
}