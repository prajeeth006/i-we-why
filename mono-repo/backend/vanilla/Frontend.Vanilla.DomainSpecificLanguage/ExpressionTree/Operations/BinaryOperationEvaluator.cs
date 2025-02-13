using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>Evaluates <see cref="BinaryOperation" /> to final value if possible.</summary>
internal interface IBinaryOperationEvaluator
{
    Task<IExpressionTree> EvaluateAsync(BinaryOperation operation, EvaluationContext context);
}

internal delegate Literal BinaryEvaluationHandler(Literal left, Literal right);

/// <summary>Common case when both operands are needed for full evaluation.</summary>
internal sealed class BinaryOperationEvaluator(BinaryEvaluationHandler evaluate) : IBinaryOperationEvaluator
{
    public BinaryEvaluationHandler Evaluate { get; } = evaluate;

    async Task<IExpressionTree> IBinaryOperationEvaluator.EvaluateAsync(BinaryOperation operation, EvaluationContext context)
    {
        var leftEvaluated = await operation.LeftOperand.EvaluateAsync(context);
        var rightEvaluated = await operation.RightOperand.EvaluateAsync(context);

        if (!(leftEvaluated is Literal leftLiteral) || !(rightEvaluated is Literal rightLiteral))
            return new BinaryOperation(operation.Operator, leftEvaluated, rightEvaluated);

        return Evaluate(leftLiteral, rightLiteral);
    }
}

internal enum LogicalCompositionResult
{
    ThisLiteral,
    OtherOperand,
}

/// <summary>Optimized evaluation of logical composition when one final operand is enough.</summary>
internal sealed class LogicalCompositionEvaluator(Func<BooleanLiteral, LogicalCompositionResult> evaluate) : IBinaryOperationEvaluator
{
    public Func<BooleanLiteral, LogicalCompositionResult> Evaluate { get; } = evaluate;

    async Task<IExpressionTree> IBinaryOperationEvaluator.EvaluateAsync(BinaryOperation operation, EvaluationContext context)
    {
        var leftEvaluated = await operation.LeftOperand.EvaluateAsync(context);

        if (leftEvaluated is BooleanLiteral leftLiteral)
            return Evaluate(leftLiteral) switch
            {
                LogicalCompositionResult.ThisLiteral => leftLiteral,
                LogicalCompositionResult.OtherOperand => await operation.RightOperand.EvaluateAsync(context),
                _ => throw new VanillaBugException(),
            };

        var rightEvaluated = await operation.RightOperand.EvaluateAsync(context);

        if (rightEvaluated is BooleanLiteral rightLiteral)
            return Evaluate(rightLiteral) switch
            {
                LogicalCompositionResult.ThisLiteral => rightLiteral,
                LogicalCompositionResult.OtherOperand => leftEvaluated,
                _ => throw new VanillaBugException(),
            };

        return new BinaryOperation(operation.Operator, leftEvaluated, rightEvaluated);
    }
}

/// <summary>Optimized to return the left-most non-empty operand.</summary>
internal sealed class NotEmptyOperandEvaluator<TLiteral>(Func<TLiteral, bool> isEmpty) : IBinaryOperationEvaluator
    where TLiteral : Literal
{
    public Func<TLiteral, bool> IsEmpty { get; } = isEmpty;

    async Task<IExpressionTree> IBinaryOperationEvaluator.EvaluateAsync(BinaryOperation operation, EvaluationContext context)
    {
        var leftEvaluated = await operation.LeftOperand.EvaluateAsync(context);

        if (leftEvaluated is TLiteral leftLiteral)
            return !IsEmpty(leftLiteral)
                ? leftLiteral
                : await operation.RightOperand.EvaluateAsync(context);

        // If PartialForClient eval -> right may be non-empty but it's a fallback for left on client-> recreate e.g. "expr OR 123"
        var rightEvaluated = await operation.RightOperand.EvaluateAsync(context);

        if (rightEvaluated is TLiteral rightLiteral && IsEmpty(rightLiteral))
            return leftEvaluated;

        return new BinaryOperation(operation.Operator, leftEvaluated, rightEvaluated);
    }
}
