import { DestinationFile } from '../../src/ast/file'

describe('AST Destination File', () => {
  it('has path and content', () => {
    const file = new DestinationFile(
      '/tmp/foobar.php',
      '<?php echo "Hello, World!";'
    )

    expect(file.path).toBe('/tmp/foobar.php')
    expect(file.content).toBe('<?php echo "Hello, World!";')
  })
})
