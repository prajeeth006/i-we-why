using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization;

namespace Frontend.Vanilla.Features.DslProviders.Time;

internal interface IDateTimeDslCalculator
{
    decimal GetTime(DateTimeOffset time);
    decimal GetDate(DateTimeOffset time);
    decimal GetTimeOfDay(DateTimeOffset time);
    string GetDayOfWeek(DateTimeOffset time);
    decimal CreateTime(decimal year, decimal month, decimal day, decimal hour, decimal minute, TimeSpan offset);
    decimal CreateTimeOfDay(decimal hour, decimal minute);
    string Format(decimal year, decimal month, decimal day);
}

internal sealed class DateTimeDslCalculator(IDslTimeConverter converter, IDateTimeCultureBasedFormatter formatter) : IDateTimeDslCalculator
{
    private const int Seconds = 0; // Ignore seconds b/c there are only methods with minute precesion

    public decimal GetTime(DateTimeOffset time)
        => converter.ToDsl(new DateTimeOffset(time.Year, time.Month, time.Day, time.Hour, time.Minute, Seconds, time.Offset));

    public decimal GetDate(DateTimeOffset time)
        => converter.ToDsl(new DateTimeOffset(time.Date, time.Offset));

    public decimal GetTimeOfDay(DateTimeOffset time)
        => GetTimeOfDay(time.Hour, time.Minute);

    private decimal GetTimeOfDay(int hour, int minute)
        => converter.ToDsl(new TimeSpan(hour, minute, Seconds));

    public string GetDayOfWeek(DateTimeOffset time)
        => time.DayOfWeek.ToString();

    public decimal CreateTime(decimal dslYear, decimal dslMonth, decimal dslDay, decimal dslHour, decimal dslMinute, TimeSpan offset)
    {
        var (year, month, day) = GuardDate(dslYear, dslMonth, dslDay);
        var (hour, minute) = GuardTimeOfDay(dslHour, dslMinute);

        return converter.ToDsl(new DateTimeOffset(year, month, day, hour, minute, Seconds, offset));
    }

    public decimal CreateTimeOfDay(decimal dslHour, decimal dslMinute)
    {
        var (hour, minute) = GuardTimeOfDay(dslHour, dslMinute);

        return GetTimeOfDay(hour, minute);
    }

    public string Format(decimal dslYear, decimal dslMonth, decimal dslDay)
    {
        var (year, month, day) = GuardDate(dslYear, dslMonth, dslDay);
        var date = new DateTime(year, month, day);

        return formatter.Format(date, "d");
    }

    private static (int, int, int) GuardDate(decimal dslYear, decimal dslMonth, decimal dslDay)
    {
        var year = GuardComponent(dslYear, DslTimeConverter.MinYear, DslTimeConverter.MaxYear, "Year");
        var month = GuardComponent(dslMonth, min: 1, max: 12, "Month");
        var day = GuardComponent(dslDay, min: 1, max: DateTime.DaysInMonth(year, month), "Day");

        return (year, month, day);
    }

    private static (int, int) GuardTimeOfDay(decimal dslHour, decimal dslMinute)
    {
        var hour = GuardComponent(dslHour, min: 0, max: 23, "Hour");
        var minute = GuardComponent(dslMinute, min: 0, max: 59, "Minute");

        return (hour, minute);
    }

    private static int GuardComponent(decimal value, int min, int max, string componentName)
    {
        if (value % 1 != 0)
            throw new Exception($"{componentName} component of a (date)time must be an integer but specified {value.ToInvariantString()} has a decimal part.");
        if (value < min || value > max)
            throw new Exception(
                $"{componentName} component of a (date)time must be between {min} and {max} (both inclusively) but specified {value.ToInvariantString()} is out of this range.");

        return (int)value;
    }
}
