using System;
using System.Collections.Concurrent;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.DomainSpecificLanguage.Json;

/// <summary>
/// Base converter for <see cref="IDslExpression{T}" /> which handles generics.
/// </summary>
internal abstract class DslExpressionJsonConverterBase : JsonConverterBase
{
    public sealed override bool CanConvert(Type objectType)
        => GetDslResultType(objectType) != null;

    public sealed override object? Read(JsonReader reader, Type typeToRead, object? existingValue, JsonSerializer serializer)
    {
        var resultType = typeToRead.GetGenericArguments().First();

        if (reader.Value == null) return null;

        return this.InvokeGeneric(nameof(Read), resultType, reader.Value);
    }

    public sealed override void Write(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var resultType = GetDslResultType(value.GetType()) ?? throw new VanillaBugException();
        this.InvokeGeneric(nameof(Write), resultType, writer, value);
    }

    public abstract IDslExpression<T> Read<T>(object value)
        where T : notnull;

    public abstract void Write<T>(JsonWriter writer, IDslExpression<T> expression)
        where T : notnull;

    private static readonly ConcurrentDictionary<Type, Type?> DslResultTypeCache = new ConcurrentDictionary<Type, Type?>();

    private static Type? GetDslResultType(Type objectType)
        => DslResultTypeCache.GetOrAdd(objectType, GetDslResultTypeFresh);

    private static Type? GetDslResultTypeFresh(Type objectType)
        => objectType.GetInterfaces()
            .Append(objectType.IsInterface ? new[] { objectType } : Type.EmptyTypes)
            .Where(i => i.IsGenericType && typeof(IDslExpression<>).IsAssignableFrom(i.GetGenericTypeDefinition()))
            .Select(i => i.GenericTypeArguments[0])
            .SingleOrDefault();
}
