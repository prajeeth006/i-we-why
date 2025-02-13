using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Security.Principal;
using System.Threading;
using Bwin.SCM.NCover;

namespace Frontend.Vanilla.Core.Abstractions;

/// <summary>
/// Abstraction of <see cref="Thread" /> to ease unit testing.
/// </summary>
internal interface IThread
{
    IPrincipal? CurrentPrincipal { get; set; }
    int ManagedThreadId { get; }
    CultureInfo CurrentCulture { get; }
}

[ExcludeFromCodeCoverage, NCoverExclude]
internal sealed class ThreadWrapper : IThread
{
    public IPrincipal? CurrentPrincipal
    {
        get => Thread.CurrentPrincipal;
        set => Thread.CurrentPrincipal = value;
    }

    public int ManagedThreadId => Thread.CurrentThread.ManagedThreadId;
    public CultureInfo CurrentCulture => Thread.CurrentThread.CurrentCulture;
}
