using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class ReferenceTypeEqualityComparerTests
{
    private IEqualityComparer<string> target;
    private Mock<ReferenceTypeEqualityComparer<string>> underlyingMock;

    public ReferenceTypeEqualityComparerTests()
    {
        underlyingMock = new Mock<ReferenceTypeEqualityComparer<string>>();
        target = underlyingMock.Object;
    }

    [Theory]
    [InlineData(null, null, true)]
    [InlineData("omg", null, false)]
    [InlineData(null, "omg", false)]
    public void Equals_ShouldReturnTrue_IfNull(string x, string y, bool expected)
    {
        // Act
        var equal = target.Equals(x, y);

        equal.Should().Be(expected);
        underlyingMock.VerifyWithAnyArgs(m => m.EqualsCore(null, null), Times.Never);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Equals_ShouldDelegate_IfNotNull(bool value)
    {
        underlyingMock.Setup(m => m.EqualsCore("a", "b")).Returns(value);

        // Act
        var equal = target.Equals("a", "b");

        equal.Should().Be(value);
    }
}

public class ComparableReferenceTypeEqualityComparerTests
{
    private IComparer<string> target;
    private ReferenceTypeEqualityComparer<string> targetEquality;
    private Mock<ComparableReferenceTypeEqualityComparer<string>> underlyingMock;

    public ComparableReferenceTypeEqualityComparerTests()
    {
        underlyingMock = new Mock<ComparableReferenceTypeEqualityComparer<string>>();
        targetEquality = underlyingMock.Object;
        target = underlyingMock.Object;
    }

    [Theory]
    [InlineData(0, true)]
    [InlineData(-1, false)]
    [InlineData(1, false)]
    public void EqualsCore_ShouldDelegate(int comparison, bool expected)
    {
        underlyingMock.Setup(m => m.CompareCore("a", "b")).Returns(comparison);

        // Act
        var result = targetEquality.EqualsCore("a", "b");

        result.Should().Be(expected);
    }

    [Theory]
    [InlineData(null, null, 0)]
    [InlineData("omg", null, 1)]
    [InlineData(null, "omg", -1)]
    public void Equals_ShouldDirectlyReturn_IfNull(string x, string y, int expected)
    {
        // Act
        var comparison = target.Compare(x, y);

        comparison.Should().Be(expected);
        underlyingMock.VerifyWithAnyArgs(m => m.EqualsCore(null, null), Times.Never);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(0)]
    [InlineData(1)]
    public void ShouldDelegate_IfNotNull(int value)
    {
        underlyingMock.Setup(m => m.CompareCore("a", "b")).Returns(value);

        // Act
        var comparison = target.Compare("a", "b");

        comparison.Should().Be(value);
    }
}
