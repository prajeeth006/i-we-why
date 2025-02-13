using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Security.Claims.Local;

/// <summary>
/// Info about a claim to be issued by <see cref="LocalClaimsProvider" />.
/// </summary>
public sealed class LocalClaimInfo
{
    /// <summary>
    /// Gets claim type.
    /// </summary>
    public TrimmedRequiredString Type { get; }

    /// <summary>
    /// Gets claims description usable for documentation.
    /// </summary>
    public TrimmedRequiredString Description { get; }

    /// <summary>
    /// Createsa a new instance.
    /// </summary>
    public LocalClaimInfo([NotNull] TrimmedRequiredString type, [NotNull] TrimmedRequiredString description)
    {
        Type = Guard.NotNull(type, nameof(type));
        Description = Guard.NotNull(description, nameof(description));
    }
}
