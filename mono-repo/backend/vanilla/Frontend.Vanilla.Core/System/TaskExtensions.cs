using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Core.System;

internal static class TaskExtensions
{
    /// <summary>
    /// For low-level operations (e.g. I/O operations) that don't need SynchronizationContext (usually HttpContext)
    /// to be restored for the rest of an async method after await finishes. This improves the performance.
    /// </summary>
    public static ConfiguredTaskAwaitable<T> NoContextRestore<T>(this Task<T> task)
        => task.ConfigureAwait(false);

    /// <summary>See <see cref="NoContextRestore{T}" />.</summary>
    public static ConfiguredTaskAwaitable NoContextRestore(this Task task)
        => task.ConfigureAwait(false);

    public static Task<T> AsTask<T>(this T value)
        => Task.FromResult(value);

    public static Task<T?> AsNullableResult<T>(this Task<T> task)
        where T : class
#pragma warning disable CS8619 // Nullability of reference types in value doesn't match target type.
        => (Task<T?>)task;
#pragma warning restore CS8619 // Nullability of reference types in value doesn't match target type.
}

#nullable disable

/// <summary>Singleton with cached completed task with null value.</summary>
internal static class DefaultResultTask<T>
{
    public static readonly Task<T> Value = Task.FromResult<T>(default);
}
