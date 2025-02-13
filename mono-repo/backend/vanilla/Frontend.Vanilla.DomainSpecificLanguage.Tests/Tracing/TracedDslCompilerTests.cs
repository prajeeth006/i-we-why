using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.Tracing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Tracing;

public class TracedDslCompilerTests
{
    private DslCompilerBase target;
    private Mock<IDslCompiler> inner;
    private ITraceRecorder traceRecorder;

    public TracedDslCompilerTests()
    {
        inner = new Mock<IDslCompiler>();
        traceRecorder = Mock.Of<ITraceRecorder>();
        target = new TracedDslCompiler(inner.Object, traceRecorder);
    }

    [Fact]
    public void ShouldDecorateCompiledExpression()
    {
        var innerExpr = Mock.Of<IDslExpression<string>>();
        var testWarnings = new[] { "Warn 1", "Warn 2" }.AsTrimmed();
        inner.Setup(i => i.Compile<string>("expr")).Returns(innerExpr.WithWarnings(testWarnings));

        // Act
        var (expr, warnings) = target.Compile<string>("expr");

        var tracedExpr = (TracedDslExpression<string>)expr;
        tracedExpr.Inner.Should().BeSameAs(innerExpr);
        tracedExpr.TraceRecorder.Should().BeSameAs(traceRecorder);
        warnings.Should().Equal(testWarnings);
    }
}
