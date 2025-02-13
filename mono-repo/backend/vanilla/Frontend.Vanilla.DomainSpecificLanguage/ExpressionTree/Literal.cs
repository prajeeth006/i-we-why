using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical.Rules;
using Newtonsoft.Json;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;

/// <summary>Constant value in the expression tree.</summary>
internal abstract class Literal : ExpressionTreeBase<Literal>
{
    private readonly Task<IExpressionTree> thisTask;

    protected Literal()
        => thisTask = Task.FromResult<IExpressionTree>(this);

    public sealed override Task<IExpressionTree> EvaluateAsync(EvaluationContext context)
        => thisTask;

    public sealed override IEnumerable<IExpressionTree> GetChildren()
        => Array.Empty<IExpressionTree>();

    public sealed override string ToString()
        => LiteralRule.ToString(this);

    /// <summary>Extracts underlying value. It upcasts it if needed.</summary>
    public abstract T GetValue<T>();

    /// <summary>Use concrete literals instead if possible.</summary>
    public static Literal GetWildcard(object value)
        => value switch
        {
            bool boolean => (BooleanLiteral)boolean,
            string str => StringLiteral.Get(str),
            decimal number => NumberLiteral.Get(number),
            VoidDslResult _ => VoidLiteral.Singleton,
            null => throw new ArgumentNullException(nameof(value)),
            _ => throw new ArgumentException(
                $"Unsupported value {value.Dump()} of type {value.GetType()}. Supported: {Enum<DslType>.Values.Select(v => v.ToClrType()).Dump()}.", nameof(value)),
        };

    public static Literal GetDefault(DslType type)
        => type switch
        {
            DslType.Boolean => BooleanLiteral.False,
            DslType.String => StringLiteral.Empty,
            DslType.Number => NumberLiteral.Zero,
            DslType.Void => VoidLiteral.Singleton,
            _ => throw type.GetInvalidException(),
        };

    public static DslType GetDslType<TLiteral>()
        where TLiteral : Literal
    {
        var clrType = typeof(TLiteral).BaseType!.GetGenericArguments()[0];

        return DslTypeHelper.ClrTypesToDsl[clrType];
    }
}

internal abstract class Literal<TValue>(TValue value) : Literal
    where TValue : notnull, IEquatable<TValue>
{
    public TValue Value { get; } = value;

    public override T GetValue<T>()
        => Value is T typed ? typed : throw new InvalidOperationException($"Value {Value.Dump()} of type {Value.GetType()} can't be assigned to requested {typeof(T)}.");

    public sealed override DslType ResultType
        => DslTypeHelper.ClrTypesToDsl[typeof(TValue)];

    public sealed override bool Equals(Literal? other)
        => (other as Literal<TValue>)?.Value.Equals(Value) == true;

    public sealed override int GetHashCode()
        => Value.GetHashCode();
}

internal sealed class NumberLiteral : Literal<decimal>
{
    public static readonly NumberLiteral Zero = new NumberLiteral(0m);

    private NumberLiteral(decimal value)
        : base(value) { }

    public static NumberLiteral Get(decimal value)
        => value != 0 ? new NumberLiteral(value) : Zero;

    public override string SerializeToClient()
        => Value.ToInvariantString();
}

internal sealed class StringLiteral : Literal<string>
{
    public static readonly StringLiteral Empty = new StringLiteral("");

    private StringLiteral(string value)
        : base(value) { }

    public static StringLiteral Get(string value)
        => value.Length > 0 ? new StringLiteral(value) : Empty;

    public override string SerializeToClient()
        => JsonConvert.ToString(Value, delimiter: '\'');
}

/// <summary>Designed for the best performance as far as there are only 2 supported values and used very often.</summary>
internal sealed class BooleanLiteral : Literal<bool>
{
    public static readonly BooleanLiteral True = new (true);
    public static readonly BooleanLiteral False = new (false);

    private BooleanLiteral(bool value)
        : base(value) { }

    public static implicit operator BooleanLiteral(bool value)
        => value ? True : False;

    public override string SerializeToClient()
        => Value ? "true" : "false";
}

internal sealed class VoidLiteral : Literal<VoidDslResult>
{
    public static readonly VoidLiteral Singleton = new ();
    public static readonly Task<IExpressionTree> SingletonTask = Task.FromResult<IExpressionTree>(Singleton);

    private VoidLiteral()
        : base(VoidDslResult.Singleton) { }

    public override string SerializeToClient() => string.Empty;
}
