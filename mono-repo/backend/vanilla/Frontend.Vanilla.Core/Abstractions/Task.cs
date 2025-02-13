using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Bwin.SCM.NCover;

namespace Frontend.Vanilla.Core.Abstractions;

/// <summary>
/// Abstraction of static API of <see cref="Task" /> to ease unit testing.
/// </summary>
internal interface ITask
{
    Task Run(Func<Task> function);
}

[ExcludeFromCodeCoverage, NCoverExclude]
internal sealed class TaskWrapper : ITask
{
    public Task Run(Func<Task> function)
        => Task.Run(function);
}
