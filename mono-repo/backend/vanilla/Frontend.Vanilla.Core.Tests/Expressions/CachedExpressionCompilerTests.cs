using FluentAssertions;
using Frontend.Vanilla.Core.Expressions;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Expressions;

public sealed class CachedExpressionCompilerTests
{
    [Fact]
    public void ShouldCompile()
    {
        var func = CachedExpressionCompiler.CompileCached((string s) => s.Length);
        func("str").Should().Be(3);
    }
}
