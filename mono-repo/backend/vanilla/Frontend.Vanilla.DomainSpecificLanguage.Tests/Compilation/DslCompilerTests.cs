using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Compilation;

public sealed class DslCompilerTests
{
    private DslCompilerBase target;
    private Mock<IExpressionTreeParser> parser;
    private ITraceRecorder traceRecorder;

    public DslCompilerTests()
    {
        parser = new Mock<IExpressionTreeParser>();
        traceRecorder = Mock.Of<ITraceRecorder>();
        target = new DslCompiler(parser.Object, traceRecorder);
    }

    public static IEnumerable<object[]> TestCases => new[]
    {
        new object[] { 0m, DslType.Number },
        new object[] { "", DslType.String },
        new object[] { false, DslType.Boolean },
        new object[] { VoidDslResult.Singleton, DslType.Void },
        new object[] { new object(), DslType.Number }, // Upcast
    };

    [Theory, MemberData(nameof(TestCases))]
    internal void ShouldCompile<T>(object dummy, DslType dslType)
    {
        var dummy2 = dummy;
        var optimizedTree = Mock.Of<IExpressionTree>(e => e.ResultType == dslType);
        var exprTree = new Mock<IExpressionTree>();
        var testWarnings = new TrimmedRequiredString[] { "Warn 1", "Warn 2" }.AsReadOnly();
        parser.Setup(p => p.Parse("raw expr", typeof(T))).Returns(exprTree.Object.WithWarnings(testWarnings));
        exprTree.Setup(e => e.EvaluateAsync(It.Is<EvaluationContext>(c =>
                c.Mode.Equals(ExecutionMode.Sync)
                && c.Evaluation == DslEvaluation.Optimization
                && c.Trace == null
                && c.LocalVariables.Count == 0)))
            .ReturnsAsync(optimizedTree);

        // Act
        var result = target.Compile<T>("raw expr");

        var expr = (DslExpression<T>)result.Value;
        expr.OriginalString.Should().Be("raw expr");
        expr.ExpressionTree.Should().BeSameAs(optimizedTree);
        expr.TraceRecorder.Should().BeSameAs(traceRecorder);
        result.Warnings.Should().Equal(testWarnings);
    }

    [Fact]
    public void ShouldTestAllDslTypes()
        => TestCases.Select(tc => tc[1]).Distinct()
            .Should().BeEquivalentTo(Enum<DslType>.Values);
}
