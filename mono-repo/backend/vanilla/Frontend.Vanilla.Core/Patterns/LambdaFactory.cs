using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Patterns;

/// <summary>
/// Generic factory for creating an object using provided lambda expression.
/// Useful in combination with dependency injection.
/// </summary>
/// <typeparam name="T"></typeparam>
internal class LambdaFactory<T>(Func<T> lambda)
{
    private readonly Func<T> lambda = Guard.NotNull(lambda, nameof(lambda));

    public T Create() => lambda();
}
