using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;

/// <summary>
/// Info regarding past proactively validated changeset.
/// </summary>
internal sealed class ValidatedChangesetInfo(UtcDateTime time, long changesetId, RequiredString result) : IHistoryItem
{
    public UtcDateTime Time { get; } = time;
    public long ChangesetId { get; } = changesetId;
    public RequiredString Result { get; } = result;
}
