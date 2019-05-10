<?php declare(strict_types=1);

// NOTE: This file is autogenerated, please do not edit manually.

namespace Omissis\AlexaSdk\Model;

final class Quux implements \JsonSerializable
{
    /**
     * @var array<string>
     */
    private const ALLOWED_TYPES = [
        \Omissis\AlexaSdk\Model\Foo\Bar\Baz1::class,
        \Omissis\AlexaSdk\Model\Foo\Bar\Baz2::class,
    ];

    /**
     * @var \Omissis\AlexaSdk\Model\Foo\Bar\Baz1|\Omissis\AlexaSdk\Model\Foo\Bar\Baz2
     */
    private $value;

    /**
     * @param \Omissis\AlexaSdk\Model\Foo\Bar\Baz1|\Omissis\AlexaSdk\Model\Foo\Bar\Baz2 $value
     */
    public function __construct($value)
    {
        if (!in_array($this->getType($value), self::ALLOWED_TYPES, true)) {
            throw new \InvalidArgumentException(
                sprintf('Value "%s" is of invalid type. Accepted types are: %s', get_class($value), implode(',', self::ALLOWED_TYPES))
            );
        }

        $this->value = $value;
    }

    /**
     * @return \Omissis\AlexaSdk\Model\Foo\Bar\Baz1|\Omissis\AlexaSdk\Model\Foo\Bar\Baz2
     */
    public function getValue()
    {
        return $this->value;
    }

    public function jsonSerialize()
    {
        return $this->value;
    }

    public static function jsonDeserialize(string $json): self
    {
        $decoded = json_decode($json);

        return new self($decoded);
    }

    /**
     * @param mixed $value
     */
    private function getType($value): string
    {
        return is_object($value) ? get_class($value) : gettype($value);
    }
}
