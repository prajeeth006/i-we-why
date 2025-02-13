using System;
using System.Linq;
using System.Net;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Frontend.Vanilla.Core.Patterns;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Net;

/// <summary>
/// Represents subnet of IP addresses.
/// </summary>
[JsonConverter(typeof(IpSubnetJsonConverter))]
internal sealed class IpSubnet : ToStringEquatable<IpSubnet>
{
    /// <summary>Gets the network address.</summary>
    public IPAddress NetworkAddress { get; }

    /// <summary>Gets the mask representing number of bits identifying this subnet.</summary>
    public int Mask { get; }

    /// <summary>Gets the mask address.</summary>
    public IPAddress MaskAddress { get; }

    // Cached for quicker Contains()
    private readonly byte[] networkBytes;
    private readonly byte[] maskBytes;

    /// <summary>
    /// Creates a new instance by parsing a string according to CIDR notation
    /// which is a network IP address prefix followed by a mask suffix representing number of significant bit of the prefix e.g. "192.168.1.0/24".
    /// </summary>
    public IpSubnet(string cidrNotation)
    {
        try
        {
            var parts = cidrNotation.Split('/');

            if (parts.Length != 2)
                throw new Exception("There must be a single slash '/' separating network address and its mask.");

            NetworkAddress = IPAddress.Parse(parts[0]);
            Mask = int.Parse(parts[1]);

            networkBytes = NetworkAddress.GetAddressBytes();
            var maxMask = 8 * networkBytes.Length;

            if (Mask <= 0 || Mask >= maxMask)
                throw new Exception($"Network mask suffix must be greater than 0 and less than {maxMask} to support at least some hosts.");

            maskBytes = new byte[networkBytes.Length];
            for (var i = 0; i < Mask; i++)
                maskBytes[i / 8] |= (byte)(1 << (7 - i % 8));

            var remainingBytes = networkBytes.ConvertAll((b, i) => (byte)((b | maskBytes[i]) ^ maskBytes[i]));

            if (remainingBytes.Any(b => b != 0))
                throw new Exception(
                    $"Network address must end with zeros but '{NetworkAddress}' according to mask /{Mask} (hence '{new IPAddress(maskBytes)}')"
                    + $" ends with '{new IPAddress(remainingBytes)}'.");

            MaskAddress = new IPAddress(maskBytes);
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Failed creating IP subnet from value '{cidrNotation}'. Most likely it's not according to CIDR notation.", ex);
        }
    }

    /// <summary>Determines if given IP address belongs to this subnet.</summary>
    public bool Contains(IPAddress address)
    {
        var bytes = address.GetAddressBytes();

        if (bytes.Length != networkBytes.Length)
            return false; // Different type IPv4 vs IPv6

        for (var i = 0; i < bytes.Length; i++)
            if ((bytes[i] & maskBytes[i]) != networkBytes[i])
                return false;

        return true;
    }

    /// <summary>See <see cref="object.ToString" />.</summary>
    public override string ToString() => NetworkAddress + "/" + Mask;

    private sealed class IpSubnetJsonConverter : JsonConverterBase<IpSubnet>
    {
        public override IpSubnet Read(JsonReader reader, Type typeToRead, JsonSerializer serializer)
            => new (reader.GetRequiredValue<string>());

        public override void Write(JsonWriter writer, IpSubnet value, JsonSerializer serializer)
            => writer.WriteValue(value.ToString());
    }
}
