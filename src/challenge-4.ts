// Now that you are expected to handle unexpected (user) input...
// you don't need to specify the different types this function expects.
//
// `unknown` tells the TS compiler not to assume anything about the input
interface JsonArray extends Array<string | number | boolean | Date | ValidJSONObject | JsonArray> { }
interface ValidJSONObject {
	[x: string]: string | number | boolean | Date | JsonArray
}

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
