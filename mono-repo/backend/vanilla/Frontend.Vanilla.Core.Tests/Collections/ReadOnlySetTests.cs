using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class ReadOnlySetTests
{
    private ReadOnlySet<string> target;
    private Mock<ISet<string>> inner;
    private static readonly string[] Other = new string[7];

    public ReadOnlySetTests()
    {
        inner = new Mock<ISet<string>>(MockBehavior.Strict);
        target = new ReadOnlySet<string>(inner.Object);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(666)]
    public void Count_ShouldDelegateToInner(int innerValue)
    {
        inner.SetupGet(i => i.Count).Returns(innerValue);
        target.Count.Should().Be(innerValue); // Act
    }

    [Fact]
    public void IsReadOnly_ShouldBeTrue()
        => ((ICollection<string>)target).IsReadOnly.Should().BeTrue(); // Act

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Contains_ShouldDelegateToInner(bool isContained)
    {
        inner.Setup(i => i.Contains("bwin")).Returns(isContained);
        target.Contains("bwin").Should().Be(isContained); // Act
    }

    [Fact]
    public void CopyTo_ShouldDelegateToInner()
    {
        inner.Setup(i => i.CopyTo(Other, 666));
        target.CopyTo(Other, 666); // Act
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void GetEnumerator_ShouldDelegateToInner(bool runGeneric)
    {
        var enumerator = Mock.Of<IEnumerator<string>>();
        inner.Setup(i => i.GetEnumerator()).Returns(enumerator);
        var result = runGeneric ? (object)target.GetEnumerator() : ((IEnumerable)target).GetEnumerator(); // Act
        result.Should().BeSameAs(enumerator);
    }

    public static readonly IEnumerable<object[]> SetOperationTestCases =
        from m in new Expression<Func<ISet<string>, bool>>[]
        {
            s => s.IsProperSubsetOf(Other),
            s => s.IsProperSupersetOf(Other),
            s => s.IsSubsetOf(Other),
            s => s.IsSupersetOf(Other),
            s => s.Overlaps(Other),
            s => s.SetEquals(Other),
        }
        from v in new[] { true, false }
        select new object[] { m, v };

    [Theory]
    [MemberData(nameof(SetOperationTestCases))]
    public void SetOperationTest(Expression<Func<ISet<string>, bool>> actionExpr, bool innerValue)
    {
        inner.Setup(actionExpr).Returns(innerValue);
        actionExpr.Compile().Invoke(target).Should().Be(innerValue);
    }

    // Use Expressions instead of Action b/c they are visible in ReSharper test listing
    public static readonly IEnumerable ModificationOperations = new Expression<Action<ISet<string>>>[]
    {
        s => s.Add("bwin"),
        s => ((ICollection<string>)s).Add("bwin"),
        s => s.Clear(),
        s => s.ExceptWith(new[] { "bwin" }),
        s => s.IntersectWith(new[] { "bwin" }),
        s => s.Remove("bwin"),
        s => s.SymmetricExceptWith(new[] { "bwin" }),
        s => s.UnionWith(new[] { "bwin" }),
    };

    [Theory]
    [MemberValuesData(nameof(ModificationOperations))]
    public void ShouldThrow_IfModificationOperationCalled(Expression<Action<ISet<string>>> actionExpr)
    {
        var action = actionExpr.Compile();
        var act = () => action(target);
        act.Should().Throw<NotSupportedException>().WithMessage("The collection is read-only.");
    }
}
