using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

/// <summary>
/// Context passed through whole DSL evaluation.
/// </summary>
internal sealed class EvaluationContext(ExecutionMode mode, DslEvaluation evaluation, IRecordingTrace? trace)
{
    public ExecutionMode Mode { get; } = mode;
    public DslEvaluation Evaluation { get; } = evaluation;
    public IDictionary<TrimmedRequiredString, Literal?> LocalVariables { get; } = new Dictionary<TrimmedRequiredString, Literal?>();
    public IRecordingTrace? Trace { get; } = trace;

    public EvaluationContext Clone()
        => new EvaluationContext(Mode, Evaluation, Trace) { LocalVariables = { LocalVariables } };
}
