using System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders.Time;

internal sealed class TimeDslProvider(IDslTimeConverter converter) : ITimeDslProvider
{
    public decimal Seconds(decimal seconds)
        => converter.ToDsl(TimeSpan.FromSeconds((double)seconds));

    public decimal Minutes(decimal minutes)
        => converter.ToDsl(TimeSpan.FromMinutes((double)minutes));

    public decimal Hours(decimal hours)
        => converter.ToDsl(TimeSpan.FromHours((double)hours));

    public decimal Days(decimal days)
        => converter.ToDsl(TimeSpan.FromDays((double)days));

    public decimal Weeks(decimal weeks)
        => converter.ToDsl(TimeSpan.FromDays((double)(7 * weeks)));

    public decimal Years(decimal years)
        => converter.ToDsl(TimeSpan.FromDays((double)(365 * years)));
}
