using System.Web;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebUtilities;

namespace Frontend.Vanilla.Features.TrackerId;

internal interface ITrackerIdQueryParameter
{
    TrimmedRequiredString? GetValue();
}

internal sealed class TrackerIdQueryParameter(IBrowserUrlProvider browserUrlProvider, ITrackerIdConfiguration config) : ITrackerIdQueryParameter
{
    public TrimmedRequiredString? GetValue()
    {
        var queryString = HttpUtility.ParseQueryString(browserUrlProvider.Url.Query);

        foreach (var name in config.QueryStrings)
            if (queryString[name] is var value && !string.IsNullOrWhiteSpace(value))
                return value.Trim();

        return null;
    }
}
