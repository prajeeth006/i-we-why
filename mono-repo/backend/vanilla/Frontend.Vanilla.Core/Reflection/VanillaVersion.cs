#pragma warning disable CS1591
using System;
using System.Globalization;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Core.Reflection;

public sealed class VanillaVersion
{
    public VanillaVersion(Version version, string hash)
    {
        Version = version;
        Hash = hash;
    }

    public VanillaVersion(int major, int minor, int build, int revision, string hash)
        : this(new Version(major, minor, build, revision), hash) { }
    private static VanillaVersion DevVersion => new VanillaVersion(new Version(int.Parse($"{DateTime.UtcNow:yy}"), CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(DateTime.UtcNow, CalendarWeekRule.FirstDay, DayOfWeek.Monday), 0, 0), "dev");
    public Version Version { get; }
    public string Hash { get; }

    public static VanillaVersion CreateInstance()
    {
        if (VanillaEnvironment.IsDev)
        {
            return DevVersion;
        }

        var versionParts = typeof(VanillaVersion).Assembly.GetFullVersion().Split("-");
        if (Version.TryParse(versionParts[0], out var v))
        {
            return new VanillaVersion(v, versionParts.Length is 2 ? versionParts[1] : "dev");
        }

        throw new Exception("Failed to parse version using " + versionParts.Join());
    }

    public override string ToString()
        => $"{Version.ToString()}-{Hash}";

    public override bool Equals(object? obj)
    {
        // Check if the given object is null or not of the same type
        if (obj == null || GetType() != obj.GetType())
            return false;

        var other = (VanillaVersion)obj;

        return Version.Equals(other.Version) && Hash.Equals(other.Hash);
    }

    public override int GetHashCode()
    {
        unchecked
        {
            int hash = 17;
            hash = hash * 31 + Version.GetHashCode();
            hash = hash * 31 + Hash.GetHashCode();
            return hash;
        }
    }
}
