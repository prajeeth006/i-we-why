using Frontend.Vanilla.Core.System;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;

public sealed class CurrentSession(UtcDateTime startTime = default, UtcDateTime expirationTime = default, bool isAutomaticLogoutRequired = false)
{
    public UtcDateTime StartTime { get; } = startTime;
    public UtcDateTime ExpirationTime { get; } = expirationTime;
    public bool IsAutomaticLogoutRequired { get; } = isAutomaticLogoutRequired;
}
