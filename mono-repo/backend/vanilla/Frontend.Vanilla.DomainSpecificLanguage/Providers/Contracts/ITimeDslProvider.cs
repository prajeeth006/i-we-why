using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>Provides functions that represents years, weeks, days, hours and minutes as seconds. This is compatible with UNIX time and can be easily combined with DateTime provider.</summary>
[ValueVolatility(ValueVolatility.Static)]
[Description(
    "Provides functions that represents years, weeks, days, hours and minutes as seconds. This is compatible with UNIX time and can be easily combined with DateTime provider.")]
public interface ITimeDslProvider
{
    /// <summary>Time of seconds represented in seconds.</summary>
    [Description("Time of seconds represented in seconds.")]
    decimal Seconds(decimal seconds);

    /// <summary>Time of minutes represented in seconds.</summary>
    [Description("Time of minutes represented in seconds.")]
    decimal Minutes(decimal minutes);

    /// <summary>Time of hours represented in seconds.</summary>
    [Description("Time of hours represented in seconds.")]
    decimal Hours(decimal hours);

    /// <summary>Time of days represented in seconds.</summary>
    [Description("Time of days represented in seconds.")]
    decimal Days(decimal days);

    /// <summary>Time of weeks represented in seconds.</summary>
    [Description("Time of weeks represented in seconds.")]
    decimal Weeks(decimal weeks);

    /// <summary>Time of years represented in seconds. One year represents 365 days.</summary>
    [Description("Time of years represented in seconds. One year represents 365 days.")]
    decimal Years(decimal years);
}
