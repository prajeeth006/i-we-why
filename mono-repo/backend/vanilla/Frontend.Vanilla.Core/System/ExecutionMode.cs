using System;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Token to indicate whether the method should be executed synchronously or asynchronously
/// according to existence of <see cref="AsyncCancellationToken" />.
/// </summary>
public struct ExecutionMode : IEquatable<ExecutionMode>
{
    /// <summary>Gets the default token which instructs synchronous execution.</summary>
    public static readonly ExecutionMode Sync = default;

    /// <summary>Creates a token which instructs asynchronous execution with given <see cref="CancellationToken" />.</summary>
    public static ExecutionMode Async(CancellationToken cancellationToken)
        => new ExecutionMode(cancellationToken);

    /// <summary>Gets the token.</summary>
    public CancellationToken? AsyncCancellationToken { get; }

    // Keep private ctor to make explicit if sync or async
    private ExecutionMode(CancellationToken cancellationToken)
        => AsyncCancellationToken = cancellationToken;

    /// <summary>See <see cref="object.Equals(object)" />.</summary>
    public override bool Equals(object? other)
        => other is ExecutionMode && Equals((ExecutionMode)other);

    /// <summary>See <see cref="IEquatable{T}.Equals(T)" />.</summary>
    public bool Equals(ExecutionMode other)
        => Equals(AsyncCancellationToken, other.AsyncCancellationToken);

    /// <summary>See <see cref="object.GetHashCode" />.</summary>
    public override int GetHashCode()
        => AsyncCancellationToken?.GetHashCode() ?? 0;

    /// <summary>See <see cref="object.ToString" />.</summary>
    public override string ToString()
    {
        if (AsyncCancellationToken == null)
            return "sync";
        if (AsyncCancellationToken.Value == default)
            return "async with default token";

        var handle = AsyncCancellationToken.Value.WaitHandle.SafeWaitHandle.DangerousGetHandle();

        return "async with token " + handle;
    }

    /// <summary>
    /// Executes task synchronously and gets the result.
    /// Correctly extracts exception if any, not wrapping them to <see cref="AggregateException" />.
    /// This is meant to be used only on tasks according to <see cref="Sync" />.
    /// </summary>
    public static TResult ExecuteSync<TResult>(Task<TResult> task, bool verifyTask = true)
    {
        if (verifyTask)
        {
            VerifySyncTask(task);
        }
        return task.GetAwaiter().GetResult(); // This code unwraps exception correctly compared to .Result which throws AggregateException
    }

    /// <summary>
    /// Executes task synchronously and gets the result.
    /// Correctly extracts exception if any, not wrapping them to <see cref="AggregateException" />.
    /// This is meant to be used only on tasks according to <see cref="Sync" />.
    /// </summary>
    public static void ExecuteSync(Task task, bool verifyTask = true)
    {
        if (verifyTask)
        {
            VerifySyncTask(task);
        }
        task.GetAwaiter().GetResult(); // This code unwraps exception correctly compared to .Result which throws AggregateException
    }

    private static void VerifySyncTask(Task task)
    {
        if (!task.Status.EqualsAny(TaskStatus.RanToCompletion, TaskStatus.Faulted))
            throw new InvalidAsyncExecutionException(
                $"Status of the task must be {TaskStatus.RanToCompletion} or {TaskStatus.Faulted}"
                + $" in case of synchronous execution mode but it is {task.Status}. So most likely something was executed asynchronously!");
    }

    /// <summary>Executes task synhrounusly and returns result.</summary>
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static TResult ExecuteSync<TResult>(Func<ExecutionMode, Task<TResult>> func, bool verifyTask = true)
        => ExecuteSync(func(Sync), verifyTask);

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static TResult ExecuteSync<TArgument, TResult>(Func<ExecutionMode, TArgument, Task<TResult>> func, TArgument arg)
        => ExecuteSync(func(Sync, arg));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static TResult ExecuteSync<TArgument1, TArgument2, TResult>(
        Func<ExecutionMode, TArgument1, TArgument2, Task<TResult>> func,
        TArgument1 arg1,
        TArgument2 arg2)
        => ExecuteSync(func(Sync, arg1, arg2));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static TResult ExecuteSync<TArgument1, TArgument2, TArgument3, TResult>(
        Func<ExecutionMode, TArgument1, TArgument2, TArgument3, Task<TResult>> func,
        TArgument1 arg1,
        TArgument2 arg2,
        TArgument3 arg3)
        => ExecuteSync(func(Sync, arg1, arg2, arg3));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static TResult ExecuteSync<TArgument1, TArgument2, TArgument3, TArgument4, TResult>(
        Func<ExecutionMode, TArgument1, TArgument2, TArgument3, TArgument4, Task<TResult>> func, TArgument1 arg1, TArgument2 arg2, TArgument3 arg3, TArgument4 arg4)
        => ExecuteSync(func(Sync, arg1, arg2, arg3, arg4));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static void ExecuteSync(Func<ExecutionMode, Task> func)
        => ExecuteSync(func(Sync));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static void ExecuteSync<TArgument>(Func<ExecutionMode, TArgument, Task> func, TArgument arg, bool verifyTask = true)
        => ExecuteSync(func(Sync, arg));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static void ExecuteSync<TArgument1, TArgument2>(Func<ExecutionMode, TArgument1, TArgument2, Task> func, TArgument1 arg1, TArgument2 arg2)
        => ExecuteSync(func(Sync, arg1, arg2));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static void ExecuteSync<TArgument1, TArgument2, TArgument3>(
        Func<ExecutionMode, TArgument1, TArgument2, TArgument3, Task> func,
        TArgument1 arg1,
        TArgument2 arg2,
        TArgument3 arg3)
        => ExecuteSync(func(Sync, arg1, arg2, arg3));

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal static void ExecuteSync<TArgument1, TArgument2, TArgument3, TArgument4>(
        Func<ExecutionMode, TArgument1, TArgument2, TArgument3, TArgument4, Task> func,
        TArgument1 arg1,
        TArgument2 arg2,
        TArgument3 arg3,
        TArgument4 arg4)
        => ExecuteSync(func(Sync, arg1, arg2, arg3, arg4));
}

internal sealed class InvalidAsyncExecutionException(string message) : InvalidOperationException(message) { }
