using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree;

public class ExpressionTreeBaseTests
{
    private readonly IExpressionTree target;
    private readonly Mock<TestExpression> underlyingMock;

    internal abstract class TestExpression : ExpressionTreeBase<TestExpression> { }

    public ExpressionTreeBaseTests()
    {
        underlyingMock = new Mock<TestExpression> { CallBase = true };
        target = underlyingMock.Object;
    }

    [Fact]
    public void GetLocalVariableUsages_ShouldCollectAllInfo()
    {
        underlyingMock.Setup(m => m.FlattenExpressions()).Returns(new IExpressionTree[]
        {
            new LocalVariableAssignment("foo", StringLiteral.Get("a")),
            new ProviderAccess(TestProviderMember.Get()),
            new LocalVariableAccess(DslType.String, "foo"),
            StringLiteral.Get("abc"),
            new LocalVariableAssignment("bar", NumberLiteral.Get(12m)),
            new LocalVariableAssignment("foo", StringLiteral.Get("b")),
            new LocalVariableAccess(DslType.Number, "wtf"),
        });

        // Act
        target.GetLocalVariableUsages().Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, LocalVariableInfo>
        {
            { "foo", new LocalVariableInfo(DslType.String, isAssigned: true, isAccessed: true) },
            { "bar", new LocalVariableInfo(DslType.Number, isAssigned: true, isAccessed: false) },
            { "wtf", new LocalVariableInfo(DslType.Number, isAssigned: false, isAccessed: true) },
        });
    }

    [Theory]
    [InlineData(ValueVolatility.Static, ValueVolatility.Static, ValueVolatility.Static)]
    [InlineData(ValueVolatility.Static, ValueVolatility.Server, ValueVolatility.Server)]
    [InlineData(ValueVolatility.Static, ValueVolatility.Client, ValueVolatility.Client)]
    [InlineData(ValueVolatility.Server, ValueVolatility.Static, ValueVolatility.Server)]
    [InlineData(ValueVolatility.Server, ValueVolatility.Server, ValueVolatility.Server)]
    [InlineData(ValueVolatility.Server, ValueVolatility.Client, ValueVolatility.Client)]
    [InlineData(ValueVolatility.Client, ValueVolatility.Static, ValueVolatility.Client)]
    [InlineData(ValueVolatility.Client, ValueVolatility.Server, ValueVolatility.Client)]
    [InlineData(ValueVolatility.Client, ValueVolatility.Client, ValueVolatility.Client)]
    public void CreateMetadata_Volatility_ShouldBeMostVolatileFromUsedMembers(
        ValueVolatility member1Volatility,
        ValueVolatility member2Volatility,
        ValueVolatility expected)
    {
        underlyingMock.Setup(m => m.FlattenExpressions()).Returns(new[]
        {
            new ProviderAccess(TestProviderMember.Get(volatility: member1Volatility)),
            new ProviderAccess(TestProviderMember.Get(volatility: member2Volatility)),
        });

        // Act
        target.CreateMetadata().Volatility.Should().Be(expected);
    }

    [Theory]
    [InlineData(false, false, false)]
    [InlineData(true, false, true)]
    [InlineData(false, true, true)]
    [InlineData(true, true, true)]
    public void CreateMetadata_ClientSideOnly_ShouldBeTrue_IfAnyUsedMemberIsTrue(bool member1ClientOnly, bool member2ClientOnly, bool expected)
    {
        underlyingMock.Setup(m => m.FlattenExpressions()).Returns(new[]
        {
            new ProviderAccess(TestProviderMember.Get(isClientOnly: member1ClientOnly, volatility: ValueVolatility.Client)),
            new ProviderAccess(TestProviderMember.Get(isClientOnly: member2ClientOnly, volatility: ValueVolatility.Client)),
        });

        // Act
        target.CreateMetadata().IsClientOnly.Should().Be(expected);
    }

    [Fact]
    public void CreateMetadata_AlreadyEvaluated_ShouldBeFalse_IfNotFinalTree()
        => target.CreateMetadata().IsAlreadyEvaluated.Should().BeFalse();

    [Fact]
    public void CreateMetadata_AlreadyEvaluated_ShouldBeFalse_IfFinalTree()
        => StringLiteral.Get("x").CreateMetadata().IsAlreadyEvaluated.Should().BeTrue();

    [Fact]
    public void FlattenExpressions_ShouldEnumerateThisWithAllDescendants()
    {
        var child1_1 = Mock.Of<IExpressionTree>();
        var child1_2_1 = Mock.Of<IExpressionTree>();
        var child1_2 = Mock.Of<IExpressionTree>(e => e.GetChildren() == new[] { child1_2_1 });
        var child1 = Mock.Of<IExpressionTree>(e => e.GetChildren() == new[] { child1_1, child1_2 });
        var child2 = Mock.Of<IExpressionTree>();
        underlyingMock.Setup(m => m.GetChildren()).Returns(new[] { child1, child2 });

        // Act
        var exprs = ((TestExpression)target).FlattenExpressions();

        exprs.Should().BeEquivalentTo(new[] { target, child1_1, child1_2_1, child1_2, child1, child2 });
    }

    [Theory, BooleanData]
    public void Equals_ShouldDelegate_IfSameType(bool isEqual)
    {
        var other = Mock.Of<TestExpression>();
        underlyingMock.Setup(m => m.Equals(other)).Returns(isEqual);

        // Act
        var result = target.Equals(other);

        result.Should().Be(isEqual);
    }

    public static IEnumerable<object[]> OtherObjs => new[]
    {
        new object[] { null },
        new object[] { "wtf" },
        new object[] { Mock.Of<IExpressionTree>() },
    };

    [Theory, MemberData(nameof(OtherObjs))]
    public void Equals_ShouldReturnFalse_IfDifferentType(object obj)
    {
        // Act
        var result = target.Equals(obj);

        result.Should().BeFalse();
        underlyingMock.Verify(m => m.Equals(It.IsAny<TestExpression>()), Times.Never);
    }
}
