using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Patterns;

/// <summary>
/// An implementation of the disposable pattern that calls an <see cref="Action"/> at disposal time.
/// </summary>
public class DisposableAction : Disposable
{
    private readonly Action disposeAction;

    /// <summary>Initializes a new instance.</summary>
    public DisposableAction(Action disposeAction)
        => this.disposeAction = Guard.NotNull(disposeAction, nameof(disposeAction));

    /// <summary>Calls the <see cref="Action"/> passed in to the constructor to handle disposal.</summary>
    protected override void OnDispose()
        => disposeAction.Invoke();
}
