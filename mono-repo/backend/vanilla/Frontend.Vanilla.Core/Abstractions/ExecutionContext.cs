using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using Bwin.SCM.NCover;

namespace Frontend.Vanilla.Core.Abstractions;

/// <summary>
/// Abstraction of static API of <see cref="ExecutionContext" /> to ease unit testing.
/// </summary>
internal interface IExecutionContext
{
    IDisposable SuppressFlow();
}

[ExcludeFromCodeCoverage, NCoverExclude]
internal sealed class ExecutionContextWrapper : IExecutionContext
{
    public IDisposable SuppressFlow()
        => ExecutionContext.SuppressFlow();
}
