using System;

namespace Frontend.Vanilla.Features.Authentication;

internal interface IRenewAuthenticationMetadata
{
    bool ShouldRenew { get; }
}

/// <summary>
/// Authentication is renewed each time when a request comes to this controller/action.
/// instead of default behavior (renewed when a request comes in the second half of authentication expiration).
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class AlwaysRenewAuthenticationAttribute : Attribute, IRenewAuthenticationMetadata
{
    bool IRenewAuthenticationMetadata.ShouldRenew => true;
}

/// <summary>
/// Authentication is never renewed when a request comes to this controller/action.
/// instead of default behavior (renewed when a request comes in the second half of authentication expiration).
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class NeverRenewAuthenticationAttribute : Attribute, IRenewAuthenticationMetadata
{
    bool IRenewAuthenticationMetadata.ShouldRenew => false;
}
