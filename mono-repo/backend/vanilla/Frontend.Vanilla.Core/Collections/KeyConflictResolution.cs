namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Defines what to do if there is key conflict when merging two keyed collections.
/// </summary>
public enum KeyConflictResolution
{
    /// <summary>
    /// An exception should be thrown.
    /// </summary>
    Throw = 0,

    /// <summary>
    /// Conflict element should be skipped.
    /// </summary>
    Skip = 1,

    /// <summary>
    /// Target entry should be overwritten.
    /// </summary>
    Overwrite = 2,
}
