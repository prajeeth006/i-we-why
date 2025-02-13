using System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders.Time;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="ICounterDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class CounterDslProvider(ICookiesDslProvider cookieDslProvider, IDslTimeConverter dslTimeConverter, IClock clock)
    : ICounterDslProvider
{
    public decimal Get(string name)
    {
        var rawValue = cookieDslProvider.Get(name);

        if (string.IsNullOrEmpty(rawValue))
        {
            return 0;
        }

        var counter = JsonConvert.DeserializeObject<Counter>(rawValue);

        return Convert.ToDecimal(counter?.Count);
    }

    public void Increment(string name, decimal expiration)
    {
        var rawValue = cookieDslProvider.Get(name) ?? string.Empty;
        var counter = JsonConvert.DeserializeObject<Counter>(rawValue);

        if (string.IsNullOrEmpty(rawValue) || counter == null || dslTimeConverter.ToDsl(clock.UserLocalNow) > dslTimeConverter.ToDsl(counter.Expiration))
        {
            var newCounter = new Counter(1, CalculateExpirationDateTime(expiration));
            SetCounterCookie(name, newCounter);
        }
        else
        {
            counter.Count += 1;
            SetCounterCookie(name, counter);
        }
    }

    private void SetCounterCookie(string name, Counter counter)
    {
        cookieDslProvider.SetPersistent(name,
            JsonConvert.SerializeObject(counter, new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
            }),
            dslTimeConverter.ToDsl(counter.Expiration));
    }

    private DateTime CalculateExpirationDateTime(decimal expiration)
    {
        // So that consumers can specify both relative Time.Days(10) or absolute DateTime.Date(2025, 8, 6)
        if (expiration > CookiesDslProvider.AbsoluteExpirationBoundary)
            return dslTimeConverter.FromDslToTime(expiration).DateTime;
        else
            return clock.UserLocalNow.Add(dslTimeConverter.FromDslToTimeSpan(expiration)).DateTime;
    }
}

internal sealed class Counter(int count, DateTime expiration)
{
    public int Count { get; set; } = count;
    public DateTime Expiration { get; set; } = expiration;
}
