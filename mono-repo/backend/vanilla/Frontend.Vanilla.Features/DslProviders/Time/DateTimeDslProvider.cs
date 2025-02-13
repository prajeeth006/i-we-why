using System;
using System.Globalization;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders.Time;

internal sealed class DateTimeDslProvider(IClock clock, IDateTimeDslCalculator calculator) : IDateTimeDslProvider
{
    public decimal GetNow()
        => calculator.GetTime(clock.UserLocalNow);

    public decimal GetUtcNow()
        => calculator.GetTime(clock.UtcNow.ValueWithOffset);

    public decimal GetToday()
        => calculator.GetDate(clock.UserLocalNow);

    public decimal GetUtcToday()
        => calculator.GetDate(clock.UtcNow.ValueWithOffset);

    public decimal GetTimeOfDay()
        => calculator.GetTimeOfDay(clock.UserLocalNow);

    public decimal GetUtcTimeOfDay()
        => calculator.GetTimeOfDay(clock.UtcNow.ValueWithOffset);

    public string GetDayOfWeek()
        => calculator.GetDayOfWeek(clock.UserLocalNow);

    public string GetUtcDayOfWeek()
        => calculator.GetDayOfWeek(clock.UtcNow.ValueWithOffset);

    public decimal DateTime(decimal year, decimal month, decimal day, decimal hour, decimal minute)
        => calculator.CreateTime(year, month, day, hour, minute, clock.UserLocalNow.Offset);

    public decimal UtcDateTime(decimal year, decimal month, decimal day, decimal hour, decimal minute)
        => calculator.CreateTime(year, month, day, hour, minute, offset: TimeSpan.Zero);

    public decimal UtcDateTime(string dateString, string exactFormat)
    {
        var format = string.IsNullOrWhiteSpace(exactFormat) ? "yyyy-MM-dd HH:mm:ss" : exactFormat;
        System.DateTime.TryParseExact(dateString, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime);

        return UtcDateTime(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour, dateTime.Minute);
    }

    public decimal Date(decimal year, decimal month, decimal day)
        => calculator.CreateTime(year, month, day, hour: 0, minute: 0, clock.UserLocalNow.Offset);

    public string Format(decimal year, decimal month, decimal day)
        => calculator.Format(year, month, day);

    public decimal UtcDate(decimal year, decimal month, decimal day)
        => calculator.CreateTime(year, month, day, hour: 0, minute: 0, offset: TimeSpan.Zero);

    public decimal Time(decimal hour, decimal minute)
        => calculator.CreateTimeOfDay(hour, minute);
}
