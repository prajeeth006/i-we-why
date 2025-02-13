using System;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.Ioc;

/// <summary>
/// Convenient implementation of <see cref="IBootTask" /> where you can directly provide lambda expression to be executed.
/// </summary>
public class LambdaBootTask : IBootTask
{
    private readonly Func<Task> executeFunc;

    /// <summary>Creates a new instance.</summary>
    public LambdaBootTask(Func<Task> executeFunc)
        => this.executeFunc = executeFunc;

    Task IBootTask.ExecuteAsync()
        => executeFunc();
}
