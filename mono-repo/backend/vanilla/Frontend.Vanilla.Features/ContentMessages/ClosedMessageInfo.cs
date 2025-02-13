using System;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.ContentMessages;

/// <summary>
/// Represents metadata about closed content message.
/// </summary>
internal class ClosedMessageInfo : ToStringEquatable<ClosedMessageInfo>
{
    static ClosedMessageInfo()
        => Comparison = StringComparison.OrdinalIgnoreCase;

    public TrimmedRequiredString Name { get; }
    public bool ShowOnNextSession { get; }
    public bool ShowOnNextLogin { get; }

    public ClosedMessageInfo(TrimmedRequiredString name, bool showOnNextSession, bool showOnNextLogin)
    {
        Name = name;
        ShowOnNextSession = showOnNextSession;
        ShowOnNextLogin = showOnNextLogin;
        Guard.Requires(
            !(showOnNextSession && showOnNextLogin),
            nameof(showOnNextSession),
            $"Parameters {nameof(showOnNextSession)} and {nameof(showOnNextLogin)} can't be both true at the same time.");
    }

    public override string ToString()
        => $"(Name='{Name}', ShowOnNextSession={ShowOnNextSession}, ShowOnNextLogin={ShowOnNextLogin})";
}
