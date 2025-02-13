namespace Frontend.Vanilla.Core.Net;

/// <summary>
/// Determines whether the application is requested from internal company network.
/// Logic is according to app type. It should be used mainly for internal diagnostic pages and features.
/// </summary>
public interface IInternalRequestEvaluator
{
    /// <summary>
    /// Determines whether the request is made from internal company network.
    /// </summary>
    bool IsInternal();
}

internal sealed class NegativeInternalRequestEvaluator : IInternalRequestEvaluator
{
    public bool IsInternal() => false;
}
