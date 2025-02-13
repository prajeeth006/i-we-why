using System;
using System.Globalization;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Requires that datetime has <see cref="DateTime.Kind" /> is <see cref="DateTimeKind.Utc" />.
/// Used to express contract of an interfaced service explicitly, remove input validations and enforce exceptions early in consumers' unit tests if they pass invalid value.
/// </summary>
[JsonConverter(typeof(UtcDateTimeConverter))]
public struct UtcDateTime : IEquatable<UtcDateTime>, IComparable<UtcDateTime>
{
    /// <summary>Defines the point in time when Unix time is equal to 0 which is January 1, 1970 00:00:00 UTC.</summary>
    public static UtcDateTime UnixEpoch = new (DateTimeOffset.FromUnixTimeSeconds(0));

    private readonly DateTime rawValue;

    /// <summary>Gets the value.</summary>
    public DateTime Value
        => rawValue != default ? rawValue : rawValue.ToUniversalTime(); // If created as default(UtcDateTime) -> adjust

    /// <summary>Gets the value with UTC offset.</summary>
    public DateTimeOffset ValueWithOffset
        => new (Value, TimeSpan.Zero);

    /// <summary>Creates a new instance.</summary>
    public UtcDateTime(DateTime value)
        => rawValue = Guard.Requires(value, v => v.Kind == DateTimeKind.Utc, nameof(value), "Value.Kind must be DateTimeKind.Utc.");

    /// <summary>Creates a new instance.</summary>
    public UtcDateTime(DateTimeOffset value)
        => rawValue = new DateTime(value.ToUniversalTime().Ticks, DateTimeKind.Utc);

    /// <summary>Creates a new instance.</summary>
    public UtcDateTime(int year, int month, int day, int hour = 0, int minute = 0, int second = 0, int millisecond = 0)
        => rawValue = new DateTime(year, month, day, hour, minute, second, millisecond, DateTimeKind.Utc);

    /// <summary>Gets the string representation in round-trip ISO 8601 format which is best suited for technical usage e.g. exchange between systems.</summary>
    public override string ToString() => Value.ToString(Format);

    /// <summary>See <see cref="object.Equals(object)" />.</summary>
    public override bool Equals(object? obj)
        => obj is UtcDateTime other && Equals(other);

    /// <summary>See <see cref="object.GetHashCode" />.</summary>
    public override int GetHashCode()
        => Value.GetHashCode();

    /// <summary>See <see cref="IEquatable{T}.Equals(T)" />.</summary>
    public bool Equals(UtcDateTime other)
        => Value.Equals(other.Value);

    /// <summary>See <see cref="IComparable{T}.CompareTo" />.</summary>
    public int CompareTo(UtcDateTime other)
        => Value.CompareTo(other.Value);

    /// <summary>Converts given time to the time in a particular time zone.</summary>
    public DateTimeOffset ConvertTo(TimeZoneInfo timeZone)
        => TimeZoneInfo.ConvertTime(ValueWithOffset, timeZone);

    /// <summary>Gets standard <see cref="DateTime" /> format string which is best suited for technical usage e.g. exchange between systems.</summary>
    internal const string Format = "O";

    /// <summary>Parses value from given string according to round-trip ISO 8601 format which is best suited for technical usage e.g. exchange between systems.</summary>
    internal static UtcDateTime? TryParse(string? str)
        => DateTime.TryParseExact(str, Format, null, DateTimeStyles.RoundtripKind, out var time) ? new UtcDateTime(time) : null;

    internal static UtcDateTime Parse(string? str)
        => TryParse(str) ?? throw new FormatException($"Failed parsing UTC date-time from value {str.Dump()}.");

    internal UtcDateTime AddSeconds(double seconds)
        => this + TimeSpan.FromSeconds(seconds);

    internal UtcDateTime AddMinutes(double minutes)
        => this + TimeSpan.FromMinutes(minutes);

    internal UtcDateTime AddHours(double hours)
        => this + TimeSpan.FromHours(hours);

    internal UtcDateTime AddDays(double days)
        => this + TimeSpan.FromDays(days);

    /*****************************************************************************************************************************************************/
    /* Don't implement implicit cast operator to DateTime(Offset) because that leads to ambiguous comparisons.
    /* For example this would be true despite current timezone is +6:00: new DateTime(2000, 1, 1, 10, 0, 0, DateTimeKing.Local) > new UtcDateTime(2000, 1, 1, 9, 0, 0)
    /*****************************************************************************************************************************************************/

    /// <summary>Adds a specified time interval to a specified date and time, yielding a new date and time.</summary>
    public static UtcDateTime operator +(UtcDateTime time, TimeSpan timeSpan)
        => new (time.Value + timeSpan);

    /// <summary>Subtracts a specified date and time from another specified date and time and returns a time interval.</summary>
    public static TimeSpan operator -(UtcDateTime time1, UtcDateTime time2)
        => time1.Value - time2.Value;

    /// <summary>Subtracts a specified time interval from a specified date and time and returns a new date and time.</summary>
    public static UtcDateTime operator -(UtcDateTime time, TimeSpan timeSpan)
        => new (time.Value - timeSpan);

    /// <summary>Determines whether two specified instances of DateTime are equal.</summary>
    public static bool operator ==(UtcDateTime time1, UtcDateTime time2)
        => time1.Value == time2.Value;

    /// <summary>Determines whether two specified instances of DateTime are not equal.</summary>
    public static bool operator !=(UtcDateTime time1, UtcDateTime time2)
        => time1.Value != time2.Value;

    /// <summary>Determines whether one specified DateTime is earlier than another specified DateTime.</summary>
    public static bool operator <(UtcDateTime time1, UtcDateTime time2)
        => time1.Value < time2.Value;

    /// <summary>Determines whether one specified DateTime represents a date and time that is the same as or earlier than another specified DateTime.</summary>
    public static bool operator <=(UtcDateTime time1, UtcDateTime time2)
        => time1.Value <= time2.Value;

    /// <summary>Determines whether one specified DateTime is later than another specified DateTime.</summary>
    public static bool operator >(UtcDateTime time1, UtcDateTime time2)
        => time1.Value > time2.Value;

    /// <summary>Determines whether one specified DateTime represents a date and time that is the same as or later than another specified DateTime.</summary>
    public static bool operator >=(UtcDateTime time1, UtcDateTime time2)
        => time1.Value >= time2.Value;

    private sealed class UtcDateTimeConverter : JsonConverterBase<UtcDateTime>
    {
        public override UtcDateTime Read(JsonReader reader, Type objectType, JsonSerializer serializer)
            => new (serializer.Deserialize<DateTime>(reader));

        public override void Write(JsonWriter writer, UtcDateTime dateTime, JsonSerializer serializer)
            => serializer.Serialize(writer, dateTime.Value);
    }
}
