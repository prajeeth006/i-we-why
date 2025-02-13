using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Time.Background;

/// <summary>
/// Captures details of the operation to be executed on background in strongly-typed manner.
/// </summary>
internal interface IBackgroundOperation
{
    Task ExecuteAsync();
    TrimmedRequiredString DebugInfo { get; }
}

internal sealed class BackgroundOperation<TArgument>(Func<TArgument, Task> function, TArgument arg) : IBackgroundOperation
{
    public Func<TArgument, Task> Function { get; } = function;
    public TArgument Arg { get; } = arg;

    public Task ExecuteAsync()
        => Function(Arg);

    public TrimmedRequiredString DebugInfo
        => $"{Function.Method} from {Function.Method.DeclaringType} with argument {Arg.Dump()}";
}
