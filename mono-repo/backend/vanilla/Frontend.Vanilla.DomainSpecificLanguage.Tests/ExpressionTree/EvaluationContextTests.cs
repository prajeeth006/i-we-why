using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree;

public class EvaluationContextTests
{
    private ExecutionMode mode;

    public EvaluationContextTests()
        => mode = TestExecutionMode.Get();

    [Theory]
    [InlineData(DslEvaluation.Optimization, false)]
    [InlineData(DslEvaluation.Optimization, true)]
    [InlineData(DslEvaluation.FullOnServer, false)]
    [InlineData(DslEvaluation.PartialForClient, true)]
    internal void Constructor_ShouldCreateCorrectly(DslEvaluation evaluation, bool hasTrace)
    {
        var trace = hasTrace ? Mock.Of<IRecordingTrace>() : null;

        // Act
        var target = new EvaluationContext(mode, evaluation, trace);

        target.Mode.Should().Be(mode);
        target.Evaluation.Should().Be(evaluation);
        target.LocalVariables.Should().BeEmpty();
        target.LocalVariables.IsReadOnly.Should().BeFalse();
        target.Trace.Should().BeSameAs(trace);
    }

    [Theory]
    [InlineData(DslEvaluation.Optimization)]
    [InlineData(DslEvaluation.FullOnServer)]
    [InlineData(DslEvaluation.PartialForClient)]
    internal void Clone_ShouldCreateDedicatedInstance(DslEvaluation evaluation)
    {
        var vars = new Dictionary<TrimmedRequiredString, Literal>
        {
            { "NullItem", null },
            { "Item", NumberLiteral.Get(1.23m) },
        }.AsReadOnly();

        var target = new EvaluationContext(mode, evaluation, null) { LocalVariables = { vars } };

        // Act
        var clone = target.Clone();

        clone.Should().NotBeSameAs(target);
        clone.Mode.Should().Be(mode);
        clone.Evaluation.Should().Be(evaluation);
        clone.LocalVariables.Should().NotBeSameAs(target.LocalVariables)
            .And.BeEquivalentTo(vars);
        target.LocalVariables.Should().BeEquivalentTo(vars, "should be preserved");
    }
}
