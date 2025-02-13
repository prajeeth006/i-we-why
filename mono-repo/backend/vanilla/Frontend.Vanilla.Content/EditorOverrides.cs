using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Overrides of content loading for current request. Usually used by content editors to view content according to their needs.
/// </summary>
internal sealed class EditorOverrides
{
    public bool NoCache { get; }
    public bool UsePreview { get; }
    public UtcDateTime? PreviewDate { get; }

    public EditorOverrides(bool noCache = false, bool usePreview = false, UtcDateTime? previewDate = null)
    {
        NoCache = noCache;
        UsePreview = usePreview;
        PreviewDate = Guard.Requires(previewDate, d => d == null || usePreview, nameof(previewDate), "PreviewDate can be specified only if UsePreview is true.");
    }
}
