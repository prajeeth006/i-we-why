using System;
using System.Linq;
using System.Threading;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Thread-safe random number generator.
/// Useful when you need only few numbers from multiple places/threads.
/// </summary>
internal static class RandomGenerator
{
    private static readonly Lock Lock = new ();
    private static readonly Random Random = new Random();

    /// <summary>Returns a random floating-point number that is greater than or equal to 0.0, and less than 1.0 in thread-safe way.</summary>
    public static double GetDouble()
    {
        lock (Lock)
            return Random.NextDouble();
    }

    /// <summary>Returns a non-negative random integer in thread-safe way.</summary>
    public static int GetInt32()
    {
        lock (Lock)
            return Random.Next();
    }

    /// <summary>Returns a non-negative random integer that is less than the specified maximum in thread-safe way.</summary>
    public static int GetInt32(int exclusiveMax)
    {
        lock (Lock)
            return Random.Next(exclusiveMax);
    }

    /// <summary>Returns random defined enum value.</summary>
    public static TEnum Get<TEnum>()
        where TEnum : Enum
        => Enum<TEnum>.Values.ElementAt(GetInt32(Enum<TEnum>.Values.Count));

    /// <summary>Returns random boolean value.</summary>
    public static bool GetBoolean()
        => GetDouble() < 0.5;
}
