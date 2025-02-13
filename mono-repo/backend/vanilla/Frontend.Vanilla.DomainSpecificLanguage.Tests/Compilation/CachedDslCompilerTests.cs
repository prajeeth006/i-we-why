using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Compilation;

public sealed class CachedDslCompilerTests
{
    private DslCompilerBase target;
    private Mock<IDslCompiler> inner;
    private TestMemoryCache cache;

    private WithWarnings<IDslExpression<string>> dslResult1;
    private WithWarnings<IDslExpression<string>> dslResult2;

    public CachedDslCompilerTests()
    {
        inner = new Mock<IDslCompiler>();
        cache = new TestMemoryCache();
        target = new CachedDslCompiler(inner.Object, cache);

        dslResult1 = Mock.Of<IDslExpression<string>>().WithWarnings("Warn 1");
        dslResult2 = Mock.Of<IDslExpression<string>>().WithWarnings("Warn 2");
    }

    [Fact]
    public void ShouldCacheExpression_IfSucceeded()
    {
        inner.Setup(i => i.Compile<string>("expr")).Returns(dslResult1);

        for (var i = 0; i < 10; i++)
        {
            var result = target.Compile<string>("expr"); // Act
            result.Should().BeSameAs(dslResult1);
        }

        inner.VerifyWithAnyArgs(c => c.Compile<string>(null), Times.Once);
        cache.CreatedEntries.Single().SlidingExpiration.Should().Be(TimeSpan.FromHours(1));
    }

    [Fact]
    public void ShouldCacheException_IfFailed()
    {
        var innerEx = new Exception("Error");
        inner.Setup(i => i.Compile<string>("expr")).Throws(innerEx);

        for (var i = 0; i < 10; i++)
            new Action(() => target.Compile<string>("expr")) // Act
                .Should().Throw().And.Should().BeSameAs(innerEx);

        inner.VerifyWithAnyArgs(c => c.Compile<string>(null), Times.Once);
        cache.CreatedEntries.Single().SlidingExpiration.Should().Be(TimeSpan.FromHours(1));
    }

    [Theory]
    [InlineData("  expr")]
    [InlineData("expr  ")]
    [InlineData("  expr  ")]
    public void ShouldCacheExpressionIgnoringLeadingAndTrailingWhiteSpaces(string whiteSpaceExpr)
    {
        inner.Setup(i => i.Compile<string>("expr")).Returns(dslResult1);

        var result = target.Compile<string>(whiteSpaceExpr); // Act

        result.Should().BeSameAs(dslResult1);
    }

    [Fact]
    public void ShouldCachePerExpression()
    {
        inner.Setup(i => i.Compile<string>("expr 1")).Returns(dslResult1);
        inner.Setup(i => i.Compile<string>("expr 2")).Returns(dslResult2);

        // Act
        var result1 = target.Compile<string>("expr 1");
        var result2 = target.Compile<string>("expr 2");

        result1.Should().BeSameAs(dslResult1);
        result2.Should().BeSameAs(dslResult2);
    }

    [Fact]
    public void ShouldCachePerType()
    {
        var boolResult = Mock.Of<IDslExpression<bool>>().WithWarnings(dslResult2.Warnings);
        inner.Setup(i => i.Compile<string>("expr")).Returns(dslResult1);
        inner.Setup(i => i.Compile<bool>("expr")).Returns(boolResult);

        // Act
        var result1 = target.Compile<string>("expr");
        var result2 = target.Compile<bool>("expr");

        result1.Should().Be(dslResult1);
        result2.Should().Be(boolResult);
    }
}
