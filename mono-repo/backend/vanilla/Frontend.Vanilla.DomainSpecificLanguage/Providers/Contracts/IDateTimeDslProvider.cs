using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides properties and functions for retrieving current date and time in UNIX time format which allows comparisons using regular number operators <![CDATA[ =, <>, >, >=, <=, < ]]>.
/// Also it can be combined with 'Time' DSL provider. Example: DateTime.Today >= DateTime.Date(2018, 11, 5).
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides properties and functions for retrieving current date and time in UNIX time format which allows comparisons using regular number operators =, <>, >, >=, <=, <."
    + " Also it can be combined with 'Time' DSL provider. Example: DateTime.Today >= DateTime.Date(2018, 11, 5)")]
public interface IDateTimeDslProvider
{
    /// <summary>Gets current date and time in user's time zone as a UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.</summary>
    [Description("Gets date and time in user time zone as a UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.")]
    decimal GetNow();

    /// <summary>Gets current UTC date and time as a UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.</summary>
    [Description("Gets UTC date and time as a UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.")]
    decimal GetUtcNow();

    /// <summary>Gets current date in user's time zone as a UNIX time. Time of the day is 00:00:00.</summary>
    [Description("Gets date in user's time zone as a UNIX time. Time of the day is 00:00:00.")]
    decimal GetToday();

    /// <summary>Gets current UTC date as a UNIX time. Time of the day is 00:00:00.</summary>
    [Description("Gets UTC date as a UNIX time. Time of the day is 00:00:00.")]
    decimal GetUtcToday();

    /// <summary>Gets current time of day in user's time zone in a format compatible with UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.</summary>
    [Description(
        "Gets current time of day in user's time zone in a format compatible with UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.")]
    decimal GetTimeOfDay();

    /// <summary>Gets current time of day in UTC in a format compatible with UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.</summary>
    [Description(
        "Gets current time of day in UTC in a format compatible with UNIX time. Precision is in minutes (seconds are always 0) for easier comparison with other members.")]
    decimal GetUtcTimeOfDay();

    /// <summary>Gets the name of the current day in user's time zone in English e.g Sunday, Monday.</summary>
    [Description("Gets the name of the current day in user's time zone in English e.g Sunday, Monday.")]
    string GetDayOfWeek();

    /// <summary>Gets the name of the current day in UTC in English e.g Sunday, Monday.</summary>
    [Description("Gets the name of the current day in UTC in English e.g Sunday, Monday.")]
    string GetUtcDayOfWeek();

    /// <summary>
    /// Creates date from passed parameters. Parameters together must represent valid date.
    /// Year represents year as integer number.
    /// Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum is 12.
    /// Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Creates date from passed parameters. Parameters together must represent valid date." +
                 " Year represents year as integer number." +
                 " Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum is 12." +
                 " Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year.")]
    decimal Date(decimal year, decimal month, decimal day);

    /// <summary>
    /// Creates date from passed parameters. Parameters together must represent valid date.
    /// Year represents year as integer number.
    /// Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum is 12.
    /// Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Creates date from passed parameters. Parameters together must represent valid date." +
                 " Year represents year as integer number." +
                 " Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum is 12." +
                 " Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year.")]
    decimal UtcDate(decimal year, decimal month, decimal day);

    /// <summary>
    /// Creates date and time from passed parameters. Parameters together must represent valid date and time.
    /// Year represents year as integer number.
    /// Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum 12.
    /// Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year.
    /// Hours represent hours as integer number. Minimum value is 0, and maximum is 23.
    /// Minutes represent minutes as integer number. Minimum value is 0, and maximum is 60.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Creates date and time from passed parameters. Parameters together must represent valid date and time." +
                 " Year represents year as integer number." +
                 " Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum 12." +
                 " Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year." +
                 " Hours represent hours as integer number. Minimum value is 0, and maximum is 23." +
                 " Minutes represent minutes as integer number. Minimum value is 0, and maximum is 60.")]
    decimal DateTime(decimal year, decimal month, decimal day, decimal hour, decimal minute);

    /// <summary>
    /// Creates date and time from passed parameters. Parameters together must represent valid date and time.
    /// Year represents year as integer number.
    /// Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum 12.
    /// Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year.
    /// Hours represent hours as integer number. Minimum value is 0, and maximum is 23.
    /// Minutes represent minutes as integer number. Minimum value is 0, and maximum is 60.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Creates date and time from passed parameters. Parameters together must represent valid date and time." +
                 " Year represents year as integer number." +
                 " Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum 12." +
                 " Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year." +
                 " Hours represent hours as integer number. Minimum value is 0, and maximum is 23." +
                 " Minutes represent minutes as integer number. Minimum value is 0, and maximum is 60.")]
    decimal UtcDateTime(decimal year, decimal month, decimal day, decimal hour, decimal minute);

    /// <summary>
    /// Creates date and time from passed parameters. Parameters together must represent valid date and time.
    /// </summary>
    /// <param name="dateString">Represents the whole date as string.</param>
    /// <param name="exactFormat">Represents the exact format of the DateString. When empty string, a fallback will be used: yyyy-MM-dd HH:mm:ss.</param>
    [ValueVolatility(ValueVolatility.Static)]
    [Description(@"Creates date and time from passed parameters. Parameters together must represent valid date and time.
                       DateString represents the whole date as string.
                       Represents the exact format of the DateString. When empty string, a fallback will be used: yyyy-MM-dd HH:mm:ss.")]
    decimal UtcDateTime(string dateString, string exactFormat);

    /// <summary>
    /// Creates time from passed parameters. Parameters together must represent valid time.
    /// Hours represent hours as integer number. Minimum value is 0, and maximum is 23.
    /// Minutes represent minutes as integer number. Minimum value is 0, and maximum is 60.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Creates time from passed parameters. Parameters together must represent valid time." +
                 " Hours represent hours as integer number. Minimum value is 0, and maximum is 23." +
                 " Minutes represent minutes as integer number. Minimum value is 0, and maximum is 60.")]
    decimal Time(decimal hour, decimal minute);

    /// <summary>
    /// Creates time from passed parameters. Parameters together must represent valid time.
    /// Hours represent hours as integer number. Minimum value is 0, and maximum is 23.
    /// Minutes represent minutes as integer number. Minimum value is 0, and maximum is 60.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Creates date from passed parameters and returns string formatted in user or browser culture. Parameters together must represent valid date." +
                 " Year represents year as integer number." +
                 " Month represents month as integer number (January = 1, February = 2 ...). Minimum value is 1, and maximum 12." +
                 " Day represents day in month as integer number. Minimum value is 1, and maximum depends on month and year.")]
    string Format(decimal year, decimal month, decimal day);
}
