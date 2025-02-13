using System;
using System.Security.Cryptography;

namespace Frontend.Vanilla.Core.Utils;

/// <summary>
/// Wraps particular <see cref="HashAlgorithm" /> to use it in more convenient way.
/// </summary>
internal interface IHashAlgorithm<TAlgorithm>
    where TAlgorithm : HashAlgorithm, new()
{
    /// <summary>
    /// Returns a string representing the hash value of a bytes.
    /// </summary>
    string CalculateHash(byte[] bytes);
}

internal sealed class HashAlgorithm<TAlgorithm> : IHashAlgorithm<TAlgorithm>
    where TAlgorithm : HashAlgorithm, new()
{
    public string CalculateHash(byte[] bytes)
    {
        Guard.NotNull(bytes, nameof(bytes));

        using var algorithm = new TAlgorithm();

        return Convert.ToBase64String(algorithm.ComputeHash(bytes));
    }
}
