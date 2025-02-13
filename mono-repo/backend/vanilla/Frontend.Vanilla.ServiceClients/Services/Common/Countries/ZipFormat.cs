using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Json.Converters;
using Newtonsoft.Json;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Common.Countries;

public sealed class ZipFormat(int minLength = 0, int maxLength = 0, string regex = null)
{
    public int MinLength { get; } = minLength;
    public int MaxLength { get; } = maxLength;

    [JsonConverter(typeof(RegexStringJsonConverter))]
    public Regex Regex { get; } = regex != null ? new Regex(regex, RegexOptions.Compiled) : null;
}
