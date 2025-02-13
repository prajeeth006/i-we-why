using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Moq.Protected;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Placeholders;

public sealed class FieldPlaceholderReplacerTests
{
    public class Foo { }

    private IFieldPlaceholderReplacer Target => underlyingMock.Object;
    private IFieldPlaceholderReplacer<Foo> GenericTarget => underlyingMock.Object;
    private Mock<FieldPlaceholderReplacer<Foo>> underlyingMock;
    private Foo foo;
    private ReplacedStringMapping replacedStrs;

    public FieldPlaceholderReplacerTests()
    {
        underlyingMock = new Mock<FieldPlaceholderReplacer<Foo>> { CallBase = true };
        foo = new Foo();
        replacedStrs = new ReplacedStringMapping(new Dictionary<string, string>());
    }

    [Fact]
    public void FieldType_ShouldEqualToGenericParameter()
        => Target.FieldType.Should().Be(typeof(Foo));

    [Fact]
    public void GetReplaceableStrings_ShouldDelegateToChildClass()
    {
        var strs = new[] { "str1", "str2" };
        underlyingMock.Protected().Setup<IEnumerable<string>>(nameof(Target.GetReplaceableStrings), foo).Returns(strs);

        // Act
        Target.GetReplaceableStrings(foo).Should().BeEquivalentTo(strs);
        GenericTarget.GetReplaceableStrings(foo).Should().BeEquivalentTo(strs);
    }

    [Fact]
    public void GetReplaceableStrings_ShouldThrow_IfInvalidType()
        => Assert.Throws<InvalidCastException>(() => Target.GetReplaceableStrings("invalid"));

    [Fact]
    public void GetReplaceableStrings_ShouldThrow_IfNullParameter()
    {
        Assert.Throws<ArgumentNullException>(() => Target.GetReplaceableStrings(null));
        Assert.Throws<ArgumentNullException>(() => GenericTarget.GetReplaceableStrings(null));
    }

    [Fact]
    public void Recreate_ShouldDelegateToChildClass()
    {
        var rewritten = new Foo();
        underlyingMock.Protected().Setup<Foo>(nameof(Target.Recreate), foo, replacedStrs).Returns(rewritten);

        // Act
        Target.Recreate(foo, replacedStrs).Should().BeSameAs(rewritten);
        GenericTarget.Recreate(foo, replacedStrs).Should().BeSameAs(rewritten);
    }

    [Fact]
    public void Recreate_ShouldThrow_IfInvalidType()
        => Assert.Throws<InvalidCastException>(() => Target.Recreate("invalid", replacedStrs));

    [Theory, BooleanData]
    public void ReplaceAll_ShouldThrow_IfNullParameter(bool nullValueOrStrings)
    {
        Assert.Throws<ArgumentNullException>(() => Target.Recreate(nullValueOrStrings ? null : foo, nullValueOrStrings ? replacedStrs : null));
        Assert.Throws<ArgumentNullException>(() => GenericTarget.Recreate(nullValueOrStrings ? null : foo, nullValueOrStrings ? replacedStrs : null));
    }
}
