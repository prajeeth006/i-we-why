using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Loading.JustInTime;

/// <summary>
/// Handles runtime exceptions during content loading e.g. Sitecore outage.
/// </summary>
internal sealed class ExceptionHandlingDecorator(IContentLoader inner) : IContentLoader
{
    public async Task<Content<IDocument>> GetContentAsync(ExecutionMode mode, DocumentId id, ContentLoadOptions options, Action<object> trace)
    {
        try
        {
            return await inner.GetContentAsync(mode, id, options, trace);
        }
        catch (Exception ex)
        {
            trace?.Invoke($"Loading failed unexpectedly: {ex}");
            var error = $"Loading content {id} failed unexpectedly: {ex}".TrimEnd();

            return new InvalidContent<IDocument>(id, null, error);
        }
    }
}
