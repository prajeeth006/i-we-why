using System;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.Testing.Fakes;
using Moq;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;

internal static class TestEvaluationContext
{
    public static EvaluationContext Get(DslEvaluation? evaluation = null)
    {
        var ctx = new EvaluationContext(
            TestExecutionMode.Get(),
            evaluation ?? RandomGenerator.Get<DslEvaluation>(),
            Mock.Of<IRecordingTrace>());

        ctx.LocalVariables.Add($"key-{Guid.NewGuid()}", StringLiteral.Get(Guid.NewGuid().ToString()));
        ctx.LocalVariables.Add($"key-{Guid.NewGuid()}", NumberLiteral.Get(RandomGenerator.GetInt32()));
        ctx.LocalVariables.Add($"key-{Guid.NewGuid()}", null);

        return ctx;
    }
}
