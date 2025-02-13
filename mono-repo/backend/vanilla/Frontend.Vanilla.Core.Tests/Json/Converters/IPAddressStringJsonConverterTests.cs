using System;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Json.Converters;

public class IPAddressStringJsonConverterTests : JsonConverterTestsBase
{
    protected override JsonConverter Target => new IpAddressStringJsonConverter();

    [Fact]
    public void Deserialize_ShouldParseIP()
    {
        // Act
        var ip = Deserialize<IPAddress>("'1.2.3.4'");

        ip.ToString().Should().Be("1.2.3.4");
    }

    [Fact]
    public void Deserialize_ShouldThrow_IfInheritedIP()
    {
        Action act = () => Deserialize<InheritedIPAddress>("'1.2.3.4'");

        act.Should().Throw<JsonSerializationException>()
            .Which.InnerException.Should().BeOfType<InvalidOperationException>()
            .Which.Message.Should().ContainAll(typeof(IpAddressStringJsonConverter), typeof(InheritedIPAddress), typeof(IPAddress));
    }

    internal sealed class InheritedIPAddress : IPAddress
    {
        public InheritedIPAddress(long newAddress)
            : base(newAddress) { }
    }

    [Fact]
    public void Deserialize_ShouldThrow_IfNotString()
        => RunDeserializeInvalidTypeTest<IPAddress>("123");

    [Fact]
    public void Serialize_ShouldWriteIPToString()
    {
        // Act
        var json = Serialize(IPAddress.Parse("1.2.3.4"));

        json.Should().BeJson("'1.2.3.4'");
    }
}
