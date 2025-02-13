using Frontend.Vanilla.Core.System;
using JetBrains.Annotations;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;

public sealed class LastSession(LastSessionDetails details = null)
{
    [CanBeNull]
    public LastSessionDetails Details { get; } = details;

    public bool IsFirstLogin => Details == null;
}

public sealed class LastSessionDetails(UtcDateTime loginTime = default, UtcDateTime logoutTime = default)
{
    public UtcDateTime LoginTime { get; } = loginTime;
    public UtcDateTime LogoutTime { get; } = logoutTime;
}
