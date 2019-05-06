interface FooBar {
  readonly foo: string

  readonly bar: number

  readonly baz: boolean

  readonly quux: Array<unknown>

  readonly corge: BazQuux

  slots?: { [key: string]: BazQuux }

  'Foo.Bar.Baz': foo.bar.Baz

  foobar(): number
}

interface BazQuux {
  test: string
}

namespace foo.bar {
  export interface Baz {}
}
