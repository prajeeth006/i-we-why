namespace Frontend.Vanilla.Core.Time.Background;

/// <summary>
/// Captures some important part of parent context and sets it up in a new thread for background work run by <see cref="IBackgroundWorker" />.
/// </summary>
internal interface IBackgroundWorkInitializer
{
    SetupBackgroundContextHandler CaptureParentContext();
}

internal delegate void SetupBackgroundContextHandler();
