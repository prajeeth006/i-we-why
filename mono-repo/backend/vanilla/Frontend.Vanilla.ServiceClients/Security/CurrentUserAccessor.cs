#nullable enable

using System.Security.Claims;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.ServiceClients.Security;

/// <summary>
/// Provides access to user in the current context specific to the application type.
/// </summary>
public interface ICurrentUserAccessor
{
    /// <summary>Gets or sets the current user.</summary>
    ClaimsPrincipal User { get; set; }
}

/// <summary>
/// Simple implementation of <see cref="ICurrentUserAccessor" /> for non-web apps assuming they are single-threaded.
/// If app is meant to be multi-threaded then it should implement its own accessor accordingly.
/// </summary>
internal sealed class SingleThreadedCurrentUserAccessor(IThread thread) : ICurrentUserAccessor
{
    private volatile ClaimsPrincipal? user;

    public ClaimsPrincipal User
    {
        get => user ?? ClaimsUserCaster.Cast(thread.CurrentPrincipal, userSource: "Thread.CurrentPrincipal");
        set => thread.CurrentPrincipal = user = Guard.NotNull(value, nameof(value));
    }
}
