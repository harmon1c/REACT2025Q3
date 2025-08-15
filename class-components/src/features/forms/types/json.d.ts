declare module '*.json' {
  // Generic JSON module typing without using `any`.
  // Consumers can assert a more specific shape when importing.
  const value: unknown;
  export default value;
}
