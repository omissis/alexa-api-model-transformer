<?php declare(strict_types=1);

// NOTE: This file is autogenerated, please do not edit manually.

namespace Omissis\AlexaSdk\Model\Foo\Bar;

final class Baz1 implements \JsonSerializable
{
    /**
     * @var \Omissis\AlexaSdk\Model\Foo\Bar\Baz2
     */
    private $childType;

    /**
     * @var null|string
     */
    private $content;

    public function __construct(
        \Omissis\AlexaSdk\Model\Foo\Bar\Baz2 $childType,
        ?string $content
    ) {
        $this->childType = $childType;
        $this->content = $content;
    }

    public function jsonSerialize()
    {
        return [
            'childType' => $this->childType,
            'content' => $this->content,
        ];
    }

    public static function jsonDeserialize(string $json): self
    {
        $decoded = json_decode($json, true);

        return new self(
            $decoded['childType'] ?? null,
            $decoded['content'] ?? null
        );
    }

    public function childType(): \Omissis\AlexaSdk\Model\Foo\Bar\Baz2
    {
        return $this->childType;
    }

    public function content(): ?string
    {
        return $this->content;
    }
}
