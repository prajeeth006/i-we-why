using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.Utils;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest.Formatters;

public sealed class StringFormatterTests
{
    private static readonly IRestFormatter Target = StringFormatter.Singleton;
    private static readonly byte[] TestBytes = { 0x48, 0x65, 0x6c, 0x6c, 0x6f };
    private const string TestString = "Hello";

    [Fact]
    public void ContentTypeTest()
        => Target.ContentType.Should().Be(ContentTypes.Text);

    [Fact]
    public void Serialize_ShouldSerializeString()
        => Target.Serialize(TestString).Should().BeEquivalentTo(TestBytes);

    [Fact]
    public void Serialize_ShouldThrowIfDifferentType()
    {
        Action act = () => Target.Serialize(new object());
        act.Should().Throw<ArgumentException>().WithMessage("StringFormatter can't serialize System.Object. Only System.String is supported.");
    }

    [Theory]
    [InlineData(typeof(string))]
    [InlineData(typeof(object))]
    [InlineData(typeof(IEnumerable<char>))]
    public void Deserialize_ShouldDeserializeString(Type type)
        => Target.Deserialize(TestBytes, type).Should().Be(TestString);

    [Fact]
    public void Deserialize_ShouldThrowIfDifferentType()
    {
        Action act = () => Target.Deserialize(TestBytes, typeof(int));
        act.Should().Throw<ArgumentException>().WithMessage("StringFormatter can't deserialize System.Int32. Only System.String is supported.");
    }
}
