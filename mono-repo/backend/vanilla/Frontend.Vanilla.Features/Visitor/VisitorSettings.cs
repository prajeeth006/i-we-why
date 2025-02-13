using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.Visitor;

/// <summary>
/// Expose the visitor (user on particular device) settings for the current request. Manipulated by <see cref="IVisitorSettingsManager" />.
/// </summary>
internal sealed class VisitorSettings
{
    /// <summary>Gets the name of the user's selected culture.</summary>
    public TrimmedRequiredString? CultureName { get; }

    /// <summary>Gets the number of user visits.</summary>
    public int VisitCount { get; }

    /// <summary>Gets the time when current user's session has started.</summary>
    public UtcDateTime SessionStartTime { get; }

    /// <summary>Gets the time of previous user's visit - session start. Can have default <c>DateTime</c> value in case of first visit.</summary>
    public UtcDateTime PreviousSessionStartTime { get; }

    public VisitorSettings() { }

    public VisitorSettings(
        TrimmedRequiredString? cultureName,
        int visitCount,
        UtcDateTime sessionStartTime,
        UtcDateTime previousSessionStartTime)
    {
        CultureName = cultureName;
        VisitCount = visitCount;
        SessionStartTime = sessionStartTime;
        PreviousSessionStartTime = previousSessionStartTime;
    }

    public VisitorSettings With(
        TrimmedRequiredString? cultureName = null,
        int? visitCount = null,
        UtcDateTime? sessionStartTime = null,
        UtcDateTime? previousSessionStartTime = null,
        TrimmedRequiredString? lastSessionId = null)
        => new VisitorSettings(
            cultureName ?? CultureName,
            visitCount ?? VisitCount,
            sessionStartTime ?? SessionStartTime,
            previousSessionStartTime ?? PreviousSessionStartTime);
}
