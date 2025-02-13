using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage;

internal interface IClientEvaluationResult
{
    bool HasFinalValue { get; }
    object Value { get; }
    string ClientExpression { get; }
}

/// <summary>
/// Result of DSL expression for the client.
/// </summary>
public abstract class ClientEvaluationResult<T> : IEquatable<ClientEvaluationResult<T>>, IClientEvaluationResult
    where T : notnull
{
    /// <summary>Creates a result holding already final value.</summary>
    public static ClientEvaluationResult<T> FromValue(T value)
        => new FinalValueResult(value);

    /// <summary>Creates a result holding JavaScript expression to be evaluated on client to get final value.</summary>
    public static ClientEvaluationResult<T> FromClientExpression(string clientExpression)
        => new ClientExpressionResult(clientExpression);

    /// <summary>
    /// Indicates if the result hold final <see cref="Value" />.
    /// If not then there is <see cref="ClientExpression" /> to be evaluated on client to get it.
    /// </summary>
    public abstract bool HasFinalValue { get; }

    /// <summary>Gets the final value if the expression was already fully evaluated on the server.</summary>
    /// <exception cref="InvalidOperationException">If <see cref="HasFinalValue" /> is <c>false</c>.</exception>
    public abstract T Value { get; }

    object IClientEvaluationResult.Value => Value;

    /// <summary>Gets the JavaScript expression that needs to be evaluated on the client to get the final value.</summary>
    /// <exception cref="InvalidOperationException">If <see cref="HasFinalValue" /> is <c>true</c>.</exception>
    public abstract string ClientExpression { get; }

    /// <summary>See <see cref="object.Equals(object)" />.</summary>
    public override bool Equals(object? obj)
        => Equals(obj as ClientEvaluationResult<T>);

    /// <summary>See <see cref="IEquatable{T}.Equals(T)" />.</summary>
    public abstract bool Equals(ClientEvaluationResult<T>? other);

    /// <summary>See <see cref="object.GetHashCode" />.</summary>
    public abstract override int GetHashCode();

    private sealed class FinalValueResult(T value) : ClientEvaluationResult<T>
    {
        public override T Value { get; } = Guard.NotNull(value, nameof(value));

        public override bool HasFinalValue
            => true;

        public override string ClientExpression
            => throw new InvalidOperationException(
                "There is no ClientExpression to be evaluated on the client because final Value is already available. Check HasFinalValue before accessing this property.");

        public override bool Equals(ClientEvaluationResult<T>? other)
            => other is FinalValueResult final && final.Value.Equals(Value);

        public override int GetHashCode()
            => Value.GetHashCode();
    }

    private sealed class ClientExpressionResult(string clientExpression) : ClientEvaluationResult<T>
    {
        public override string ClientExpression { get; } = Guard.NotWhiteSpace(clientExpression, nameof(clientExpression));

        public override bool HasFinalValue
            => false;

        public override T Value
            => throw new InvalidOperationException(
                "There is no final Value yet. Evaluate ClientExpression on the client to get it. Check HasFinalValue before accessing this property.");

        public override bool Equals(ClientEvaluationResult<T>? other)
            => other is ClientExpressionResult client && client.ClientExpression.Equals(ClientExpression);

        public override int GetHashCode()
            => ClientExpression.GetHashCode();
    }
}
